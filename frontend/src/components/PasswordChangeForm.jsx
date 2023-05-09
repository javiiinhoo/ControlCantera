import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from "../config";
import Cookies from 'js-cookie';
/* import '../static/css/PasswordChange.module.css'; */
const PasswordChangeForm = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/cambiar-contraseña/`, {
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword,
            }, {
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            });
            
            
            alert('Contraseña cambiada exitosamente');
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            alert('Error al cambiar contraseña');
            console.error(error);
        }
        console.log(oldPassword,newPassword,confirmNewPassword)
    };

    return (
        <div className="card">
            <div className="card-header">
                <h4>Cambiar Contraseña</h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="oldPassword">Contraseña actual</label>
                        <input
                            type="password"
                            className="form-control"
                            name="oldPassword"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">Nueva contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            name="newPassword"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirmar nueva contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            name="confirmNewPassword"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Guardar cambios
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeForm;
