import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { ospiteApi } from "@/api/ospiteApi";
import type { OspiteRespDTO } from "@/interfaces/utente";

function OspiteDettaglio() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ospite, setOspite] = useState<OspiteRespDTO | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    ospiteApi
      .ottieni(id)
      .then(setOspite)
      .catch(() => setErrore("Ospite non trovato"))
      .finally(() => setCaricamento(false));
  }, [id]);

  if (caricamento) {
    return (
      <Container className="page-container">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (errore || !ospite) {
    return (
      <Container className="page-container">
        <Alert variant="danger">{errore ?? "Ospite non trovato"}</Alert>
      </Container>
    );
  }

  return (
    <Container className="page-container">
      <Button
        variant="link"
        onClick={() => navigate(-1)}
        className="link-indietro"
      >
        ← Torna alla lista
      </Button>

      <h1>
        {ospite.nome} {ospite.cognome}
      </h1>

      <div className="profilo-sola-lettura">
        <dl>
          <dt>Email</dt>
          <dd>{ospite.email}</dd>
          <dt>Telefono</dt>
          <dd>{ospite.telefono ?? "—"}</dd>
          <dt>Data di nascita</dt>
          <dd>{ospite.dataDiNascita ?? "—"}</dd>
          <dt>Iscritto dal</dt>
          <dd>{ospite.dataRegistrazione}</dd>
        </dl>
      </div>
    </Container>
  );
}

export default OspiteDettaglio;
