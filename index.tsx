import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConvexProvider } from 'convex/react';
import { convex } from './lib/convexClient';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);