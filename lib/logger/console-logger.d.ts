export declare class ConsoleLogger {
    static info(message?: any, ...optionalParams: any[]): void;
    static warn(message?: any, ...optionalParams: any[]): void;
    static error(message?: any, ...optionalParams: any[]): void;
    /**
     * Log info messages in pretty format.
     *
     * @param message log message
     * @param params additional params for verbose log
     */
    static prettyInfo(message: string, params?: object): void;
    /**
     * Log resource info messages in pretty format.
     *
     * @param message log message
     * @param resourceName resource name
     * @param params additional params for verbose log
     */
    static resourcePrettyInfo(resourceName: string, message: string, params?: object): void;
    /**
     * Log error messages in pretty format.
     *
     * @param message log message
     * @param params additional params for verbose log
     */
    static prettyError(message: string, params?: object): void;
    /**
     * Log warn messages in pretty format.
     *
     * @param message log message
     * @param params additional params for verbose log
     */
    static prettyWarn(message: string, params?: object): void;
}
