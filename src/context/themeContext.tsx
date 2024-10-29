import { createContext } from "react";
import { ThemContext } from "~types/context/themeContext";

export const ThemeContext = createContext<ThemContext | null>(null)
