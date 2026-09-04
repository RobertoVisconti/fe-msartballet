# MS Art Ballet — Frontend

Client React per la gestione e la vetrina di una scuola di danza: sito pubblico, area personale per gli allievi e pannello di amministrazione completo.

> **Questo progetto è diviso in due repository:**
> - **Frontend (questo repo)** — client React + TypeScript: https://github.com/RobertoVisconti/fe-msartballet
> - **Backend** — API REST Spring Boot: https://github.com/RobertoVisconti/be-capstone-msartballet

Progetto capstone realizzato per il corso Epicode. Per funzionare richiede il backend in esecuzione.

---

## Stack

| | |
|---|---|
| Libreria UI | React 19 + TypeScript (React Compiler attivo) |
| Build tool | Vite |
| Routing | React Router v7 |
| Stato globale | Redux Toolkit (limitato all'autenticazione) |
| HTTP | Axios, con interceptor per token e gestione 401 |
| Stile | Bootstrap 5 + React-Bootstrap, tema scuro custom |
| Icone | React Icons (Lucide) |

---

## Funzionalità

### Sito pubblico

Home con hero e video di presentazione, pagina "La Scuola", insegnanti, corsi, sale, galleria fotografica con lightbox, store, contatti e calendario lezioni. Un visitatore può **prenotare una lezione di prova senza registrarsi**.

### Area personale

Accessibile dopo il login, con contenuti diversi per ruolo:

- **Tutti i ruoli** — "Il mio profilo": dati anagrafici, foto profilo, cambio password
- **Allievo** — "Le mie iscrizioni" e "Le mie prenotazioni", in sola lettura
- **Admin** — collegamento rapido al pannello di amministrazione

### Pannello admin

CRUD completo su tutte le entità del dominio: allievi, insegnanti, ospiti, admin, discipline, corsi, sale, prodotti, spettacoli, media, lezioni, iscrizioni, prenotazioni e transazioni. Include registrazione di nuovi utenti (con invio del link di attivazione), liste paginate, filtri combinabili (per corso, stato, intervallo di date) e upload immagini.

---

## Avvio in locale

### Prerequisiti

- Node.js 20+
- Il [backend](https://github.com/RobertoVisconti/be-capstone-msartballet) in esecuzione

### 1. Configurazione

Il file `.env` è escluso dal versionamento: va creato nella root del progetto con l'indirizzo del backend.

```env
VITE_API_BASE_URL=http://localhost:3007
```

### 2. Installazione e avvio

```bash
npm install
npm run dev
```

L'applicazione risponde su `http://localhost:5173`.

> La porta deve corrispondere a quella configurata in `FRONTEND_URL` sul backend, che la usa per la policy CORS e per costruire i link di attivazione inviati via email.

### Altri comandi

```bash
npm run build     # type-check + build di produzione
npm run lint      # ESLint
npm run preview   # anteprima della build
```

---

## Struttura del progetto

```
src/
├── api/           # client axios e funzioni per ogni risorsa dell'API
├── components/
│   ├── admin/     # form riutilizzabili, sidebar e layout del pannello admin
│   ├── common/    # Paginazione, stati lista (caricamento/vuoto/errore), toast
│   ├── home/      # sezioni della home page
│   └── layout/    # layout e navigazione del sito pubblico
├── interfaces/    # tipi TypeScript allineati ai DTO del backend
├── pages/
│   ├── admin/     # pagine del pannello di amministrazione
│   └── auth/      # login, attivazione account, recupero password
├── redux/         # slice, thunk e store (autenticazione)
├── routes/        # router e rotte protette per ruolo
└── utils/         # gestione sessione ed estrazione messaggi di errore
```

---

## Note implementative

- **Rotte protette per ruolo** — un unico componente `ProtectedRoute` accetta l'elenco dei ruoli ammessi: reindirizza al login chi non è autenticato e alla home chi non ha i permessi.
- **Sessione persistente** — token e dati utente vengono salvati in `localStorage` e ripristinati all'avvio; un interceptor Axios esegue il logout automatico su risposta `401`.
- **Componenti condivisi** — `Paginazione` e `StatiLista` uniformano paginazione e i quattro stati di ogni lista (caricamento, errore con "Riprova", lista vuota, dati), evitando duplicazione fra le pagine admin.
- **Tema unico** — un solo `App.css` organizzato in sezioni, con i colori, la tipografia e le spaziature definiti come variabili CSS in `:root`.
- **Responsive** — layout a due colonne su desktop, con navigazione a menu laterale che diventa a comparsa sotto i 992px.

---

## Autore

Roberto Visconti — progetto capstone Epicode.
