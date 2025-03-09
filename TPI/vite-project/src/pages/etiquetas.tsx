
import './etiquetas.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormEtiqueta from "../components/formEtiqueta/formEtiqueta";
import deleteIcon from "../assets/basura.png";
import ModalMessage from "../components/modalMessage/modalMessage.tsx";
import { ErrorTipo } from "../components/modalMessage/error.enum.tsx";
import ConfirmationModal from "../components/confirmationModal/confirmationModal.tsx";
import LoadingSpinner from "../components/loadingSpinner/loadingSpinner.tsx";
const apiUrl = import.meta.env.VITE_API_URL;

interface Etiqueta {
    id: number;
    nombre: string;
    descripcion: string;
}

const EtiquetaPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false)
    const [modalMessage, setModalMessage] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEtiqueta, setCurrentEtiqueta] = useState<Etiqueta | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [formData, setFormData] = useState<Etiqueta>({
        id: 0,
        nombre: '',
        descripcion: '',
    });

    useEffect(() => {
        const fetchEtiquetas = async () => {
            setIsDataLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/api/etiqueta`);
                setEtiquetas(response.data.data);
                setIsDataLoading(false);
            } catch (err) {
                setError('No se pudieron recuperar las etiquetas.');
                setTipoError(ErrorTipo.HARD_ERROR);
                setRecargaPagina(false);
                setModalMessage('No se pudieron recuperar las etiquetas.\n'+err);
                setShowModal(true);
            }
        };

        fetchEtiquetas();
    }, []);

    const handleEditToggle = (etiqueta: Etiqueta) => {
        setIsEditing(true);
        setCurrentEtiqueta(etiqueta);
        setFormData(etiqueta);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        if (currentEtiqueta) {
            try {
                await axios.put(`${apiUrl}/api/etiqueta/${currentEtiqueta.id}`, formData);
                setEtiquetas((prev) =>
                    prev.map((etiqueta) =>
                        etiqueta.id === currentEtiqueta.id ? { ...etiqueta, ...formData } : etiqueta
                    )
                );
                setIsEditing(false);
                setCurrentEtiqueta(null);
                setTipoError(ErrorTipo.SUCCESS);
                setRecargaPagina(true);
                setModalMessage('Datos modificados con exito');
                setShowModal(true);
            } catch (error) {
                setError("Hubo un error al intentar modificar la etiqueta.");
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
        if (itemToDelete !== null) {
            try {
                await axios.delete(`${apiUrl}/api/etiqueta/${itemToDelete}`);
                setEtiquetas((prev) => prev.filter((etiqueta) => etiqueta.id !== itemToDelete));
                setTipoError(ErrorTipo.SUCCESS);
                setRecargaPagina(true);
                setModalMessage('Etiqueta eliminada con éxito.');
                setShowModal(true);
            } catch (error) {
                setError("Hubo un error al intentar eliminar la etiqueta.");
                setTipoError(ErrorTipo.SOFT_ERROR);
                setRecargaPagina(true);
                setModalMessage('Error al eliminar la etiqueta:\n' + error);
                setShowModal(true);
            } finally {
                setShowConfirmationModal(false);
                setItemToDelete(null);
            }
        }
    };

    return (
        <>
            <FormEtiqueta />
            <div className="etiqueta-page">
            {isDataLoading ? (
                <LoadingSpinner/>
                ) : error ? (
                    <p>{error}</p>
                ) : etiquetas.length > 0 ? (
                    <div className="etiqueta-container">
                        {etiquetas.map((etiqueta) => (
                            <div key={etiqueta.id} className="etiqueta-card">
                                {isEditing && currentEtiqueta?.id === etiqueta.id ? (
                                    <div className="edit-form">
                                        <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre"/>
                                        <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" rows={4}/>
                                        <button onClick={handleSaveChanges} className='save-button'>Guardar</button>
                                        <button onClick={() => { setIsEditing(false); setCurrentEtiqueta(null); }} className='cancel-button'>Cancelar</button>
                                    </div>
                                ) : (
                                    <>
                                        <h3>{etiqueta.nombre}</h3>
                                        <h6>Información de la Etiqueta</h6>
                                        <div className="etiqueta-info">
                                            <p>Descripción: {etiqueta.descripcion}</p>
                                            <button onClick={() => handleEditToggle(etiqueta)} className='edit-button'>Editar</button>
                                            <button onClick={() => promptDelete(etiqueta.id)} className="delete-button">
                                                <img src={deleteIcon} alt="Eliminar" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No se encontraron etiquetas.</p>
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

export default EtiquetaPage;
