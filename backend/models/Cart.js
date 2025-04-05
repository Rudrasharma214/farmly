const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User ka reference
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Product ka reference
      quantity: { type: Number, required: true, default: 1 } // Kitna item hai
    }
  ],
  totalAmount: { type: Number, default: 0 } // Total price of cart
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
