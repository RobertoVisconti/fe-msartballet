import { useState } from "react";
import type { FormEvent } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import type { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { authApi } from "@/api/authApi";
import CaricaImmagine from "./CaricaImmagine";
import { useNotifica } from "@/components/common/ToastProvider";
import type { NewAllievoDTO } from "@/interfaces/auth";
import type { AllievoRespDTO, LarghezzaPunte } from "@/interfaces/utente";
import type { ErrorsDTO } from "@/interfaces/common";
import { estraiMessaggioErrore } from "@/utils/erroreApi";

const OPZIONI_LARGHEZZA_PUNTE: LarghezzaPunte[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "X",
  "XX",
  "XXX",
  "XXXX",
  "XXXXX",
  "NARROW",
  "MEDIUM",
  "WIDE",
];

const FORM_VUOTO: NewAllievoDTO = {
  nome: "",
  cognome: "",
  email: "",
  dataDiNascita: "",
  imgProfilo: "",
  numeroScarpetta: "",
  marcaScarpetta: "",
  haPunte: false,
  marcaPunte: "",
  larghezzaPunte: undefined,
  tagliaBody: "",
  tagliaCalzini: "",
  altezzaCm: undefined,
  tagliaPantalone: "",
  dataScadenzaCertificato: "",
  contattoEmergenzaNome: "",
  contattoEmergenzaTelefono: "",
  codiceFiscale: "",
  consensoPrivacyFoto: false,
};

function vuotoAUndefined(valore: string | undefined) {
  return valore === "" ? undefined : valore;
}

function costruisciPayload(form: NewAllievoDTO): NewAllievoDTO {
  return {
    ...form,
    imgProfilo: vuotoAUndefined(form.imgProfilo),
    numeroScarpetta: vuotoAUndefined(form.numeroScarpetta),
    marcaScarpetta: vuotoAUndefined(form.marcaScarpetta),
    marcaPunte: vuotoAUndefined(form.marcaPunte),
    tagliaBody: vuotoAUndefined(form.tagliaBody),
    tagliaCalzini: vuotoAUndefined(form.tagliaCalzini),
    tagliaPantalone: vuotoAUndefined(form.tagliaPantalone),
    dataScadenzaCertificato: vuotoAUndefined(form.dataScadenzaCertificato),
    contattoEmergenzaNome: vuotoAUndefined(form.contattoEmergenzaNome),
    contattoEmergenzaTelefono: vuotoAUndefined(form.contattoEmergenzaTelefono),
    codiceFiscale: vuotoAUndefined(form.codiceFiscale),
  };
}

function FormNuovoAllievo() {
  const [form, setForm] = useState<NewAllievoDTO>(FORM_VUOTO);
  const [inCorso, setInCorso] = useState(false);
  const [creato, setCreato] = useState<AllievoRespDTO | null>(null);
  const notifica = useNotifica();

  function aggiorna<K extends keyof NewAllievoDTO>(
    campo: K,
    valore: NewAllievoDTO[K],
  ) {
    setForm((p) => ({ ...p, [campo]: valore }));
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setCreato(null);
    try {
      const nuovoAllievo = await authApi.creaAllievo(costruisciPayload(form));
      setCreato(nuovoAllievo);
      setForm(FORM_VUOTO);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      notifica(
        estraiMessaggioErrore(error.response?.data, "Registrazione non riuscita"),
        "errore",
      );
    } finally {
      setInCorso(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="profilo-form">
      {creato && (
        <Alert variant="success">
          {creato.nome} {creato.cognome} registrato/a — email di attivazione
          inviata a {creato.email}.{" "}
          <Link to={`/admin/allievi/${creato.id}`}>Apri il suo profilo</Link>
        </Alert>
      )}

      <h2>Dati anagrafici</h2>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              value={form.nome}
              onChange={(e) => aggiorna("nome", e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              value={form.cognome}
              onChange={(e) => aggiorna("cognome", e.target.value)}
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
              onChange={(e) => aggiorna("email", e.target.value)}
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
              onChange={(e) => aggiorna("dataDiNascita", e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <CaricaImmagine
            value={form.imgProfilo}
            onCaricata={(url) => aggiorna("imgProfilo", url)}
            etichetta="Immagine profilo"
          />
        </Col>
      </Row>

      <h2>Attrezzatura da danza</h2>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Numero scarpetta</Form.Label>
            <Form.Control
              value={form.numeroScarpetta}
              onChange={(e) => aggiorna("numeroScarpetta", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Marca scarpetta</Form.Label>
            <Form.Control
              value={form.marcaScarpetta}
              onChange={(e) => aggiorna("marcaScarpetta", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-center">
          <Form.Check
            type="checkbox"
            label="Ha le punte"
            checked={form.haPunte ?? false}
            onChange={(e) => aggiorna("haPunte", e.target.checked)}
          />
        </Col>
        {form.haPunte && (
          <>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Marca punte</Form.Label>
                <Form.Control
                  value={form.marcaPunte}
                  onChange={(e) => aggiorna("marcaPunte", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Larghezza punte</Form.Label>
                <Form.Select
                  value={form.larghezzaPunte ?? ""}
                  onChange={(e) =>
                    aggiorna(
                      "larghezzaPunte",
                      (e.target.value || undefined) as
                        | LarghezzaPunte
                        | undefined,
                    )
                  }
                >
                  <option value="">—</option>
                  {OPZIONI_LARGHEZZA_PUNTE.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </>
        )}
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Taglia body</Form.Label>
            <Form.Control
              value={form.tagliaBody}
              onChange={(e) => aggiorna("tagliaBody", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Taglia calzini</Form.Label>
            <Form.Control
              value={form.tagliaCalzini}
              onChange={(e) => aggiorna("tagliaCalzini", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Altezza (cm)</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={250}
              value={form.altezzaCm ?? ""}
              onChange={(e) =>
                aggiorna(
                  "altezzaCm",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Taglia pantalone</Form.Label>
            <Form.Control
              value={form.tagliaPantalone}
              onChange={(e) => aggiorna("tagliaPantalone", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <h2>Certificato e contatti</h2>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Scadenza certificato medico</Form.Label>
            <Form.Control
              type="date"
              value={form.dataScadenzaCertificato}
              onChange={(e) =>
                aggiorna("dataScadenzaCertificato", e.target.value)
              }
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Contatto emergenza — nome</Form.Label>
            <Form.Control
              value={form.contattoEmergenzaNome}
              onChange={(e) =>
                aggiorna("contattoEmergenzaNome", e.target.value)
              }
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Contatto emergenza — telefono</Form.Label>
            <Form.Control
              value={form.contattoEmergenzaTelefono}
              onChange={(e) =>
                aggiorna("contattoEmergenzaTelefono", e.target.value)
              }
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Codice fiscale</Form.Label>
            <Form.Control
              value={form.codiceFiscale}
              onChange={(e) =>
                aggiorna("codiceFiscale", e.target.value.toUpperCase())
              }
            />
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-center">
          <Form.Check
            type="checkbox"
            label="Consenso privacy foto"
            checked={form.consensoPrivacyFoto ?? false}
            onChange={(e) => aggiorna("consensoPrivacyFoto", e.target.checked)}
          />
        </Col>
      </Row>

      <Button type="submit" disabled={inCorso} className="btn-accent">
        {inCorso ? "Registrazione..." : "Registra allievo"}
      </Button>
    </Form>
  );
}

export default FormNuovoAllievo;
