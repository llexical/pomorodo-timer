/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { App } from './App';
import { CountdownProvider } from './context/Countdown';
import { ThemeProvider } from './context/Theme';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <ThemeProvider>
    <CountdownProvider>
      <App />
    </CountdownProvider>
  </ThemeProvider>
), root);
