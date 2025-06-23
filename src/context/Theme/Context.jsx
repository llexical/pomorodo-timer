import { useContext, createContext, createSignal } from "solid-js";

const ThemeContext = createContext();

const themes = [
  "nature",
  "cats",
  "minimalist",
  "sherlock",
  "hubblehq"
]

export function ThemeProvider(props) {
  const getTheme = () => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme) {
      return storedTheme;
    }
    return themes[0];
  }

  const [theme, setTheme] = createSignal(getTheme());

  const updateTheme = (theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  }



  const themeVals = {
    theme,
    themes,
    updateTheme,
  }

  return (
    <ThemeContext.Provider value={themeVals}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() { return useContext(ThemeContext); }
