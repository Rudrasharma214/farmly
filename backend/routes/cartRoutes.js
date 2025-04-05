const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticate = require("../middleware/auth");

router.post("/add", authenticate, cartController.addToCart);
router.get("/", authenticate, cartController.getCart);
router.put("/update", authenticate, cartController.updateCartQuantity);
router.delete("/remove/:productId", authenticate, cartController.removeFromCart);
router.delete("/clear", authenticate, cartController.emptyCart);

module.exports = router;
