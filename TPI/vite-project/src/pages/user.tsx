
import Inicio from '../components/inicio/inicio';
import User from "../components/user/user";
import Title from '../components/tilte/title';
import backgroundImg from '../assets/id.jpeg';

export default function UserPage() {
    return (
        <div>
            <Inicio
                title="Gestión de Cuenta"
                subTitle="En esta sección, podrás ver y actualizar toda la información relacionada con tu cuenta personal. Revisa y edita tus datos de perfil, mantén tu información de contacto siempre actualizada y asegúrate de que todo esté correcto para aprovechar al máximo los servicios del Ministerio de Magia."
                backgroundImage={backgroundImg}
            />
            <Title 
                encabezado='TU CUENTA' 
                title='Información' 
                subTitle='' 
            />
            <User />
        </div>
    );
}