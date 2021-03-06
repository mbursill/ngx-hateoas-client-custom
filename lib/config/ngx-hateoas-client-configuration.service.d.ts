import { Injector } from '@angular/core';
import { HateoasConfiguration } from './hateoas-configuration.interface';
import * as i0 from "@angular/core";
/**
 * This service for configuration library.
 *
 * You should inject this service in your main AppModule and pass
 * configuration using {@link #configure()} method.
 */
export declare class NgxHateoasClientConfigurationService {
    private injector;
    constructor(injector: Injector);
    /**
     * Configure library with client params.
     *
     * @param config suitable client properties needed to properly library work
     */
    configure(config: HateoasConfiguration): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxHateoasClientConfigurationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxHateoasClientConfigurationService>;
}
