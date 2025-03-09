import React from 'react';
import Inicio from '../components/inicio/inicio';
import InicioMenu from '../components/inicio-menu/inicio-menu';
import Title from '../components/tilte/title';
import Informacion from '../components/informacion/informacion';
import Articulos from '../components/articulos/articulos';
import backgroundImg from '../assets/inicio.jpeg';

const InicioPage: React.FC = () => {
  return (
    <div>
      <Inicio
      title="Bienvenido al Ministerio de Magia"
      subTitle="En esta entidad centralizada, nos dedicamos a mantener el orden y la justicia en el mundo de la magia, garantizando la armonía entre el mundo mágico y el mundo no mágico. Desde la regulación de la magia hasta la protección contra amenazas oscuras, nuestra misión es asegurar un entorno seguro y justo para todos los seres mágicos."
      backgroundImage={backgroundImg}
      fullHeight={true}
      />
      <Title 
        encabezado='SERVICIOS' 
        title='Nuestra Página' 
        subTitle='Explora las opciones a continuación para descubrir y gestionar todo lo relacionado con la magia: consulta nuestra base de hechizos, solicita patentes para tus creaciones mágicas o accede a hechizos restringidos bajo supervisión especial.' 
      />
      <InicioMenu />
      <Informacion />
      <Title 
        encabezado='NOVEDADES' 
        title='Artículos' 
        subTitle='' 
      />
      <Articulos />
    </div>
  );
};

export default InicioPage;
