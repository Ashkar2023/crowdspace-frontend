export type Themes = "light" | "dark"

export type ThemContext =  {
    theme : Themes,
    screenWidth:number,
    toggleTheme : (theme : Themes)=> void
}