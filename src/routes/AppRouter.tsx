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
import AllievoDettaglio from "@/pages/admin/AllievoDettaglio";
import AllieviList from "@/pages/admin/AllieviList";
import AdminHome from "@/pages/admin/AdminHome";
import InsegnantiList from "@/pages/admin/InsegnantiList";
import InsegnanteDettaglio from "@/pages/admin/InsegnanteDettaglio";
import OspitiList from "@/pages/admin/OspitiList";
import OspiteDettaglio from "@/pages/admin/OspiteDettaglio";

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
          <Route path="/admin/insegnanti" element={<InsegnantiList />} />
          <Route
            path="/admin/insegnanti/:id"
            element={<InsegnanteDettaglio />}
          />
          <Route path="/admin/ospiti" element={<OspitiList />} />
          <Route path="/admin/ospiti/:id" element={<OspiteDettaglio />} />
        </Route>

        <Route path="*" element={<InArrivo titolo="Pagina non trovata" />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
