"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app_config_1 = __importDefault(require("./../app.config"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management System',
            description: 'API endpoints features',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://localhost:${app_config_1.default.server.port}${app_config_1.default.server.baseURL}`,
                description: 'Local server'
            },
            {
                url: `${app_config_1.default.server.baseURL}`,
                description: 'Live server'
            }
        ],
        components: {
            securitySchemes: {
                bearerToken: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [
        './src/docs/**/*.ts',
        './src/routes/**/*.ts',
        './src/routes/**/**/*.ts'
    ]
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
