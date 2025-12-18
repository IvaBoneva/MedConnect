import { Container, Card } from "react-bootstrap";
import PharmacyMapPage from "../../map/PharmacyMapPage";

const PharmaciesPage = () => {
  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm" style={{ height: "750px" }}>
        <h3 className="text-success text-left mb-5">
          🏥 Търсене на болници и аптеки
        </h3>
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PharmacyMapPage />
        </div>
      </Card>
    </Container>
  );
};

export default PharmaciesPage;
