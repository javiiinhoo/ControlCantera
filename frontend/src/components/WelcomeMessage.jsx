import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

import { API_URL } from "../config";

function WelcomeMessage() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/usuario-actual/`, {
                    withCredentials: true,
                });

                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="overlay">
            <div>
                <h1 className="display-4 text-center">
                    Bienvenido a RC Deportivo Cantera, {user?.username}
                </h1>

                {user?.profile?.is_approved && user?.is_authenticated && (
                    <p className="display-12 text-center">Su cuenta aún no ha sido aprobada por el administrador.</p>
                )}
            </div>
        </div>
    );
}

export default WelcomeMessage;
