import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { utenteApi } from "@/api/utenteApi";
import FormAllievo from "@/components/admin/FormAllievo";
import FormInsegnante from "@/components/admin/FormInsegnante";
import type {
  UtenteMe,
  OspiteRespDTO,
  AdminRespDTO,
  CambiaPasswordDTO,
} from "@/interfaces/utente";
import type { ErrorsDTO } from "@/interfaces/common";

function Profilo() {
  const [utente, setUtente] = useState<UtenteMe | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    utenteApi
      .me()
      .then(setUtente)
      .catch(() => setErrore("Impossibile caricare il profilo"))
      .finally(() => setCaricamento(false));
  }, []);

  if (caricamento) {
    return (
      <Container className="page-container">
        <p>Caricamento...</p>
      </Container>
    );
  }

  if (errore || !utente) {
    return (
      <Container className="page-container">
        <Alert variant="danger">{errore ?? "Profilo non disponibile"}</Alert>
      </Container>
    );
  }

  return (
    <Container className="page-container">
      <h1>Il mio profilo</h1>
      <p className="page-intro">
        {utente.nome} {utente.cognome} —{" "}
        <Badge bg="secondary">{utente.ruolo}</Badge>
      </p>

      {utente.ruolo === "ALLIEVO" && (
        <FormAllievo
          utente={utente}
          mostraCampiAdmin={false}
          onSalvato={setUtente}
        />
      )}
      {utente.ruolo === "INSEGNANTE" && (
        <FormInsegnante utente={utente} onSalvato={setUtente} />
      )}
      {(utente.ruolo === "OSPITE" || utente.ruolo === "ADMIN") && (
        <DatiSoliLettura utente={utente} />
      )}

      <CambiaPassword />
    </Container>
  );
}

interface DatiSoliLetturaProps {
  utente: OspiteRespDTO | AdminRespDTO;
}

function DatiSoliLettura({ utente }: DatiSoliLetturaProps) {
  return (
    <div className="profilo-sola-lettura">
      <h2>Dati anagrafici</h2>
      <dl>
        <dt>Nome</dt>
        <dd>{utente.nome}</dd>
        <dt>Cognome</dt>
        <dd>{utente.cognome}</dd>
        <dt>Email</dt>
        <dd>{utente.email}</dd>
        <dt>Data di nascita</dt>
        <dd>{utente.dataDiNascita}</dd>
        <dt>Iscritto dal</dt>
        <dd>{utente.dataRegistrazione}</dd>
      </dl>
      <p className="testo-secondario">
        Per modificare questi dati contatta la segreteria — il tuo ruolo non
        prevede l'auto-modifica.
      </p>
    </div>
  );
}

function CambiaPassword() {
  const [form, setForm] = useState({
    vecchiaPassword: "",
    nuovaPassword: "",
    conferma: "",
  });
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [fatto, setFatto] = useState(false);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErrore(null);

    if (form.nuovaPassword !== form.conferma) {
      setErrore("Le due password non coincidono");
      return;
    }

    setInCorso(true);
    try {
      const dto: CambiaPasswordDTO = {
        vecchiaPassword: form.vecchiaPassword,
        nuovaPassword: form.nuovaPassword,
      };
      await utenteApi.cambiaPassword(dto);
      setFatto(true);
      setForm({ vecchiaPassword: "", nuovaPassword: "", conferma: "" });
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErrore(
        error.response?.data?.message ?? "Cambio password non riuscito",
      );
    } finally {
      setInCorso(false);
    }
  }

  return (
    <section className="cambia-password">
      <h2>Cambia password</h2>
      {errore && <Alert variant="danger">{errore}</Alert>}
      {fatto && <Alert variant="success">Password aggiornata</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Password attuale</Form.Label>
              <Form.Control
                type="password"
                value={form.vecchiaPassword}
                onChange={(e) =>
                  setForm((p) => ({ ...p, vecchiaPassword: e.target.value }))
                }
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Nuova password</Form.Label>
              <Form.Control
                type="password"
                minLength={8}
                value={form.nuovaPassword}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nuovaPassword: e.target.value }))
                }
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Conferma nuova password</Form.Label>
              <Form.Control
                type="password"
                minLength={8}
                value={form.conferma}
                onChange={(e) =>
                  setForm((p) => ({ ...p, conferma: e.target.value }))
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button
          type="submit"
          disabled={inCorso}
          variant="outline-light"
          className="btn-outline-accent"
        >
          {inCorso ? "Salvataggio..." : "Aggiorna password"}
        </Button>
      </Form>
    </section>
  );
}

export default Profilo;
