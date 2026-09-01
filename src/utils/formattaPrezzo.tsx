export function formattaPrezzo(valore: number): string {
  return valore.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
  });
}