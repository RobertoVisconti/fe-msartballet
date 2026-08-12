import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormNuovoAllievo from "@/components/admin/FormNuovoAllievo";

function RegistraAllievo() {
  return (
    <Container className="page-container">
      <Link to="/admin/registrazione" className="link-indietro">
        ← Torna alla scelta
      </Link>
      <h1>Registra un nuovo Allievo</h1>
      <FormNuovoAllievo />
    </Container>
  );
}

export default RegistraAllievo;
