import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/theme.css';
import { App } from '@/app/App';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró #root');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
