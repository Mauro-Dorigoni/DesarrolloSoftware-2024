
import Inicio from "../components/inicio/inicio.tsx";
import Title from "../components/tilte/title.tsx";
import HechizoCard from "../components/hechizoCard/hechizoCard.tsx";
import backgroundImg from '../assets/inicio-hechizos2.jpeg';

export default function HechizosEmpleadoPage() {
    return (
        <div>
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