import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "~hooks/useReduxHooks";
import { setAppTheme } from "~services/state/app.slice";
import type { ThemContext, Themes } from "~types/context/themeContext.types";
import { ThemeContext } from "./themeContext";

const bodyNode = document.body;

// Theme Provider Component
export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const selectedTheme = useAppSelector(state => state.app.theme);
    const dispatch = useAppDispatch();

    const toggleTheme: ThemContext["toggleTheme"] = (theme: Themes) => {
        dispatch(setAppTheme(theme));
    }

    useEffect(() => {
        bodyNode?.classList.remove("light_mode", "dark_mode", "light", "dark");

        if (selectedTheme === "dark") {
            bodyNode?.classList.add("dark_mode", "dark");
        } else {
            bodyNode?.classList.add("light_mode", "light");
        }

    }, [selectedTheme]);

    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

    const handleResize = useCallback((event: UIEvent) => {
        setScreenWidth(window.innerWidth);
    }, [])

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }

    }, []);

    return (
        <ThemeContext.Provider value={{ theme: selectedTheme, toggleTheme, screenWidth }}>
            {children}
        </ThemeContext.Provider>
    )
}
