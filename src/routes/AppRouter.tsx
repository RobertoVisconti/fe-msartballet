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
import Contatti from "@/pages/Contatti";
import Home from "@/pages/Home";
import Corsi from "@/pages/Corsi";
import Sale from "@/pages/Sale";
import Store from "@/pages/Store";
import Insegnanti from "@/pages/Insegnanti";
import Galleria from "@/pages/Galleria";
import DisciplineAdmin from "@/pages/admin/DisciplineAdmin";
import SaleAdmin from "@/pages/admin/SaleAdmin";
import ProdottiAdmin from "@/pages/admin/ProdottiAdmin";
import SpettacoliAdmin from "@/pages/admin/SpettacoliAdmin";
import CorsiAdmin from "@/pages/admin/CorsiAdmin";
import MediaAdmin from "@/pages/admin/MediaAdmin";
import Lezioni from "@/pages/Lezioni";
import LezioniAdmin from "@/pages/admin/LezioniAdmin";
import IscrizioniAdmin from "@/pages/admin/IscrizioniAdmin";

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
        <Route path="/" element={<Home />} />
        <Route path="/la-scuola" element={<InArrivo titolo="La Scuola" />} />
        <Route path="/insegnanti" element={<Insegnanti />} />
        <Route path="/corsi" element={<Corsi />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/galleria" element={<Galleria />} />
        <Route path="/store" element={<Store />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="/lezioni" element={<Lezioni />} />
        <Route
          path="/prenota-prova"
          element={<InArrivo titolo="Prenota una prova" />}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/il-mio-profilo" element={<Profilo />} />
        </Route>

        <Route element={<ProtectedRoute ruoliConsentiti={["ADMIN"]} />}>
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
          <Route path="/admin/discipline" element={<DisciplineAdmin />} />
          <Route path="/admin/sale" element={<SaleAdmin />} />
          <Route path="/admin/prodotti" element={<ProdottiAdmin />} />
          <Route path="/admin/spettacoli" element={<SpettacoliAdmin />} />
          <Route path="/admin/corsi" element={<CorsiAdmin />} />
          <Route path="/admin/media" element={<MediaAdmin />} />
          <Route path="/admin/lezioni" element={<LezioniAdmin />} />
          <Route path="/admin/iscrizioni" element={<IscrizioniAdmin />} />
        </Route>

        <Route path="*" element={<InArrivo titolo="Pagina non trovata" />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
