import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";

function ProfileCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [photo, setPhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get(`${API_URL}/usuario-actual/`, {
          withCredentials: true,
        });
        setUser(res.data);
        setIsLoading(false);
        setDireccion(res.data.direccion);
        setTelefono(res.data.telefono);
        setPhoto(res.data.photo_url)
      } catch (error) {
        console.log(error.response.data);
        setErrors(error.response.data);
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("direccion", direccion);
    formData.append("telefono", telefono);
    if (photo) {
      formData.append('photo', photo);
    } else {
      formData.append('photo', ''); // explicitly clear the existing photo
    }
    console.log(photo);
    try {
      const res = await axios.put(
        `${API_URL}/perfil/` + user.username + "/",
        formData,
        {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        console.log(res);
        alert("Los cambios se aplicaron con éxito");
        window.location.reload(false); setPerfil(res.data);
      }
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  return (
    <div className="container-fluid mt-0 p-auto">
      <div className="row">
        <div className="col-md-6">
          <div className="border-0 card shadow-sm">
            <div className="card-body text-center">
              <img
                alt="Foto de perfil"
                className="photo-photo img-fluid"
                src={`${API_URL}${user.photo_url}`}
              />
              <h3 className="card-title mb-0">{user.username}</h3>
              <small className="card-text text-muted">{user.email}</small>
              <hr />
              <a className="btn btn-primary" href="/cambiar-contraseña">
                Cambiar contraseña
              </a>
              {!user.is_approved && (
                <a className="btn btn-primary" href="/solicitud-verificacion">
                  Solicitar verificación
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Información personal</h5>
              <form onSubmit={handleSubmit} enctype="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="nombre text">Nombre completo:</label>
                  <input
                    className="form-control"
                    id="nombre"
                    value={`${user.first_name} ${user.last_name}`}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="direccion">Dirección:</label>
                  <input
                    className="form-control"
                    id="direccion"
                    name="direccion"
                    placeholder="Ingrese su dirección"
                    value={direccion}
                    onChange={(event) => setDireccion(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono:</label>
                  <input
                    className="form-control"
                    id="telefono"
                    name="telefono"
                    placeholder="Ingrese su número de teléfono"
                    value={telefono}
                    onChange={(event) => setTelefono(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className=" pl-25 custom-file-label" htmlFor="photo">
                    Click para cambiar tu foto
                  </label>
                  <div className="custom-file">
                    <input
                      className="custom-file-input"
                      hidden
                      id="photo"
                      name="photo"
                      placeholder="Tu foto"
                      data-browse="Elegir archivo"
                      title="Haz clic aquí para seleccionar una imagen"
                      type="file"
                      onChange={(event) => setPhoto(event.target.files[0])}
                    />
                  </div>
                </div>
                <button className="btn btn-primary mt-3" type="submit">
                  Guardar cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
