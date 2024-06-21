import React, { createContext, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  Home  from './Pages/Home';
import { Cashier } from './Pages/Cashier';
import { Inventory } from './Pages/Inventory';
import { Navbar } from './Pages/Navbar';
import { CashierInventory } from './Pages/CashierInventory';
import { TransactionHistory } from './Pages/TransactionHistory';
import { Setting } from './Pages/Setting';
import { Login } from './Pages/Login';
import { Register } from './Pages/Register';
import { Title } from './Component/Title';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionDetail } from './Pages/TransactionDetail';
export const AppContext = createContext();

function App()
{
  const client = new QueryClient();
  const [name, setname] = useState("asin");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <QueryClientProvider client={client}>
        <AppContext.Provider value={{ name, setname, isAuthenticated, setIsAuthenticated, user, setUser }}>
          <Router>
            <Title />
            <div className='controll'>
              <Navbar />
              <div className="main-content">
                <Routes>
                  {!isAuthenticated ? (
                    <>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="*" element={<Navigate to="/login" />} />
                    </>
                  ) : (
                    <>
                      <Route path="/" element={<Home />} />
                      <Route path="/cashier" element={<Cashier />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/cashier/inventory" element={<CashierInventory />} />
                      <Route path="/transactionHistory" element={<TransactionHistory />} />
                      <Route path="/transactiondetails/:transactionId" element={<TransactionDetail />} />
                      <Route path="/settings" element={<Setting />} />
                      <Route path="*" element={<h1>Page not found</h1>} />
                    </>
                  )}
                </Routes>
              </div>
            </div>
            <div className='footer'>
              foot
            </div>
          </Router>
        </AppContext.Provider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
