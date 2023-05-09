import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../static/css/Register.module.css';
import { API_URL } from "../config";
const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirm: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { first_name, last_name, username, email, password, password_confirm } = formData;
        if (password !== password_confirm) {
            alert("Las contraseñas no coinciden.");
            console.log(formData)
            return;
        }

        /**/

        try {
            const res = await axios.post(`${API_URL}/registro/`, { // Concatenar URL base con ruta del endpoint
                first_name: first_name,
                last_name: last_name,
                username: username,
                email: email,
                password: password,
                password_confirm: password_confirm
            });
            console.log(formData)

            console.log(res);
            if (res.status === 201) {
                alert("Usuario creado exitosamente");
                navigate('/');
            }
        } catch (err) {
            console.log(formData)

            alert("Ha ocurrido un error al crear el usuario.");
        }
    }


    return (
        <div className="form-container">
            <h2>Registro de usuario.</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-input-container">
                    <label htmlFor="first_name">Nombre:</label>
                    <input type="text" name="first_name" id="first_name" className="form-input" onChange={handleInputChange} required />
                </div>
                <div className="form-input-container">
                    <label htmlFor="last_name">Apellidos:</label>
                    <input type="text" name="last_name" id="last_name" className="form-input" onChange={handleInputChange} required />
                </div>
                <div className="form-input-container">
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input type="text" name="username" id="username" className="form-input" onChange={handleInputChange} required />
                </div>
                <div className="form-input-container">
                    <label htmlFor="email">Correo electrónico:</label>
                    <input type="email" name="email" id="email" className="form-input" onChange={handleInputChange} required />
                </div>
                <div className="form-input-container">
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" name="password" id="password" className="form-input" onChange={handleInputChange} required />
                </div>
                <div className="form-input-container">
                    <label htmlFor="password_confirm">Confirmar contraseña:</label>
                    <input type="password" name="password_confirm" id="password_confirm" className="form-input" onChange={handleInputChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Registrarse</button>
            </form>
        </div>



    );
};

export default Register;