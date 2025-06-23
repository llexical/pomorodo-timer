import { createSignal } from "solid-js";

import { useCountdown } from "../../context/Countdown";
import { useTheme } from "../../context/Theme";

import styles from './NextPrize.module.css'

const prizeImgs = {
  nature: {
    default: "https://cdn-icons-png.flaticon.com/512/9470/9470902.png",
    complete: "https://cdn-icons-png.flaticon.com/512/11191/11191732.png"
  },
  cats: {
    default: "https://cdn-icons-png.flaticon.com/512/14895/14895948.png",
    complete: "https://cdn-icons-png.flaticon.com/512/14985/14985014.png"
  },
  minimalist: {
    default: "",
    complete: ""
  },
  sherlock: {
    default: "https://cdn-icons-png.flaticon.com/512/10641/10641473.png",
    complete: "https://cdn-icons-png.flaticon.com/512/332/332057.png"
  },
  hubblehq: {
    default: "https://cdn-icons-png.flaticon.com/512/10729/10729384.png",
    complete: "https://cdn-icons-png.flaticon.com/512/2086/2086684.png"
  },
}

export function NextPrize() {
  const { state } = useCountdown();
  const { theme } = useTheme();

  const [nextPrize, setNextPrize] = createSignal(getNextPrize());

  const getPrizeImg = () => {
    return state() === "completed" ? prizeImgs[theme()].complete : prizeImgs[theme()].default
  }

  function getNextPrize() {
    const storedPrize = localStorage.getItem("nextPrize")
    return storedPrize ? storedPrize : "";
  }

  function updateNextPrize(nextPrize) {
    setNextPrize(nextPrize);
    localStorage.setItem("nextPrize", nextPrize)
  }

  return (
    <section className={styles.NextPrize} data-theme={theme()}>
      <img
        src={getPrizeImg()}
      />
      <div className={styles['NextPrize-setPrize']}>
        <h2>Next prize</h2>
        <textarea
          name="prize-text"
          value={nextPrize()}
          placeholder="Something awesome here!"
          onFocusOut={(e) => updateNextPrize(e.target.value)}
        />
      </div>
    </section>
  );
}
