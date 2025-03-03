import swaggerJsdoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ministerio de Magia API',
            version: '1.2.1',
            description: 'API para administrar el patentamiento y visualización de hechizos del Ministerio de Magia',
            contact: {
                name: 'Equipo Ministerio de Magia',
                email: 'dorigonimauro@gmail.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/`,
                description: 'Local server'
            },
            {
                url: 'https://api.ministeriomagia.com',
                description: 'Production server'
            }
        ]
    },
    apis: ['./**/*.routes.ts']
};
const specs = swaggerJsdoc(options);
export default specs;
//# sourceMappingURL=documentacion.js.map