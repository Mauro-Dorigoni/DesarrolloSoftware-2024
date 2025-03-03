# Backend de TPI - Ministerio de Magia UTN
Carpeta que contiene el codigo de la API utilizada por el sistema del Trabajo Practico Integrador de Desarrollo de Software. 

## Tecnologias Utilizadas
- Express
- MikroORM
- TypeScript
- NodeJs
- Multer
- JSONWebToken
- SQL
- CORS

## Instrucciones de instalacion/utilizacion
El siguiente instructuvo utilizara __pnpm__ como gestor de dependencias a modo de ejmplo. Quedara en el usuario realizar los cambios adecuados si es que utiliza otro gestor.

Si lo que desea es utilizar la API, sepa que esta esta desplegada y en funcionamiento en https://desarrollo-software-2024.onrender.com

Para comenzar a utilizar la Ministerio de Magia API, debera hacer un clone del Directorio de Backend de este Repositorio, de la siguiente manera:
```
git clone --no-checkout --filter=blob:none https://github.com/Mauro-Dorigoni/DesarrolloSoftware-2024.git
cd DesarrolloSoftware-2024
git sparse-checkout init --cone
git sparse-checkout set TPI/Backend
git checkout main
```

Una vez tenga disponible el repositorio, debera instalar las dependencias de desarrollo, posisionandose con la terminal en el directorio APIReST, y ejecutando:

`pnpm install`

Luego, debera crear un archivo de ambiente llamado **.env.development** dentro de APIReST (a la misma altura que package.json) que contenga la siguiente estructura:
```
#Token
JWT_SECRET=token

# Ambiente de desarrollo
NODE_ENV=development

#Puerto donde corre la API
PORT=<Elija su puerto>

#Frontend
FRONTEND_URL=<La URL del frontend>

DB_HOST=<IP o URL de su host de Base de Datos>
DB_USER=<Usuario de la Base de Datos>
DB_PASS=<Contrasena de la Base de Datos>
DB_NAME=<Nombre de la Base de Datos>
DB_URL=mysql://<ususario>:<constrasena>@<host>/<nombre_BD>
```

Si desea una Base de Datos con Datos de prueba, puede encontrar un export en https://github.com/Mauro-Dorigoni/DesarrolloSoftware-2024/blob/9db8463764fd46ba17ba501233efa05624f26d53/TPI/assets/db/db.sql
Recordar que esta API esta basada en Bases de Datos SQL.

Finalmente, para iniciar el servidor que contiene a la API, ejecute:

`pnpm start`

o:

`pnpm start:dev`
