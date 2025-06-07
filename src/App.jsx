import { useCountdown } from "./context/Countdown";
import { Timer } from './components/Timer'
import { NextPrize } from "./components/NextPrize";
import { Stickers } from "./components/Stickers";

import styles from './App.module.css';

export function App() {
  const { state } = useCountdown();

  return (
    <main className={styles['App']} data-state={state()}>
      <Timer />
      <NextPrize />
      <Stickers />
    </main>
  );
};
