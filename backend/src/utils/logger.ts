/**
 * Módulo para gestión de logs
 */

// Tipos de niveles de log
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Clase Logger para manejar logs
 */
class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Formatea un mensaje de log
   * @param level Nivel del log
   * @param message Mensaje a loguear
   * @returns 
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`;
  }

  /**
   * Log de información
   * @param message Mensaje a loguear
   * @param meta Metadata opcional
   */
  public info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message));
    if (meta) console.log(meta);
  }

  /**
   * Log de advertencia
   * @param message Mensaje a loguear
   * @param meta Metadata opcional
   */
  public warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message));
    if (meta) console.warn(meta);
  }

  /**
   * Log de error
   * @param message Mensaje a loguear
   * @param meta Metadata opcional
   */
  public error(message: string, meta?: any): void {
    console.error(this.formatMessage('error', message));
    if (meta) console.error(meta);
  }

  /**
   * Log de depuración
   * @param message Mensaje a loguear
   * @param meta Metadata opcional
   */
  public debug(message: string, meta?: any): void {
    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message));
      if (meta) console.debug(meta);
    }
  }
}

/**
 * Fábrica para crear instancias de Logger
 */
export const LoggerFactory = {
  /**
   * Obtiene o crea una instancia de Logger para el contexto dado
   * @param context Contexto del logger
   * @returns Instancia de Logger
   */
  getLogger(context: string): Logger {
    return new Logger(context);
  }
};
