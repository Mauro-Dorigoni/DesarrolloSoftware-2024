import React, { useState, useEffect, useContext } from 'react';
import './formVisualizacion.css';
import cross from '../../assets/cross.png';
import axios from 'axios';
import { AuthContext } from '../../context/authContext.tsx';
import ModalMessage from '../modalMessage/modalMessage';
import { ErrorTipo } from '../modalMessage/error.enum';

const apiUrl = import.meta.env.VITE_API_URL;

interface Hechizo {
    id: number;
    nombre: string;
    restringido: boolean;
}

export default function FormVisualizacion() {
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [hechizo, setHechizo] = useState('');
    const [motivo, setMotivo] = useState('');
    const [hechizos, setHechizos] = useState<Hechizo[]>([]);
    const { currentUser } = useContext(AuthContext);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    //fetch de los hechizos restringidos
    useEffect(() => {
        const fetchHechizos = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/hechizo/visualizacion`);
                if (Array.isArray(response.data.data)) {
                    const hechizosRestringidos = response.data.data.filter((h: Hechizo) => h.restringido);
                    setHechizos(hechizosRestringidos);
                } else {
                    setTipoError(ErrorTipo.SOFT_ERROR);
                    setRecargaPagina(true);
                    setModalMessage('La respuesta no contiene un arreglo en data:\n' + JSON.stringify(response.data));
                    setShowModal(true);
                }
            } catch (error) {
                setTipoError(ErrorTipo.HARD_ERROR);
                setRecargaPagina(false);
                setModalMessage('No se pudieron recuperar los Hechizos.\n' + JSON.stringify(error));
                setShowModal(true);
            }
        };

        fetchHechizos();
    }, []);

    //enviar la solicitud
    const handleSolicitud = async (e: React.FormEvent) => {
        e.preventDefault();

        //validar el usuario actual
        if (!currentUser || !currentUser.id) {
            setTipoError(ErrorTipo.HARD_ERROR);
            setModalMessage('No se pudo recuperar el usuario loggeado.');
            setShowModal(true);
            return;
        }

        //campos no vacíos
        if (!hechizo || !motivo) {
            setTipoError(ErrorTipo.SOFT_ERROR);
            setModalMessage('Todos los campos son obligatorios.');
            setShowModal(true);
            return;
        }

        //estructura de la solicitud
        const data = {
            idMago: currentUser.id, 
            idHechizo: hechizo,     
            motivo: motivo         
        };

        try {
            const response = await axios.post(`${apiUrl}/api/solicitud_visualizacion/`, data, {
                headers: { 'Content-Type': 'application/json' }
            });

            setHechizo('');
            setMotivo('');
            setIsPopupVisible(false);
            setTipoError(ErrorTipo.SUCCESS);
            setRecargaPagina(true);
            setModalMessage('Solicitud de visualización enviada con éxito.\n' + JSON.stringify(response.data.message));
            setShowModal(true);
        } catch (error) {
            setTipoError(ErrorTipo.SOFT_ERROR);
            setRecargaPagina(true);
            setModalMessage('Hubo un error al enviar la solicitud.\n' + JSON.stringify(error));
            setShowModal(true);
        }
    };

    return (
        <div>
            <button className='plus-visualizacion-button' onClick={togglePopup}>
                + Solicitud
            </button>

            {isPopupVisible && (
                <div>
                    <div className='visualizacion-overlay' onClick={togglePopup}></div>
                    <form className='form-visualizacion' onSubmit={handleSolicitud}>
                        <button type="button" className='close-visualizacion' onClick={togglePopup}>
                            <img src={cross} alt="Cerrar" />
                        </button>
                        <h4>Solicitud de Visualización</h4>
                        <div className="form-visualizacion-group">
                            <p>Hechizo</p>
                            <select id="hechizo" onChange={(e) => setHechizo(e.target.value)} value={hechizo} required>
                                <option value="">Selecciona un hechizo</option>
                                {hechizos.map((h) => (
                                    <option key={h.id} value={h.id}>{h.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>Motivo</p>
                            <textarea id="motivo" onChange={(e) => setMotivo(e.target.value)} value={motivo} rows={4} required />
                        </div>
                        <button type="submit" className='button-visualizacion'>Enviar</button>
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