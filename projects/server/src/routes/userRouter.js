// const router = require("express").Router();
// const userController = require("../controllers/userController");
// const authMiddleware = require("../middleware/authMiddleware");
// const validatorMiddleware = require("../middleware/validatorMiddleware");
// const multerMiddlewareProduct = require("../middleware/multerMiddleware/product");
// const transactionController = require("../controllers/transactionController");
// const multerMiddlewareProfile = require("../middleware/multerMiddleware/profile");

// router.use(authMiddleware.verifyToken);

// router.get("/category", userController.getUserCategory);
// router.get("/default/category", userController.getUserDefaultCategory);

// router.patch(
//   "/category/:id",
//   validatorMiddleware.updateCategory,
//   userController.updateCategory
// );

// router.patch(
//   "/product/:id",
//   multerMiddlewareProduct.single("file"),
//   validatorMiddleware.updateProduct,
//   userController.updateProduct
// );

// router.get("/product", userController.getAllUserProduct);

// router.get("/cart", transactionController.getCart);

// router.post(
//   "/cart/:id",
//   validatorMiddleware.addToCart,
//   transactionController.addToCart
// );

// router.delete("/cart", transactionController.emptyCart);

// router.delete("/cart/:id", transactionController.removeFromCart);

// router.post("/income", userController.userIncome);

// router.post("/transaction", userController.userTransaction);

// router.post(
//   "/checkout",
//   validatorMiddleware.checkoutAddress,
//   transactionController.checkout
// );

// router.post("/purchase", userController.userPurchase);

// router.get("/", userController.getUserProfile);

// router.patch(
//   "/profile",
//   multerMiddlewareProfile.single("file"),
//   userController.updateImageProfile
// );

// router.post(
//   "/top_selling",
//   userController.getTopSellingProducts
// );



// module.exports = router;
