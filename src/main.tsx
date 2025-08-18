import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FocusIndicator } from './components/accessibility/FocusIndicator';
import { setupKeyboardNavigation } from './utils/focusUtils';

// Initialize keyboard navigation
setupKeyboardNavigation();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FocusIndicator />
    <App />
  </StrictMode>
);
