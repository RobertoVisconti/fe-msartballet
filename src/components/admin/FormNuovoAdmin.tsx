import { useState } from "react";
import type { FormEvent } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import type { AxiosError } from "axios";
import { authApi } from "@/api/authApi";
import type { NewAdminDTO } from "@/interfaces/auth";
import type { AdminRespDTO } from "@/interfaces/utente";
import type { ErrorsDTO } from "@/interfaces/common";

const FORM_VUOTO: NewAdminDTO = {
  nome: "",
  cognome: "",
  email: "",
  dataDiNascita: "",
  imgProfilo: "",
};

function FormNuovoAdmin() {
  const [form, setForm] = useState<NewAdminDTO>(FORM_VUOTO);
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [creato, setCreato] = useState<AdminRespDTO | null>(null);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setErrore(null);
    setCreato(null);
    try {
      const payload = { ...form, imgProfilo: form.imgProfilo || undefined };
      const nuovoAdmin = await authApi.creaAdmin(payload);
      setCreato(nuovoAdmin);
      setForm(FORM_VUOTO);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErrore(error.response?.data?.message ?? "Registrazione non riuscita");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="profilo-form">
      {errore && <Alert variant="danger">{errore}</Alert>}
      {creato && (
        <Alert variant="success">
          {creato.nome} {creato.cognome} registrato/a come Admin — email di
          attivazione inviata a {creato.email}.
        </Alert>
      )}

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
              max={new Date().toISOString().slice(0, 10)}
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
            <Form.Label>URL immagine profilo</Form.Label>
            <Form.Control
              value={form.imgProfilo}
              onChange={(e) =>
                setForm((p) => ({ ...p, imgProfilo: e.target.value }))
              }
              placeholder="https://..."
            />
          </Form.Group>
        </Col>
      </Row>

      <Button type="submit" disabled={inCorso} className="btn-accent">
        {inCorso ? "Registrazione..." : "Registra admin"}
      </Button>
    </Form>
  );
}

export default FormNuovoAdmin;
