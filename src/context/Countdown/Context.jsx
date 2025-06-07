import { createSignal, useContext, onCleanup, createContext } from "solid-js";

const audioURL =
  "https://archive.org/download/lp_the-four-seasons_antonio-vivaldi-leonard-bernstein-the-new/disc1/01.06.%20Summer%3A%20III%20-%20Presto.mp3";

const CountdownContext = createContext();

export function CountdownProvider(props) {
  let curCountdown;
  let curAudioTimeout;
  const audio = new Audio(audioURL);
  const startTime = new Temporal.PlainTime(0, 0, 3);
  const oneSecondDuration = Temporal.Duration.from("PT1S"); // One-second duration
  
  const [state, setState] = createSignal("inactive");
  const [countdownTime, setCountdownTime] = createSignal(startTime);

  const resetCountdown = () => {
    clearInterval(curCountdown);
    clearTimeout(curAudioTimeout);
    audio.pause();
    setCountdownTime(startTime);
    setState("inactive");
  }

  const startCountdown = () =>  {
    if (["active"].includes(props.state)) return;
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
  }

  const pauseCountdown = () => {
    clearInterval(curCountdown);
    setState("paused");
  }

  const countdown = {
    countdownTime,
    state,

    setCountdownTime,
    startCountdown,
    pauseCountdown,
    resetCountdown
  };

  onCleanup(() => {
    clearInterval(curCountdown);
    clearTimeout(curAudioTimeout);
  });

  return (
    <CountdownContext.Provider value={countdown}>
      {props.children}
    </CountdownContext.Provider>
  );
}

export function useCountdown() { return useContext(CountdownContext); }