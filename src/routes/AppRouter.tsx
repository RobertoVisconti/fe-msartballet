import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/pages/auth/Login";
import RegistrazioneOspite from "@/pages/auth/RegistrazioneOspite";
import AttivaAccount from "@/pages/auth/AttivaAccount";
import PasswordDimenticata from "@/pages/auth/PasswordDimenticata";
import ResetPassword from "@/pages/auth/ResetPassword";
import InArrivo from "@/pages/InArrivo";
import Profilo from "@/pages/Profilo";
import AllievoDettaglio from "@/components/admin/AllievoDettaglio";
import AllieviList from "@/components/admin/AllieviList";
import AdminHome from "@/components/admin/AdminHome";

function AppRouter() {
  return (
    <Routes>
      {/* Auth: pagina intera, senza sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrati" element={<RegistrazioneOspite />} />
      <Route path="/attiva-account" element={<AttivaAccount />} />
      <Route path="/password-dimenticata" element={<PasswordDimenticata />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Tutto il resto: dentro il layout con sidebar/footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<InArrivo titolo="Home" />} />
        <Route path="/la-scuola" element={<InArrivo titolo="La Scuola" />} />
        <Route path="/insegnanti" element={<InArrivo titolo="Insegnanti" />} />
        <Route path="/corsi" element={<InArrivo titolo="Corsi" />} />
        <Route path="/sale" element={<InArrivo titolo="Sale" />} />
        <Route path="/galleria" element={<InArrivo titolo="Galleria" />} />
        <Route path="/store" element={<InArrivo titolo="Store" />} />
        <Route path="/contatti" element={<InArrivo titolo="Contatti" />} />
        <Route
          path="/prenota-prova"
          element={<InArrivo titolo="Prenota una prova" />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/il-mio-profilo"
            element={<InArrivo titolo="Il mio profilo" />}
          />
          <Route path="/il-mio-profilo" element={<Profilo />} />
        </Route>

        <Route element={<ProtectedRoute ruoliConsentiti={["ADMIN"]} />}>
          <Route path="/admin" element={<InArrivo titolo="Area Admin" />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/allievi" element={<AllieviList />} />
          <Route path="/admin/allievi/:id" element={<AllievoDettaglio />} />
        </Route>

        <Route path="*" element={<InArrivo titolo="Pagina non trovata" />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
