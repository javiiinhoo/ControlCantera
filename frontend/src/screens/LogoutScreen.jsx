// Pantalla de cierre de sesión (LogoutScreen.jsx)
import React from 'react';
import Logout from '../components/Logout'

import CustomNavbar from '../components/CustomNavbar';
import Footer from '../components/Footer';

const LogoutScreen = () => {
    return (
        <div>
            <CustomNavbar />
            <Logout onLogout={() => { }} />
            <Footer />
        </div>
    );
};

export default LogoutScreen;
