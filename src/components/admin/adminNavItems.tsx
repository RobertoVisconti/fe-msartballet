import type { IconType } from "react-icons";
import {
  LuLayoutDashboard,
  LuUserPlus,
  LuGraduationCap,
  LuUsers,
  LuUserRound,
  LuBookOpen,
  LuDoorOpen,
  LuShoppingBag,
  LuDrama,
  LuCalendarDays,
  LuImages,
  LuCalendarCheck,
  LuClipboardList,
  LuTicket,
  LuWallet,
  LuShieldCheck,
} from "react-icons/lu";

export interface VoceMenuAdmin {
  path: string;
  label: string;
  icon: IconType;
}

export const vociMenuAdmin: VoceMenuAdmin[] = [
  { path: "/admin", label: "Dashboard", icon: LuLayoutDashboard },
  { path: "/admin/registrazione", label: "Registrazione", icon: LuUserPlus },
  { path: "/admin/allievi", label: "Allievi", icon: LuGraduationCap },
  { path: "/admin/insegnanti", label: "Insegnanti", icon: LuUsers },
  { path: "/admin/ospiti", label: "Ospiti", icon: LuUserRound },
  { path: "/admin/admins", label: "Admin", icon: LuShieldCheck },
  { path: "/admin/discipline", label: "Discipline", icon: LuBookOpen },
  { path: "/admin/sale", label: "Sale", icon: LuDoorOpen },
  { path: "/admin/prodotti", label: "Prodotti", icon: LuShoppingBag },
  { path: "/admin/spettacoli", label: "Spettacoli", icon: LuDrama },
  { path: "/admin/corsi", label: "Corsi", icon: LuCalendarDays },
  { path: "/admin/media", label: "Media", icon: LuImages },
  { path: "/admin/lezioni", label: "Lezioni", icon: LuCalendarCheck },
  { path: "/admin/iscrizioni", label: "Iscrizioni", icon: LuClipboardList },
  { path: "/admin/prenotazioni", label: "Prenotazioni", icon: LuTicket },
  { path: "/admin/transazioni", label: "Transazioni", icon: LuWallet },
];
