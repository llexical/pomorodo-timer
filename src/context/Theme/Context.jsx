import { useContext, createContext, createSignal } from "solid-js";

const ThemeContext = createContext();

const themes = [
  "nature",
  "cats",
  "zen"
]

export function ThemeProvider(props) {
  const [theme, setTheme] = createSignal(themes[1]);

  const themeVals = {
    theme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={themeVals}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() { return useContext(ThemeContext); }
