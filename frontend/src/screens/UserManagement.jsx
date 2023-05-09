import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from '../components/CustomNavbar';
import UserList from '../components/UserList';
import { API_URL } from "../config";
import Cookies from "js-cookie";

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/gestion-usuarios/`, {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });
    
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      const response = await axios.put(`${API_URL}/gestion-usuarios/${userId}/`, null, {
        headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
            'Content-Type': 'multipart/form-data',
          
          },
        withCredentials: true,
      });
      console.log(response.data);
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {...user, is_approved: true};
        } else {
          return user;
        }
      });
      setUsers(updatedUsers);
      alert(`El usuario con id ${userId} ha sido aprobado.`);
    } catch (error) {
      console.error(error);
    }
  }

  const handleReject = (userId) => {
    // Enviar solicitud para rechazar al usuario con id 'userId'
    alert(`El usuario con id ${userId} ha sido rechazado.`);
  }

  return (
    <div>
      <CustomNavbar />
      <h1>Gestión de usuarios</h1>
      <UserList users={users} onApprove={handleApprove} onReject={handleReject} />
    </div>  
  );
}



export default UserManagement;
