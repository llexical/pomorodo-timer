import { createSignal, Show, Index, createMemo, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

const audioURL =
  "https://archive.org/download/lp_the-four-seasons_antonio-vivaldi-leonard-bernstein-the-new/disc1/01.06.%20Summer%3A%20III%20-%20Presto.mp3";
const imgPrizeUrl = "https://cdn-icons-png.flaticon.com/512/9036/9036098.png";
const imgPrizeUrlCompleted =
  "https://cdn-icons-png.flaticon.com/512/6039/6039671.png";

const stickerOptions = [
  "https://cdn-icons-png.flaticon.com/512/6443/6443652.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443643.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443664.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443634.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443628.png",
  "https://cdn-icons-png.flaticon.com/512/6443/6443625.png"
]

export function App() {
  let curCountdown;
  let curAudioTimeout;

  const audio = new Audio(audioURL);

  const startTime = new Temporal.PlainTime(0, 20, 0);
  const oneSecondDuration = Temporal.Duration.from("PT1S"); // One-second duration

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

  function getNextPrize() {
    const storedPrize = localStorage.getItem("nextPrize")
    return storedPrize ? storedPrize : "";
  }

  function updateNextPrize(nextPrize) {
    setNextPrize(nextPrize);
    localStorage.setItem("nextPrize", nextPrize)
  }

  const [countdownTime, setCountdownTime] = createSignal(startTime);
  const [state, setState] = createSignal("inactive");
  const [stickers, setStickers] = createStore(getStickers());
  const [nextPrize, setNextPrize] = createSignal(getNextPrize());

  const nextStickerIndex = createMemo(() => {
    return stickers.findIndex((sticker) => !sticker.completed)
  });

  function resetCountdown() {
    clearInterval(curCountdown);
    clearTimeout(curAudioTimeout);
    audio.pause();
    setCountdownTime(startTime);
    setState("inactive");
  }

  const onStartCountdown = () => {
    if (["active"].includes(state())) return;
    setState("active");

    curCountdown = setInterval(() => {
      const curTime = Temporal.PlainTime.from(countdownTime());
      const newTime = curTime.subtract(oneSecondDuration);

      if (newTime.toString() === "00:00:00") {
        setCountdownTime(newTime);
        setState("completed");
        audio.play()
        curAudioTimeout = setTimeout(() => audio.pause(), 30000)
        clearInterval(curCountdown);
      }
      setCountdownTime(newTime);
    }, "1000");
  };

  const onPauseCountdown = () => {
    clearInterval(curCountdown);
    setState("paused");
  };

  const onResetCountdown = () => {
    resetCountdown();
  };

  const onOpenPrize = () => {
    resetCountdown();
    updateStickers(nextStickerIndex(), {
      completed: true,
      sticker: getStickerOption()
    });
  };

  const onTimeChange = (e) => {
    const data = new FormData(e.target.form);
    setCountdownTime(
      new Temporal.PlainTime(data.get("hour"), data.get("minute"), data.get("second"))
    );
  }

  onCleanup(() => {
    clearInterval(curCountdown);
    clearTimeout(curAudioTimeout);
  });


  return (
    <main data-state={state()}>
      <section className="Timer">
        <Show when={state() === 'inactive'}>
          <form>
            <input type="text" name="hour" maxlength="2" value={(countdownTime().hour).toString().padStart(2, '0')} onFocusOut={onTimeChange} />:
            <input type="text" name="minute" maxlength="2" value={(countdownTime().minute).toString().padStart(2, '0')} onFocusOut={onTimeChange} />:
            <input type="text" name="second" maxlength="2" value={(countdownTime().second).toString().padStart(2, '0')} onFocusOut={onTimeChange} />
          </form>
        </Show>
        <Show when={state() !== 'inactive'}>
          <h1>{countdownTime().toString()}</h1>
        </Show>
        <Show when={!["active", "completed"].includes(state())}>
          <button onClick={onStartCountdown}>
            {() => (state() === "paused" ? "Resume" : "Start")}
          </button>
        </Show>
        <Show when={state() === "active"}>
          <button onClick={onPauseCountdown}>Pause</button>
        </Show>
        <Show when={["paused", "completed"].includes(state())}>
          <button onClick={onResetCountdown}>Reset</button>
        </Show>
      </section>
      <section class="Prizes">
        <img
          src={state() === "completed" ? imgPrizeUrlCompleted : imgPrizeUrl}
        />
        <div class="Prizes-next">
          <h2>Next prize</h2>
          <textarea name="prize-text" value={nextPrize()} placeholder="Something awesome here!" onFocusOut={(e) => updateNextPrize(e.target.value)}/>
        </div>
      </section>
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