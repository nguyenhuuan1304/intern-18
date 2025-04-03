import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import store from './store/store.ts';
import { Provider } from 'react-redux'
import ScrollTop from './components/scrollTop/ScrollTop.tsx';

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
    <ScrollTop/>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>
);
