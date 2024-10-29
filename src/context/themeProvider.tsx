import { FC, ReactNode, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~hooks/useReduxHooks";
import { setAppTheme } from "~services/state/app.slice";
import type { ThemContext, Themes } from "~types/context/themeContext";
import { ThemeContext } from "./themeContext";

const rootNode = document.getElementById("root");

// Theme Provider Component
export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const selectedTheme = useAppSelector(state => state.app.theme);
    const dispatch = useAppDispatch();
    
    const toggleTheme: ThemContext["toggleTheme"] = (theme: Themes) => {
        dispatch(setAppTheme(theme));
    }
    
    useEffect(() => {
        rootNode?.classList.remove("light_mode", "dark_mode");
        
        if (selectedTheme === "dark") {
            rootNode?.classList.add("dark_mode");
        } else {
            rootNode?.classList.add("light_mode");
        }

    }, [selectedTheme]);


    return (
        <ThemeContext.Provider value={{ theme: selectedTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
