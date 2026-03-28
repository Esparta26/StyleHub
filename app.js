const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const productos = [
  {
    id: 1,
    name: 'Hoodie Oversize "Street"',
    price: 120000,
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=300&q=80",
    description:
      "Nuestro Hoodie Oversize Street está diseñado para brindar máxima comodidad sin perder el estilo urbano. Confeccionado en algodón premium de alto gramaje, ofrece una sensación cálida y una caída perfecta para un look moderno y relajado.",
  },
  {
    id: 2,
    name: "Zapatillas NYKE Jordan",
    price: 95000,
    img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80",
    description:
      "Nuestras Zapatillas Nike Jordan combinan estilo icónico y comodidad superior. Diseñadas con materiales de alta calidad y una suela resistente, son perfectas para destacar en cualquier outfit urbano mientras disfrutas de un ajuste cómodo durante todo el día.",
  },
  {
    id: 3,
    name: "Camiseta Boxy Fit",
    price: 65000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80",
    description:
      "Nuestra Camiseta Boxy Fit está diseñada para ofrecer el máximo confort sin perder el estilo urbano. Fabricada en algodón premium de alto gramaje para una caída perfecta.",
  },
  {
    id: 4,
    name: "Gorra Trucker Style",
    price: 45000,
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=300&q=80",
    description:
      "Nuestra Gorra Trucker Style está pensada para complementar tu outfit urbano con un toque clásico. Su diseño con malla trasera permite mayor ventilación, mientras su estructura firme mantiene un estilo auténtico y moderno.",
  },
];

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/login", (req, res) => {
  res.redirect("/");
});

app.get("/home", (req, res) => {
  res.render("index", { items: productos });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/productCart", (req, res) => {
  res.render("productCart");
});

app.get("/productDetail/:id", (req, res) => {
  const id = req.params.id;
  const producto = productos.find((p) => p.id == id);

  res.render("productDetail", { producto });
});

app.get("/products/create", (req, res) => {
  res.render("products/create");
});

app.post("/login", (req, res) => {
  console.log("Usuario intentando entrar:", req.body.email);
  res.redirect("/home");
});

app.post("/register", (req, res) => {
  console.log("Nuevo registro:", req.body.fullName);
  res.redirect("/");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("-------------------------------------------");
  console.log(`🚀 StyleHub activo en http://localhost:${PORT}`);
  console.log("-------------------------------------------");
});
