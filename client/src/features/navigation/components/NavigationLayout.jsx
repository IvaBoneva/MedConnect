import { Navbar, Nav, Container } from "react-bootstrap";
import { NavBrand } from "./NavBrand"
import { NavLinks } from "./NavLinks"
import { DashboardButton } from "./DashboardButton";

export const NavigationLayout = ({ 
  isPremium, 
  isAuthenticated, 
  onDashboardClick 
}) => {
  return (
    <Navbar expand="lg" className="navbar-dark shadow-lg" sticky="top" style={{ backgroundColor: "#2E8B57" }}>
      <Container>
        <NavBrand isPremium={isPremium} />
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <NavLinks isAuthenticated={isAuthenticated} />
            <DashboardButton onClick={onDashboardClick} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};