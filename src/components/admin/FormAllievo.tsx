import { useState } from "react";
import type { FormEvent } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import type { AxiosError } from "axios";
import { allievoApi } from "@/api/allievoApi";
import type {
  AllievoRespDTO,
  AggiornaAllievoDTO,
  LarghezzaPunte,
} from "@/interfaces/utente";
import type { ErrorsDTO } from "@/interfaces/common";

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

function vuotoAUndefined(valore: string | undefined): string | undefined {
  return valore === "" ? undefined : valore;
}

function costruisciPayload(form: AggiornaAllievoDTO): AggiornaAllievoDTO {
  return {
    ...form,
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
    noteSegreteria: vuotoAUndefined(form.noteSegreteria),
  };
}

interface FormAllievoProps {
  utente: AllievoRespDTO;
  mostraCampiAdmin: boolean;
  onSalvato: (utente: AllievoRespDTO) => void;
}

function FormAllievo({
  utente,
  mostraCampiAdmin,
  onSalvato,
}: FormAllievoProps) {
  const [form, setForm] = useState<AggiornaAllievoDTO>({
    nome: utente.nome,
    cognome: utente.cognome,
    email: utente.email,
    dataDiNascita: utente.dataDiNascita,
    numeroScarpetta: utente.numeroScarpetta ?? "",
    marcaScarpetta: utente.marcaScarpetta ?? "",
    haPunte: utente.haPunte ?? false,
    marcaPunte: utente.marcaPunte ?? "",
    larghezzaPunte: utente.larghezzaPunte ?? undefined,
    tagliaBody: utente.tagliaBody ?? "",
    tagliaCalzini: utente.tagliaCalzini ?? "",
    altezzaCm: utente.altezzaCm ?? undefined,
    tagliaPantalone: utente.tagliaPantalone ?? "",
    dataScadenzaCertificato: utente.dataScadenzaCertificato ?? "",
    contattoEmergenzaNome: utente.contattoEmergenzaNome ?? "",
    contattoEmergenzaTelefono: utente.contattoEmergenzaTelefono ?? "",
    codiceFiscale: utente.codiceFiscale ?? "",
    quotaIscrizionePagata: utente.quotaIscrizionePagata ?? false,
    consensoPrivacyFoto: utente.consensoPrivacyFoto ?? false,
    noteSegreteria: utente.noteSegreteria ?? "",
  });
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [salvato, setSalvato] = useState(false);

  function aggiorna<K extends keyof AggiornaAllievoDTO>(
    campo: K,
    valore: AggiornaAllievoDTO[K],
  ) {
    setForm((precedente) => ({ ...precedente, [campo]: valore }));
    setSalvato(false);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setInCorso(true);
    setErrore(null);
    try {
      const aggiornato = await allievoApi.aggiorna(
        utente.id,
        costruisciPayload(form),
      );
      onSalvato(aggiornato);
      setSalvato(true);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErrore(error.response?.data?.message ?? "Salvataggio non riuscito");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="profilo-form">
      {errore && <Alert variant="danger">{errore}</Alert>}
      {salvato && <Alert variant="success">Salvato</Alert>}

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

      {mostraCampiAdmin && (
        <>
          <h2>Amministrazione (solo staff)</h2>
          <Row>
            <Col md={6} className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Quota di iscrizione pagata"
                checked={form.quotaIscrizionePagata ?? false}
                onChange={(e) =>
                  aggiorna("quotaIscrizionePagata", e.target.checked)
                }
              />
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Note segreteria</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  maxLength={2000}
                  value={form.noteSegreteria}
                  onChange={(e) => aggiorna("noteSegreteria", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}

      <Button type="submit" disabled={inCorso} className="btn-accent">
        {inCorso ? "Salvataggio..." : "Salva modifiche"}
      </Button>
    </Form>
  );
}

export default FormAllievo;
