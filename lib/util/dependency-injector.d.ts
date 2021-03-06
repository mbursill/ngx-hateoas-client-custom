import { Injector, Type } from '@angular/core';
/**
 * Holds dependency injector to allow use ше in internal the lib classes.
 */
export declare class DependencyInjector {
    private static _injector;
    static get<T>(type: Type<T>): T;
    static set injector(value: Injector);
}
