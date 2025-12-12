import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../../images/logoMed.png";

export const NavBrand = ({ isPremium }) => {
  return (
    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
      <img 
        src={logo} 
        alt="MedConnect Logo" 
        width={35} 
        height={35} 
        className="me-2" 
      />
      <span>
        MedConnect{" "}
        {isPremium && (
          <i style={{ fontSize: "15px", color: "#e8f5e9" }}>Premium</i>
        )}
      </span>
    </Navbar.Brand>
  );
};
