import { Show, Index, createMemo } from "solid-js";
import { createStore } from "solid-js/store";

import { useCountdown } from "./context/Countdown";
import { Timer } from './components/Timer'
import { NextPrize } from "./components/NextPrize";

const stickerOptions = [
  "https://cdn-icons-png.flaticon.com/512/6443/6443652.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443643.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443664.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443634.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443628.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443625.png"
]

export function App() {
  const { state, resetCountdown } = useCountdown();

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
    let i = Math.floor(Math.random() * stickerOptions.length);
    return stickerOptions[i];
  }

  const [stickers, setStickers] = createStore(getStickers());

  const nextStickerIndex = createMemo(() => {
    return stickers.findIndex((sticker) => !sticker.completed)
  });

  const onOpenPrize = () => {
    resetCountdown();
    updateStickers(nextStickerIndex(), {
      completed: true,
      sticker: getStickerOption()
    });
  };


  return (
    <main data-state={state()}>
      <Timer />
      <NextPrize />

      <section class="Stickers">
        <ul>
          <Index each={stickers}>
            {(sticker, index) => {
              const isNextSticker = () => index === nextStickerIndex();
              return (
                <li data-next-sticker={isNextSticker()} data-is-completed={sticker.completed}>
                  <button
                    disabled={!isNextSticker() || state() !== "completed"}
                    onClick={() => onOpenPrize()}
                  >
                    {index + 1}
                    <Show when={sticker().sticker}>
                      <img src={sticker().sticker} />
                    </Show>
                  </button>
                </li>
              );
            }}
          </Index>
        </ul>
      </section>
    </main>
  );
};