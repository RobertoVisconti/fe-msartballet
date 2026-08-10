import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { attivaAccount } from "@/redux/thunks/authThunks";

function AttivaAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const [nuovaPassword, setNuovaPassword] = useState("");
  const [conferma, setConferma] = useState("");
  const [erroreLocale, setErroreLocale] = useState<string | null>(null);

  const inCorso = status === "loading";

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErroreLocale(null);

    if (nuovaPassword !== conferma) {
      setErroreLocale("Le due password non coincidono");
      return;
    }

    const risultato = await dispatch(attivaAccount({ token, nuovaPassword }));
    if (attivaAccount.fulfilled.match(risultato)) {
      navigate("/", { replace: true });
    }
  }

  if (!token) {
    return (
      <Container className="auth-page">
        <div className="auth-card">
          <h1>Link non valido</h1>
          <p>
            Manca il token di attivazione nell'indirizzo. Controlla il link
            ricevuto via email.
          </p>
          <Link to="/login">Torna al login</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="auth-page">
      <div className="auth-card">
        <h1>Attiva il tuo account</h1>
        <p>Imposta la password per completare l'attivazione.</p>

        {(error || erroreLocale) && (
          <Alert variant="danger">{erroreLocale ?? error}</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="attivaPassword">
            <Form.Label>Nuova password</Form.Label>
            <Form.Control
              type="password"
              minLength={8}
              value={nuovaPassword}
              onChange={(e) => setNuovaPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="attivaConferma">
            <Form.Label>Conferma password</Form.Label>
            <Form.Control
              type="password"
              minLength={8}
              value={conferma}
              onChange={(e) => setConferma(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" disabled={inCorso} className="btn-accent w-100">
            {inCorso ? "Attivazione in corso..." : "Attiva account"}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default AttivaAccount;
