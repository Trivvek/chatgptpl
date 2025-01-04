import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './Register';
import Activate from './Activate';
import Login from './Login';
import ChatList from './ChatList';
import ChatView from './ChatView';
import PrivateRoute from './PrivateRoute';

const ChatLayout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <ChatList />
            <Routes>
                <Route path=":chatId" element={<ChatView />} />
                <Route path="/" element={<div style={{ flex: 1, padding: '20px' }}>Wybierz czat lub rozpocznij nowy</div>} />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            <h1>Witamy w Twoim Polskim ChatGPT!</h1>
                            <Link to="/register" style={{ marginRight: '10px' }}>Przejdź do rejestracji</Link>
                            <Link to="/login" style={{ marginRight: '10px' }}>Zaloguj się</Link>
                        </div>
                    }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/activate/:token" element={<Activate />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chats/*" 
                element={
                <PrivateRoute>
                    <ChatLayout />
                </PrivateRoute>
                }
                />    
            </Routes>
        </BrowserRouter>
    );
}

export default App;