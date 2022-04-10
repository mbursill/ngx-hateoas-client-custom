import { Injectable } from '@angular/core';
import { LibConfig } from '../../config/lib-config';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getResourceType, isResourceCollection } from '../../model/resource-type';
import { ResourceUtils } from '../../util/resource.utils';
import { DependencyInjector } from '../../util/dependency-injector';
import { UrlUtils } from '../../util/url.utils';
import { HttpExecutor } from '../http-executor';
import { StageLogger } from '../../logger/stage-logger';
import { Stage } from '../../logger/stage.enum';
import { ValidationUtils } from '../../util/validation.utils';
import { CacheKey } from './cache/model/cache-key';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./cache/resource-cache.service";
export function getResourceCollectionHttpService() {
    return DependencyInjector.get(ResourceCollectionHttpService);
}
/**
 * Service to perform HTTP requests to get {@link ResourceCollection} type.
 */
export class ResourceCollectionHttpService extends HttpExecutor {
    constructor(httpClient, cacheService) {
        super(httpClient, cacheService);
    }
    /**
     * Perform GET request to retrieve collection of the resources.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid or returned resource type is not collection of the resources
     */
    get(url, options) {
        const httpOptions = UrlUtils.convertToHttpOptions(options);
        return super.getHttp(url, httpOptions)
            .pipe(map((data) => {
            if (!isResourceCollection(data)) {
                if (LibConfig.config.cache.enabled) {
                    this.cacheService.evictResource(CacheKey.of(url, httpOptions));
                }
                const errMsg = `You try to get the wrong resource type: expected ResourceCollection type, actual ${getResourceType(data)} type.`;
                StageLogger.stageErrorLog(Stage.INIT_RESOURCE, { error: errMsg, options });
                throw new Error(errMsg);
            }
            return ResourceUtils.instantiateResourceCollection(data, httpOptions?.params?.has('projection'));
        }), catchError(error => observableThrowError(error)));
    }
    /**
     * Perform get resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    getResourceCollection(resourceName, options) {
        ValidationUtils.validateInputParams({ resourceName });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}'`,
            options
        });
        return this.get(url, options);
    }
    /**
     *  Perform search resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param searchQuery name of the search method
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    search(resourceName, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceName, searchQuery });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName).concat('/search/' + searchQuery);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', searchQuery: '${searchQuery}'`,
            options
        });
        return this.get(url, options);
    }
}
ResourceCollectionHttpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceCollectionHttpService, deps: [{ token: i1.HttpClient }, { token: i2.ResourceCacheService }], target: i0.ɵɵFactoryTarget.Injectable });
ResourceCollectionHttpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceCollectionHttpService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceCollectionHttpService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.ResourceCacheService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UtY29sbGVjdGlvbi1odHRwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaGF0ZW9hcy1jbGllbnQvc3JjL2xpYi9zZXJ2aWNlL2ludGVybmFsL3Jlc291cmNlLWNvbGxlY3Rpb24taHR0cC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3BELE9BQU8sRUFBYyxVQUFVLElBQUksb0JBQW9CLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsZUFBZSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRzFELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRXBFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHlCQUF5QixDQUFDOzs7O0FBR25ELE1BQU0sVUFBVSxnQ0FBZ0M7SUFDOUMsT0FBTyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUQ7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RkFBN0IsNkJBQTZCO2tCQUR6QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBMaWJDb25maWcgfSBmcm9tICcuLi8uLi9jb25maWcvbGliLWNvbmZpZyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBnZXRSZXNvdXJjZVR5cGUsIGlzUmVzb3VyY2VDb2xsZWN0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWwvcmVzb3VyY2UtdHlwZSc7XHJcbmltcG9ydCB7IFJlc291cmNlVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3Jlc291cmNlLnV0aWxzJztcclxuaW1wb3J0IHsgUmVzb3VyY2VDb2xsZWN0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWwvcmVzb3VyY2UvcmVzb3VyY2UtY29sbGVjdGlvbic7XHJcbmltcG9ydCB7IEJhc2VSZXNvdXJjZSB9IGZyb20gJy4uLy4uL21vZGVsL3Jlc291cmNlL2Jhc2UtcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBEZXBlbmRlbmN5SW5qZWN0b3IgfSBmcm9tICcuLi8uLi91dGlsL2RlcGVuZGVuY3ktaW5qZWN0b3InO1xyXG5pbXBvcnQgeyBHZXRPcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbC9kZWNsYXJhdGlvbnMnO1xyXG5pbXBvcnQgeyBVcmxVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvdXJsLnV0aWxzJztcclxuaW1wb3J0IHsgSHR0cEV4ZWN1dG9yIH0gZnJvbSAnLi4vaHR0cC1leGVjdXRvcic7XHJcbmltcG9ydCB7IFN0YWdlTG9nZ2VyIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL3N0YWdlLWxvZ2dlcic7XHJcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL3N0YWdlLmVudW0nO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3ZhbGlkYXRpb24udXRpbHMnO1xyXG5pbXBvcnQgeyBDYWNoZUtleSB9IGZyb20gJy4vY2FjaGUvbW9kZWwvY2FjaGUta2V5JztcclxuaW1wb3J0IHsgUmVzb3VyY2VDYWNoZVNlcnZpY2UgfSBmcm9tICcuL2NhY2hlL3Jlc291cmNlLWNhY2hlLnNlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlKCk6IFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlIHtcclxuICByZXR1cm4gRGVwZW5kZW5jeUluamVjdG9yLmdldChSZXNvdXJjZUNvbGxlY3Rpb25IdHRwU2VydmljZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHRvIHBlcmZvcm0gSFRUUCByZXF1ZXN0cyB0byBnZXQge0BsaW5rIFJlc291cmNlQ29sbGVjdGlvbn0gdHlwZS5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlIGV4dGVuZHMgSHR0cEV4ZWN1dG9yIHtcclxuXHJcbiAgY29uc3RydWN0b3IoaHR0cENsaWVudDogSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICBjYWNoZVNlcnZpY2U6IFJlc291cmNlQ2FjaGVTZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihodHRwQ2xpZW50LCBjYWNoZVNlcnZpY2UpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBHRVQgcmVxdWVzdCB0byByZXRyaWV2ZSBjb2xsZWN0aW9uIG9mIHRoZSByZXNvdXJjZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXJsIHRvIHBlcmZvcm0gcmVxdWVzdFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIHJlcXVlc3Qgb3B0aW9uc1xyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZCBvciByZXR1cm5lZCByZXNvdXJjZSB0eXBlIGlzIG5vdCBjb2xsZWN0aW9uIG9mIHRoZSByZXNvdXJjZXNcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBSZXNvdXJjZUNvbGxlY3Rpb248QmFzZVJlc291cmNlPj4odXJsOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IGh0dHBPcHRpb25zID0gVXJsVXRpbHMuY29udmVydFRvSHR0cE9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gICAgcmV0dXJuIHN1cGVyLmdldEh0dHAodXJsLCBodHRwT3B0aW9ucylcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgbWFwKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmICghaXNSZXNvdXJjZUNvbGxlY3Rpb24oZGF0YSkpIHtcclxuICAgICAgICAgICAgaWYgKExpYkNvbmZpZy5jb25maWcuY2FjaGUuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuY2FjaGVTZXJ2aWNlLmV2aWN0UmVzb3VyY2UoQ2FjaGVLZXkub2YodXJsLCBodHRwT3B0aW9ucykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVyck1zZyA9IGBZb3UgdHJ5IHRvIGdldCB0aGUgd3JvbmcgcmVzb3VyY2UgdHlwZTogZXhwZWN0ZWQgUmVzb3VyY2VDb2xsZWN0aW9uIHR5cGUsIGFjdHVhbCAkeyBnZXRSZXNvdXJjZVR5cGUoZGF0YSkgfSB0eXBlLmA7XHJcbiAgICAgICAgICAgIFN0YWdlTG9nZ2VyLnN0YWdlRXJyb3JMb2coU3RhZ2UuSU5JVF9SRVNPVVJDRSwge2Vycm9yOiBlcnJNc2csIG9wdGlvbnN9KTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIFJlc291cmNlVXRpbHMuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24oZGF0YSwgaHR0cE9wdGlvbnM/LnBhcmFtcz8uaGFzKCdwcm9qZWN0aW9uJykpIGFzIFQ7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gZ2V0IHJlc291cmNlIGNvbGxlY3Rpb24gcmVxdWVzdCB3aXRoIHVybCBidWlsdCBieSB0aGUgcmVzb3VyY2UgbmFtZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZXNvdXJjZU5hbWUgdXNlZCB0byBidWlsZCByb290IHVybCB0byB0aGUgcmVzb3VyY2VcclxuICAgKiBAcGFyYW0gb3B0aW9ucyAob3B0aW9uYWwpIG9wdGlvbnMgdGhhdCBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIGdldFJlc291cmNlQ29sbGVjdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2VDb2xsZWN0aW9uPEJhc2VSZXNvdXJjZT4+KHJlc291cmNlTmFtZTogc3RyaW5nLCBvcHRpb25zPzogR2V0T3B0aW9uKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VOYW1lfSk7XHJcblxyXG4gICAgY29uc3QgdXJsID0gVXJsVXRpbHMuZ2VuZXJhdGVSZXNvdXJjZVVybChVcmxVdGlscy5nZXRBcGlVcmwoKSwgcmVzb3VyY2VOYW1lKTtcclxuXHJcbiAgICBTdGFnZUxvZ2dlci5zdGFnZUxvZyhTdGFnZS5QUkVQQVJFX1VSTCwge1xyXG4gICAgICByZXN1bHQ6IHVybCxcclxuICAgICAgdXJsUGFydHM6IGBiYXNlVXJsOiAnJHsgVXJsVXRpbHMuZ2V0QXBpVXJsKCkgfScsIHJlc291cmNlOiAnJHsgcmVzb3VyY2VOYW1lIH0nYCxcclxuICAgICAgb3B0aW9uc1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0KHVybCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgUGVyZm9ybSBzZWFyY2ggcmVzb3VyY2UgY29sbGVjdGlvbiByZXF1ZXN0IHdpdGggdXJsIGJ1aWx0IGJ5IHRoZSByZXNvdXJjZSBuYW1lLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlc291cmNlTmFtZSB1c2VkIHRvIGJ1aWxkIHJvb3QgdXJsIHRvIHRoZSByZXNvdXJjZVxyXG4gICAqIEBwYXJhbSBzZWFyY2hRdWVyeSBuYW1lIG9mIHRoZSBzZWFyY2ggbWV0aG9kXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgYXBwbGllZCB0byB0aGUgcmVxdWVzdFxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZWFyY2g8VCBleHRlbmRzIFJlc291cmNlQ29sbGVjdGlvbjxCYXNlUmVzb3VyY2U+PihyZXNvdXJjZU5hbWU6IHN0cmluZywgc2VhcmNoUXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEdldE9wdGlvbik6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3Jlc291cmNlTmFtZSwgc2VhcmNoUXVlcnl9KTtcclxuXHJcbiAgICBjb25zdCB1cmwgPSBVcmxVdGlscy5nZW5lcmF0ZVJlc291cmNlVXJsKFVybFV0aWxzLmdldEFwaVVybCgpLCByZXNvdXJjZU5hbWUpLmNvbmNhdCgnL3NlYXJjaC8nICsgc2VhcmNoUXVlcnkpO1xyXG5cclxuICAgIFN0YWdlTG9nZ2VyLnN0YWdlTG9nKFN0YWdlLlBSRVBBUkVfVVJMLCB7XHJcbiAgICAgIHJlc3VsdDogdXJsLFxyXG4gICAgICB1cmxQYXJ0czogYGJhc2VVcmw6ICckeyBVcmxVdGlscy5nZXRBcGlVcmwoKSB9JywgcmVzb3VyY2U6ICckeyByZXNvdXJjZU5hbWUgfScsIHNlYXJjaFF1ZXJ5OiAnJHsgc2VhcmNoUXVlcnkgfSdgLFxyXG4gICAgICBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5nZXQodXJsLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==