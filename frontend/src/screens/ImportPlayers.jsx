import React, { useState } from 'react';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';
import { API_URL } from '../config';
import Cookies from 'js-cookie';
import CustomNavbar from "../components/CustomNavbar";

const ImportPlayers = () => {
    const [progress, setProgress] = useState(0);
    const [showProgressBar, setShowProgressBar] = useState(false);

    const handleImportButtonClick = async (event) => {
        event.preventDefault();
        try {
            setShowProgressBar(true);
            await axios.post(`${API_URL}/importar-jugadores/`, { update: true }, {
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
                onUploadProgress: function (progressEvent) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });
            alert('Jugadores importados con éxito');
        } catch (error) {
            console.log(error); // Imprimir el mensaje de error completo en la consola del navegador
            console.log('Headers:', error.response);

            alert('Error al importar jugadores. Revisa la consola para más detalles.'); // Avisar al usuario que consulte la consola para más información sobre el error
        } finally {
            setShowProgressBar(false);
        }
    };

    return (
        <div className="container">
            <CustomNavbar />
            <h1 className="mb-4">Importar jugadores</h1>
            {showProgressBar ? (
                <div className="mt-3">
                    <ProgressBar now={progress} label={`${progress}%`} animated />
                </div>
            ) : (
                <button className="btn btn-primary mt-3" onClick={handleImportButtonClick}>
                    Importar
                </button>
            )}
        </div>
    );
};

export default ImportPlayers;
