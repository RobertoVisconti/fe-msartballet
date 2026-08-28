import { Pagination } from "react-bootstrap";
import type { Page } from "@/interfaces/common";

interface Props {
  pagina: Page<unknown>;
  onCambiaPagina: (numeroPagina: number) => void;
  raggio?: number;
}
function costruisciSequenza(
  corrente: number,
  totale: number,
  raggio: number,
): (number | "ellissi")[] {
  const visibili = new Set<number>([0, totale - 1]);
  for (let i = corrente - raggio; i <= corrente + raggio; i++) {
    if (i >= 0 && i < totale) visibili.add(i);
  }

  const ordinate = [...visibili].sort((a, b) => a - b);
  const sequenza: (number | "ellissi")[] = [];

  ordinate.forEach((numero, indice) => {
    if (indice > 0) {
      const salto = numero - ordinate[indice - 1];

      if (salto === 2) {
        sequenza.push(ordinate[indice - 1] + 1);
      } else if (salto > 2) {
        sequenza.push("ellissi");
      }
    }

    sequenza.push(numero);
  });

  return sequenza;
}

function Paginazione({ pagina, onCambiaPagina, raggio = 1 }: Props) {
  const { number: corrente, totalPages: totale, totalElements } = pagina;

  if (totalElements === 0) return null;

  const primo = corrente * pagina.size + 1;
  const ultimo = primo + pagina.numberOfElements - 1;

  return (
    <div className="paginazione">
      {totale > 1 && (
        <Pagination className="paginazione-controlli">
          <Pagination.Prev
            disabled={pagina.first}
            onClick={() => onCambiaPagina(corrente - 1)}
          />

          {costruisciSequenza(corrente, totale, raggio).map((voce, indice) =>
            voce === "ellissi" ? (
              <Pagination.Ellipsis key={`ellissi-${indice}`} disabled />
            ) : (
              <Pagination.Item
                key={voce}
                active={voce === corrente}
                onClick={() => onCambiaPagina(voce)}
              >
                {voce + 1}
              </Pagination.Item>
            ),
          )}

          <Pagination.Next
            disabled={pagina.last}
            onClick={() => onCambiaPagina(corrente + 1)}
          />
        </Pagination>
      )}

      <p className="paginazione-conteggio testo-secondario">
        {primo}–{ultimo} di {totalElements}
      </p>
    </div>
  );
}

export default Paginazione;
