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
import { insegnanteApi } from "@/api/insegnanteApi";
import type {
  UtenteMe,
  InsegnanteRespDTO,
  OspiteRespDTO,
  AdminRespDTO,
  AggiornaInsegnanteDTO,
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
        <ModificaInsegnante utente={utente} onSalvato={setUtente} />
      )}
      {(utente.ruolo === "OSPITE" || utente.ruolo === "ADMIN") && (
        <DatiSoliLettura utente={utente} />
      )}

      <CambiaPassword />
    </Container>
  );
}

interface ModificaInsegnanteProps {
  utente: InsegnanteRespDTO;
  onSalvato: (utente: InsegnanteRespDTO) => void;
}

function ModificaInsegnante({ utente, onSalvato }: ModificaInsegnanteProps) {
  const [form, setForm] = useState<AggiornaInsegnanteDTO>({
    nome: utente.nome,
    cognome: utente.cognome,
    email: utente.email,
    dataDiNascita: utente.dataDiNascita,
    biografia: utente.biografia,
  });
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [salvato, setSalvato] = useState(false);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setErrore(null);
    try {
      const aggiornato = await insegnanteApi.aggiorna(utente.id, form);
      onSalvato(aggiornato);
      setSalvato(true);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErrore(error.response?.data?.message ?? "Salvataggio non riuscito");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="profilo-form">
      {errore && <Alert variant="danger">{errore}</Alert>}
      {salvato && <Alert variant="success">Profilo aggiornato</Alert>}

      <h2>Dati anagrafici</h2>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              value={form.cognome}
              onChange={(e) =>
                setForm((p) => ({ ...p, cognome: e.target.value }))
              }
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Data di nascita</Form.Label>
            <Form.Control
              type="date"
              value={form.dataDiNascita}
              onChange={(e) =>
                setForm((p) => ({ ...p, dataDiNascita: e.target.value }))
              }
              required
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Biografia</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              maxLength={2000}
              value={form.biografia}
              onChange={(e) =>
                setForm((p) => ({ ...p, biografia: e.target.value }))
              }
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Button type="submit" disabled={inCorso} className="btn-accent">
        {inCorso ? "Salvataggio..." : "Salva modifiche"}
      </Button>
    </Form>
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
