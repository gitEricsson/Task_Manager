"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpSwaggerDocs = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = __importDefault(require("../config/swagger/swagger.config"));
const setUpSwaggerDocs = (app, port) => {
    app.use('/docs', swagger_ui_express_1.default.serveFiles(swagger_config_1.default), swagger_ui_express_1.default.setup(swagger_config_1.default));
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swagger_config_1.default);
    });
};
exports.setUpSwaggerDocs = setUpSwaggerDocs;
