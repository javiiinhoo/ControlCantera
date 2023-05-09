import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../static/css/PlayerList.module.css';
import '../static/js/PlayerList.js';

function ListaJugadores() {
    const [jugadores, setJugadores] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('/api/player_list/');
            setJugadores(response.data);
        }
        fetchData();
    }, []);

    return (
        <div className="container-table">
            <h1 className="mb-4 text-center">Lista de jugadores</h1>
            {jugadores.length ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Enlace</th>
                            <th>Temporada</th>
                            <th>Fecha</th>
                            <th>Último club</th>
                            <th>Nuevo club</th>
                            <th>Valor de mercado</th>
                            <th>Coste</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jugadores.map((jugador) => (
                            <tr key={jugador.id}>
                                <td>{jugador.nombre}</td>
                                {jugador.enlace_visited ? (
                                    <td>
                                        <a href={jugador.enlace} target="_blank" className="visited-link" rel="noreferrer">
                                            {jugador.enlace}
                                        </a>
                                    </td>
                                ) : (
                                    <td>
                                        <a href={jugador.enlace} target="_blank" rel="noreferrer">
                                            {jugador.enlace}
                                        </a>
                                    </td>
                                )}
                                <td>{jugador.temporada}</td>
                                <td>{jugador.fecha}</td>
                                <td>{jugador.ultimo_club}</td>
                                <td>{jugador.nuevo_club}</td>
                                <td>{jugador.valor_mercado}</td>
                                <td>{jugador.coste}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay jugadores disponibles. Por favor importa jugadores para continuar.</p>
            )}
        </div>
    );
}

export default ListaJugadores;
