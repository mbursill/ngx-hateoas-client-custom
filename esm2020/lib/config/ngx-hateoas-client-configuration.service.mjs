import { Injectable } from '@angular/core';
import { DependencyInjector } from '../util/dependency-injector';
import { LibConfig } from './lib-config';
import { ConsoleLogger } from '../logger/console-logger';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../model/resource/resource';
import { ResourceCollection } from '../model/resource/resource-collection';
import { EmbeddedResource } from '../model/resource/embedded-resource';
import { PagedResourceCollection } from '../model/resource/paged-resource-collection';
import { ValidationUtils } from '../util/validation.utils';
import * as i0 from "@angular/core";
/**
 * This service for configuration library.
 *
 * You should inject this service in your main AppModule and pass
 * configuration using {@link #configure()} method.
 */
export class NgxHateoasClientConfigurationService {
    constructor(injector) {
        this.injector = injector;
        DependencyInjector.injector = injector;
        // Setting resource types to prevent circular dependencies
        ResourceUtils.useResourceType(Resource);
        ResourceUtils.useResourceCollectionType(ResourceCollection);
        ResourceUtils.usePagedResourceCollectionType(PagedResourceCollection);
        ResourceUtils.useEmbeddedResourceType(EmbeddedResource);
    }
    /**
     * Configure library with client params.
     *
     * @param config suitable client properties needed to properly library work
     */
    configure(config) {
        ValidationUtils.validateInputParams({ config, baseApi: config?.http?.rootUrl });
        LibConfig.setConfig(config);
        ConsoleLogger.prettyInfo('HateoasClient was configured with options', {
            rootUrl: config.http.rootUrl
        });
    }
}
NgxHateoasClientConfigurationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientConfigurationService, deps: [{ token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
NgxHateoasClientConfigurationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientConfigurationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientConfigurationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.Injector }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWhhdGVvYXMtY2xpZW50LWNvbmZpZ3VyYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1oYXRlb2FzLWNsaWVudC9zcmMvbGliL2NvbmZpZy9uZ3gtaGF0ZW9hcy1jbGllbnQtY29uZmlndXJhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDakUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUN0RixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7O0FBRTNEOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLG9DQUFvQztJQUUvQyxZQUFvQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3BDLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDdkMsMERBQTBEO1FBQzFELGFBQWEsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDNUQsYUFBYSxDQUFDLDhCQUE4QixDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDdEUsYUFBYSxDQUFDLHVCQUF1QixDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxTQUFTLENBQUMsTUFBNEI7UUFDM0MsZUFBZSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFFOUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU1QixhQUFhLENBQUMsVUFBVSxDQUFDLDJDQUEyQyxFQUFFO1lBQ3BFLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU87U0FDN0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7aUlBeEJVLG9DQUFvQztxSUFBcEMsb0NBQW9DOzJGQUFwQyxvQ0FBb0M7a0JBRGhELFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEZXBlbmRlbmN5SW5qZWN0b3IgfSBmcm9tICcuLi91dGlsL2RlcGVuZGVuY3ktaW5qZWN0b3InO1xyXG5pbXBvcnQgeyBMaWJDb25maWcgfSBmcm9tICcuL2xpYi1jb25maWcnO1xyXG5pbXBvcnQgeyBIYXRlb2FzQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vaGF0ZW9hcy1jb25maWd1cmF0aW9uLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IENvbnNvbGVMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvY29uc29sZS1sb2dnZXInO1xyXG5pbXBvcnQgeyBSZXNvdXJjZVV0aWxzIH0gZnJvbSAnLi4vdXRpbC9yZXNvdXJjZS51dGlscyc7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi4vbW9kZWwvcmVzb3VyY2UvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9tb2RlbC9yZXNvdXJjZS9yZXNvdXJjZS1jb2xsZWN0aW9uJztcclxuaW1wb3J0IHsgRW1iZWRkZWRSZXNvdXJjZSB9IGZyb20gJy4uL21vZGVsL3Jlc291cmNlL2VtYmVkZGVkLXJlc291cmNlJztcclxuaW1wb3J0IHsgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9tb2RlbC9yZXNvdXJjZS9wYWdlZC1yZXNvdXJjZS1jb2xsZWN0aW9uJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblV0aWxzIH0gZnJvbSAnLi4vdXRpbC92YWxpZGF0aW9uLnV0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBUaGlzIHNlcnZpY2UgZm9yIGNvbmZpZ3VyYXRpb24gbGlicmFyeS5cclxuICpcclxuICogWW91IHNob3VsZCBpbmplY3QgdGhpcyBzZXJ2aWNlIGluIHlvdXIgbWFpbiBBcHBNb2R1bGUgYW5kIHBhc3NcclxuICogY29uZmlndXJhdGlvbiB1c2luZyB7QGxpbmsgI2NvbmZpZ3VyZSgpfSBtZXRob2QuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBOZ3hIYXRlb2FzQ2xpZW50Q29uZmlndXJhdGlvblNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGluamVjdG9yOiBJbmplY3Rvcikge1xyXG4gICAgRGVwZW5kZW5jeUluamVjdG9yLmluamVjdG9yID0gaW5qZWN0b3I7XHJcbiAgICAvLyBTZXR0aW5nIHJlc291cmNlIHR5cGVzIHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzXHJcbiAgICBSZXNvdXJjZVV0aWxzLnVzZVJlc291cmNlVHlwZShSZXNvdXJjZSk7XHJcbiAgICBSZXNvdXJjZVV0aWxzLnVzZVJlc291cmNlQ29sbGVjdGlvblR5cGUoUmVzb3VyY2VDb2xsZWN0aW9uKTtcclxuICAgIFJlc291cmNlVXRpbHMudXNlUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb25UeXBlKFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uKTtcclxuICAgIFJlc291cmNlVXRpbHMudXNlRW1iZWRkZWRSZXNvdXJjZVR5cGUoRW1iZWRkZWRSZXNvdXJjZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb25maWd1cmUgbGlicmFyeSB3aXRoIGNsaWVudCBwYXJhbXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29uZmlnIHN1aXRhYmxlIGNsaWVudCBwcm9wZXJ0aWVzIG5lZWRlZCB0byBwcm9wZXJseSBsaWJyYXJ5IHdvcmtcclxuICAgKi9cclxuICBwdWJsaWMgY29uZmlndXJlKGNvbmZpZzogSGF0ZW9hc0NvbmZpZ3VyYXRpb24pOiB2b2lkIHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtjb25maWcsIGJhc2VBcGk6IGNvbmZpZz8uaHR0cD8ucm9vdFVybH0pO1xyXG5cclxuICAgIExpYkNvbmZpZy5zZXRDb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBDb25zb2xlTG9nZ2VyLnByZXR0eUluZm8oJ0hhdGVvYXNDbGllbnQgd2FzIGNvbmZpZ3VyZWQgd2l0aCBvcHRpb25zJywge1xyXG4gICAgICByb290VXJsOiBjb25maWcuaHR0cC5yb290VXJsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==