import { ModuleWithProviders } from '@angular/core';
import { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
import * as i0 from "@angular/core";
export { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
export { Resource } from './model/resource/resource';
export { EmbeddedResource } from './model/resource/embedded-resource';
export { ResourceCollection } from './model/resource/resource-collection';
export { PagedResourceCollection } from './model/resource/paged-resource-collection';
export { Sort, SortOrder, Include, HttpMethod, ProjectionRelType, GetOption, PagedGetOption, RequestOption, RequestParam } from './model/declarations';
export { HateoasResourceOperation } from './service/external/hateoas-resource-operation';
export { HateoasResourceService } from './service/external/hateoas-resource.service';
export { HateoasResource, HateoasEmbeddedResource, HateoasProjection, ProjectionRel } from './model/decorators';
export declare class NgxHateoasClientModule {
    static forRoot(): ModuleWithProviders<NgxHateoasClientModule>;
    constructor(config: NgxHateoasClientConfigurationService);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxHateoasClientModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NgxHateoasClientModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NgxHateoasClientModule>;
}
