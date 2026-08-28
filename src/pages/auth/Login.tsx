import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { loginUser } from "@/redux/thunks/authThunks";
import { useNotifica } from "@/components/common/ToastProvider";

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status } = useAppSelector((state) => state.auth);
  const notifica = useNotifica();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inCorso = status === "loading";

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    const risultato = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(risultato)) {
      const provenienza = (
        location.state as { from?: { pathname: string } } | null
      )?.from?.pathname;
      navigate(provenienza ?? "/", { replace: true });
    } else {
      notifica(risultato.payload ?? "Accesso non riuscito", "errore");
    }
  }

  return (
    <Container className="auth-page">
      <div className="auth-card">
        <h1>Accedi</h1>
        <p>Inserisci le tue credenziali per accedere all'area riservata.</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" disabled={inCorso} className="btn-accent w-100">
            {inCorso ? "Accesso in corso..." : "Accedi"}
          </Button>
        </Form>

        <div className="auth-links">
          <Link to="/password-dimenticata">Password dimenticata?</Link>
        </div>
      </div>
    </Container>
  );
}

export default Login;
