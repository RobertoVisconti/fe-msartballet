import { Link } from "react-router-dom";
import { LuGraduationCap, LuUsers, LuShieldCheck } from "react-icons/lu";

const OPZIONI = [
  {
    path: "/admin/registrazione/allievo",
    label: "Allievo",
    descrizione: "Iscrive un nuovo allievo ai corsi della scuola.",
    icon: LuGraduationCap,
  },
  {
    path: "/admin/registrazione/insegnante",
    label: "Insegnante",
    descrizione: "Aggiunge un nuovo insegnante allo staff.",
    icon: LuUsers,
  },
  {
    path: "/admin/registrazione/admin",
    label: "Admin",
    descrizione: "Crea un nuovo account con accesso amministrativo.",
    icon: LuShieldCheck,
  },
];

function RegistrazioneAdmin() {
  return (
    <div className="registrazione-scelta">
      <h1>Registrazione</h1>
      <p className="testo-secondario">
        Scegli che tipo di account vuoi creare. L'utente riceverà un'email per
        attivarlo e impostare la password.
      </p>
      <div className="registrazione-griglia">
        {OPZIONI.map(({ path, label, descrizione, icon: Icon }) => (
          <Link key={path} to={path} className="registrazione-card">
            <Icon size={28} strokeWidth={1.6} />
            <h2>{label}</h2>
            <p>{descrizione}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RegistrazioneAdmin;
