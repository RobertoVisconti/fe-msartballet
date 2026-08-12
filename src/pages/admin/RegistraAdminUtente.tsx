import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormNuovoAdmin from "@/components/admin/FormNuovoAdmin";

function RegistraAdminUtente() {
  return (
    <Container className="page-container">
      <Link to="/admin/registrazione" className="link-indietro">
        ← Torna alla scelta
      </Link>
      <h1>Registra un nuovo Admin</h1>
      <FormNuovoAdmin />
    </Container>
  );
}

export default RegistraAdminUtente;
