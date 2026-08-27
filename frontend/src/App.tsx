import { Routes, Route } from 'react-router-dom';
import './App.css'
import StoreFront from './pages/StoreFront'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path='/' element={<StoreFront/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
    </Routes>
  );
}

export default App
