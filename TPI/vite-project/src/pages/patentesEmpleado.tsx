import Inicio from '../components/inicio/inicio';
import backgroundImg from '../assets/inicio-patentes.jpeg';
import FormPatenteValidacionRechaza from "../components/formPatenteValidacionRechaza/formPatenteValidacionRechaza.tsx";
import FormPatenteValidacionAcepta from "../components/formPatenteValidacionAcepta/formPatenteValidacionAcepta.tsx";
import { AuthContext } from "../context/authContext.tsx";
import { useContext, useEffect } from 'react';
import axios from 'axios';
import React, { useState } from 'react';
import './patentes.css';
import Title from "../components/tilte/title.tsx";
import ModalMessage from "../components/modalMessage/modalMessage.tsx";
import { ErrorTipo } from "../components/modalMessage/error.enum.tsx";
import LoadingSpinner from "../components/loadingSpinner/loadingSpinner.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

interface Patente {
    id: number;
    fechaCreacion: Date;
    nombre: string;
    descripcion: string;
    estado: string;
    motivoRechazo: string | null; // Puede ser null
    instrucciones: string;
    empleado: {
        nombre: string;
        apellido: string;
        email: string;
        profesion: string;
        madera_varita: string;
        nucleo_varita: string;
        largo_varita: number;
    } | null;  // Puede ser null
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

const PatentesEmpleadoPage: React.FC = () => {

    const [showModal, setShowModal] = useState(false);
    const [tipoError, setTipoError] = useState<ErrorTipo | null>(null);
    const [recargaPagina, setRecargaPagina] = useState(false)
    const [modalMessage, setModalMessage] = useState('');
    const [Patente, setPatentes] = useState<Patente[]>([]);
    const { currentUser } = useContext(AuthContext);
    const [isDataLoading, setIsDataLoading] = useState(false);
    

    const fetchUserPatentes = async () => {
        setIsDataLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/api/patente/pending`);
            setPatentes(response.data.data);
            setIsDataLoading(false);
        } catch (error) {
            console.error(error);
            setTipoError(ErrorTipo.HARD_ERROR);
            setRecargaPagina(false);
            setModalMessage('No se pudieron recuperar las patentes pendientes.\n'+error);
            setShowModal(true);
        }
    };

    
    useEffect(() => {
        if (currentUser?.id) {
            fetchUserPatentes();
        }
    }, [currentUser]);

    useEffect(() => {
    }, [Patente]);

    return (
         <div>
            <Inicio
                title="Gestion de solicitudes de Patentes"
                subTitle="Aquí podrás supervisar, gestionar y aprobar solicitudes de patentes de hechizos únicos creados por los magos de todas las instituciones. Recuerda
                realizar tus gestiones siempre en conformidad con las normas del Ministerio de Magia."
                backgroundImage={backgroundImg}
            />
            

            <Title 
                encabezado='' 
                title='Patentes Pendientes' 
                subTitle='' 
            />
            {/* Mostrar las patentes del usuario en tarjetas */}
            <div className="patentes-container">
                {isDataLoading ? (
                    <LoadingSpinner/>
                ):Patente.length > 0 ? (
                    Patente.map((patente) => (
                        <div key={patente.id} className="patentes-card">
                             <h3>{patente.nombre}</h3>
                                <h6>Información General</h6>
                                <div className='personal-info'>
                                <p>Usuario: {patente.mago.nombre} {patente.mago.apellido}</p>
                                <p>ID Patente: {patente.id}</p>
                                <p>Fecha: {new Date(patente.fechaCreacion).toLocaleDateString()}</p>
                                <p>Descripcion: {patente.descripcion}</p>
                                <p>Instrucciones: {patente.instrucciones}</p>
                                </div>
                                <div className="buttons-container">
                                    <FormPatenteValidacionRechaza idPatente={patente.id} />
                                    <FormPatenteValidacionAcepta idPatente={patente.id} />
                                </div>

                                
                        </div>
                    ))
                ) : (
                    <p>No existen patentes pendientes de revision.</p>
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
}
export default PatentesEmpleadoPage;