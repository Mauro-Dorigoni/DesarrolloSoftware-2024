# Propuesta TP DSW

## Grupo

### Integrantes

- 49457 - Dorigoni Mauro
- 49453 - Gelmetti Lucia
- 41324 - Gimenez Ulises

Se les extiende un sentido agradecimiento por su apoyo tecnico y moral a las siguientes personas:

- Fausto Leoni
- Juan Cruz D'Amor
- Victoria Peinado

### Repositorios

- [full app](https://github.com/Mauro-Dorigoni/DesarrolloSoftware-2024/tree/main/TPI)

## Tema

### Descripción

Nuestro proyecto está ambientado en el mundo mágico de Harry Potter. La página cumpliría el rol de ser el sitio oficial del Ministerio de Magia. Un mago puede darse de alta para visualizar la base de datos de hechizos del ministerio. A su vez, puede solicitar patentar un hechizo de su propia creacion (que sera o no aprobada por un empleado del ministerio).
Un empleado puede catalogar un hechizo como restringido al publico general, lo que implica que sus instrucciones no estaran disponibles.
Un mago puede solicitar visualizar informacion restringida sobre un hechizo, y esta solicitud sera evaluada por un empleado. Si esta es aceptada, podra tener duracion limitada o ilimitada.
Los hechizos corresponden a un tipo, y se les otorga etiquetas para definir su grado de dificultad y
caracteristicas generales.
Los magos deberan informar la institucion donre realizaron o estan realizando sus estudios magicos.

### Modelo de Negocio

![](./assets/media/ModeloDominioDSW.drawio.png)

### Modelo Entidad-Relacion

![](https://github.com/Mauro-Dorigoni/DesarrolloSoftware-2024/blob/main/assets/media/DER_TP_IntegradorDS_HP.jpeg)

## Alcance Funcional

### Alcance Mínimo

| Req      | Detalle                                                      |
| :------- | :----------------------------------------------------------- |
| **CRUD simple**          | 1. CRUD TipoHechizo <br> 2. CRUD Institucion <br> 3. CRUD Etiquetas |
| **CRUD dependiente**     | 1. CRUD Mago {depende de} CRUD Institucion <br> 2. CRUD Empleado {depende de} CRUD Institucion |
| **Listado + detalle**    | 1. Listado de todos los hechizos (etiquetas, tipo de hechizo, mago que lo patentó) con filtro (etiquetas/tipo de hechizo) => detalle CRUD Hechizo <br> 2. Listado de patentes con filtro (estado) => detalle CRUD Patente <br> 3. Listado de magos => detalle CRUD Mago, CRUD Institucion |
| **CUU/Epic**             | 1. Patentar un nuevo hechizo <br> 2. Aprobar la patente de un nuevo hechizo <br> 3. Rechazar patente |


Adicionales para Aprobación

| Req      | Detalle                                                      |
| :------- | :----------------------------------------------------------- |
| CUU/Epic | 1. Solicitar permiso de visualizacion de hechizos restringidos <br> 2. Aprobar la solicitud <br> 3. Rechazar la solicitud |

### Alcance Adicional Voluntario

_Nota_: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

| Req      | Detalle                                                                        |
| :------- | :----------------------------------------------------------------------------- |
| Listados | 1. Listado de solicitudes con filtro (estado) <br> 2. Busqueda de hechizos por datos |
| Otros    | 1. Vencimiento de permisos de visualizacion <br> 2. Manejo de imagenes de hechizos <br> 3. Manejo de datos sensibles |
