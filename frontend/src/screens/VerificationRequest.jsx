import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VerificationRequestForm from '../components/VerificationRequestForm';
import { API_URL } from "../config";
import Cookies from "js-cookie";

function VerificationRequest() {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleSubmit(formData) {
        for (let [key, value] of formData) {
            console.log(`${key}: ${value}`)
        }
        axios.post(`${API_URL}/solicitar-verificacion/`, formData, {
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'multipart/form-data'
            }, withCredentials: true, // Incluir cookies en la solicitud

        })
            .then((res) => {
                setSuccess("Tu solicitud ha sido enviada correctamente");
                navigate('/'); 
            })
            .catch((err) => {
                console.log(err);
                setError("Ha ocurrido un error al enviar la solicitud");
            });
        console.log(Cookies.get('csrftoken'));
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Solicitud de verificación de identidad</h5>
                            <hr />
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="alert alert-success" role="alert">
                                    {success}
                                </div>
                            )}
                            <VerificationRequestForm onSubmit={handleSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerificationRequest;
