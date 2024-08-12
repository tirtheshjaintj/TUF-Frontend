import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import FlashCards from './components/FlashCards.jsx';

const router=createBrowserRouter(
  createRoutesFromChildren(
    <Route path="" element={<App/>}>
    <Route path="/" element={<FlashCards/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
