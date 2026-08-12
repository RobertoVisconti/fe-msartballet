import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormNuovoInsegnante from "@/components/admin/FormNuovoInsegnante";

function RegistraInsegnante() {
  return (
    <Container className="page-container">
      <Link to="/admin/registrazione" className="link-indietro">
        ← Torna alla scelta
      </Link>
      <h1>Registra un nuovo Insegnante</h1>
      <FormNuovoInsegnante />
    </Container>
  );
}

export default RegistraInsegnante;
