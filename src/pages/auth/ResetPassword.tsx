import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { resetPassword } from "@/redux/thunks/authThunks";

function ResetPassword() {
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

    const risultato = await dispatch(resetPassword({ token, nuovaPassword }));
    if (resetPassword.fulfilled.match(risultato)) {
      navigate("/", { replace: true });
    }
  }

  if (!token) {
    return (
      <Container className="auth-page">
        <div className="auth-card">
          <h1>Link non valido</h1>
          <p>Manca il token di reset nell'indirizzo. Richiedine uno nuovo.</p>
          <Link to="/password-dimenticata">Richiedi nuovo link</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="auth-page">
      <div className="auth-card">
        <h1>Reimposta la password</h1>

        {(error || erroreLocale) && (
          <Alert variant="danger">{erroreLocale ?? error}</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="resetPassword">
            <Form.Label>Nuova password</Form.Label>
            <Form.Control
              type="password"
              minLength={8}
              value={nuovaPassword}
              onChange={(e) => setNuovaPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="resetConferma">
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
            {inCorso ? "Salvataggio in corso..." : "Reimposta password"}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default ResetPassword;
