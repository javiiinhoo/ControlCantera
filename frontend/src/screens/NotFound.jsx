import React from "react";
import { Link } from "react-router-dom";
import '../static/css/NotFound.css';

function NotFound(props) {
    let message;
    if (props.location.state && props.location.state.from === 'buscar-jugador') {
        message = "No se encontró ningún jugador con ese nombre";
    } else {
        message = "Parece que estás perdido";
    }

    return (
        <div data-cy='pageBody'>
            <h1 data-cy='pageHeader' className="cabecera">
                Oh!
            </h1>
            <p data-cy='simpleMessage' className="parrafo">
                {message}
            </p>
            <Link data-cy='homeLink' to='/' className="enlace">Volver a casa</Link>
            <img src={require('../media/logo.png')} width="50px" height="50px" alt="logo"></img>
        </div>
    )
}

export default NotFound;
