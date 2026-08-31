import type { ErrorsDTO } from "@/interfaces/common";
export function estraiMessaggioErrore(
  data: ErrorsDTO | undefined,
  messaggioDefault: string,
): string {
  if (!data) return messaggioDefault;
  if (data.listaErrori && data.listaErrori.length > 0) {
    return `${data.message}: ${data.listaErrori.join("; ")}`;
  }
  return data.message;
}
