import { createContext } from "react";
import { ThemContext } from "~types/context/themeContext.types";

export const ThemeContext = createContext<ThemContext | null>(null)
