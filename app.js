const express = require("express");
const path = require("path");
const fs = require("fs");
const methodOverride = require("method-override");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

const productsFilePath = path.join(__dirname, "data", "products.json");

const getProducts = () => {
  const jsonFile = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(jsonFile);
};

const saveProducts = (productos) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(productos, null, 2));
};

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/login", (req, res) => {
  res.redirect("/");
});

app.get("/home", (req, res) => {
  const productos = getProducts();
  res.render("index", { items: productos });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/productCart", (req, res) => {
  res.render("productCart");
});

app.get("/productDetail/:id", (req, res) => {
  const productos = getProducts();
  const producto = productos.find((p) => p.id == req.params.id);
  res.render("productDetail", { producto });
});

app.get("/create", (req, res) => {
  res.render("products/create");
});

app.get("/edit/:id", (req, res) => {
  const productos = getProducts();
  const producto = productos.find((p) => p.id == req.params.id);
  res.render("products/edit", { product: producto });
});

app.post("/login", (req, res) => {
  res.redirect("/home");
});

app.post("/register", (req, res) => {
  res.redirect("/");
});

app.post("/create", (req, res) => {
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

app.put("/edit/:id", (req, res) => {
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

app.delete("/delete/:id", (req, res) => {
  let productos = getProducts();
  productos = productos.filter((p) => p.id != req.params.id);
  saveProducts(productos);
  res.redirect("/home");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 StyleHub activo en http://localhost:${PORT}`);
});