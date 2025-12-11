import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavBrand = ({ isPremium }) => {
  return isPremium ? (
    <Navbar.Brand as={Link} to="/">
      MedConnect+{" "}
      <i style={{ fontSize: "15px", color: "#e8f5e9" }}>Premium</i>
    </Navbar.Brand>
  ) : (
    <Navbar.Brand as={Link} to="/">
      MedConnect+
    </Navbar.Brand>
  );
};