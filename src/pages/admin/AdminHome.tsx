import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuGraduationCap,
  LuClipboardList,
  LuTicket,
  LuCalendarCheck,
  LuWallet,
  LuUserPlus,
  LuMailWarning,
  LuStethoscope,
} from "react-icons/lu";
import { allievoApi } from "@/api/allievoApi";
import { insegnanteApi } from "@/api/insegnanteApi";
import { iscrizioneApi } from "@/api/iscrizioneApi";
import { prenotazioneApi } from "@/api/prenotazioneApi";
import { lezioneApi } from "@/api/lezioneApi";
import { transazioneApi } from "@/api/transazioneApi";
import { useNotifica } from "@/components/common/ToastProvider";
import { formattaPrezzo } from "@/utils/formattaPrezzo";
import { StatoCaricamento, StatoErrore } from "@/components/common/StatiLista";
import type { AllievoRespDTO } from "@/interfaces/utente";
import type { PrenotazioneRespDTO } from "@/interfaces/prenotazione";
import type { LezioneRespDTO } from "@/interfaces/lezione";

const GIORNI_PROSSIME_LEZIONI = 7;
const GIORNI_SCADENZA_CERTIFICATO = 30;
const RIGHE_PANNELLO = 5;
const MAX_TRANSAZIONI_MESE = 200;

interface DatiDashboard {
  allieviAttivi: number;
  iscrizioniAttive: number;
  prenotazioniInAttesa: number;
  lezioniInArrivo: number;
  daAttivare: number;
  incassoMese: number;
  numeroTransazioniMese: number;
  certificati: AllievoRespDTO[];
  totaleCertificati: number;
  prenotazioni: PrenotazioneRespDTO[];
  lezioni: LezioneRespDTO[];
}

/** ISO senza fuso, come lo vuole il LocalDateTime dei filtri dal/al. */
function isoLocale(data: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())}` +
    `T${p(data.getHours())}:${p(data.getMinutes())}:${p(data.getSeconds())}`
  );
}

/** Solo data, come il LocalDate di certificatoScadeEntro. */
function isoData(data: Date): string {
  return isoLocale(data).slice(0, 10);
}

function fraGiorni(giorni: number): Date {
  const data = new Date();
  data.setDate(data.getDate() + giorni);
  return data;
}

function formattaData(valore: string): string {
  return new Date(valore).toLocaleDateString("it-IT");
}

function formattaDataOra(valore: string): string {
  return new Date(valore).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scaduto(data: string | null): boolean {
  if (!data) return false;
  return new Date(data) < new Date(isoData(new Date()));
}

function AdminHome() {
  const [dati, setDati] = useState<DatiDashboard | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);
  const notifica = useNotifica();

  function caricaDashboard() {
    setCaricamento(true);
    const adesso = new Date();
    const inizioMese = new Date(adesso.getFullYear(), adesso.getMonth(), 1);
    const fineMese = new Date(
      adesso.getFullYear(),
      adesso.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    Promise.all([
      allievoApi.lista({ accountAttivo: true, size: 1 }),
      allievoApi.lista({ accountAttivo: false, size: 1 }),
      insegnanteApi.lista({ size: 100 }),
      iscrizioneApi.lista({ stato: "ATTIVA", size: 1 }),
      // Solo lezioni da oggi in poi: una prenotazione su una lezione gia
      // passata non e piu confermabile e gonfierebbe il contatore.
      prenotazioneApi.lista({
        stato: "IN_ATTESA",
        dataDa: isoData(adesso),
        size: RIGHE_PANNELLO,
        sort: "lezione.dataOraInizio,asc",
      }),
      lezioneApi.lista({
        dal: isoLocale(adesso),
        al: isoLocale(fraGiorni(GIORNI_PROSSIME_LEZIONI)),
        size: RIGHE_PANNELLO,
        sort: "dataOraInizio,asc",
      }),
      allievoApi.lista({
        certificatoScadeEntro: isoData(fraGiorni(GIORNI_SCADENZA_CERTIFICATO)),
        size: RIGHE_PANNELLO,
        sort: "dataScadenzaCertificato,asc",
      }),
      transazioneApi.lista({
        dal: isoLocale(inizioMese),
        al: isoLocale(fineMese),
        size: MAX_TRANSAZIONI_MESE,
      }),
    ])
      .then(
        ([
          attivi,
          nonAttivi,
          insegnanti,
          iscrizioni,
          prenotazioni,
          lezioni,
          certificati,
          transazioni,
        ]) => {
          const insegnantiDaAttivare = insegnanti.content.filter(
            (i) => !i.accountAttivo,
          ).length;

          setDati({
            allieviAttivi: attivi.totalElements,
            iscrizioniAttive: iscrizioni.totalElements,
            prenotazioniInAttesa: prenotazioni.totalElements,
            lezioniInArrivo: lezioni.totalElements,
            daAttivare: nonAttivi.totalElements + insegnantiDaAttivare,
            incassoMese: transazioni.content.reduce(
              (somma, t) => somma + t.importo,
              0,
            ),
            numeroTransazioniMese: transazioni.totalElements,
            certificati: certificati.content,
            totaleCertificati: certificati.totalElements,
            prenotazioni: prenotazioni.content,
            lezioni: lezioni.content,
          });
          setErrore(false);
        },
      )
      .catch(() => {
        setErrore(true);
        notifica("Impossibile caricare la dashboard", "errore");
      })
      .finally(() => setCaricamento(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    caricaDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativo]);

  if (caricamento) {
    return (
      <div className="page-container">
        <h1>Area Admin</h1>
        <StatoCaricamento testo="Caricamento dashboard..." />
      </div>
    );
  }

  if (errore || !dati) {
    return (
      <div className="page-container">
        <h1>Area Admin</h1>
        <StatoErrore
          testo="Impossibile caricare i dati della dashboard."
          onRiprova={() => setTentativo((t) => t + 1)}
        />
      </div>
    );
  }

  const tessere = [
    {
      etichetta: "Allievi attivi",
      valore: String(dati.allieviAttivi),
      icona: LuGraduationCap,
      to: "/admin/allievi",
      attenzione: false,
    },
    {
      etichetta: "Iscrizioni attive",
      valore: String(dati.iscrizioniAttive),
      icona: LuClipboardList,
      to: "/admin/iscrizioni",
      attenzione: false,
    },
    {
      etichetta: "Prenotazioni in attesa (da oggi)",
      valore: String(dati.prenotazioniInAttesa),
      icona: LuTicket,
      to: "/admin/prenotazioni",
      attenzione: dati.prenotazioniInAttesa > 0,
    },
    {
      etichetta: `Lezioni nei prossimi ${GIORNI_PROSSIME_LEZIONI} giorni`,
      valore: String(dati.lezioniInArrivo),
      icona: LuCalendarCheck,
      to: "/admin/lezioni",
      attenzione: false,
    },
    {
      etichetta: "Account da attivare",
      valore: String(dati.daAttivare),
      icona: LuMailWarning,
      to: "/admin/allievi",
      attenzione: dati.daAttivare > 0,
    },
    {
      etichetta: `Incasso del mese (${dati.numeroTransazioniMese} transazioni)`,
      valore: formattaPrezzo(dati.incassoMese),
      icona: LuWallet,
      to: "/admin/transazioni",
      attenzione: false,
    },
  ];

  return (
    <div className="page-container">
      <h1>Area Admin</h1>
      <p className="testo-secondario">
        Usa il menu a sinistra per gestire utenti, catalogo, lezioni e
        transazioni.
      </p>

      <div className="dashboard-tessere">
        {tessere.map(({ etichetta, valore, icona: Icona, to, attenzione }) => (
          <Link
            key={etichetta}
            to={to}
            className={"dashboard-tessera" + (attenzione ? " attenzione" : "")}
          >
            <Icona size={18} strokeWidth={1.8} />
            <span className="dashboard-tessera-valore">{valore}</span>
            <span className="dashboard-tessera-etichetta">{etichetta}</span>
          </Link>
        ))}
      </div>

      <div className="dashboard-pannelli">
        <section className="dashboard-pannello">
          <div className="dashboard-pannello-testa">
            <h2>
              <LuStethoscope size={16} strokeWidth={1.8} />
              Certificati medici
            </h2>
            <Link to="/admin/allievi">Vedi allievi</Link>
          </div>
          {dati.certificati.length === 0 ? (
            <p className="dashboard-vuoto">
              Nessun certificato scaduto o in scadenza nei prossimi{" "}
              {GIORNI_SCADENZA_CERTIFICATO} giorni.
            </p>
          ) : (
            <>
              <ul className="dashboard-righe">
                {dati.certificati.map((allievo) => (
                  <li key={allievo.id}>
                    <Link to={`/admin/allievi/${allievo.id}`}>
                      {allievo.nome} {allievo.cognome}
                    </Link>
                    <span
                      className={
                        scaduto(allievo.dataScadenzaCertificato)
                          ? "dashboard-nota scaduto"
                          : "dashboard-nota"
                      }
                    >
                      {allievo.dataScadenzaCertificato
                        ? formattaData(allievo.dataScadenzaCertificato)
                        : "—"}
                    </span>
                  </li>
                ))}
              </ul>
              {dati.totaleCertificati > dati.certificati.length && (
                <p className="dashboard-vuoto">
                  e altri {dati.totaleCertificati - dati.certificati.length}.
                </p>
              )}
            </>
          )}
        </section>

        <section className="dashboard-pannello">
          <div className="dashboard-pannello-testa">
            <h2>
              <LuTicket size={16} strokeWidth={1.8} />
              Prenotazioni da confermare
            </h2>
            <Link to="/admin/prenotazioni">Gestisci</Link>
          </div>
          {dati.prenotazioni.length === 0 ? (
            <p className="dashboard-vuoto">
              Nessuna prenotazione in attesa su lezioni future.
            </p>
          ) : (
            <ul className="dashboard-righe">
              {dati.prenotazioni.map((prenotazione) => (
                <li key={prenotazione.id}>
                  <span>
                    {prenotazione.nomeUtente}
                    <span className="dashboard-sala">
                      {" "}
                      · {prenotazione.titoloCorso}
                    </span>
                  </span>
                  <span className="dashboard-nota">
                    {formattaDataOra(prenotazione.dataOraLezione)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard-pannello">
          <div className="dashboard-pannello-testa">
            <h2>
              <LuCalendarCheck size={16} strokeWidth={1.8} />
              Prossime lezioni
            </h2>
            <Link to="/admin/lezioni">Calendario</Link>
          </div>
          {dati.lezioni.length === 0 ? (
            <p className="dashboard-vuoto">
              Nessuna lezione nei prossimi {GIORNI_PROSSIME_LEZIONI} giorni.
            </p>
          ) : (
            <ul className="dashboard-righe">
              {dati.lezioni.map((lezione) => (
                <li key={lezione.id}>
                  <span>
                    {lezione.titoloCorso}
                    <span className="dashboard-sala">
                      {" "}
                      · {lezione.titoloSala}
                    </span>
                  </span>
                  <span className="dashboard-nota">
                    {formattaDataOra(lezione.dataOraInizio)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <span className="dashboard-etichetta">Scorciatoie</span>
      <div className="registrazione-griglia">
        <Link to="/admin/registrazione" className="registrazione-card">
          <LuUserPlus size={22} strokeWidth={1.6} />
          <h2>Registra un utente</h2>
          <p>Allievo, insegnante o nuovo admin.</p>
        </Link>
        <Link to="/admin/lezioni" className="registrazione-card">
          <LuCalendarCheck size={22} strokeWidth={1.6} />
          <h2>Nuova lezione</h2>
          <p>Aggiungi una data al calendario.</p>
        </Link>
        <Link to="/admin/transazioni" className="registrazione-card">
          <LuWallet size={22} strokeWidth={1.6} />
          <h2>Nuova transazione</h2>
          <p>Registra un pagamento.</p>
        </Link>
        <Link to="/admin/iscrizioni" className="registrazione-card">
          <LuClipboardList size={22} strokeWidth={1.6} />
          <h2>Iscrizioni</h2>
          <p>Controlla e cambia gli stati.</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminHome;
