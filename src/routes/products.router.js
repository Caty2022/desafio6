const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager-db.js");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  let { limit = 10, page = 1, sort, query } = req.query;
  let sortOption = {};

  if (sort === "asc" || sort === "desc") {
    sortOption.price = sort === "asc" ? 1 : -1;
  }

  try {
    const filter = {};
    if (query) {
      filter.$or = [
        { category: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
      ];
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
    };

    const products = await productsModel.paginate(filter, options);

    res.status(200).json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Error displaying products: ${error}`,
    });
  }
});

//2) Traer solo un producto por id:

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const producto = await productManager.getProductById(id);
    if (!producto) {
      return res.json({
        error: "Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

//3) Agregar nuevo producto:

router.post("/", async (req, res) => {
  const nuevoProducto = req.body;

  try {
    await productManager.addProduct(nuevoProducto);
    res.status(201).json({
      message: "Producto agregado exitosamente",
    });
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

//4) Actualizar por ID
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productoActualizado = req.body;

  try {
    await productManager.updateProduct(id, productoActualizado);
    res.json({
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

//5) Eliminar producto:

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productManager.deleteProduct(id);
    res.json({
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;
