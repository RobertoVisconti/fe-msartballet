import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import type { AxiosError } from "axios";
import { prodottoApi } from "@/api/prodottoApi";
import type { ProdottoRespDTO, NewProdottoDTO } from "@/interfaces/catalogo";
import type { ErrorsDTO } from "@/interfaces/common";

const formVuoto: NewProdottoDTO = {
  titolo: "",
  descrizioneProdotto: "",
  imgProdotto: "",
  prezzoProdotto: 0,
};

function ProdottiAdmin() {
  const [prodotti, setProdotti] = useState<ProdottoRespDTO[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<ProdottoRespDTO | null>(null);
  const [form, setForm] = useState<NewProdottoDTO>(formVuoto);
  const [erroreForm, setErroreForm] = useState<string | null>(null);
  const [inCorso, setInCorso] = useState(false);

  function caricaLista() {
    setCaricamento(true);
    prodottoApi
      .lista({ size: 100 })
      .then((pagina) => setProdotti(pagina.content))
      .catch(() => setErrore("Impossibile caricare i prodotti"))
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    caricaLista();
  }, []);

  function apriCreazione() {
    setInModifica(null);
    setForm(formVuoto);
    setErroreForm(null);
    setModaleAperto(true);
  }

  function apriModifica(prodotto: ProdottoRespDTO) {
    setInModifica(prodotto);
    setForm({
      titolo: prodotto.titolo,
      descrizioneProdotto: prodotto.descrizioneProdotto,
      imgProdotto: prodotto.imgProdotto,
      prezzoProdotto: prodotto.prezzoProdotto,
    });
    setErroreForm(null);
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setErroreForm(null);
    try {
      if (inModifica) {
        await prodottoApi.modifica(inModifica.id, form);
      } else {
        await prodottoApi.crea(form);
      }
      setModaleAperto(false);
      caricaLista();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErroreForm(
        error.response?.data?.message ?? "Salvataggio non riuscito",
      );
    } finally {
      setInCorso(false);
    }
  }

  async function handleElimina(prodotto: ProdottoRespDTO) {
    if (!window.confirm(`Eliminare il prodotto "${prodotto.titolo}"?`)) return;
    await prodottoApi.elimina(prodotto.id);
    caricaLista();
  }

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Prodotti</h1>
        <Button className="btn-accent" onClick={apriCreazione}>
          + Nuovo prodotto
        </Button>
      </div>

      {errore && <Alert variant="danger">{errore}</Alert>}

      {caricamento ? (
        <Spinner animation="border" />
      ) : (
        <Table responsive className="tabella-admin">
          <thead>
            <tr>
              <th>Titolo</th>
              <th>Prezzo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {prodotti.map((prodotto) => (
              <tr key={prodotto.id}>
                <td>{prodotto.titolo}</td>
                <td>€ {prodotto.prezzoProdotto}</td>
                <td className="azioni-cella">
                  <Button
                    size="sm"
                    variant="outline-light"
                    onClick={() => apriModifica(prodotto)}
                  >
                    Modifica
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleElimina(prodotto)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={modaleAperto} onHide={() => setModaleAperto(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {inModifica ? "Modifica prodotto" : "Nuovo prodotto"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {erroreForm && <Alert variant="danger">{erroreForm}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                value={form.titolo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, titolo: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={1000}
                value={form.descrizioneProdotto}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    descrizioneProdotto: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL immagine</Form.Label>
              <Form.Control
                value={form.imgProdotto}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imgProdotto: e.target.value }))
                }
                placeholder="https://..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prezzo (€)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step="0.01"
                value={form.prezzoProdotto}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    prezzoProdotto: Number(e.target.value),
                  }))
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-light"
              onClick={() => setModaleAperto(false)}
            >
              Annulla
            </Button>
            <Button type="submit" className="btn-accent" disabled={inCorso}>
              {inCorso ? "Salvataggio..." : "Salva"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default ProdottiAdmin;
