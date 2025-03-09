import Inicio from '../components/inicio/inicio';
import backgroundImg from '../assets/inicio-patentes.jpeg';
import { AuthContext } from "../context/authContext.tsx";
import { useContext, useEffect } from 'react';
import axios from 'axios';
import React, { useState } from 'react';
import './visualizacion.css';
import Title from "../components/tilte/title.tsx";
import ModalMessage from "../components/modalMessage/modalMessage.tsx";
import { ErrorTipo } from "../components/modalMessage/error.enum.tsx";
import FormVisualizacionRechaza from "../components/formVisualizacionRechaza/formVisualizacionRechaza.tsx";
import FormVisualizacionAcepta from "../components/formVisualizacionAcepta/formVisualizacionAcepta.tsx";
import LoadingSpinner from "../components/loadingSpinner/loadingSpinner.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

interface Solicitud {
    id: number;
    motivo: string;
    estado: string;
    motivo_rechazo: string | null;
    fecha_hasta: Date | null;
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

const VisualizacionEmpleadoPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const { currentUser } = useContext(AuthContext);
    const [isDataLoading, setIsDataLoading] = useState(false);
    

    const fetchUserSolicitudes = async () => {
        setIsDataLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/api/solicitud_visualizacion/pending`);
            setSolicitudes(response.data.data);
            setIsDataLoading(false);
        } catch (error) {
            console.error(error);
            setTipoError(ErrorTipo.HARD_ERROR);
            setRecargaPagina(false);
            setModalMessage('No se pudieron recuperar las solicitudes pendientes.\n' + error);
            setShowModal(true);
        }
    };

    useEffect(() => {
        if (currentUser?.id) {
            fetchUserSolicitudes();
        }
    }, [currentUser]);

    return (
        <div>
            <Inicio
                title="Gestión de solicitudes de Visualización"
                subTitle="Aquí podrás supervisar, gestionar y aprobar solicitudes de visualización de hechizos restringidos realizadas por magos de todas las instituciones. Recuerda realizar tus gestiones siempre en conformidad con las normas del Ministerio de Magia."
                backgroundImage={backgroundImg}
            />
            <Title encabezado='' title='Solicitudes Pendientes' subTitle='' />
            <div className="solicitudes-container">
                {isDataLoading ? (
                    <LoadingSpinner/>
                ): solicitudes.length > 0 ? (
                    solicitudes.map((solicitud) => (
                        <div key={solicitud.id} className="patentes-card">
                            <h3>{solicitud.hechizo.nombre}</h3>
                            <h6>Información General</h6>
                            <div className='personal-info'>
                                <p><strong>Hechizo: {solicitud.hechizo.nombre}</strong></p>
                                <p>Usuario: {solicitud.mago.nombre} {solicitud.mago.apellido}</p>
                                <p>ID Solicitud: {solicitud.id}</p>
                                <p>Motivo: {solicitud.motivo}</p>
                            </div>
                            <div className="buttons-container">
                                <FormVisualizacionRechaza idSolicitud={solicitud.id} />
                                <FormVisualizacionAcepta idSolicitud={solicitud.id} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No existen solicitudes pendientes de revisión.</p>
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
export default VisualizacionEmpleadoPage;