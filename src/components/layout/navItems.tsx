import type { IconType } from "react-icons";
import {
  LuHouse,
  LuGraduationCap,
  LuUsers,
  LuCalendarDays,
  LuDoorOpen,
  LuImages,
  LuShoppingBag,
} from "react-icons/lu";

export interface VoceMenu {
  path: string;
  label: string;
  icon: IconType;
}

export const vociMenu: VoceMenu[] = [
  { path: "/", label: "Home", icon: LuHouse },
  { path: "/la-scuola", label: "La Scuola", icon: LuGraduationCap },
  { path: "/insegnanti", label: "Insegnanti", icon: LuUsers },
  { path: "/corsi", label: "Corsi", icon: LuCalendarDays },
  { path: "/sale", label: "Sale", icon: LuDoorOpen },
  { path: "/galleria", label: "Galleria", icon: LuImages },
  { path: "/store", label: "Store", icon: LuShoppingBag },
];
