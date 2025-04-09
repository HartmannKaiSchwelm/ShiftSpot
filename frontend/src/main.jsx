import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Landing from "./pages/Landing.jsx";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Landing />
  </StrictMode>,
)
