/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../scss/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="tw-w-full">
      <App />
    </div>
  </React.StrictMode>
);
