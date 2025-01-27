import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Activate from './Activate';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import TokenPurchase from './TokenPurchase';
import PaymentSuccess from './PaymentSuccess';
import ChatApp from './ChatApp';
import './styles.css';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <h1 className="welcome-title">
          Polski ChatGPT
          <span style={{ color: '#4CAF50' }}>&lt;/&gt;</span>
        </h1>
        <p className="welcome-subtitle">
          Twój osobisty asystent AI w języku polskim
        </p>
        <div className="welcome-buttons">
          <Link to="/register" className="auth-button-primary">
            Zarejestruj się
          </Link>
          <Link to="/login" className="auth-button-secondary">
            Zaloguj się
          </Link>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate/:token" element={<Activate />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/tokens"
          element={
            <PrivateRoute>
              <TokenPurchase />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <PrivateRoute>
              <PaymentSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="/chats/*"
          element={
            <PrivateRoute>
              <ChatApp />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="welcome-page">
              <div className="welcome-card">
                <h1 className="welcome-title">404</h1>
                <p className="welcome-subtitle">
                  Strona nie została znaleziona
                </p>
                <div className="welcome-buttons">
                  <Link to="/" className="auth-button-primary">
                    Wróć do strony głównej
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;