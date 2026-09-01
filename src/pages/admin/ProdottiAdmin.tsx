import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import type { AxiosError } from "axios";
import { prodottoApi } from "@/api/prodottoApi";
import CaricaImmagine from "@/components/admin/CaricaImmagine";
import { useNotifica } from "@/components/common/ToastProvider";
import { estraiMessaggioErrore } from "@/utils/erroreApi";
import {
  StatoCaricamento,
  StatoErrore,
  StatoVuoto,
  AvvisoLimite,
} from "@/components/common/StatiLista";
import type { ProdottoRespDTO, NewProdottoDTO } from "@/interfaces/catalogo";
import type { Page, ErrorsDTO } from "@/interfaces/common";

const formVuoto: NewProdottoDTO = {
  titolo: "",
  descrizioneProdotto: "",
  imgProdotto: "",
  prezzoProdotto: 0,
};

function ProdottiAdmin() {
  const [pagina, setPagina] = useState<Page<ProdottoRespDTO> | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  const [modaleAperto, setModaleAperto] = useState(false);
  const [inModifica, setInModifica] = useState<ProdottoRespDTO | null>(null);
  const [form, setForm] = useState<NewProdottoDTO>(formVuoto);
  const [inCorso, setInCorso] = useState(false);
  const notifica = useNotifica();

  function caricaLista() {
    setCaricamento(true);
    prodottoApi
      .lista({ size: 100 })
      .then((risultato) => {
        setPagina(risultato);
        setErrore(false);
      })
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare i prodotti", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    caricaLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativo]);

  function apriCreazione() {
    setInModifica(null);
    setForm(formVuoto);
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
    setModaleAperto(true);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
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
      notifica(
        estraiMessaggioErrore(error.response?.data, "Salvataggio non riuscito"),
        "errore",
      );
    } finally {
      setInCorso(false);
    }
  }

  async function handleElimina(prodotto: ProdottoRespDTO) {
    if (!window.confirm(`Eliminare il prodotto "${prodotto.titolo}"?`)) return;
    try {
      await prodottoApi.elimina(prodotto.id);
      caricaLista();
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(
          error.response?.data,
          "Eliminazione non riuscita",
        ),
        "errore",
      );
    }
  }

  return (
    <Container className="page-container">
      <div className="dettaglio-intestazione">
        <h1>Prodotti</h1>
        <Button className="btn-accent" onClick={apriCreazione}>
          + Nuovo prodotto
        </Button>
      </div>

      {caricamento ? (
        <StatoCaricamento testo="Caricamento prodotti..." />
      ) : errore ? (
        <StatoErrore
          testo="Impossibile caricare i prodotti."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      ) : !pagina || pagina.empty ? (
        <StatoVuoto testo="Nessun prodotto registrato." />
      ) : (
        <>
          <AvvisoLimite pagina={pagina} />
          <Table responsive className="tabella-admin">
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Prezzo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((prodotto) => (
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
        </>
      )}

      <Modal show={modaleAperto} onHide={() => setModaleAperto(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {inModifica ? "Modifica prodotto" : "Nuovo prodotto"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
            <CaricaImmagine
              value={form.imgProdotto}
              onCaricata={(url) => setForm((p) => ({ ...p, imgProdotto: url }))}
              etichetta="Immagine prodotto"
            />
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
