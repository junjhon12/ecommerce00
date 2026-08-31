import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import StoreFront from './pages/StoreFront';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Success from './pages/Success';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<StoreFront/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;