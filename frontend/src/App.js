import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Register from './screens/Register';
import Profile from './screens/Profile';
import PasswordChange from './screens/PasswordChange';
import UserManagement from './screens/UserManagement';
import VerificationRequest from './screens/VerificationRequest';
import ImportPlayers from './screens/ImportPlayers';
import PlayerSearch from './screens/PlayerSearch';
import PlayerList from './screens/PlayerList.jsx';
import AccessDenied from './screens/AccessDenied';
import Index from './screens/Index';
import LoginScreen from './screens/LoginScreen';
import LogoutScreen from './screens/LogoutScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route exact path="/registro" element={<Register />} />
        <Route exact path="/login" element={<LoginScreen />} />
        <Route exact path="/logout" element={<LogoutScreen />} />
        <Route exact path='/perfil/:username/' element={<Profile />} />
        <Route exact path="/cambiar-contraseña" element={<PasswordChange />} />
        <Route exact path="/gestion-usuarios" element={<UserManagement />} />
        <Route exact path="/solicitar-verificacion" element={<VerificationRequest />} />
        <Route exact path="/importar-jugadores" element={<ImportPlayers />} />
        <Route exact path="/buscar-jugadores" element={<PlayerSearch />} />
        <Route exact path='/lista-jugadores/:query/' element={<PlayerList />} />
        <Route exact path="/acceso-denegado" element={<AccessDenied />} />
      </Routes>
    </Router>
  );
}

export default App;
