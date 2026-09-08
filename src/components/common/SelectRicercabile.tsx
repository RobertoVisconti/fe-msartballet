import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { LuChevronDown } from "react-icons/lu";

export interface OpzioneRicercabile {
  id: string;
  etichetta: string;
}

interface SelectRicercabileProps {
  opzioni: OpzioneRicercabile[];
  value: string;
  onChange: (id: string) => void;
  /** Testo della voce vuota, come la prima <option> di una select nativa. */
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

/** Toglie accenti e maiuscole, cosi "Nicolò" si trova scrivendo "nicolo". */
function normalizza(testo: string): string {
  return testo
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Select con ricerca: mostra l'etichetta scelta a riposo, filtra le voci
 * mentre si scrive. Il valore verso l'esterno resta l'id, come una select.
 */
function SelectRicercabile({
  opzioni,
  value,
  onChange,
  placeholder = "Seleziona...",
  required = false,
  disabled = false,
}: SelectRicercabileProps) {
  const [aperto, setAperto] = useState(false);
  const [query, setQuery] = useState("");
  const [evidenziato, setEvidenziato] = useState(0);
  const listaRef = useRef<HTMLUListElement>(null);
  const idLista = useId();

  const etichettaScelta = opzioni.find((o) => o.id === value)?.etichetta ?? "";

  const risultati = useMemo(() => {
    const cercato = normalizza(query.trim());
    if (!cercato) {
      // A ricerca vuota la voce vuota resta in cima, come nella select nativa.
      return [{ id: "", etichetta: placeholder }, ...opzioni];
    }
    return opzioni.filter((o) => normalizza(o.etichetta).includes(cercato));
  }, [opzioni, query, placeholder]);

  // Tiene la voce evidenziata dentro la parte visibile della lista.
  useEffect(() => {
    if (!aperto) return;
    listaRef.current
      ?.querySelector(".evidenziata")
      ?.scrollIntoView({ block: "nearest" });
  }, [aperto, evidenziato]);

  function apri() {
    if (disabled) return;
    setQuery("");
    setEvidenziato(0);
    setAperto(true);
  }

  function chiudi() {
    setAperto(false);
    setQuery("");
  }

  function seleziona(opzione: OpzioneRicercabile) {
    onChange(opzione.id);
    chiudi();
  }

  function handleKeyDown(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      evento.preventDefault();
      if (!aperto) {
        apri();
        return;
      }
      if (risultati.length === 0) return;
      const passo = evento.key === "ArrowDown" ? 1 : -1;
      setEvidenziato((i) => (i + passo + risultati.length) % risultati.length);
      return;
    }
    // Invio a lista aperta sceglie la voce, non invia il form.
    if (evento.key === "Enter" && aperto) {
      evento.preventDefault();
      const scelta = risultati[evidenziato];
      if (scelta) seleziona(scelta);
      return;
    }
    if (evento.key === "Escape" && aperto) {
      evento.preventDefault();
      chiudi();
    }
  }

  return (
    <div className="select-ricercabile">
      <input
        type="text"
        className="form-control select-ricercabile-campo"
        role="combobox"
        aria-expanded={aperto}
        aria-controls={idLista}
        aria-activedescendant={
          aperto && risultati.length > 0
            ? `${idLista}-${evidenziato}`
            : undefined
        }
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        // A riposo mostra la scelta, da aperto mostra cio che si sta cercando.
        value={aperto ? query : etichettaScelta}
        required={required}
        disabled={disabled}
        onFocus={apri}
        onBlur={chiudi}
        onKeyDown={handleKeyDown}
        onChange={(evento) => {
          setQuery(evento.target.value);
          setEvidenziato(0);
          setAperto(true);
        }}
      />
      <LuChevronDown
        size={16}
        className="select-ricercabile-icona"
        aria-hidden="true"
      />

      {aperto && (
        <ul
          className="select-ricercabile-lista"
          id={idLista}
          role="listbox"
          ref={listaRef}
        >
          {risultati.length === 0 ? (
            <li className="select-ricercabile-vuoto">Nessun risultato</li>
          ) : (
            risultati.map((opzione, indice) => (
              <li
                key={opzione.id || "__vuota"}
                id={`${idLista}-${indice}`}
                role="option"
                aria-selected={opzione.id === value}
                className={
                  "select-ricercabile-voce" +
                  (indice === evidenziato ? " evidenziata" : "") +
                  (opzione.id === value ? " scelta" : "") +
                  (opzione.id === "" ? " vuota" : "")
                }
                // Evita il blur del campo prima che scatti il click.
                onMouseDown={(evento) => evento.preventDefault()}
                onMouseEnter={() => setEvidenziato(indice)}
                onClick={() => seleziona(opzione)}
              >
                {opzione.etichetta}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default SelectRicercabile;
