import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
  <header>
    <nav>
      <Link to="/">Home </Link>
      <Link to="/sitter_profile_page">Profile </Link>
      <Link to="/search_page">Search </Link>
    </nav>
  </header>
);

export default Footer;
