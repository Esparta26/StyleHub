const express = require("express");
const path = require("path");
const fs = require("fs");
const methodOverride = require("method-override");
const session = require("express-session");
const cookies = require("cookie-parser");
const bcrypt = require("bcryptjs");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(cookies());
app.use(
  session({
    secret: "SecretoSuperSeguroDeStyleHub",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  if (!req.session.userLogged && req.cookies.userEmail) {
    const usuarios = getUsers();
    const usuarioRecordado = usuarios.find((u) => u.email === req.cookies.userEmail);
    
    if (usuarioRecordado) {
      delete usuarioRecordado.password;
      req.session.userLogged = usuarioRecordado;
    }
  }
  next();
});

app.use((req, res, next) => {
  res.locals.userLogged = req.session.userLogged || null;
  next();
});

const authMiddleware = (req, res, next) => {
  if (!req.session.userLogged) {
    return res.redirect("/"); 
  }
  next();
};

const guestMiddleware = (req, res, next) => {
  if (req.session.userLogged) {
    return res.redirect("/home"); 
  }
  next();
};

const productsFilePath = path.join(__dirname, "data", "products.json");
const usersFilePath = path.join(__dirname, "data", "users.json");

const getProducts = () => JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
const saveProducts = (productos) => fs.writeFileSync(productsFilePath, JSON.stringify(productos, null, 2));

const getUsers = () => JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
const saveUsers = (usuarios) => fs.writeFileSync(usersFilePath, JSON.stringify(usuarios, null, 2));

app.get("/", guestMiddleware, (req, res) => {
  res.render("login");
});

app.get("/register", guestMiddleware, (req, res) => {
  res.render("register");
});

app.post("/login", guestMiddleware, (req, res) => {
  const usuarios = getUsers();
  const { email, password, remember } = req.body;

  const userToLogin = usuarios.find((u) => u.email === email);

  if (userToLogin) {
    const isPasswordOk = bcrypt.compareSync(password, userToLogin.password);
    
    if (isPasswordOk) {
      delete userToLogin.password; 
      req.session.userLogged = userToLogin;

      if (remember) {
        res.cookie("userEmail", userToLogin.email, { maxAge: 1000 * 60 * 60 * 24 * 30 });
      }
      return res.redirect("/home");
    }
  }
  return res.redirect("/");
});

app.post("/register", guestMiddleware, (req, res) => {
  const usuarios = getUsers();
  const { fullName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const nuevoUsuario = {
    id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
    fullName,
    email,
    password: hashedPassword,
  };

  usuarios.push(nuevoUsuario);
  saveUsers(usuarios);
  res.redirect("/");
});

app.get("/home", authMiddleware, (req, res) => {
  const productos = getProducts();
  res.render("index", { items: productos });
});

app.get("/profile", authMiddleware, (req, res) => {
  res.render("profile");
});

app.get("/productCart", authMiddleware, (req, res) => {
  res.render("productCart");
});

app.get("/productDetail/:id", authMiddleware, (req, res) => {
  const productos = getProducts();
  const producto = productos.find((p) => p.id == req.params.id);
  res.render("productDetail", { producto });
});

app.get("/create", authMiddleware, (req, res) => {
  res.render("products/create");
});

app.get("/edit/:id", authMiddleware, (req, res) => {
  const productos = getProducts();
  const producto = productos.find((p) => p.id == req.params.id);
  res.render("products/edit", { product: producto });
});

app.post("/create", authMiddleware, (req, res) => {
  const productos = getProducts();
  const { name, price, img, description, size, category } = req.body;

  const nuevoProducto = {
    id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
    name,
    price: Number(price),
    img,
    description,
    size,
    category
  };

  productos.push(nuevoProducto);
  saveProducts(productos);
  res.redirect("/home");
});

app.put("/edit/:id", authMiddleware, (req, res) => {
  const productos = getProducts();
  const index = productos.findIndex((p) => p.id == req.params.id);

  if (index !== -1) {
    productos[index] = {
      id: Number(req.params.id),
      name: req.body.name,
      price: Number(req.body.price),
      img: req.body.img,
      description: req.body.description,
      size: req.body.size,
      category: req.body.category
    };
    saveProducts(productos);
  }
  res.redirect("/home");
});

app.delete("/delete/:id", authMiddleware, (req, res) => {
  let productos = getProducts();
  productos = productos.filter((p) => p.id != req.params.id);
  saveProducts(productos);
  res.redirect("/home");
});

app.get("/logout", (req, res) => {
  res.clearCookie("userEmail");
  req.session.destroy();
  res.redirect("/");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 StyleHub activo en http://localhost:${PORT}`);
});