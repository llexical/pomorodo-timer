import { createSignal } from "solid-js";

import { useCountdown } from "../../context/Countdown";
import styles from './NextPrize.module.css'

const imgPrizeUrl = "https://cdn-icons-png.flaticon.com/512/9036/9036098.png";
const imgPrizeUrlCompleted =
  "https://cdn-icons-png.flaticon.com/512/6039/6039671.png";

export function NextPrize() {
  const { state } = useCountdown();
  const [nextPrize, setNextPrize] = createSignal(getNextPrize());

  function getNextPrize() {
    const storedPrize = localStorage.getItem("nextPrize")
    return storedPrize ? storedPrize : "";
  }
  
  function updateNextPrize(nextPrize) {
    setNextPrize(nextPrize);
    localStorage.setItem("nextPrize", nextPrize)
  }

  return (
    <section className={styles.NextPrize}>
      <img
        src={state() === "completed" ? imgPrizeUrlCompleted : imgPrizeUrl}
      />
      <div className={styles['NextPrize-setPrize']}>
        <h2>Next prize</h2>
        <textarea name="prize-text" value={nextPrize()} placeholder="Something awesome here!" onFocusOut={(e) => updateNextPrize(e.target.value)}/>
      </div>
    </section>
  );
}