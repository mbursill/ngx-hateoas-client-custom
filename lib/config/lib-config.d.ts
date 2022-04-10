import { HateoasConfiguration } from './hateoas-configuration.interface';
/**
 * Contains all configuration lib params.
 */
export declare class LibConfig {
    static readonly DEFAULT_CONFIG: {
        http: {
            rootUrl: string;
        };
        logs: {
            verboseLogs: boolean;
        };
        cache: {
            enabled: boolean;
            lifeTime: number;
        };
        useTypes: {
            resources: any[];
        };
        pagination: {
            defaultPage: {
                size: number;
                page: number;
            };
        };
        isProduction: boolean;
    };
    static config: HateoasConfiguration;
    static setConfig(hateoasConfiguration: HateoasConfiguration): void;
}
