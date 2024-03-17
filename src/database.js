const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://catalinakrenz3316:coderhouse@cluster0.0yui3l4.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Conexión exitosa"))
  .catch(() => console.log("Error en la conexión"));
