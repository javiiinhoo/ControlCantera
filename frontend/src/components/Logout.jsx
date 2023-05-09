import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importa la librería js-cookie

import { API_URL } from "../config";
import '../static/css/Logout.module.css';

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const cookies = document.cookie.split(';');
        console.log(cookies);
        const csrftoken = cookies.find(cookie => cookie.trim().startsWith('csrftoken'));
        if (!csrftoken) {
            console.log('Cookie de autenticación no encontrada');
            navigate(`/`);
        }
    }, [navigate]);

    const handleLogout = async () => {
        const csrftoken = Cookies.get('csrftoken');
        if (csrftoken) {
            try {
                // Lógica para cerrar sesión
                const config = {
                    headers: {
                        'X-CSRFToken': csrftoken
                    }
                };
                const res = await axios.post(`${API_URL}/logout/`, {}, config);
                if (res.status === 200) {
                    alert('Cerraste sesión exitosamente');
                    onLogout(); // Invoca la función de manejo de cierre de sesión
                    Cookies.remove('sessionid'); // Elimina la cookie de autenticación
                    navigate(`/`);
                }
            } catch (err) {
                console.log(err);
                alert('Error al cerrar sesión');
            }
        } else {
            // El usuario no tiene una cookie de autenticación, no puede cerrar sesión
            alert('No puedes cerrar sesión, ya que no tienes una sesión activa.');
            alert('Serás redirigido al inicio.');
            navigate('/');
        }
    };

    return (
        <div className="container">
            <h2>Cerrar sesión</h2>
            <button className="btn btn-danger" onClick={handleLogout}>
                Cerrar sesión
            </button>
        </div>
    );
};

export default Logout;
