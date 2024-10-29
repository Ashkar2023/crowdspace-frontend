export type Themes = "light" | "dark"

export type ThemContext =  {
    theme : Themes,
    toggleTheme : (theme : Themes)=> void
}