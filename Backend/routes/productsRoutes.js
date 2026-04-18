import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add", createProduct);
router.get("/", getProducts);       // all products
router.get("/:id", getProductById); // single product by ID
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
