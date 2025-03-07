import React, { useState, useContext } from 'react';
import './formPatente.css';
import cross from '../../assets/cross.png';
import { AuthContext } from '../../context/authContext.tsx';
import axios from 'axios';
import ModalMessage from '../modalMessage/modalMessage';
import { ErrorTipo } from '../modalMessage/error.enum.tsx';

const apiUrl = import.meta.env.VITE_API_URL;

const FormPatente: React.FC = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false)
    const [modalMessage, setModalMessage] = useState('');
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) {
        setTipoError(ErrorTipo.HARD_ERROR);
        setRecargaPagina(false);
        setModalMessage('No se pudo recuperar el usuario loggeado.');
        setShowModal(true);
    }

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [instrucciones, setInstrucciones] = useState('');
    const [imagen, setImagen] = useState<File | null>(null);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !currentUser.id) {
            setTipoError(ErrorTipo.HARD_ERROR);
            setRecargaPagina(false);
            setModalMessage('No se puede recuperar el usuario loggeado');
            setShowModal(true);
            return;
        }
        if (!imagen) {
            setTipoError(ErrorTipo.SOFT_ERROR);
            setRecargaPagina(false);
            setModalMessage('Debe adjuntar una imagen.');
            setShowModal(true);
            return;
        }
        const formData = new FormData();
        formData.append('nombre',nombre);
        formData.append('descripcion', descripcion);
        formData.append('instrucciones', instrucciones);
        formData.append('idMago', currentUser.id.toString());
        formData.append('imagen', imagen);
        try {
            const response = await axios.post(`${apiUrl}/api/patente/`, formData,{
                headers:{'Content-Type':'multipart/form-data'}
            });
            setNombre('');
            setDescripcion('');
            setInstrucciones('');
            setImagen(null)
            setIsPopupVisible(false);
            
            setTipoError(ErrorTipo.SUCCESS);
            setRecargaPagina(true);
            setModalMessage('Registro de Patente exitoso.\n'+response.data.message);
            setShowModal(true);
        } catch (error) {
            setTipoError(ErrorTipo.SOFT_ERROR);
            setRecargaPagina(true);
            setModalMessage('Hubo un error al dar de alta la patente.\n'+error);
            setShowModal(true);
        }
    };

    return (
        <div>
            <button className='plus-patente-button' onClick={togglePopup}>
                + Patente
            </button>
            {isPopupVisible && (
                <div>
                    <div className='patente-overlay' onClick={togglePopup}></div>
                    <form className='form-patente'  onSubmit={handleSubmit}>
                        <button className='close-patente' onClick={togglePopup}>
                            <img src={cross} alt="" />
                        </button>
                        <h4>Solicitud de Patente</h4>
                        <div>
                            <p>Nombre</p>
                            <input type="text" onChange={(e) => setNombre(e.target.value)} value={nombre} required />
                        </div>
                        <div>
                            <p>Descripción</p>
                            <textarea id="descripcion" onChange={(e) => setDescripcion(e.target.value)} value={descripcion} rows={4} required />
                        </div>
                        <div>
                            <p>Instrucciones</p>
                            <textarea id="instrucciones" onChange={(e) => setInstrucciones(e.target.value)} value={instrucciones} rows={4} required />
                        </div>
                        <div>
                            <p>Imagen</p>
                            <input type="file" onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        setImagen(e.target.files[0]);
                                                                    }
                                                                }}
                            id="foto" name="foto" accept="image/*" required/>                        
                        </div>
                        <button type="submit" className='button-patente'>Enviar</button>
                    </form>
                </div>
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

export default FormPatente;

