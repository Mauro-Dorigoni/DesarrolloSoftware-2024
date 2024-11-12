import Navbar from "../components/navbar/navbar";
import Inicio from '../components/inicio/inicio';
import Footer from "../components/footer/footer";
import backgroundImg from '../assets/inicio-patentes.jpeg';
import FormPatenteValidacionRechaza from "../components/formPatenteValidacionRechaza/formPatenteValidacionRechaza.tsx";
import FormPatenteValidacionAcepta from "../components/formPatenteValidacionAcepta/formPatenteValidacionAcepta.tsx";
import { AuthContext } from "../context/authContext.tsx";
import { useContext, useEffect } from 'react';
import axios from 'axios';
import React, { useState } from 'react';
import './patentes.css';
import Title from "../components/tilte/title.tsx";


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


    const [error, setError] = useState<string | null>(null);
    const [Patente, setPatentes] = useState<Patente[]>([]);
    const { currentUser } = useContext(AuthContext);

    const fetchUserPatentes = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/patente/pending`);
            console.log('Patentes pendientes de revisión recibidas:', response.data);
            setPatentes(response.data.data);
        } catch (error) {
            setError('Error al cargar las patentes pendientes de revisión');
            console.error(error);
        }
    };

    
    useEffect(() => {
        if (currentUser?.id) {
            fetchUserPatentes();
        }
    }, [currentUser]);

    useEffect(() => {
        console.log('Patentes pendientes de revision cargadas:', Patente);
    }, [Patente]);

    return (
         <div>
            <Navbar />
            <Inicio
                title="Gestion de solicitudes de Patentes"
                subTitle="Aquí podrás supervisar, gestionar y aprobar solicitudes de patentes de hechizos únicos creados por los magos de todas las instituciones. Recuerda
                realizar tus gestiones siempre en conformidad con las normas del Ministerio de Magia."
                backgroundImage={backgroundImg}
            />
            

            <Title 
                encabezado='' 
                title='Patentes pendientes' 
                subTitle='' 
            />
            {/* Mostrar las patentes del usuario en tarjetas */}
            <div className="patentes-container">
                {Patente.length > 0 ? (
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
            </div>
            {error && <div className="error-message">{error}</div>}  {/* Mostrar el error */}
            <Footer />
        </div>
    );
}
export default PatentesEmpleadoPage;