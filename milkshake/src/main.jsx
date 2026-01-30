import React from 'react'
import ReactDOM from 'react-dom/client'
import MilkshakeReviews from './MilkshakeReviews.jsx' 
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <MilkshakeReviews />
    </BrowserRouter>
  </React.StrictMode>,
)