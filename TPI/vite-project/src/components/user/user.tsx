import React, { useContext, useState } from 'react';
import './user.css';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalMessage from '../modalMessage/modalMessage';
import { ErrorTipo } from '../modalMessage/error.enum.tsx';
import ConfirmationModal from '../confirmationModal/confirmationModal.tsx';

const apiUrl = import.meta.env.VITE_API_URL;

const User: React.FC = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate(); //useNavigate para la redirección
  const [showModal, setShowModal] = useState(false);
  const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [recargaPagina, setRecargaPagina] = useState(false)
  const [modalMessage, setModalMessage] = useState('');
  //modo edición/visualización
  const [isEditing, setIsEditing] = useState(false);

  //almacena los datos del usuario para edición
  const [userData, setUserData] = useState({
    nombre: currentUser?.nombre || '',
    apellido: currentUser?.apellido || '',
    email: currentUser?.email || '',
    profesion: currentUser?.profesion || '',
    madera_varita: currentUser?.madera_varita || '',
    nucleo_varita: currentUser?.nucleo_varita || '',
    largo_varita: currentUser?.largo_varita || '',
    pass: '', //la contraseña no la muestra
  });

  //confirmación de la nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState('');

  //atualiza el estado userData con el valor ingresado en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // actualiza el estado para la confirmación de la contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'pass') {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setConfirmPassword(value);
    }
  };

  //cambiar entre modo edición y visualización
  const handleEditToggle = () => {
    if (isEditing) {
      //si cancelo la edición, restablecer los datos a los valores originales
      setUserData({
        nombre: currentUser?.nombre || '',
        apellido: currentUser?.apellido || '',
        email: currentUser?.email || '',
        profesion: currentUser?.profesion || '',
        madera_varita: currentUser?.madera_varita || '',
        nucleo_varita: currentUser?.nucleo_varita || '',
        largo_varita: currentUser?.largo_varita || '',
        pass: '',
      });
    }
    setIsEditing(!isEditing);
  };

  //guardar cambios del usuario
  const handleSaveChanges = async () => {
    if (userData.pass !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.put(`${apiUrl}/api/auth/update`, { ...userData, id: currentUser?.id });
    //actualizar el currentUser del contexto con los nuevos datos
    const updatedUser = { ...currentUser, ...userData };
    setUserData(updatedUser); 
    setIsEditing(false);  //desactivar el modo edición

    //guardar los cambios en el localStorage para que persistan al recargar la página
    localStorage.setItem('user', JSON.stringify(updatedUser));
      setTipoError(ErrorTipo.SUCCESS);
      setRecargaPagina(true);
      setModalMessage('Informacion actualizada con exito');
      setShowModal(true);
    } catch (error) {
      setTipoError(ErrorTipo.SOFT_ERROR);
      setRecargaPagina(true);
      setModalMessage('Hubo un error al actualizar la información. Por favor, inténtalo de nuevo.\n'+error);
      setShowModal(true);
    }
  };

  const logoutConfirmation = () => {
    setShowLogoutModal(true);
  }
  //cerrar sesión y redirigir al login
  const handleLogout = () => {
    logout();
    navigate('/login'); //redirigir sin recargar la página
  };

  //eliminar cuenta
  const promptDelete = (id: number) => {
    setItemToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleDelete = async () => {
    if (itemToDelete!==null) {
      try {
        await axios.delete(`${apiUrl}/api/magos/${itemToDelete}`);
        setTipoError(ErrorTipo.SUCCESS);
        setRecargaPagina(true);
        setModalMessage('Cuenta eliminada con éxito.');
        setShowModal(true);
        logout();
      } catch (error) {
        setTipoError(ErrorTipo.SOFT_ERROR);
        setRecargaPagina(true);
        setModalMessage('Hubo un error al eliminar la cuenta. Intenta nuevamente.\n'+error);
        setShowModal(true);
      } finally {
        setShowConfirmationModal(false);
        setItemToDelete(null);
    }
    }
  };

  return (
    <div className='user-container'>
      <div className='user-card'>
        {isEditing ? (
          <>
            <input type="text" name="nombre" value={userData.nombre} onChange={handleInputChange} placeholder="Nombre" />
            <input type="text" name="apellido" value={userData.apellido} onChange={handleInputChange} placeholder="Apellido" />
            <input type="email" name="email" value={userData.email} onChange={handleInputChange} placeholder="Email" />
            <input type="text" name="profesion" value={userData.profesion} onChange={handleInputChange} placeholder="Profesión" />
            <input type="text" name="madera_varita" value={userData.madera_varita} onChange={handleInputChange} placeholder="Madera de la Varita" />
            <input type="text" name="nucleo_varita" value={userData.nucleo_varita} onChange={handleInputChange} placeholder="Núcleo de la Varita" />
            <input type="text" name="largo_varita" value={userData.largo_varita} onChange={handleInputChange} placeholder="Largo de la Varita" />
            <input type="password" name="pass" value={userData.pass} onChange={handlePasswordChange} placeholder="Nueva Contraseña" />
            <input type="password" value={confirmPassword} onChange={handlePasswordChange} placeholder="Confirmar Contraseña" />
            <button onClick={handleSaveChanges} className='save-button'>Guardar</button>
            <button onClick={handleEditToggle} className='cancel-button'>Cancelar</button>
          </>
        ) : (
          <>
            <h3>{userData.nombre} {userData.apellido}</h3>
            <h6>Información Personal</h6>
            <div className='personal-info'>
              <p>Email: {userData.email}</p>
              <p>Profesión: {userData.profesion}</p>
            </div>
            <h6>Información de la Varita</h6>
            <div className='user-varita'>
              <p>Madera: {userData.madera_varita}</p>
              <p>Núcleo: {userData.nucleo_varita}</p>
              <p>Largo: {userData.largo_varita}</p>
            </div>
            <button onClick={handleEditToggle} className='edit-button'>Editar</button>
          </>
        )}
      </div>
      <div className='red-buttons'>
        <button onClick={logoutConfirmation} className='logout-button'>Logout</button>
        <button onClick={() => currentUser && promptDelete(currentUser.id)} className="delete-user"disabled={!currentUser}>Eliminar</button>
      </div>
      {showConfirmationModal && (
          <ConfirmationModal
              message="¿Estás seguro de que querés eliminar tu cuenta?"
              onConfirm={handleDelete}
              onCancel={() => {
                  setShowConfirmationModal(false);
                  setItemToDelete(null);
              }}
          />
      )}
      {showLogoutModal && (
          <ConfirmationModal
              message="¿Estás seguro de que querés cerrar sesion?"
              onConfirm={handleLogout}
              onCancel={() => {
                  setShowLogoutModal(false);
              }}
          />
      )}
      {showModal && (
          <ModalMessage
              errorType={tipoError}
              message={modalMessage}
              reloadOnClose={recargaPagina} 
          />
      )}
    </div>
  );
};

export default User;
