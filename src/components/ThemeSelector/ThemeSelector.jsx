import { Index } from "solid-js";

import { useTheme } from "../../context/Theme";

import styles from './ThemeSelector.module.css';

export function ThemeSelector() {
  const { updateTheme, themes } = useTheme();

  return (
    <ul className={styles['ThemeSelector']}>
      <Index each={themes}>
        {(themeChoice, index) => (
          <li data-theme-choice={themeChoice()} onClick={() => updateTheme(themeChoice())}>{themeChoice}</li>
        )}
      </Index>
    </ul>
  );
};
