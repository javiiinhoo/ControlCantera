import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importa la librería js-cookie

import { API_URL } from "../config";
import '../static/css/Login.module.css';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        // Comprueba si el usuario ya tiene la cookie al cargar el componente
        const authtoken = Cookies.get('authtoken');
        if (authtoken) {
            navigate(`/logout`); // Redirige a la página de logout
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = formData;
        console.log(formData);
        try {
            const res = await axios.post(`${API_URL}/login/`, { username, password }, {
                withCredentials: true, // Incluir cookies en la solicitud
                headers: {
                    'X-CSRFToken': Cookies.get('authtoken'), // Configurar el encabezado X-CSRFToken con el valor de la cookie authtoken
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                console.log(res);
                alert('Iniciaste sesión exitosamente');
                onLogin(username);
                navigate(`/`);
            }
        } catch (err) {
            console.log(err);
            alert('Nombre de usuario o contraseña incorrectos');
        }
    };



    return (
        <div class="container mb-5">
            <h2 class="text-center mb-4">Iniciar sesión</h2>
            <form class="text-center" onSubmit={handleSubmit}>
                <div class="form-group">
                    <label for="username">Usuario:</label>
                    <input class="form-control" name="username" onChange={handleInputChange} required />
                </div>
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input class="form-control" name="password" onChange={handleInputChange} required type="password" />
                </div>
                <button class="btn btn-primary mb-3 login-btn" type="submit">
                    Iniciar sesión
                </button>
            </form>
        </div>


    );
};

export default Login;
