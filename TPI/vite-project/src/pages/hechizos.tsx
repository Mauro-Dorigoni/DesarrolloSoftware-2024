import Inicio from '../components/inicio/inicio';
import Title from "../components/tilte/title";
import backgroundImg from '../assets/inicio-hechizos2.jpeg';
import HechizoCard from "../components/hechizoCard/hechizoCard";
import './hechizos.css';

export default function HechizosPage() {
    return (
        <div className="hechizos-container">
            <Inicio
                title="Hechizos"
                subTitle="Bienvenido a la sección de hechizos, tu portal para descubrir y explorar una amplia gama de hechizos mágicos. Aquí podrás ver una lista completa de hechizos, cada uno con su descripción detallada e instrucciones sobre cómo realizarlo. Además, puedes filtrar los hechizos por categorías para encontrar fácilmente aquellos que se ajusten a tus necesidades específicas."
                backgroundImage={backgroundImg}
            />
            <Title 
                encabezado='HECHIZOS' 
                title='Catálogo'
                subTitle='A continuación se encuentran listados todos los hechizos disponibles. Para obtener la información completa de cada hechizo, simplemente haz clic en el ícono "i". Ten en cuenta que aquellos hechizos que no tienen este ícono son restringidos y requieren una solicitud de visualización. Puedes realizar esta solicitud en la página de visualización.'
            />
            <HechizoCard />
        </div>
    );
}