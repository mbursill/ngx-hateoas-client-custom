import { NgModule } from '@angular/core';
import { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
import { HateoasResourceService } from './service/external/hateoas-resource.service';
import { ResourceHttpService } from './service/internal/resource-http.service';
import { PagedResourceCollectionHttpService } from './service/internal/paged-resource-collection-http.service';
import { ResourceCollectionHttpService } from './service/internal/resource-collection-http.service';
import { CommonResourceHttpService } from './service/internal/common-resource-http.service';
import { ResourceCacheService } from './service/internal/cache/resource-cache.service';
import * as i0 from "@angular/core";
import * as i1 from "./config/ngx-hateoas-client-configuration.service";
export { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
export { Resource } from './model/resource/resource';
export { EmbeddedResource } from './model/resource/embedded-resource';
export { ResourceCollection } from './model/resource/resource-collection';
export { PagedResourceCollection } from './model/resource/paged-resource-collection';
export { Include, HttpMethod } from './model/declarations';
export { HateoasResourceOperation } from './service/external/hateoas-resource-operation';
export { HateoasResourceService } from './service/external/hateoas-resource.service';
export { HateoasResource, HateoasEmbeddedResource, HateoasProjection, ProjectionRel } from './model/decorators';
export class NgxHateoasClientModule {
    constructor(config) {
    }
    static forRoot() {
        return {
            ngModule: NgxHateoasClientModule,
            providers: [
                NgxHateoasClientConfigurationService,
                CommonResourceHttpService,
                ResourceHttpService,
                ResourceCollectionHttpService,
                PagedResourceCollectionHttpService,
                HateoasResourceService,
                ResourceCacheService
            ]
        };
    }
}
NgxHateoasClientModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientModule, deps: [{ token: i1.NgxHateoasClientConfigurationService }], target: i0.ɵɵFactoryTarget.NgModule });
NgxHateoasClientModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientModule });
NgxHateoasClientModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientModule, imports: [[]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: []
                }]
        }], ctorParameters: function () { return [{ type: i1.NgxHateoasClientConfigurationService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWhhdGVvYXMtY2xpZW50Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1oYXRlb2FzLWNsaWVudC9zcmMvbGliL25neC1oYXRlb2FzLWNsaWVudC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDekcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDckYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDL0UsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDL0csT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDcEcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDNUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saURBQWlELENBQUM7OztBQUV2RixPQUFPLEVBQUUsb0NBQW9DLEVBQUUsTUFBTSxtREFBbUQsQ0FBQztBQUN6RyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDckQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDMUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDckYsT0FBTyxFQUFtQixPQUFPLEVBQUUsVUFBVSxFQUE2RSxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZKLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxlQUFlLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFLaEgsTUFBTSxPQUFPLHNCQUFzQjtJQWdCakMsWUFBWSxNQUE0QztJQUN4RCxDQUFDO0lBaEJELE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTztZQUNMLFFBQVEsRUFBRSxzQkFBc0I7WUFDaEMsU0FBUyxFQUFFO2dCQUNULG9DQUFvQztnQkFDcEMseUJBQXlCO2dCQUN6QixtQkFBbUI7Z0JBQ25CLDZCQUE2QjtnQkFDN0Isa0NBQWtDO2dCQUNsQyxzQkFBc0I7Z0JBQ3RCLG9CQUFvQjthQUNyQjtTQUNGLENBQUM7SUFDSixDQUFDOzttSEFkVSxzQkFBc0I7b0hBQXRCLHNCQUFzQjtvSEFBdEIsc0JBQXNCLFlBRnhCLEVBQUU7MkZBRUEsc0JBQXNCO2tCQUhsQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxFQUFFO2lCQUNaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgTmd4SGF0ZW9hc0NsaWVudENvbmZpZ3VyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9jb25maWcvbmd4LWhhdGVvYXMtY2xpZW50LWNvbmZpZ3VyYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IEhhdGVvYXNSZXNvdXJjZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2UvZXh0ZXJuYWwvaGF0ZW9hcy1yZXNvdXJjZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzb3VyY2VIdHRwU2VydmljZSB9IGZyb20gJy4vc2VydmljZS9pbnRlcm5hbC9yZXNvdXJjZS1odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQYWdlZFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlL2ludGVybmFsL3BhZ2VkLXJlc291cmNlLWNvbGxlY3Rpb24taHR0cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVzb3VyY2VDb2xsZWN0aW9uSHR0cFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2UvaW50ZXJuYWwvcmVzb3VyY2UtY29sbGVjdGlvbi1odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb21tb25SZXNvdXJjZUh0dHBTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlL2ludGVybmFsL2NvbW1vbi1yZXNvdXJjZS1odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUNhY2hlU2VydmljZSB9IGZyb20gJy4vc2VydmljZS9pbnRlcm5hbC9jYWNoZS9yZXNvdXJjZS1jYWNoZS5zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCB7IE5neEhhdGVvYXNDbGllbnRDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4vY29uZmlnL25neC1oYXRlb2FzLWNsaWVudC1jb25maWd1cmF0aW9uLnNlcnZpY2UnO1xyXG5leHBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vbW9kZWwvcmVzb3VyY2UvcmVzb3VyY2UnO1xyXG5leHBvcnQgeyBFbWJlZGRlZFJlc291cmNlIH0gZnJvbSAnLi9tb2RlbC9yZXNvdXJjZS9lbWJlZGRlZC1yZXNvdXJjZSc7XHJcbmV4cG9ydCB7IFJlc291cmNlQ29sbGVjdGlvbiB9IGZyb20gJy4vbW9kZWwvcmVzb3VyY2UvcmVzb3VyY2UtY29sbGVjdGlvbic7XHJcbmV4cG9ydCB7IFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uIH0gZnJvbSAnLi9tb2RlbC9yZXNvdXJjZS9wYWdlZC1yZXNvdXJjZS1jb2xsZWN0aW9uJztcclxuZXhwb3J0IHsgU29ydCwgU29ydE9yZGVyLCBJbmNsdWRlLCBIdHRwTWV0aG9kLCBQcm9qZWN0aW9uUmVsVHlwZSwgR2V0T3B0aW9uLCBQYWdlZEdldE9wdGlvbiwgUmVxdWVzdE9wdGlvbiwgUmVxdWVzdFBhcmFtIH0gZnJvbSAnLi9tb2RlbC9kZWNsYXJhdGlvbnMnO1xyXG5leHBvcnQgeyBIYXRlb2FzUmVzb3VyY2VPcGVyYXRpb24gfSBmcm9tICcuL3NlcnZpY2UvZXh0ZXJuYWwvaGF0ZW9hcy1yZXNvdXJjZS1vcGVyYXRpb24nO1xyXG5leHBvcnQgeyBIYXRlb2FzUmVzb3VyY2VTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlL2V4dGVybmFsL2hhdGVvYXMtcmVzb3VyY2Uuc2VydmljZSc7XHJcbmV4cG9ydCB7IEhhdGVvYXNSZXNvdXJjZSwgSGF0ZW9hc0VtYmVkZGVkUmVzb3VyY2UsIEhhdGVvYXNQcm9qZWN0aW9uLCBQcm9qZWN0aW9uUmVsIH0gZnJvbSAnLi9tb2RlbC9kZWNvcmF0b3JzJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW11cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEhhdGVvYXNDbGllbnRNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Tmd4SGF0ZW9hc0NsaWVudE1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IE5neEhhdGVvYXNDbGllbnRNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIE5neEhhdGVvYXNDbGllbnRDb25maWd1cmF0aW9uU2VydmljZSxcclxuICAgICAgICBDb21tb25SZXNvdXJjZUh0dHBTZXJ2aWNlLFxyXG4gICAgICAgIFJlc291cmNlSHR0cFNlcnZpY2UsXHJcbiAgICAgICAgUmVzb3VyY2VDb2xsZWN0aW9uSHR0cFNlcnZpY2UsXHJcbiAgICAgICAgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb25IdHRwU2VydmljZSxcclxuICAgICAgICBIYXRlb2FzUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgIFJlc291cmNlQ2FjaGVTZXJ2aWNlXHJcbiAgICAgIF1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE5neEhhdGVvYXNDbGllbnRDb25maWd1cmF0aW9uU2VydmljZSkge1xyXG4gIH1cclxuXHJcbn1cclxuIl19