import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import * as serviceWorker from './serviceWorker';

// Use createRoot to manage the root of your app
const container = document.getElementById('root');
const root = createRoot(container); // Create a root for the app
root.render(<App />); // Render the App to the root

serviceWorker.unregister(); // Keep your service worker logic
