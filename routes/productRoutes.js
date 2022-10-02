const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Product = require("../models/product");
const { validateProduct, isloggedIn, isSeller, isProductAuthor } = require("../middleware");

// Show all the products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("products/index", { products });
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

// Display a form to add product
router.get("/product/new", isloggedIn, (req, res) => {
  res.render("products/new");
});

// Add a new Product

router.post("/products", isloggedIn, isSeller, validateProduct, async (req, res) => {
  try {
    const { name, img, desc, price } = req.body;
    await Product.create({ name, img, price: parseFloat(price), desc, author: req.user._id });
    req.flash("success", "Succesfully added a new product");
    res.redirect("/products");
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

//
router.get("/products/new", (req, res) => {
  try {
    res.render("products/new");
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { name, img, desc, price } = req.body;
    await Product.create({ name, img, price: parseFloat(price), desc });
    res.redirect("products");
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("reviews");
    res.render("products/show", { product });
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

router.get("/products/:id/edit", isloggedIn, isProductAuthor, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product });
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

// Update a single product
router.patch("/products/:id", isloggedIn, isProductAuthor, validateProduct, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, desc, img } = req.body;
    await Product.findByIdAndUpdate(id, { name, price, desc, img });
    req.flash("msg", "Edit your product successfully");
    res.redirect(`/products/${id}`);
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

router.delete("/products/:id", isloggedIn, isProductAuthor, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    res.redirect("/products");
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});
module.exports = router;