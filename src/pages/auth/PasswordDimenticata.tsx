import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import type { AxiosError } from "axios";
import { authApi } from "@/api/authApi";
import type { ErrorsDTO } from "@/interfaces/common";

function PasswordDimenticata() {
  const [email, setEmail] = useState("");
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [inviata, setInviata] = useState(false);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setErrore(null);
    try {
      await authApi.passwordDimenticata({ email });
      setInviata(true);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErrore(error.response?.data?.message ?? "Richiesta non riuscita");
    } finally {
      setInCorso(false);
    }
  }

  if (inviata) {
    return (
      <Container className="auth-page">
        <div className="auth-card">
          <h1>Controlla la tua email</h1>
          <p>
            Se l'indirizzo esiste, ti abbiamo inviato un link per reimpostare la
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
        <h1>Password dimenticata</h1>
        <p>
          Inserisci l'email del tuo account: ti mandiamo un link per reimpostare
          la password.
        </p>

        {errore && <Alert variant="danger">{errore}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="dimenticataEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" disabled={inCorso} className="btn-accent w-100">
            {inCorso ? "Invio in corso..." : "Invia link"}
          </Button>
        </Form>

        <div className="auth-links">
          <Link to="/login">Torna al login</Link>
        </div>
      </div>
    </Container>
  );
}

export default PasswordDimenticata;
