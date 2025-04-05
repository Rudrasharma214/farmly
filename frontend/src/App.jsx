import { Outlet, Link } from "react-router-dom";
import "./App.css"; // make sure this is imported

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/products" className="nav-link">Products</Link>
        <Link to="/cart" className="nav-link">Cart</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
