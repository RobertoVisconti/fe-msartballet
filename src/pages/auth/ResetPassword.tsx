import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { resetPassword } from "@/redux/thunks/authThunks";
import { useNotifica } from "@/components/common/ToastProvider";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status } = useAppSelector((state) => state.auth);
  const notifica = useNotifica();

  const [nuovaPassword, setNuovaPassword] = useState("");
  const [conferma, setConferma] = useState("");

  const inCorso = status === "loading";

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    if (nuovaPassword !== conferma) {
      notifica("Le due password non coincidono", "errore");
      return;
    }

    const risultato = await dispatch(resetPassword({ token, nuovaPassword }));
    if (resetPassword.fulfilled.match(risultato)) {
      navigate("/", { replace: true });
    } else {
      notifica(risultato.payload ?? "Reimpostazione non riuscita", "errore");
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
