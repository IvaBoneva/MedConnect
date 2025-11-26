import { Container, Card } from "react-bootstrap";
import PharmacyMap from "../../components/PharmacyMap";

const Pharmacies = () => {
  return (
    <>
      <Container className="py-5">
        <Card className="p-4 shadow-sm" style={{ height: "750px" }}>
          <h3 className="text-success text-left mb-5">
            🏥 Търсене на болници и аптеки
          </h3>{" "}
          <div style={{ height: "600px", width: "100%" }}>
            <PharmacyMap />
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Pharmacies;
