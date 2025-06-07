import { useCountdown } from "./context/Countdown";
import { Timer } from './components/Timer'
import { NextPrize } from "./components/NextPrize";
import { Stickers } from "./components/Stickers";

export function App() {
  const { state } = useCountdown();

  return (
    <main data-state={state()}>
      <Timer />
      <NextPrize />
      <Stickers />
    </main>
  );
};
