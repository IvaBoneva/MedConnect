import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavBrand = ({ isPremium }) => {
  return (
    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
      <span>
        MedConnect+{" "}
        {isPremium && (
          <i style={{ fontSize: "15px", color: "#e8f5e9" }}>Premium</i>
        )}
      </span>
    </Navbar.Brand>
  );
};
