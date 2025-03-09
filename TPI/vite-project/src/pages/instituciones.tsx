import './instituciones.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormInstitucion from "../components/formInstituciones/formInstituciones";
import deleteIcon from "../assets/basura.png";
import ModalMessage from "../components/modalMessage/modalMessage.tsx";
import { ErrorTipo } from "../components/modalMessage/error.enum.tsx";
import ConfirmationModal from "../components/confirmationModal/confirmationModal.tsx";
import LoadingSpinner from "../components/loadingSpinner/loadingSpinner.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

interface Institucion {
    id: number;
    nombre: string;
    ciudad: string;
    pais: string;
}

const InstitucionesPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false)
    const [modalMessage, setModalMessage] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentInstitucion, setCurrentInstitucion] = useState<Institucion | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [formData, setFormData] = useState<Institucion>({
        id: 0,
        nombre: '',
        ciudad: '',
        pais: '',
    });

    useEffect(() => {
        const fetchInstituciones = async () => {
            setIsDataLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/api/institucion`);
                setInstituciones(response.data.data);
                setIsDataLoading(false)
            } catch (err) {
                setError('Error al cargar las instituciones');
                console.error(err);
                setTipoError(ErrorTipo.HARD_ERROR);
                setRecargaPagina(false);
                setModalMessage('No se pudieron recuperar las etiquetas.\n'+err);
                setShowModal(true);
            }
        };

        fetchInstituciones();
    }, []);

    const handleEditToggle = (institucion: Institucion) => {
        setIsEditing(true);
        setCurrentInstitucion(institucion);
        setFormData(institucion);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        if (currentInstitucion) {
            try {
                await axios.put(`${apiUrl}/api/institucion/${currentInstitucion.id}`, formData);
                setInstituciones((prev) => 
                    prev.map((institucion) => 
                        institucion.id === currentInstitucion.id ? { ...institucion, ...formData } : institucion
                    )
                );
                setIsEditing(false);
                setCurrentInstitucion(null);
                setTipoError(ErrorTipo.SUCCESS);
                setRecargaPagina(true);
                setModalMessage('Datos modificados con exito');
                setShowModal(true);
            } catch (error) {
                setError("Hubo un error al intentar modificar la Intitucion.");
                setTipoError(ErrorTipo.SOFT_ERROR);
                setRecargaPagina(true);
                setModalMessage('Error al actualizar la información:\n'+error);
                setShowModal(true);
            }
        }
    };

    const promptDelete = (id: number) => {
        setItemToDelete(id);
        setShowConfirmationModal(true);
    };

    const handleDelete = async () => {
        if (itemToDelete!==null) {
            try {
                await axios.delete(`${apiUrl}/api/institucion/${itemToDelete}`);
                // Elimina la institución del estado
                setInstituciones((prev) => prev.filter((institucion) => institucion.id !== itemToDelete));
                setTipoError(ErrorTipo.SUCCESS);
                setRecargaPagina(true);
                setModalMessage('Institucion eliminada con exito.');
                setShowModal(true);
            } catch (error) {
                setError("Hubo un error al intentar eliminar la Institucion.");
                setTipoError(ErrorTipo.SOFT_ERROR);
                setRecargaPagina(true);
                setModalMessage('Error al eliminar la institucion:\n'+error);
                setShowModal(true);
            } finally {
                setShowConfirmationModal(false);
                setItemToDelete(null);
            }
        }
    };

    return (
        <>
            <FormInstitucion />
            <div className="instituciones-page">
            {isDataLoading ? (
                <LoadingSpinner/>
                ) : error ? (
                    <p>{error}</p>
                ) : instituciones.length > 0 ? (
                    <div className="instituciones-container">
                        {instituciones.map((institucion) => (
                            <div key={institucion.id} className="institucion-card">
                                {isEditing && currentInstitucion?.id === institucion.id ? (
                                    <div className="edit-form">
                                        <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" />
                                        <input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Ciudad" />
                                        <input type="text" name="pais" value={formData.pais} onChange={handleInputChange} placeholder="País" />
                                        <button onClick={handleSaveChanges} className='save-button'>Guardar</button>
                                        <button onClick={() => { setIsEditing(false); setCurrentInstitucion(null); }} className='cancel-button'>Cancelar</button>
                                    </div>
                                ) : (
                                    <>
                                        <h3>{institucion.nombre}</h3>
                                        <h6>Información de la Institución</h6>
                                        <div className="institucion-info">
                                            <p>Ciudad: {institucion.ciudad}</p>
                                            <p>País: {institucion.pais}</p>
                                            <button onClick={() => handleEditToggle(institucion)} className='edit-button'>Editar</button>
                                            <button onClick={() => promptDelete(institucion.id)} className="delete-button">
                                                <img src={deleteIcon} alt="Eliminar" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No se encontraron instituciones</p>
                )}
                {showConfirmationModal && (
                    <ConfirmationModal
                        message="¿Estás seguro de que querés eliminar esta etiqueta?"
                        onConfirm={handleDelete}
                        onCancel={() => {
                            setShowConfirmationModal(false);
                            setItemToDelete(null);
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
        </>
    );
};

export default InstitucionesPage;
