import React, { useState } from "react";

function VerificationRequestForm({ onSubmit }) {
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("apellidos", apellidos);
        formData.append("mensaje", mensaje);
        onSubmit(formData);
    };

    return (
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingrese su nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="apellidos">Apellidos:</label>
                <input
                    className="form-control"
                    id="apellidos"
                    name="apellidos"
                    placeholder="Ingrese sus apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="mensaje">Mensaje:</label>
                <textarea
                    className="form-control"
                    id="mensaje"
                    name="mensaje"
                    placeholder="Escriba un mensaje"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                />
            </div>
            <button className="btn btn-primary m-0 mt-1" type="submit">
                Enviar solicitud
            </button>
        </form>
    );
}

export default VerificationRequestForm;
