// Pantalla de cierre de sesión (LoginScreen.jsx)
import React from 'react';
import Login from '../components/Login'

import CustomNavbar from '../components/CustomNavbar';
import Footer from '../components/Footer';

const LoginScreen = () => {
    return (
        <div>
            <CustomNavbar />
            <Login onLogin={() => { }} />
            <Footer />
        </div>
    );
};

export default LoginScreen;
