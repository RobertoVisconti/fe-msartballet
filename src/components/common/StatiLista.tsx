import { Alert, Button, Spinner } from "react-bootstrap";
import type { Page } from "@/interfaces/common";

/* Caricamento in corso di una lista o di una pagina di dettaglio. */
export function StatoCaricamento({
  testo = "Caricamento...",
}: {
  testo?: string;
}) {
  return (
    <div className="stato-lista" role="status" aria-live="polite">
      <Spinner animation="border" size="sm" />
      <span>{testo}</span>
    </div>
  );
}

/* Richiesta riuscita ma senza risultati */
export function StatoVuoto({ testo }: { testo: string }) {
  return <p className="stato-lista">{testo}</p>;
}

/* Errore di caricamento */
export function StatoErrore({
  testo,
  onRiprova,
}: {
  testo: string;
  onRiprova: () => void;
}) {
  return (
    <Alert variant="danger" className="stato-errore">
      <span>{testo}</span>
      <Button size="sm" variant="outline-light" onClick={onRiprova}>
        Riprova
      </Button>
    </Alert>
  );
}

/* Messaggio limite paginazione */
export function AvvisoLimite({ pagina }: { pagina: Page<unknown> | null }) {
  if (!pagina || pagina.totalElements <= pagina.numberOfElements) return null;

  return (
    <Alert variant="warning" className="avviso-limite">
      Mostrati {pagina.numberOfElements} di {pagina.totalElements} risultati
      totali.
    </Alert>
  );
}
