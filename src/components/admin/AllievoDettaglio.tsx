import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Badge, Button, Spinner, Alert } from "react-bootstrap";
import { allievoApi } from "@/api/allievoApi";
import FormAllievo from "@/components/admin/FormAllievo";
import type { AllievoRespDTO } from "@/interfaces/utente";

function AllievoDettaglio() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [allievo, setAllievo] = useState<AllievoRespDTO | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    allievoApi
      .ottieni(id)
      .then(setAllievo)
      .catch(() => setErrore("Allievo non trovato"))
      .finally(() => setCaricamento(false));
  }, [id]);

  async function toggleAttivo() {
    if (!allievo) return;
    const azione = allievo.accountAttivo
      ? allievoApi.disattiva
      : allievoApi.riattiva;
    const aggiornato = await azione(allievo.id);
    setAllievo(aggiornato);
  }

  if (caricamento) {
    return (
      <Container className="page-container">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (errore || !allievo) {
    return (
      <Container className="page-container">
        <Alert variant="danger">{errore ?? "Allievo non trovato"}</Alert>
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

      <div className="dettaglio-intestazione">
        <h1>
          {allievo.nome} {allievo.cognome}
        </h1>
        <div className="dettaglio-azioni">
          <Badge bg={allievo.accountAttivo ? "success" : "secondary"}>
            {allievo.accountAttivo ? "Attivo" : "Disattivato"}
          </Badge>
          <Button size="sm" variant="outline-light" onClick={toggleAttivo}>
            {allievo.accountAttivo ? "Disattiva" : "Riattiva"}
          </Button>
        </div>
      </div>

      <FormAllievo utente={allievo} mostraCampiAdmin onSalvato={setAllievo} />
    </Container>
  );
}

export default AllievoDettaglio;
