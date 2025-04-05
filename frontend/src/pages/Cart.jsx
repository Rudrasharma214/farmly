import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Cart Response:", res.data); // Debug line

      const safeProducts = (res.data.products || []).filter(
        (item) => item && item.product
      );

      setCartItems(safeProducts);
      setTotalAmount(res.data.totalAmount || 0);
    } catch (err) {
      console.error("Failed to load cart:", err.message);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/cart/update`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems(res.data.products || []);
      setTotalAmount(res.data.totalAmount || 0);
    } catch (err) {
      console.error("Error updating quantity:", err.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems(res.data.products || []);
      setTotalAmount(res.data.totalAmount || 0);
    } catch (err) {
      console.error("Error removing item:", err.message);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item, index) => (
              <li key={item.product._id || index} className="cart-item">
                <div className="item-info">
                  <strong>{item.product.name}</strong>
                  <p>₹{item.product.price}</p>
                  <p>
                    Qty:
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3>Total: ₹{totalAmount}</h3>
        </>
      )}
    </div>
  );
};

export default Cart;
