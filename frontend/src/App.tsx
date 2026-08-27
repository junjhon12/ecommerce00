import { Routes, Route } from 'react-router-dom';
import './App.css';
import StoreFront from './pages/StoreFront';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path='/' element={<StoreFront/>}/>
      <Route path='/login' element={<Login/>}/>
      
      {/* 
        feat: wrap administrative routes
        Nesting the dashboard inside the ProtectedRoute component was chosen to 
        optimize security enforcement at the router level, balancing safe navigation 
        with readable configuration[cite: 12].
      */}
      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Route>
    </Routes>
  );
}

export default App;