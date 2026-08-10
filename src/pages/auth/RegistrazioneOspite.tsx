import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import type { AxiosError } from "axios";
import { authApi } from "@/api/authApi";
import type { ErrorsDTO } from "@/interfaces/common";

interface FormRegistrazione {
  nome: string;
  cognome: string;
  email: string;
  dataDiNascita: string;
}

const formVuoto: FormRegistrazione = {
  nome: "",
  cognome: "",
  email: "",
  dataDiNascita: "",
};

function RegistrazioneOspite() {
  const [form, setForm] = useState<FormRegistrazione>(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [completata, setCompletata] = useState(false);

  function aggiornaCampo(campo: keyof FormRegistrazione, valore: string) {
    setForm((precedente) => ({ ...precedente, [campo]: valore }));
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setErrore(null);
    try {
      await authApi.registraOspite(form);
      setCompletata(true);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErrore(error.response?.data?.message ?? "Registrazione non riuscita");
    } finally {
      setInCorso(false);
    }
  }

  if (completata) {
    return (
      <Container className="auth-page">
        <div className="auth-card">
          <h1>Controlla la tua email</h1>
          <p>
            Ti abbiamo inviato un link per attivare l'account e impostare la
            password.
          </p>
          <Link to="/login">Torna al login</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="auth-page">
      <div className="auth-card">
        <h1>Registrati</h1>
        <p>
          Crea un account ospite: potrai prenotare lezioni singole e acquistare
          prodotti.
        </p>

        {errore && <Alert variant="danger">{errore}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="regNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              value={form.nome}
              onChange={(e) => aggiornaCampo("nome", e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="regCognome">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              value={form.cognome}
              onChange={(e) => aggiornaCampo("cognome", e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="regEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) => aggiornaCampo("email", e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="regData">
            <Form.Label>Data di nascita</Form.Label>
            <Form.Control
              type="date"
              value={form.dataDiNascita}
              onChange={(e) => aggiornaCampo("dataDiNascita", e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" disabled={inCorso} className="btn-accent w-100">
            {inCorso ? "Invio in corso..." : "Registrati"}
          </Button>
        </Form>

        <div className="auth-links">
          <Link to="/login">Hai già un account? Accedi</Link>
        </div>
      </div>
    </Container>
  );
}

export default RegistrazioneOspite;
