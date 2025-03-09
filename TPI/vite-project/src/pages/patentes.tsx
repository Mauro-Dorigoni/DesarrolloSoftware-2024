import React, { useState, useContext, useEffect } from 'react';
import Inicio from '../components/inicio/inicio';
import backgroundImg from '../assets/inicio-patentes.jpeg';
import FormPatente from "../components/formPatente/formPatente";
import { AuthContext } from "../context/authContext.tsx";
import axios from 'axios';
import './patentes.css';
import Title from "../components/tilte/title.tsx";
import ModalMessage from "../components/modalMessage/modalMessage.tsx";
import { ErrorTipo } from "../components/modalMessage/error.enum.tsx";
import Select from 'react-select';
import LoadingSpinner from '../components/loadingSpinner/loadingSpinner.tsx';

const apiUrl = import.meta.env.VITE_API_URL;

interface Patente {
    id: number;
    fechaCreacion: Date;
    nombre: string;
    descripcion: string;
    estado: string;
    motivo_rechazo: string | null;
    instrucciones: string;
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

const PatentesPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [Patente, setPatentes] = useState<Patente[]>([]);
    const { currentUser } = useContext(AuthContext);
    const [selectedFilter, setSelectedFilter] = useState<{ label: string; value: string } | null>({ label: 'Todas', value: '' });
    const [filteredPatentes, setFilteredPatentes] = useState<Patente[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    

    const fetchUserPatentes = async () => {
        setIsDataLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/api/patente/mago`);
            setPatentes(response.data.data);
            setFilteredPatentes(response.data.data); // Inicializa las patentes filtradas con todas las patentes
            setIsDataLoading(false);
        } catch (error) {
            setTipoError(ErrorTipo.HARD_ERROR);
            setRecargaPagina(false);
            setModalMessage('No se pudieron recuperar las Patentes del Usuario\n' + error);
            setShowModal(true);
        }
    };

    useEffect(() => {
        if (currentUser?.id) {
            fetchUserPatentes();
        }
    }, [currentUser]);

    const filterBy: string[] = ['publicada', 'rechazada', 'pendiente_revision'];
    const filterOptions = [{ label: 'Todas', value: '' }, ...filterBy.map((filtro: string) => ({ label: filtro, value: filtro }))];

    const handleFilterChange = () => {
        setIsDataLoading(true);
        let filtered = Patente;
        if (selectedFilter && selectedFilter.value !== '') {
            filtered = Patente.filter(patente => patente.estado === selectedFilter.value);
        }
        setFilteredPatentes(filtered);
        setIsDataLoading(false)
    };

    useEffect(() => {
        handleFilterChange();
    }, [selectedFilter]);

    const getEstadoClass = (estado: string) => {
        switch (estado) {
            case 'publicada':
                return 'estado-verde';
            case 'rechazada':
                return 'estado-rojo';
            case 'pendiente_revision':
                return 'estado-amarillo';
            default:
                return '';
        }
    };

const [showSpinner, setShowSpinner] = useState(true);

useEffect(() => {
  if (isDataLoading) {
    setShowSpinner(true); // Muestra el spinner cuando empieza a cargar
  } else {
    // Lo dejo un rato en pantalla pq sino hace una interaccion rara que piensa que las patentes son un arreglo vacio y muestra el mensaje de error
    const timeoutId = setTimeout(() => setShowSpinner(false), 100); 
    return () => clearTimeout(timeoutId);
  }
}, [isDataLoading]);


    return (
        <div>
            <Inicio
                title="Solicitudes de Patentes"
                subTitle="Aquí puedes gestionar todas tus solicitudes de patentes de hechizos."
                backgroundImage={backgroundImg}
            />
            <FormPatente />
            <Title encabezado="TUS PATENTES" title="Información" subTitle="" />
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
            <div className="patentes-container">
                {showSpinner  ? (
                    <LoadingSpinner />
                ): filteredPatentes.length > 0 ? (
                    filteredPatentes.map((patente) => (
                        <div key={patente.id} className="patentes-card">
                            <h3>{patente.nombre}</h3>
                            <h6>Información General</h6>
                            <div className="personal-info">
                                <p>Usuario: {patente.mago.nombre} {patente.mago.apellido}</p>
                                <p>ID Patente: {patente.id}</p>
                                <p>Fecha: {new Date(patente.fechaCreacion).toLocaleDateString()}</p>
                                <p>Descripcion: {patente.descripcion}</p>
                                <p>Instrucciones: {patente.instrucciones}</p>
                            </div>
                            <h6>Información de Estado</h6>
                            <div className="user-varita">
                                <p>
                                    <span>Estado: </span>
                                    <span className={getEstadoClass(patente.estado)}>{patente.estado}</span>
                                </p>
                                {patente.empleado ? (
                                    <p>Empleado Revisor: {patente.empleado.nombre} {patente.empleado.apellido}</p>
                                ) : (
                                    <p>Empleado Revisor: No asignado</p>
                                )}
                                <p>Motivo de rechazo: {patente.motivo_rechazo || 'N/A'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay patentes {selectedFilter?.value || 'registradas'}.</p>
                )}
                {showModal && (
                    <ModalMessage
                        errorType={tipoError}
                        message={modalMessage}
                        reloadOnClose={recargaPagina}
                    />
                )}
            </div>
        </div>
    );
};

export default PatentesPage;


