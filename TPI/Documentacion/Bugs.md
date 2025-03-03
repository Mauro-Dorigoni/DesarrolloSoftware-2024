# Bugs del Sitio

En la siguiente tabla se indican los bugs encontrados en el sistema y el estado actual de estos.

| **ID**      | **Especificacion** | **Fecha** | **Estado de Resolucion** |
| :------- | :------------------------------------------------- | :-- | :-- |
| b001 | No asignacion de Etiquetas a la Patente/Hechizo | 01/11/2024 | RESOLVED |
| b002 | Muestra defectuosa de la informacion de un hechizo en la pagina de hechizos | 02/11/2024 | RESOLVED |
| b003 | No asingacion del empleado que rechazo la patente | 09/02/2025 | RESOLVED |
| b004 | Recuperacion defectuosa de datos en los sanitizedInput | 05/10/2024 | RESOLVED |
| b005 | Error al mostrar las patentes de un Mago que no registro patentes | 01/02/2015 | RESOLVED |
| b006 | Interaccion defenctuosa entre la busqueda y los filtros en la pagina de hechizos | 01/12/2024 | RESOLVED |
| b007 | Lista incompleta de hechizos a los cual el mago puede solicitar visualizacion | 02/02/2025 | RESOLVED |
| b008 | Error al mostrar imagen de un hechizo si esta fue dada eliminada de los uploads del servidor | 02/03/2025 | PENDING |


## Detalle

- **b001**: Al publicar una patente, el backend no asigna adecuadamente las etiquetas elegidas por el empleado a esta. Implica que las etiquetas no se ven reflejadas en la Base de Datos, por lo cual generea una interaccion inadecuada con el frontend al intentar mostrarlas.
- **b002**: En la pagina de hechizos, al hacer click en detalle de hechizos, se abren los popups correspondientes a todos los hechizos de manera superpuesta uno sobre el otro. En definitiva, el unico detalle legible es el del ultimo hechizo registrado en la Base de Datos.
- **b003**: Al rechazar la patente, el backend envia un codigo 401 indicando que no se pudo recuperar el empleado que realizo la accion. La patente se rechaza, pero el empleado revisor se deja en null.
- **b004**: No se toman correctamente los datos de la funcion sanitized input.
- **b005**: Si un mago no tiene patentes registradas, al navegar hacia la pagina de patentes, esta lanza un axiosError (500) indicando que no se encontraron patentes. Lo correcto seria que en la seccion de patentes muestr "No hay patentes diponibles".
- **b006**: Si la barra de busqueda esta vacia y se utiliza uno o los dos de los filtros mas de una vez consecutiva, la pagina muestra que no hay hechizos. 
- **b007**: El backend comenzo a devolver una lista incompleta de los hechizos restringidos a los cuales un mago puede solicitar acceso.
- **b008**: El frontend contemlpla que un hechizo puede no tener dada de alta una imagen, pero no si esta fue dada de alta y despues eliminada, mostrando una card defectuosa.