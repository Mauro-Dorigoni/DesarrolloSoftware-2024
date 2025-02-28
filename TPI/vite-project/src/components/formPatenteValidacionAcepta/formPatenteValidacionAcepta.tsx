import React, { useState, useEffect, useContext } from 'react';
import './formPatenteValidacionAcepta.css';
import cross from '../../assets/cross.png';
import { AuthContext } from '../../context/authContext.tsx';
import axios from 'axios';
import ModalMessage from '../modalMessage/modalMessage';
import { ErrorTipo } from '../modalMessage/error.enum.tsx';

const apiUrl = import.meta.env.VITE_API_URL;

interface Etiqueta {
    id: number;
    nombre: string;
    descripcion: string;
}

interface TipoHechizo {
    id: number;
    nombre: string;
    caracteristicas: string;
}

interface formValidacionAceptaProps {
    idPatente: number;
}

function FormPatenteValidacionAcepta({ idPatente }: formValidacionAceptaProps) {

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [TipoHechizo, setTipoHechizo] = useState<TipoHechizo[]>([]);
    const [Etiqueta, setEtiqueta] = useState<Etiqueta[]>([]);
    const [selectedEtiquetas, setSelectedEtiquetas] = useState<Etiqueta[]>([]); // Etiquetas seleccionadas
    const [restringido, setRestringido] = useState<boolean>(false); // Para manejar restringido (Sí/No)
    const [selectedTipoHechizo, setSelectedTipoHechizo] = useState<number | null>(null); // Estado para tipo de hechizo seleccionado
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false)
    const [modalMessage, setModalMessage] = useState('');

    // Mostrar/ocultar formulario
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    // Fetch para obtener los tipos de hechizos
    useEffect(() => {
        fetchTipoHechizo();
        fetchEtiqueta();
    }, []);

    const fetchTipoHechizo = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/tipo_hechizo`);
            setTipoHechizo(response.data.data);
        } catch (error) {
            setTipoError(ErrorTipo.HARD_ERROR);
            setRecargaPagina(false);
            setModalMessage('Error al cargar los tipos de hechizo.\n'+error);
            setShowModal(true);
        }
    };

    const fetchEtiqueta = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/etiqueta`);
            setEtiqueta(response.data.data);
        } catch (error) {
            setTipoError(ErrorTipo.HARD_ERROR);
            setRecargaPagina(false);
            setModalMessage('Error al cargar las etiquetas.\n'+error);
            setShowModal(true);
        }
    };

    // Función para manejar la selección de etiquetas
    const handleSelectEtiqueta = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        const selectedEtiqueta = Etiqueta.find(etiqueta => etiqueta.id === selectedId);

        if (selectedEtiqueta) {
            setSelectedEtiquetas([...selectedEtiquetas, selectedEtiqueta]);
            setEtiqueta(Etiqueta.filter(etiqueta => etiqueta.id !== selectedId)); // Eliminar del dropdown
        }
    };

    // Función para eliminar una etiqueta seleccionada
    const handleRemoveEtiqueta = (id: number) => {
        const etiquetaToRemove = selectedEtiquetas.find(etiqueta => etiqueta.id === id);

        if (etiquetaToRemove) {
            setSelectedEtiquetas(selectedEtiquetas.filter(etiqueta => etiqueta.id !== id));
            setEtiqueta([...Etiqueta, etiquetaToRemove]); // Volver a agregar al dropdown
        }
    };

    // Función para manejar la publicación de la patente
    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser || !currentUser.id) {
            setTipoError(ErrorTipo.HARD_ERROR);
            setRecargaPagina(false);
            setModalMessage('No se pudo recuperar el usuario loggeado.');
            setShowModal(true);
            return;
        }

        // Solo enviamos el tipo de hechizo seleccionado
        const formData = {
            tipoHechizo: selectedTipoHechizo, // Solo el tipo de hechizo seleccionado
            Etiquetas: selectedEtiquetas,
            restringido,
            empleado: currentUser.id
        };

        try {
            const response = await axios.put(`${apiUrl}/api/patente/publish/${idPatente}`, formData);
            setIsPopupVisible(false);
            setTipoError(ErrorTipo.SUCCESS);
            setRecargaPagina(true);
            setModalMessage('Patente publicada correctamente. \n'+response.data.id);
            setShowModal(true);
        } catch (error) {
            setTipoError(ErrorTipo.SOFT_ERROR);
            setRecargaPagina(true);
            setModalMessage('Hubo un error al publicar la patente.\n'+error);
            setShowModal(true);
        }
    };

    return (
        <div>
            <button className='publicar-patente-button' onClick={togglePopup}>
                Publicar
            </button>
            {isPopupVisible && (
                <div>
                    <div className='patente-overlay' onClick={togglePopup}></div>
                    <form className='form-rechazo-patente' onSubmit={handleReject}>
                        <button className='close-rechazo-patente' onClick={togglePopup}>
                            <img src={cross} alt="" />
                        </button>
                        <h4>Publicacion de Patente</h4>
                        
                        {/* Tipo de Hechizo */}
                        <div>
                            <p>Tipo de Hechizo</p>
                            <select
                                required
                                onChange={(e) => setSelectedTipoHechizo(parseInt(e.target.value, 10))}
                                value={selectedTipoHechizo ?? ""}
                            >
                                <option value="" disabled>Seleccionar tipo de hechizo</option>
                                {TipoHechizo.map(hechizo => (
                                    <option key={hechizo.id} value={hechizo.id}>
                                        {hechizo.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Etiquetas */}
                        <div>
                            <p>Etiquetas</p>
                        
                                {selectedEtiquetas.map(etiqueta => (
                                    <span className='etiqueta-seleccionada' key={etiqueta.id}>
                                        {etiqueta.nombre}
                                        <button type="button" onClick={() => handleRemoveEtiqueta(etiqueta.id)}>
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            <select onChange={handleSelectEtiqueta} value="">
                                <option value="" disabled>Seleccionar etiqueta</option>
                                {Etiqueta.map(etiqueta => (
                                    <option key={etiqueta.id} value={etiqueta.id}>
                                        {etiqueta.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Restringir Visualización */}
                        <div>
                            <p>Restringir Visualización?</p>
                            <select value={restringido ? "si" : "no"} onChange={e => setRestringido(e.target.value === "si")}>
                                <option value="no">No</option>
                                <option value="si">Sí</option>
                            </select>
                        </div>

                        <button type="submit" className='button-rechazo-patente'>Publicar</button>
                    </form>
                </div>
            )}
             {showModal && (
                <ModalMessage
                    errorType={tipoError}
                    message={modalMessage}
                    reloadOnClose={recargaPagina} // Recargar la página al cerrar
                />
            )}
        </div>
    );
}

export default FormPatenteValidacionAcepta;





