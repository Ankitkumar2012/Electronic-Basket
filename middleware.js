const { productSchema, reviewSchema } = require("./schemas");
const Product = require("./models/product");

module.exports.isloggedIn = (req, res, next) => {
  req.session.returnUrl = req.originalUrl;

  if (!req.isAuthenticated()) {
    req.flash("error", "You need to login first to do that!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateProduct = (req, res, next) => {
  const { name, img, desc, price } = req.body;
  const { error } = productSchema.validate({ name, img, price, desc });

  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    return res.render("error", { err: msg });
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { rating, comment } = req.body;
  const { error } = reviewSchema.validate({ rating, comment });

  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    return res.render("error", { err: msg });
  }
  next();
};

module.exports.isSeller = (req, res, next) => {
  if (req.user.role !== "Seller") {
    req.flash("error", "You don't have permissions to do that ");
    return res.redirect("/products");
  }
  next();
};

module.exports.isProductAuthor = async (req, res, next) => {
  // getting product id
  const { id } = req.params;

  const product = await Product.findById(id);
  const a = product.author;
  const b = req.user._id;
  if (!a.equals(b)) {
    req.flash("error", "You don't have permissions to do that ");
    return res.redirect(`/products/${id}`);
  }
  next();
};