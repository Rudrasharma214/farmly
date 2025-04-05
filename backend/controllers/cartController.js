const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    let cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    // Calculate totalAmount
    let total = 0;
    for (const item of cart.products) {
      const p = await Product.findById(item.product);
      if (p) total += item.quantity * p.price;
    }

    cart.totalAmount = total;
    await cart.save();

    // Return populated cart
    const populatedCart = await Cart.findOne({ user: userId }).populate("products.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });

    if (!cart) {
      return res.json({ products: [], totalAmount: 0 });
    }

    res.json({
      products: cart.products,
      totalAmount: cart.totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) return res.status(404).json({ message: "Product not in cart" });

    cart.products[index].quantity = quantity;

    // Recalculate total
    let total = 0;
    for (const item of cart.products) {
      const p = await Product.findById(item.product);
      if (p) total += item.quantity * p.price;
    }

    cart.totalAmount = total;
    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate("products.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    // Recalculate total
    let total = 0;
    for (const item of cart.products) {
      const p = await Product.findById(item.product);
      if (p) total += item.quantity * p.price;
    }

    cart.totalAmount = total;
    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate("products.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: "Cart emptied", products: [], totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: "Error emptying cart", error: error.message });
  }
};
