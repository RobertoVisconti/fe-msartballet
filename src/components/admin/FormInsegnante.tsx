import { useState } from "react";
import type { FormEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import type { AxiosError } from "axios";
import { insegnanteApi } from "@/api/insegnanteApi";
import type {
  InsegnanteRespDTO,
  AggiornaInsegnanteDTO,
} from "@/interfaces/utente";
import type { ErrorsDTO } from "@/interfaces/common";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";

interface FormInsegnanteProps {
  utente: InsegnanteRespDTO;
  onSalvato: (utente: InsegnanteRespDTO) => void;
}

function FormInsegnante({ utente, onSalvato }: FormInsegnanteProps) {
  const [form, setForm] = useState<AggiornaInsegnanteDTO>({
    nome: utente.nome,
    cognome: utente.cognome,
    email: utente.email,
    dataDiNascita: utente.dataDiNascita,
    biografia: utente.biografia,
  });
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);

    try {
      const aggiornato = await insegnanteApi.aggiorna(utente.id, form);
      onSalvato(aggiornato);
      notifica("Salvato", "successo");
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(error.response?.data, "Salvataggio non riuscito"),
        "errore",
      );
    } finally {
      setInCorso(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="profilo-form">
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

export default FormInsegnante;
