import React from 'react';

const AccessDenied = () => {
    return (
        <div className="container text-center">
            <h1 className="my-5">Acceso denegado</h1>
            <p className="lead">Lo siento, no tienes permiso para acceder a esta página.</p>
            <p className="lead">Por favor, ponte en contacto con el administrador del sitio si crees que se trata de un error.</p>
        </div>
    );
};

export default AccessDenied;
