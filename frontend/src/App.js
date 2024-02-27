import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Common/Login';
import Registration from './Common/Registration';
import Dashboard from './Customer/Dashboard';
import Restaurant from './Customer/Menu';
import Cart from './Customer/Cart';
import Foods from './Restaurant/Food';
import Orders from './Restaurant/Orders';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
            <Route path="/Registration" element={<Registration />} /> 
            <Route path="/Restaurant" element={<Restaurant />} /> 
            <Route path="/Dashboard" element={<Dashboard />} /> 
            <Route path="/Foods" element={<Foods />} />
            <Route path="/Login" element={<Login />} /> 
            <Route path="/Cart" element={<Cart />} />  
            <Route path="/Orders" element={<Orders />} /> 
       </Routes>
    </BrowserRouter>
      

    </div>
  );
}

export default App;