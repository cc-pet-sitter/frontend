import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";


const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('login');
    } catch (err) {
      console.error('Failed to logout: ', err);
    }
  }

  return (
    <header>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/sitter_profile_page">Profile </Link>
        <Link to="/search_page">Search </Link>
        <Link to="/login">Login </Link>
        <Link to="/signup">Sign Up </Link>
        <p>Welcome, {currentUser?.email}!</p>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default Header;
