import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/reset-tipografia.css'
import './styles/login.css'
import App from './App.jsx'
import './styles/barra-navegacion.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
