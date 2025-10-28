"use strict";
/**
 * Módulo para gestión de logs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFactory = void 0;
/**
 * Clase Logger para manejar logs
 */
class Logger {
    constructor(context) {
        this.context = context;
    }
    /**
     * Formatea un mensaje de log
     * @param level Nivel del log
     * @param message Mensaje a loguear
     * @returns
     */
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`;
    }
    /**
     * Log de información
     * @param message Mensaje a loguear
     * @param meta Metadata opcional
     */
    info(message, meta) {
        console.log(this.formatMessage('info', message));
        if (meta)
            console.log(meta);
    }
    /**
     * Log de advertencia
     * @param message Mensaje a loguear
     * @param meta Metadata opcional
     */
    warn(message, meta) {
        console.warn(this.formatMessage('warn', message));
        if (meta)
            console.warn(meta);
    }
    /**
     * Log de error
     * @param message Mensaje a loguear
     * @param meta Metadata opcional
     */
    error(message, meta) {
        console.error(this.formatMessage('error', message));
        if (meta)
            console.error(meta);
    }
    /**
     * Log de depuración
     * @param message Mensaje a loguear
     * @param meta Metadata opcional
     */
    debug(message, meta) {
        // Solo mostrar en desarrollo
        if (process.env.NODE_ENV !== 'production') {
            console.debug(this.formatMessage('debug', message));
            if (meta)
                console.debug(meta);
        }
    }
}
/**
 * Fábrica para crear instancias de Logger
 */
exports.LoggerFactory = {
    /**
     * Obtiene o crea una instancia de Logger para el contexto dado
     * @param context Contexto del logger
     * @returns Instancia de Logger
     */
    getLogger(context) {
        return new Logger(context);
    }
};
