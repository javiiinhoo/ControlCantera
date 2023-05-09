import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';
const PlayerSearch = () => {
    const [jugadores, setJugadores] = useState([]);
    const [nombreJugador, setNombreJugador] = useState('');
    const [resultados, setResultados] = useState([]);
    const [mensaje, setMensaje] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const obtenerJugadores = async () => {
            try {
                const response = await axios.get(`${API_URL}/buscar-jugadores/`, {
                    withCredentials: true,
                });
                jugadores = response.data;
                console.log(jugadores);
                if (jugadores.length === 0) {
                    setMensaje(
                        'No se encontraron jugadores en la base de datos. Por favor, importe los jugadores.'
                    );
                    navigate('/importar-jugadores');
                } else {
                    const fechaActual = new Date();
                    const ultimaActualizacion = new Date(jugadores[0].last_updated);
                    const diferenciaSemanas = Math.round(
                        (fechaActual - ultimaActualizacion) / (1000 * 60 * 60 * 24 * 7)
                    );
                    if (diferenciaSemanas >= 6) {
                        setMensaje(
                            'La última actualización de los jugadores fue hace más de 6 semanas. Por favor, importe los jugadores.'
                        );
                        navigate('/importar-jugadores');
                    } else {
                        setJugadores(jugadores);
                    }
                }
            } catch (error) {
                console.log(error);
                setMensaje('No se encontraron jugadores en la base de datos. Por favor, importe los jugadores.');
                alert('Serás redireccionado a la importación.');
                navigate('/importar-jugadores');
            }
        };
        obtenerJugadores();
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${API_URL}/buscar-jugadores/`,
                { nombre: nombreJugador },
                {
                    withCredentials: true,
                }
            );
            setResultados(response.data);
        } catch (error) {
            console.log(error);
            setMensaje('Ha ocurrido un error al buscar el jugador.');
        }
    };

    const handleInputChange = (event) => {
        setNombreJugador(event.target.value);
    };

    return (
        <div>
            <CustomNavbar />
            <h1 className='text-center'>Buscar jugador</h1>

            {mensaje ? (
                <p className='text-center'>{mensaje}</p>
            ) : (
                <form className='form-container' onSubmit={handleSubmit}>
                    <label htmlFor='buscar-jugador'>Nombre del jugador:</label>
                    <input
                        id='buscar-jugador'
                        name='nombre'
                        autoComplete='off'
                        value={nombreJugador}
                        onChange={handleInputChange}
                    />
                    <button type='submit'>Buscar</button>
                </form>
            )}

            {resultados.length > 0 && (
                <ul>
                    {resultados.map((jugador) => (
                        <li key={jugador.id}>{jugador.nombre}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlayerSearch;
