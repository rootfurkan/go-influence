import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import AuthBootstrap from './features/auth/AuthBootstrap';
import './styles/landing.css';
import './styles/brand.css';
import './styles/influencer.css';
import './styles/influencer-onboarding.css';
import './styles/admin.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthBootstrap>
          <App />
        </AuthBootstrap>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
