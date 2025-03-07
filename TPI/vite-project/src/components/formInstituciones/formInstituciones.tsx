import React, { useState } from 'react';
import axios from 'axios';
import './formInstituciones.css';
import cross from '../../assets/cross.png';
import ModalMessage from '../modalMessage/modalMessage';
import { ErrorTipo } from '../modalMessage/error.enum.tsx';

const apiUrl = import.meta.env.VITE_API_URL;

const FormInstitucion: React.FC = () => {
    // Visibilidad de form 
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Función para mostrar/ocultar el form
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const [nombre, setNombre] = useState('');
    const [pais, setPais] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false)
    const [modalMessage, setModalMessage] = useState('');

    // Función para manejar el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Enviar los datos a la API
            const response = await axios.post(`${apiUrl}/api/institucion`, {
                nombre,
                pais,
                ciudad
            });
            // Restablece el formulario y cierra el popup
            setNombre('');
            setPais('');
            setCiudad('');
            setIsPopupVisible(false);

            setTipoError(ErrorTipo.SUCCESS);
            setRecargaPagina(true);
            setModalMessage('Registro de Institucion Exitoso.\n'+response.data.message);
            setShowModal(true);
        } catch (error) {
            setTipoError(ErrorTipo.SOFT_ERROR);
            setRecargaPagina(true);
            setModalMessage('Hubo un error al dar de alta la Institucion.\n'+error);
            setShowModal(true);
        }
    };

    return(
        <div>
            <button className='plus-institucion-button' onClick={togglePopup}>
                + Institución
            </button>
            {isPopupVisible && (
                <div>
                    <div className='institucion-overlay' onClick={togglePopup}></div>
                    <form className='form-institucion' onSubmit={handleSubmit}>
                        <button className='close-institucion' onClick={togglePopup}>
                            <img src={cross} alt="Cerrar" />
                        </button>
                        <h4>Nueva Institución</h4>
                        <div>
                            <p>Nombre</p>
                            <input type="text" onChange={(e) => setNombre(e.target.value)} value={nombre} required />
                        </div>
                        <div>
                            <p>País</p>
                            <input type="text" onChange={(e) => setPais(e.target.value)} value={pais} required />
                        </div>
                        <div>
                            <p>Ciudad</p>
                            <input type="text" onChange={(e) => setCiudad(e.target.value)} value={ciudad} required />
                        </div>
                        <button type="submit" className='button-institucion'>Agregar</button>
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
}

export default FormInstitucion;
