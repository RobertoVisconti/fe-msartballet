import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { ToastContainer, Toast } from "react-bootstrap";

type TipoNotifica = "successo" | "errore";

interface Notifica {
  id: number;
  messaggio: string;
  tipo: TipoNotifica;
}

type FunzioneNotifica = (messaggio: string, tipo?: TipoNotifica) => void;

const ToastContext = createContext<FunzioneNotifica | null>(null);

let ultimoId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [notifiche, setNotifiche] = useState<Notifica[]>([]);

  const notifica = useCallback<FunzioneNotifica>(
    (messaggio, tipo = "errore") => {
      const id = ++ultimoId;
      setNotifiche((precedenti) => [...precedenti, { id, messaggio, tipo }]);
    },
    [],
  );

  function rimuovi(id: number) {
    setNotifiche((precedenti) => precedenti.filter((n) => n.id !== id));
  }

  return (
    <ToastContext.Provider value={notifica}>
      {children}
      <ToastContainer className="toast-container-app" position="bottom-end">
        {notifiche.map((n) => (
          <Toast
            key={n.id}
            bg={n.tipo === "successo" ? "success" : "danger"}
            onClose={() => rimuovi(n.id)}
            delay={5000}
            autohide
          >
            <Toast.Body className="text-white">{n.messaggio}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useNotifica(): FunzioneNotifica {
  const notifica = useContext(ToastContext);
  if (!notifica) {
    throw new Error("useNotifica va usato dentro <ToastProvider>");
  }
  return notifica;
}
