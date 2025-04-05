import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    area: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/products",
        formData
      );
      setProducts([...products, res.data]);
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        area: "",
      });
    } catch (err) {
      console.error("Failed to add product:", err.message);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to delete product:", err.message);
    }
  };

  const handleEdit = (productId) => {
    console.log("Edit product with id:", productId);
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Login first to add to cart!");
        return;
      }
  
      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId,
          quantity: 1, // default quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Product added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };
  
  
  
  
  
  

  return (
    <div className="container">
      <h2>Product Management</h2>

      {/* Product Creation Form */}
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Product</button>
      </form>

      {/* Product List */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product._id} className="product-item">
              <div className="product-details">
                <strong>{product.name}</strong> <br />₹{product.price} |{" "}
                {product.category} | Stock: {product.stock} <br />
                Area: {product.area} <br />
                <span>{product.description}</span>
              </div>
              <div className="product-actions">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="add-btn"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleEdit(product._id)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
