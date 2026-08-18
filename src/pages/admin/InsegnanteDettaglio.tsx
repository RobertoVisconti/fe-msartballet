import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Badge, Button, Spinner, Alert } from "react-bootstrap";
import type { AxiosError } from "axios";
import { insegnanteApi } from "@/api/insegnanteApi";
import FormInsegnante from "@/components/admin/FormInsegnante";
import { useNotifica } from "@/components/common/ToastProvider";
import type { InsegnanteRespDTO } from "@/interfaces/utente";
import type { ErrorsDTO } from "@/interfaces/common";

function InsegnanteDettaglio() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [insegnante, setInsegnante] = useState<InsegnanteRespDTO | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);
  const notifica = useNotifica();

  useEffect(() => {
    if (!id) return;
    insegnanteApi
      .ottieni(id)
      .then(setInsegnante)
      .catch(() => setErrore("Insegnante non trovato"))
      .finally(() => setCaricamento(false));
  }, [id]);

  async function toggleAttivo() {
    if (!insegnante) return;
    const azione = insegnante.accountAttivo
      ? insegnanteApi.disattiva
      : insegnanteApi.riattiva;
    try {
      const aggiornato = await azione(insegnante.id);
      setInsegnante(aggiornato);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Operazione non riuscita",
        "errore",
      );
    }
  }

  if (caricamento) {
    return (
      <Container className="page-container">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (errore || !insegnante) {
    return (
      <Container className="page-container">
        <Alert variant="danger">{errore ?? "Insegnante non trovato"}</Alert>
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
          {insegnante.nome} {insegnante.cognome}
        </h1>
        <div className="dettaglio-azioni">
          <Badge bg={insegnante.accountAttivo ? "success" : "secondary"}>
            {insegnante.accountAttivo ? "Attivo" : "Disattivato"}
          </Badge>
          <Button size="sm" variant="outline-light" onClick={toggleAttivo}>
            {insegnante.accountAttivo ? "Disattiva" : "Riattiva"}
          </Button>
        </div>
      </div>

      <FormInsegnante utente={insegnante} onSalvato={setInsegnante} />
    </Container>
  );
}

export default InsegnanteDettaglio;
