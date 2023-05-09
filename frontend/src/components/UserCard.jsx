import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";

function UserCard(props) {
    const { user, onApprove, onReject } = props;

    const [photo, setPhoto] = useState(null);
    const [fullName, setFullName] = useState("");

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get(`${API_URL}/usuario-actual/`, {
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken'),
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,
                });
                const user = response.data;
                console.log(user);
                setPhoto({API_URL}+user.profile.photo);
                console.log(photo)
                setFullName(`${user.first_name} ${user.last_name}`);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserData();
    }, [photo]);

    return (
        <Card style={{ width: "18rem" }}>
            {photo && (
                <Card.Img variant="top" src={user.profile.photo} />
            )}
            <Card.Body>
                <Card.Title>{fullName}</Card.Title>
                <Card.Text>{user.solicitud}</Card.Text>
                <Button variant="success" onClick={() => onApprove(user.id)}>
                    Aprobar
                </Button>{" "}
                <Button variant="danger" onClick={() => onReject(user.id)}>
                    Rechazar
                </Button>
            </Card.Body>
        </Card>
    );
}

export default UserCard;
