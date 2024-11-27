import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import './tipoHechizo.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormTipoHechizo from "../components/formTipoHechizo/formTipoHechizo";
import deleteIcon from "../assets/basura.png";
import ModalMessage from "../components/modalMessage/modalMessage.tsx";
import { ErrorTipo } from "../components/modalMessage/error.enum.tsx";

interface TipoHechizo {
    id: number;
    nombre: string;
    caracteristicas: string;
}

const TipoHechizoPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false)
    const [modalMessage, setModalMessage] = useState('');
    const [tiposHechizo, setTiposHechizo] = useState<TipoHechizo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTipoHechizo, setCurrentTipoHechizo] = useState<TipoHechizo | null>(null);
    const [formData, setFormData] = useState<TipoHechizo>({
        id: 0,
        nombre: '',
        caracteristicas: '',
    });

    useEffect(() => {
        const fetchTiposHechizo = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/tipo_hechizo');
                setTiposHechizo(response.data.data);
            } catch (err) {
                setError('Error al cargar los tipos de hechizo.');
                setTipoError(ErrorTipo.HARD_ERROR);
                setRecargaPagina(false);
                setModalMessage('No se pudieron recuperar los tipo de hechizo\n'+err);
                setShowModal(true);
            }
        };

        fetchTiposHechizo();
    }, []);

    const handleEditToggle = (tipoHechizo: TipoHechizo) => {
        setIsEditing(true);
        setCurrentTipoHechizo(tipoHechizo);
        setFormData(tipoHechizo);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        if (currentTipoHechizo) {
            try {
                await axios.put(`http://localhost:3000/api/tipo_hechizo/${currentTipoHechizo.id}`, formData);
                setTiposHechizo((prev) =>
                    prev.map((tipoHechizo) =>
                        tipoHechizo.id === currentTipoHechizo.id ? { ...tipoHechizo, ...formData } : tipoHechizo
                    )
                );
                setIsEditing(false);
                setCurrentTipoHechizo(null);
                setTipoError(ErrorTipo.SUCCESS);
                setRecargaPagina(true);
                setModalMessage('Datos modificados con exito');
                setShowModal(true);
            } catch (error) {
                console.error("Error al actualizar la información:", error);
                setTipoError(ErrorTipo.SOFT_ERROR);
                setRecargaPagina(true);
                setModalMessage('Error al actualizar la información:\n'+error);
                setShowModal(true);
            }
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que querés eliminar este tipo de hechizo?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/tipo_hechizo/${id}`);
                setTiposHechizo((prev) => prev.filter((tipoHechizo) => tipoHechizo.id !== id));
                setTipoError(ErrorTipo.SUCCESS);
                setRecargaPagina(true);
                setModalMessage('Tipo Hechizo eliminada con exito.');
                setShowModal(true);
            } catch (error) {
                setError("Hubo un error al intentar eliminar el tipo de hechizo.");
                setTipoError(ErrorTipo.SOFT_ERROR);
                setRecargaPagina(true);
                setModalMessage('Error al eliminar la etiqueta:\n'+error);
                setShowModal(true);
            }
        }
    };

    return (
        <>
            <Navbar />
            <FormTipoHechizo />
            <div className="tipoHechizo-page">
                {error ? (
                    <p>{error}</p>
                ) : tiposHechizo.length > 0 ? (
                    <div className="tipoHechizo-container">
                        {tiposHechizo.map((tipoHechizo) => (
                            <div key={tipoHechizo.id} className="tipoHechizo-card">
                                {isEditing && currentTipoHechizo?.id === tipoHechizo.id ? (
                                    <div className="edit-form">
                                        <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre"/>
                                        <textarea name="caracteristicas" value={formData.caracteristicas} onChange={handleInputChange} placeholder="Características" rows={4}/>
                                        <button onClick={handleSaveChanges} className='save-button'>Guardar</button>
                                        <button onClick={() => { setIsEditing(false); setCurrentTipoHechizo(null); }} className='cancel-button'>Cancelar</button>
                                    </div>
                                ) : (
                                    <>
                                        <h3>{tipoHechizo.nombre}</h3>
                                        <h6>Información del Tipo de Hechizo</h6>
                                        <div className="tipoHechizo-info">
                                            <p>Características: {tipoHechizo.caracteristicas}</p>
                                            <button onClick={() => handleEditToggle(tipoHechizo)} className='edit-button'>Editar</button>
                                            <button onClick={() => handleDelete(tipoHechizo.id)} className="delete-button">
                                                <img src={deleteIcon} alt="Eliminar" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No se encontraron tipos de hechizo.</p>
                )}
                {showModal && (
                    <ModalMessage
                        errorType={tipoError}
                        message={modalMessage}
                        reloadOnClose={recargaPagina} 
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default TipoHechizoPage;
