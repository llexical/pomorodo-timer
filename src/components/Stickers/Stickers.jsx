import { Index, createMemo, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { useCountdown } from "../../context/Countdown";
import { useTheme } from "../../context/Theme";
import styles from './Stickers.module.css'

const stickerOptions = {
  nature: [
    "https://cdn-icons-png.flaticon.com/512/6443/6443652.png",
    "https://cdn-icons-png.flaticon.com/512/6443/6443643.png",
    "https://cdn-icons-png.flaticon.com/512/6443/6443664.png",
    "https://cdn-icons-png.flaticon.com/512/6443/6443634.png",
    "https://cdn-icons-png.flaticon.com/512/6443/6443628.png",
    "https://cdn-icons-png.flaticon.com/512/6443/6443625.png"
  ],
  cats: [
    "https://cdn-icons-png.flaticon.com/512/11565/11565172.png",
    "https://cdn-icons-png.flaticon.com/512/11565/11565136.png",
    "https://cdn-icons-png.flaticon.com/512/11565/11565160.png",
    "https://cdn-icons-png.flaticon.com/512/11565/11565180.png",
    "https://cdn-icons-png.flaticon.com/512/11565/11565138.png",
    "https://cdn-icons-png.flaticon.com/512/11565/11565146.png"
  ],
  minimalist: ["", "", "", "", "", ""],
  sherlock: [
    "https://cdn-icons-png.flaticon.com/512/1283/1283487.png",
    "https://cdn-icons-png.flaticon.com/512/2539/2539419.png",
    "https://cdn-icons-png.flaticon.com/512/3013/3013756.png",
    "https://cdn-icons-png.flaticon.com/512/311/311762.png",
    "https://cdn-icons-png.flaticon.com/512/836/836853.png",
    "https://cdn-icons-png.flaticon.com/512/3286/3286624.png"
  ]
}

export function Stickers() {
  const { state, resetCountdown } = useCountdown();
  const { theme } = useTheme();

  function getStickers() {
    const storedStickers = localStorage.getItem("stickers")
    if (storedStickers) {
      // Only use the cache if its from the same day otherwise ignore
      const stickers = JSON.parse(storedStickers);
      const stickersCacheDate = Temporal.PlainDate.from(stickers.date);

      if (!Temporal.PlainDate.compare(stickersCacheDate, Temporal.Now.plainDateISO())) {
        // returns 0 if they are the same
        return stickers.stickers;
      }
    }
    return Array.from({ length: 6 }, () => ({
      completed: false,
      sticker: null,
    }));
  }

  function updateStickers(...args) {
    setStickers(...args);
    localStorage.setItem("stickers", JSON.stringify({date: Temporal.Now.plainDateISO().toString(), stickers}));
  }

  function getStickerOption() {
    return Math.floor(Math.random() * stickerOptions[theme()].length);
  }

  const [stickers, setStickers] = createStore(getStickers());

  const nextStickerIndex = createMemo(() => {
    return stickers.findIndex((sticker) => !sticker.completed)
  });

  const onCollectSticker = () => {
    resetCountdown();
    updateStickers(nextStickerIndex(), {
      completed: true,
      sticker: getStickerOption()
    });
  };

  return (
    <section className={styles.Stickers} data-theme={theme()}>
      <ul>
        <Index each={stickers}>
          {(sticker, index) => {
            const isNextSticker = () => index === nextStickerIndex();
            return (
              <li data-next-sticker={isNextSticker()} data-is-completed={sticker().completed}>
                <button
                  disabled={!isNextSticker() || state() !== "completed"}
                  onClick={() => onCollectSticker()}
                >
                  {index + 1}
                  <Show when={sticker().sticker !== null}>
                    <img src={stickerOptions[theme()][sticker().sticker]} />
                  </Show>
                </button>
              </li>
            );
          }}
        </Index>
      </ul>
    </section>
  );
}
