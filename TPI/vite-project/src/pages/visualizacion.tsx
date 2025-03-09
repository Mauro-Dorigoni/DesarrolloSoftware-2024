import { useState, useContext, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Inicio from '../components/inicio/inicio';
import Title from "../components/tilte/title";
import './visualizacion.css';
import backgroundImg from '../assets/inicio-visualizacion2.jpeg';
import FormVisualizacion from "../components/formVisualizacion/formVisualizacion";
import ModalMessage from "../components/modalMessage/modalMessage";
import { ErrorTipo } from "../components/modalMessage/error.enum";
import { AuthContext } from '../context/authContext.tsx';
import LoadingSpinner from '../components/loadingSpinner/loadingSpinner.tsx';

const apiUrl = import.meta.env.VITE_API_URL;

interface Solicitud {
    id: number;
    motivo: string;
    estado: string;
    motivo_rechazo: string | null;
    fecha_hasta: string | null;
    permanente: boolean | null
    hechizo:{
        nombre:string;
    }
    empleado: {
        nombre: string;
        apellido: string;
        email: string;
        profesion: string;
        madera_varita: string;
        nucleo_varita: string;
        largo_varita: number;
    } | null;
    mago: {
        nombre: string;
        apellido: string;
        email: string;
        profesion: string;
        madera_varita: string;
        nucleo_varita: string;
        largo_varita: number;
    };
}

export default function VisualizacionPage() {
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const { currentUser } = useContext(AuthContext);
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<{ label: string; value: string } | null>({ label: 'Todas', value: '' });
    const [isDataLoading, setIsDataLoading] = useState(false);

    
    const fetchUserSolicitudes = async () => {
        setIsDataLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/api/solicitud_visualizacion/mago`);
            setSolicitudes(response.data.data);
            setFilteredSolicitudes(response.data.data);
            setIsDataLoading(false);
        } catch (error) {
            setTipoError(ErrorTipo.HARD_ERROR);
            setRecargaPagina(false);
            setModalMessage('No se pudieron recuperar las Patentes del Usuario\n' + error);
            setShowModal(true);
        }
    }

    useEffect(() => {
        if (currentUser?.id) {
            fetchUserSolicitudes();
        }
    }, [currentUser]);

    const filterBy: string[] = ['aprobada', 'rechazada', 'pendiente_revision', 'vencida'];
    const filterOptions = [{ label: 'Todas', value: '' }, ...filterBy.map((filtro: string) => ({ label: filtro, value: filtro }))];

        const handleFilterChange = () => {
            setIsDataLoading(true);
            let filtered = solicitudes;
            if (selectedFilter && selectedFilter.value !== '') {
                filtered = solicitudes.filter(solicitudes => solicitudes.estado === selectedFilter.value);
            }
            setFilteredSolicitudes(filtered);
            setIsDataLoading(false)
        };
    
    useEffect(() => {
        handleFilterChange();
    }, [selectedFilter]);

        const getEstadoClass = (estado: string) => {
            switch (estado) {
                case 'aprobada':
                    return 'estado-verde';
                case 'rechazada':
                    return 'estado-rojo';
                case 'pendiente_revision':
                    return 'estado-amarillo';
                case 'vencida':
                    return 'estado-violeta'
                default:
                    return '';
            }
        };

        const [showSpinner, setShowSpinner] = useState(true);
        
        useEffect(() => {
          if (isDataLoading) {
            setShowSpinner(true); // Muestra el spinner cuando empieza a cargar
          } else {
            // Lo dejo un rato en pantalla pq sino hace una interaccion rara que piensa que las solicitudes son un arreglo vacio y muestra el mensaje de error
            const timeoutId = setTimeout(() => setShowSpinner(false), 100); 
            return () => clearTimeout(timeoutId);
          }
        }, [isDataLoading]);
    return (
        <div>
            <Inicio
                title="Solicitudes de Visualización"
                subTitle="En esta sección, puedes solicitar acceso a las instrucciones de hechizos restringidos completando un formulario específico. Este proceso es necesario para acceder a información sobre hechizos que están sujetos a restricciones especiales. También podrás hacer un seguimiento del estado de tus solicitudes realizadas."
                backgroundImage={backgroundImg}
            />
            <FormVisualizacion />
            <Title encabezado="TUS SOLICITUDES" title="Información" subTitle="" />
            <div className="filtros-container">
                <Select
                    className="select-dropdown"
                    options={filterOptions}
                    value={selectedFilter}
                    onChange={setSelectedFilter}
                    placeholder="Filtrar por estado"
                    isClearable
                />
            </div>
            <div className="solicitudes-container">
                {showSpinner  ? (
                    <LoadingSpinner />
                ): filteredSolicitudes.length > 0 ? (
                    filteredSolicitudes.map((solicitud) => (
                        <div key={solicitud.id} className="solicitud-card">
                            <h3>{solicitud.hechizo.nombre}</h3>
                            <h6>Información General</h6>
                            <div className="solicitud-info">
                                <p>Usuario: {solicitud.mago.nombre} {solicitud.mago.apellido}</p>
                                <p>Motivo: {solicitud.motivo}</p>
                            </div>
                            <h6>Información de Estado</h6>
                            <div className="solicitud-estado">
                                <p>
                                    <span>Estado: </span>
                                    <span className={getEstadoClass(solicitud.estado)}>{solicitud.estado}</span>
                                </p>
                                {solicitud.empleado && (
                                    <p>Empleado Revisor: {solicitud.empleado.nombre} {solicitud.empleado.apellido}</p>
                                )}
                                {solicitud.motivo_rechazo && (
                                    <p>Motivo de rechazo: {solicitud.motivo_rechazo}</p>
                                )}
                                {(solicitud.estado == 'aprobada'&& solicitud.permanente) && (
                                    <p>Vigencia: Permanente</p>
                                )}
                                {(solicitud.estado == 'aprobada' && solicitud.fecha_hasta) && (
                                    <p>Vigencia: {solicitud.fecha_hasta}</p>
                                )}
                            </div>
                        </div>
                    ))
                ):(
                    <p>No hay solicitudes {selectedFilter?.value || 'registradas'}.</p>)
                }
            </div>
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