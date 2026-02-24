import React from 'react'
import ReactDOM from 'react-dom/client'
import NotFound from './pages/NotFound'
import './index.css'

// В будущем здесь будет полноценный Router (навигация)
// Сейчас мы просто отображаем твой React-компонент для теста
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotFound />
  </React.StrictMode>
)
