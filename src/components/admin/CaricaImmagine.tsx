import { useState } from "react";
import type { ChangeEvent } from "react";
import { Form, Spinner, Alert } from "react-bootstrap";
import type { AxiosError } from "axios";
import { uploadApi } from "@/api/uploadApi";
import type { ErrorsDTO } from "@/interfaces/common";

interface CaricaImmagineProps {
  value?: string;
  onCaricata: (url: string) => void;
  etichetta?: string;
  richiesta?: boolean;
  accept?: string;
  mostraAnteprima?: boolean;
  carica?: (file: File) => Promise<string>;
}

function CaricaImmagine({
  value,
  onCaricata,
  etichetta = "Immagine",
  richiesta = false,
  accept = "image/*",
  mostraAnteprima = true,
  carica = uploadApi.caricaFile,
}: CaricaImmagineProps) {
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  async function handleFile(evento: ChangeEvent<HTMLInputElement>) {
    const file = evento.target.files?.[0];
    if (!file) return;
    setInCorso(true);
    setErrore(null);
    try {
      const url = await carica(file);
      onCaricata(url);
    } catch (err) {
      const error = err as AxiosError<ErrorsDTO>;
      setErrore(error.response?.data?.message ?? "Caricamento non riuscito");
    } finally {
      setInCorso(false);
      evento.target.value = "";
    }
  }

  return (
    <Form.Group className="carica-immagine mb-3">
      <Form.Label>{etichetta}</Form.Label>
      {value && mostraAnteprima && (
        <img src={value} alt="" className="carica-immagine-anteprima" />
      )}
      <div className="carica-immagine-riga">
        <Form.Control
          type="file"
          accept={accept}
          onChange={handleFile}
          disabled={inCorso}
          required={richiesta && !value}
        />
        {inCorso && <Spinner animation="border" size="sm" />}
      </div>
      {errore && (
        <Alert variant="danger" className="mt-2 mb-0">
          {errore}
        </Alert>
      )}
    </Form.Group>
  );
}

export default CaricaImmagine;
