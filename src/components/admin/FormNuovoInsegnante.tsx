import { useState } from "react";
import type { FormEvent } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import type { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { authApi } from "@/api/authApi";
import CaricaImmagine from "./CaricaImmagine";
import { useNotifica } from "@/components/common/ToastProvider";
import type { NewInsegnanteDTO } from "@/interfaces/auth";
import type { InsegnanteRespDTO } from "@/interfaces/utente";
import type { ErrorsDTO } from "@/interfaces/common";

const FORM_VUOTO: NewInsegnanteDTO = {
  nome: "",
  cognome: "",
  email: "",
  dataDiNascita: "",
  imgProfilo: "",
  biografia: "",
};

function FormNuovoInsegnante() {
  const [form, setForm] = useState<NewInsegnanteDTO>(FORM_VUOTO);
  const [inCorso, setInCorso] = useState(false);
  const [creato, setCreato] = useState<InsegnanteRespDTO | null>(null);
  const notifica = useNotifica();

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setCreato(null);
    try {
      const payload = { ...form, imgProfilo: form.imgProfilo || undefined };
      const nuovoInsegnante = await authApi.creaInsegnante(payload);
      setCreato(nuovoInsegnante);
      setForm(FORM_VUOTO);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        error.response?.data?.message ?? "Registrazione non riuscita",
        "errore",
      );
    } finally {
      setInCorso(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="profilo-form">
      {creato && (
        <Alert variant="success">
          {creato.nome} {creato.cognome} registrato/a — email di attivazione
          inviata a {creato.email}.{" "}
          <Link to={`/admin/insegnanti/${creato.id}`}>Apri il suo profilo</Link>
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
          <CaricaImmagine
            value={form.imgProfilo}
            onCaricata={(url) => setForm((p) => ({ ...p, imgProfilo: url }))}
            etichetta="Immagine profilo"
          />
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
        {inCorso ? "Registrazione..." : "Registra insegnante"}
      </Button>
    </Form>
  );
}

export default FormNuovoInsegnante;
