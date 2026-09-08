/**
 * Sceglie quante colonne dare a una griglia in base a quanti elementi ci sono,
 * per evitare l'ultima riga quasi vuota (8 schede sopra e 2 sole sotto).
 *
 * Preferisce il numero di colonne che divide esattamente il totale; se nessuno
 * lo divide, quello che lascia l'ultima riga piu piena. A parita, piu colonne.
 */
export function colonneOttimali(totale: number, massimo: number): number {
  if (totale <= 0) return 1;

  let migliore = 1;
  let punteggioMigliore = -1;

  for (let colonne = 1; colonne <= Math.min(massimo, totale); colonne++) {
    const resto = totale % colonne;
    // Divisione esatta: punteggio massimo possibile.
    const punteggio = resto === 0 ? totale : resto;
    if (punteggio >= punteggioMigliore) {
      punteggioMigliore = punteggio;
      migliore = colonne;
    }
  }

  return migliore;
}
