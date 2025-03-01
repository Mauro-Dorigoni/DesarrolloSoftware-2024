# Frontend de TPI - Ministerio de Magia UTN
Carpeta que contiene el codigo del Frontend del sistema del Trabajo Practico Integrador de Desarrollo de Software. 

## Tecnologias Utilizadas
- TypeScript
- NodeJs
- React
- Vite-Proyect

## Instrucciones de instalacion/utilizacion
El siguiente instructuvo utilizara __pnpm__ como gestor de dependencias a modo de ejmplo. Quedara en el usuario realizar los cambios adecuados si es que utiliza otro gestor.

Si lo que desea es utilizar este Frontend, sepa que esta esta desplegado y en funcionamiento en https://ministerio-magia-utn.vercel.app/

Para comenzar a utilizar el Frontend del Ministerio de la Magia, debera hacer un clone del Directorio de Frontend de este Repositorio, de la siguiente manera:
```
git clone --no-checkout --filter=blob:none https://github.com/Mauro-Dorigoni/DesarrolloSoftware-2024.git
cd DesarrolloSoftware-2024
git sparse-checkout init --cone
git sparse-checkout set TPI/vite-proyect
git checkout main
```

Una vez tenga disponible el repositorio, debera instalar las dependencias de desarrollo, posisionandose con la terminal en el directorio, y ejecutando:

`pnpm install`

Luego, debera crear un archivo de ambiente llamado **.env.development** dentro del directorio (a la misma altura que package.json) que contenga la siguiente estructura:
```
VITE_API_URL=<URL de la API a utilizar>
VITE_ENV=development
```

Para el correcto funcionamiento de estew Frontend, debera tener un Backend compatible desplegado y en funcionamiento. Puede encontrar este junto a sus instrucciones de instalacion en https://github.com/Mauro-Dorigoni/DesarrolloSoftware-2024/tree/ab0602e82b5d8d9b471224201eefee5857a31afe/TPI/Backend

Finalmente, para iniciar el servidor que contiene al Frontend, ejecute:

`pnpm dev`
