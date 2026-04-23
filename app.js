const express = require("express");
const path = require("path");
const fs = require("fs"); // 🆕 Módulo para leer/escribir archivos
const methodOverride = require("method-override"); // 🆕 Módulo para habilitar PUT y DELETE

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method")); // 🆕 Le dice a Express que lea los ?_method=PUT/DELETE en los formularios

// --- LÓGICA DE BASE DE DATOS JSON ---
const productsFilePath = path.join(__dirname, "data", "products.json");

// Función para leer los productos del archivo JSON
const getProducts = () => {
  const jsonFile = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(jsonFile);
};

// Función para guardar los productos en el archivo JSON
const saveProducts = (productos) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(productos, null, 2));
};

// --- RUTAS ---

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/login", (req, res) => {
  res.redirect("/");
});

app.get("/home", (req, res) => {
  const productos = getProducts(); // 🆕 Lee del JSON
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
  const id = req.params.id;
  const producto = productos.find((p) => p.id == id);
  res.render("productDetail", { producto });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/edit/:id", (req, res) => {
  const productos = getProducts();
  const producto = productos.find((p) => p.id == req.params.id);
  res.render("edit", { producto });
});

app.post("/login", (req, res) => {
  console.log("Usuario intentando entrar:", req.body.email);
  res.redirect("/home");
});

app.post("/register", (req, res) => {
  console.log("Nuevo registro:", req.body.fullName);
  res.redirect("/");
});

// 🆕 CREAR: Ahora guarda en el JSON
app.post("/create", (req, res) => {
  const productos = getProducts();
  const { name, price, img, description } = req.body;

  const nuevoProducto = {
    id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1, // Genera ID automático
    name,
    price: Number(price),
    img,
    description,
  };

  productos.push(nuevoProducto);
  saveProducts(productos); // 👈 Guarda el archivo físicamente

  res.redirect("/home");
});

// 🆕 EDITAR: Cambiado a app.put
app.put("/edit/:id", (req, res) => {
  const productos = getProducts();
  const index = productos.findIndex((p) => p.id == req.params.id);

  if (index !== -1) {
    productos[index].name = req.body.name;
    productos[index].price = Number(req.body.price);
    productos[index].img = req.body.img;
    productos[index].description = req.body.description;
    
    saveProducts(productos); // 👈 Sobrescribe el JSON con los cambios
  }

  res.redirect("/home");
});

// 🆕 ELIMINAR: La ruta que te faltaba
app.delete("/delete/:id", (req, res) => {
  let productos = getProducts();
  // Filtra los productos, dejando todos menos el que queremos borrar
  productos = productos.filter((p) => p.id != req.params.id);
  
  saveProducts(productos); // 👈 Guarda la lista actualizada
  res.redirect("/home");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("-------------------------------------------");
  console.log(`🚀 StyleHub activo en http://localhost:${PORT}`);
  console.log("-------------------------------------------");
});