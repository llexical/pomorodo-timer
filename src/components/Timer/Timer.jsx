import { Show } from "solid-js";

import { useCountdown } from "../../context/Countdown";
import styles from './Timer.module.css'

export function Timer() {
  const {
    state,
    countdownTime,
    setCountdownTime,
    startCountdown,
    pauseCountdown,
    resetCountdown
  } = useCountdown()

  const onTimeChange = (e) => {
    const data = new FormData(e.target.form);
    setCountdownTime(
      new Temporal.PlainTime(data.get("hour"), data.get("minute"), data.get("second"))
    );
  }
  
  return (
    <section className={styles.Timer}>
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
        <button onClick={startCountdown}>
        {() => (state() === "paused" ? "Resume" : "Start")}
        </button>
      </Show>
      <Show when={state() === "active"}>
        <button onClick={pauseCountdown}>Pause</button>
      </Show>
      <Show when={["paused", "completed"].includes(state())}>
        <button onClick={resetCountdown}>Reset</button>
      </Show>
    </section>
  );
}