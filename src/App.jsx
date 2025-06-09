import { useCountdown } from "./context/Countdown";
import { useTheme } from "./context/Theme";
import { ThemeSelector } from "./components/ThemeSelector";
import { Timer } from './components/Timer'
import { NextPrize } from "./components/NextPrize";
import { Stickers } from "./components/Stickers";

import styles from './App.module.css';

export function App() {
  const { state } = useCountdown();
  const { theme } = useTheme();

  return (
    <main className={styles['App']} data-state={state()} data-theme={theme()}>
      <ThemeSelector />
      <div className={styles['App-content']}>
        <Timer />
        <NextPrize />
        <Stickers />
      </div>
    </main>
  );
};
