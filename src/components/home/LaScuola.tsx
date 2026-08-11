import { useEffect, useState } from "react";
import { disciplinaApi } from "@/api/disciplinaApi";
import { salaApi } from "@/api/salaApi";

function LaScuola() {
  const [numeroDiscipline, setNumeroDiscipline] = useState<number | null>(null);
  const [numeroSale, setNumeroSale] = useState<number | null>(null);

  useEffect(() => {
    disciplinaApi
      .lista({ size: 1 })
      .then((pagina) => setNumeroDiscipline(pagina.totalElements))
      .catch(() => {});
    salaApi
      .lista({ size: 1 })
      .then((pagina) => setNumeroSale(pagina.totalElements))
      .catch(() => {});
  }, []);

  return (
    <section className="scuola-section" id="scuola">
      <div className="scuola-sinistra">
        <span className="tag-stagione">Stagione 2026</span>
        <h2>Come lavoriamo</h2>
        <p>
          Un metodo che unisce la disciplina della tecnica classica alla libertà
          espressiva delle discipline contemporanee, in classi piccole seguite
          da vicino.
        </p>
        <div className="scuola-stats">
          <div className="stat">
            <span className="stat-numero">12</span>
            <span className="stat-etichetta">Allievi per classe</span>
          </div>
          <div className="stat">
            <span className="stat-numero">{numeroDiscipline ?? "—"}</span>
            <span className="stat-etichetta">Discipline</span>
          </div>
          <div className="stat">
            <span className="stat-numero">{numeroSale ?? "—"}</span>
            <span className="stat-etichetta">Sale attrezzate</span>
          </div>
        </div>
      </div>
      <div className="scuola-destra">
        <span className="scuola-virgoletta">”</span>
        <p className="scuola-citazione">
          La danza non è solo movimento: è il modo in cui il corpo racconta ciò
          che le parole non arrivano a dire.
        </p>
        <span className="scuola-didascalia">Il nostro metodo</span>
      </div>
    </section>
  );
}

export default LaScuola;
