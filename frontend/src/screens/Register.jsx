import React from 'react';
import Registro from '../components/Register';
import CustomNavbar from '../components/CustomNavbar';
import Footer from '../components/Footer';


const Register = () => {
    return (
        <div className="registro-container">
            <CustomNavbar />
            <Registro />
            <Footer />
        </div>
    );
};

export default Register;
