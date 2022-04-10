import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResourceUtils } from '../../util/resource.utils';
import { DependencyInjector } from '../../util/dependency-injector';
import { UrlUtils } from '../../util/url.utils';
import { getResourceType, isResource } from '../../model/resource-type';
import { HttpExecutor } from '../http-executor';
import { LibConfig } from '../../config/lib-config';
import { Stage } from '../../logger/stage.enum';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';
import { toString } from 'lodash-es';
import { CacheKey } from './cache/model/cache-key';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./cache/resource-cache.service";
/**
 * Get instance of the ResourceHttpService by Angular DependencyInjector.
 */
export function getResourceHttpService() {
    return DependencyInjector.get(ResourceHttpService);
}
/**
 * Service to perform HTTP requests to get {@link Resource} type.
 */
export class ResourceHttpService extends HttpExecutor {
    constructor(httpClient, cacheService) {
        super(httpClient, cacheService);
    }
    /**
     * Perform GET request to retrieve resource.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid or returned resource type is not resource
     */
    get(url, options) {
        const httpOptions = UrlUtils.convertToHttpOptions(options);
        return super.getHttp(url, httpOptions, options?.useCache)
            .pipe(map((data) => {
            if (!isResource(data)) {
                if (LibConfig.config.cache.enabled) {
                    this.cacheService.evictResource(CacheKey.of(url, httpOptions));
                }
                const errMsg = `You try to get wrong resource type: expected Resource type, actual ${getResourceType(data)} type.`;
                StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {
                    options,
                    error: errMsg
                });
                throw new Error(errMsg);
            }
            return ResourceUtils.instantiateResource(data, httpOptions?.params?.has('projection'));
        }), catchError(error => observableThrowError(error)));
    }
    /**
     * Perform POST request.
     *
     * @param url to perform request
     * @param body request body
     * @param options request options
     * @throws error when required params are not valid
     */
    post(url, body, options) {
        return super.postHttp(url, body, UrlUtils.convertToHttpOptions(options))
            .pipe(map((data) => {
            if (isResource(data)) {
                return ResourceUtils.instantiateResource(data);
            }
            return data;
        }), catchError(error => observableThrowError(error)));
    }
    /**
     * Perform PUT request.
     *
     * @param url to perform request
     * @param body request body
     * @param options request options
     * @throws error when required params are not valid
     */
    put(url, body, options) {
        return super.putHttp(url, body, UrlUtils.convertToHttpOptions(options))
            .pipe(map((data) => {
            if (isResource(data)) {
                return ResourceUtils.instantiateResource(data);
            }
            return data;
        }), catchError(error => observableThrowError(error)));
    }
    /**
     * Perform PATCH request.
     *
     * @param url to perform request
     * @param body request body
     * @param options request options
     * @throws error when required params are not valid
     */
    patch(url, body, options) {
        return super.patchHttp(url, body, UrlUtils.convertToHttpOptions(options))
            .pipe(map((data) => {
            if (isResource(data)) {
                return ResourceUtils.instantiateResource(data);
            }
            return data;
        }), catchError(error => observableThrowError(error)));
    }
    /**
     * Perform DELETE request.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid
     */
    delete(url, options) {
        return super.deleteHttp(url, {
            ...UrlUtils.convertToHttpOptions(options),
            observe: options?.observe ? options?.observe : 'response'
        })
            .pipe(map((data) => {
            if (isResource(data)) {
                return ResourceUtils.instantiateResource(data);
            }
            return data;
        }), catchError(error => observableThrowError(error)));
    }
    /**
     * Perform get resource request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param id resource id
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    getResource(resourceName, id, options) {
        ValidationUtils.validateInputParams({ resourceName, id });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName).concat('/', toString(id));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', id: '${id}'`,
            options
        });
        return this.get(url, options);
    }
    /**
     * Perform POST resource request with url built by the resource name.
     *
     * @param resourceName to be post
     * @param body resource to create
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    postResource(resourceName, body, options) {
        ValidationUtils.validateInputParams({ resourceName, body });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}'`,
            options
        });
        return this.post(url, body, options);
    }
    /**
     * Perform PATCH resource request with url built by the resource name and resource id.
     *
     * @param resourceName to be patched
     * @param id resource id
     * @param body contains data to patch resource properties
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    patchResource(resourceName, id, body, options) {
        ValidationUtils.validateInputParams({ resourceName, id, body });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, toString(id));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', resourceId: '${id}'`,
            options
        });
        return this.patch(url, body, options);
    }
    /**
     * Perform PUT resource request with url built by the resource name and resource id.
     *
     * @param resourceName to be put
     * @param id resource id
     * @param body contains data to replace resource properties
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    putResource(resourceName, id, body, options) {
        ValidationUtils.validateInputParams({ resourceName, id, body });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, toString(id));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', resourceId: '${id}'`,
            options
        });
        return this.put(url, body, options);
    }
    /**
     * Perform DELETE resource request with url built by the resource name and resource id.
     *
     * @param resourceName to be deleted
     * @param id resource id
     * @param options (optional) additional options that will be applied to the request
     * @throws error when required params are not valid
     */
    deleteResource(resourceName, id, options) {
        ValidationUtils.validateInputParams({ resourceName, id });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, toString(id));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', resourceId: '${id}'`,
            options
        });
        return this.delete(url, options);
    }
    /**
     * Perform search single resource request with url built by the resource name.
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
ResourceHttpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceHttpService, deps: [{ token: i1.HttpClient }, { token: i2.ResourceCacheService }], target: i0.ɵɵFactoryTarget.Injectable });
ResourceHttpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceHttpService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceHttpService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.ResourceCacheService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UtaHR0cC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWhhdGVvYXMtY2xpZW50L3NyYy9saWIvc2VydmljZS9pbnRlcm5hbC9yZXNvdXJjZS1odHRwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsVUFBVSxJQUFJLG9CQUFvQixFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXRFLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXhFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ2hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0seUJBQXlCLENBQUM7Ozs7QUFHbkQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsc0JBQXNCO0lBQ3BDLE9BQU8sa0JBQWtCLENBQUMsR0FBRyxDQUFDLG1CQUFt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LElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7O2dIQTlRVSxtQkFBbUI7b0hBQW5CLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQUQvQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgUmVzb3VyY2VVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvcmVzb3VyY2UudXRpbHMnO1xyXG5pbXBvcnQgeyBCYXNlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9tb2RlbC9yZXNvdXJjZS9iYXNlLXJlc291cmNlJztcclxuaW1wb3J0IHsgRGVwZW5kZW5jeUluamVjdG9yIH0gZnJvbSAnLi4vLi4vdXRpbC9kZXBlbmRlbmN5LWluamVjdG9yJztcclxuaW1wb3J0IHsgVXJsVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3VybC51dGlscyc7XHJcbmltcG9ydCB7IGdldFJlc291cmNlVHlwZSwgaXNSZXNvdXJjZSB9IGZyb20gJy4uLy4uL21vZGVsL3Jlc291cmNlLXR5cGUnO1xyXG5pbXBvcnQgeyBHZXRPcHRpb24sIFJlcXVlc3RPcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbC9kZWNsYXJhdGlvbnMnO1xyXG5pbXBvcnQgeyBIdHRwRXhlY3V0b3IgfSBmcm9tICcuLi9odHRwLWV4ZWN1dG9yJztcclxuaW1wb3J0IHsgTGliQ29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL2xpYi1jb25maWcnO1xyXG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4uLy4uL2xvZ2dlci9zdGFnZS5lbnVtJztcclxuaW1wb3J0IHsgU3RhZ2VMb2dnZXIgfSBmcm9tICcuLi8uLi9sb2dnZXIvc3RhZ2UtbG9nZ2VyJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC92YWxpZGF0aW9uLnV0aWxzJztcclxuaW1wb3J0IHsgdG9TdHJpbmcgfSBmcm9tICdsb2Rhc2gtZXMnO1xyXG5pbXBvcnQgeyBDYWNoZUtleSB9IGZyb20gJy4vY2FjaGUvbW9kZWwvY2FjaGUta2V5JztcclxuaW1wb3J0IHsgUmVzb3VyY2VDYWNoZVNlcnZpY2UgfSBmcm9tICcuL2NhY2hlL3Jlc291cmNlLWNhY2hlLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEdldCBpbnN0YW5jZSBvZiB0aGUgUmVzb3VyY2VIdHRwU2VydmljZSBieSBBbmd1bGFyIERlcGVuZGVuY3lJbmplY3Rvci5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXNvdXJjZUh0dHBTZXJ2aWNlKCk6IFJlc291cmNlSHR0cFNlcnZpY2Uge1xyXG4gIHJldHVybiBEZXBlbmRlbmN5SW5qZWN0b3IuZ2V0KFJlc291cmNlSHR0cFNlcnZpY2UpO1xyXG59XHJcblxyXG4vKipcclxuICogU2VydmljZSB0byBwZXJmb3JtIEhUVFAgcmVxdWVzdHMgdG8gZ2V0IHtAbGluayBSZXNvdXJjZX0gdHlwZS5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJlc291cmNlSHR0cFNlcnZpY2UgZXh0ZW5kcyBIdHRwRXhlY3V0b3Ige1xyXG5cclxuICBjb25zdHJ1Y3RvcihodHRwQ2xpZW50OiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgIGNhY2hlU2VydmljZTogUmVzb3VyY2VDYWNoZVNlcnZpY2UpIHtcclxuICAgIHN1cGVyKGh0dHBDbGllbnQsIGNhY2hlU2VydmljZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtIEdFVCByZXF1ZXN0IHRvIHJldHJpZXZlIHJlc291cmNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVybCB0byBwZXJmb3JtIHJlcXVlc3RcclxuICAgKiBAcGFyYW0gb3B0aW9ucyByZXF1ZXN0IG9wdGlvbnNcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWQgb3IgcmV0dXJuZWQgcmVzb3VyY2UgdHlwZSBpcyBub3QgcmVzb3VyY2VcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBCYXNlUmVzb3VyY2U+KHVybDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEdldE9wdGlvbik6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgY29uc3QgaHR0cE9wdGlvbnMgPSBVcmxVdGlscy5jb252ZXJ0VG9IdHRwT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIHJldHVybiBzdXBlci5nZXRIdHRwKHVybCwgaHR0cE9wdGlvbnMsIG9wdGlvbnM/LnVzZUNhY2hlKVxyXG4gICAgICAucGlwZShcclxuICAgICAgICBtYXAoKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKCFpc1Jlc291cmNlKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGlmIChMaWJDb25maWcuY29uZmlnLmNhY2hlLmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICB0aGlzLmNhY2hlU2VydmljZS5ldmljdFJlc291cmNlKENhY2hlS2V5Lm9mKHVybCwgaHR0cE9wdGlvbnMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBlcnJNc2cgPSBgWW91IHRyeSB0byBnZXQgd3JvbmcgcmVzb3VyY2UgdHlwZTogZXhwZWN0ZWQgUmVzb3VyY2UgdHlwZSwgYWN0dWFsICR7IGdldFJlc291cmNlVHlwZShkYXRhKSB9IHR5cGUuYDtcclxuICAgICAgICAgICAgU3RhZ2VMb2dnZXIuc3RhZ2VFcnJvckxvZyhTdGFnZS5JTklUX1JFU09VUkNFLCB7XHJcbiAgICAgICAgICAgICAgb3B0aW9ucyxcclxuICAgICAgICAgICAgICBlcnJvcjogZXJyTXNnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gUmVzb3VyY2VVdGlscy5pbnN0YW50aWF0ZVJlc291cmNlKGRhdGEsIGh0dHBPcHRpb25zPy5wYXJhbXM/LmhhcygncHJvamVjdGlvbicpKSBhcyBUO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtIFBPU1QgcmVxdWVzdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgdG8gcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIGJvZHkgcmVxdWVzdCBib2R5XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgcmVxdWVzdCBvcHRpb25zXHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIHBvc3QodXJsOiBzdHJpbmcsIGJvZHk6IGFueSB8IG51bGwsIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiBzdXBlci5wb3N0SHR0cCh1cmwsIGJvZHksIFVybFV0aWxzLmNvbnZlcnRUb0h0dHBPcHRpb25zKG9wdGlvbnMpKVxyXG4gICAgICAucGlwZShcclxuICAgICAgICBtYXAoKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGlzUmVzb3VyY2UoZGF0YSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlVXRpbHMuaW5zdGFudGlhdGVSZXNvdXJjZShkYXRhKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBQVVQgcmVxdWVzdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgdG8gcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIGJvZHkgcmVxdWVzdCBib2R5XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgcmVxdWVzdCBvcHRpb25zXHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIHB1dCh1cmw6IHN0cmluZywgYm9keTogYW55IHwgbnVsbCwgb3B0aW9ucz86IFJlcXVlc3RPcHRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHN1cGVyLnB1dEh0dHAodXJsLCBib2R5LCBVcmxVdGlscy5jb252ZXJ0VG9IdHRwT3B0aW9ucyhvcHRpb25zKSlcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgbWFwKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChpc1Jlc291cmNlKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZVV0aWxzLmluc3RhbnRpYXRlUmVzb3VyY2UoZGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICB9KSxcclxuICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSlcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gUEFUQ0ggcmVxdWVzdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgdG8gcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIGJvZHkgcmVxdWVzdCBib2R5XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgcmVxdWVzdCBvcHRpb25zXHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIHBhdGNoKHVybDogc3RyaW5nLCBib2R5OiBhbnkgfCBudWxsLCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gc3VwZXIucGF0Y2hIdHRwKHVybCwgYm9keSwgVXJsVXRpbHMuY29udmVydFRvSHR0cE9wdGlvbnMob3B0aW9ucykpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIG1hcCgoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXNSZXNvdXJjZShkYXRhKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VVdGlscy5pbnN0YW50aWF0ZVJlc291cmNlKGRhdGEpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBERUxFVEUgcmVxdWVzdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgdG8gcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgcmVxdWVzdCBvcHRpb25zXHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIGRlbGV0ZSh1cmw6IHN0cmluZywgb3B0aW9ucz86IFJlcXVlc3RPcHRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHN1cGVyLmRlbGV0ZUh0dHAodXJsLCB7XHJcbiAgICAgIC4uLlVybFV0aWxzLmNvbnZlcnRUb0h0dHBPcHRpb25zKG9wdGlvbnMpLFxyXG4gICAgICBvYnNlcnZlOiBvcHRpb25zPy5vYnNlcnZlID8gb3B0aW9ucz8ub2JzZXJ2ZSA6ICdyZXNwb25zZSdcclxuICAgIH0pXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIG1hcCgoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXNSZXNvdXJjZShkYXRhKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VVdGlscy5pbnN0YW50aWF0ZVJlc291cmNlKGRhdGEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtIGdldCByZXNvdXJjZSByZXF1ZXN0IHdpdGggdXJsIGJ1aWx0IGJ5IHRoZSByZXNvdXJjZSBuYW1lLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlc291cmNlTmFtZSB1c2VkIHRvIGJ1aWxkIHJvb3QgdXJsIHRvIHRoZSByZXNvdXJjZVxyXG4gICAqIEBwYXJhbSBpZCByZXNvdXJjZSBpZFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0UmVzb3VyY2U8VCBleHRlbmRzIEJhc2VSZXNvdXJjZT4ocmVzb3VyY2VOYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBudW1iZXIgfCBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZXNvdXJjZU5hbWUsIGlkfSk7XHJcblxyXG4gICAgY29uc3QgdXJsID0gVXJsVXRpbHMuZ2VuZXJhdGVSZXNvdXJjZVVybChVcmxVdGlscy5nZXRBcGlVcmwoKSwgcmVzb3VyY2VOYW1lKS5jb25jYXQoJy8nLCB0b1N0cmluZyhpZCkpO1xyXG5cclxuICAgIFN0YWdlTG9nZ2VyLnN0YWdlTG9nKFN0YWdlLlBSRVBBUkVfVVJMLCB7XHJcbiAgICAgIHJlc3VsdDogdXJsLFxyXG4gICAgICB1cmxQYXJ0czogYGJhc2VVcmw6ICckeyBVcmxVdGlscy5nZXRBcGlVcmwoKSB9JywgcmVzb3VyY2U6ICckeyByZXNvdXJjZU5hbWUgfScsIGlkOiAnJHsgaWQgfSdgLFxyXG4gICAgICBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5nZXQodXJsLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gUE9TVCByZXNvdXJjZSByZXF1ZXN0IHdpdGggdXJsIGJ1aWx0IGJ5IHRoZSByZXNvdXJjZSBuYW1lLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlc291cmNlTmFtZSB0byBiZSBwb3N0XHJcbiAgICogQHBhcmFtIGJvZHkgcmVzb3VyY2UgdG8gY3JlYXRlXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgYXBwbGllZCB0byB0aGUgcmVxdWVzdFxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwb3N0UmVzb3VyY2UocmVzb3VyY2VOYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBib2R5OiBCYXNlUmVzb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUmVxdWVzdE9wdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VOYW1lLCBib2R5fSk7XHJcblxyXG4gICAgY29uc3QgdXJsID0gVXJsVXRpbHMuZ2VuZXJhdGVSZXNvdXJjZVVybChVcmxVdGlscy5nZXRBcGlVcmwoKSwgcmVzb3VyY2VOYW1lKTtcclxuXHJcbiAgICBTdGFnZUxvZ2dlci5zdGFnZUxvZyhTdGFnZS5QUkVQQVJFX1VSTCwge1xyXG4gICAgICByZXN1bHQ6IHVybCxcclxuICAgICAgdXJsUGFydHM6IGBiYXNlVXJsOiAnJHsgVXJsVXRpbHMuZ2V0QXBpVXJsKCkgfScsIHJlc291cmNlOiAnJHsgcmVzb3VyY2VOYW1lIH0nYCxcclxuICAgICAgb3B0aW9uc1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucG9zdCh1cmwsIGJvZHksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBQQVRDSCByZXNvdXJjZSByZXF1ZXN0IHdpdGggdXJsIGJ1aWx0IGJ5IHRoZSByZXNvdXJjZSBuYW1lIGFuZCByZXNvdXJjZSBpZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZXNvdXJjZU5hbWUgdG8gYmUgcGF0Y2hlZFxyXG4gICAqIEBwYXJhbSBpZCByZXNvdXJjZSBpZFxyXG4gICAqIEBwYXJhbSBib2R5IGNvbnRhaW5zIGRhdGEgdG8gcGF0Y2ggcmVzb3VyY2UgcHJvcGVydGllc1xyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgcGF0Y2hSZXNvdXJjZShyZXNvdXJjZU5hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICBpZDogbnVtYmVyIHwgc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUmVxdWVzdE9wdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VOYW1lLCBpZCwgYm9keX0pO1xyXG5cclxuICAgIGNvbnN0IHVybCA9IFVybFV0aWxzLmdlbmVyYXRlUmVzb3VyY2VVcmwoVXJsVXRpbHMuZ2V0QXBpVXJsKCksIHJlc291cmNlTmFtZSwgdG9TdHJpbmcoaWQpKTtcclxuXHJcbiAgICBTdGFnZUxvZ2dlci5zdGFnZUxvZyhTdGFnZS5QUkVQQVJFX1VSTCwge1xyXG4gICAgICByZXN1bHQ6IHVybCxcclxuICAgICAgdXJsUGFydHM6IGBiYXNlVXJsOiAnJHsgVXJsVXRpbHMuZ2V0QXBpVXJsKCkgfScsIHJlc291cmNlOiAnJHsgcmVzb3VyY2VOYW1lIH0nLCByZXNvdXJjZUlkOiAnJHsgaWQgfSdgLFxyXG4gICAgICBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5wYXRjaCh1cmwsIGJvZHksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBQVVQgcmVzb3VyY2UgcmVxdWVzdCB3aXRoIHVybCBidWlsdCBieSB0aGUgcmVzb3VyY2UgbmFtZSBhbmQgcmVzb3VyY2UgaWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVzb3VyY2VOYW1lIHRvIGJlIHB1dFxyXG4gICAqIEBwYXJhbSBpZCByZXNvdXJjZSBpZFxyXG4gICAqIEBwYXJhbSBib2R5IGNvbnRhaW5zIGRhdGEgdG8gcmVwbGFjZSByZXNvdXJjZSBwcm9wZXJ0aWVzXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgYXBwbGllZCB0byB0aGUgcmVxdWVzdFxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwdXRSZXNvdXJjZShyZXNvdXJjZU5hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgaWQ6IG51bWJlciB8IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgYm9keTogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUmVxdWVzdE9wdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VOYW1lLCBpZCwgYm9keX0pO1xyXG5cclxuICAgIGNvbnN0IHVybCA9IFVybFV0aWxzLmdlbmVyYXRlUmVzb3VyY2VVcmwoVXJsVXRpbHMuZ2V0QXBpVXJsKCksIHJlc291cmNlTmFtZSwgdG9TdHJpbmcoaWQpKTtcclxuXHJcbiAgICBTdGFnZUxvZ2dlci5zdGFnZUxvZyhTdGFnZS5QUkVQQVJFX1VSTCwge1xyXG4gICAgICByZXN1bHQ6IHVybCxcclxuICAgICAgdXJsUGFydHM6IGBiYXNlVXJsOiAnJHsgVXJsVXRpbHMuZ2V0QXBpVXJsKCkgfScsIHJlc291cmNlOiAnJHsgcmVzb3VyY2VOYW1lIH0nLCByZXNvdXJjZUlkOiAnJHsgaWQgfSdgLFxyXG4gICAgICBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5wdXQodXJsLCBib2R5LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gREVMRVRFIHJlc291cmNlIHJlcXVlc3Qgd2l0aCB1cmwgYnVpbHQgYnkgdGhlIHJlc291cmNlIG5hbWUgYW5kIHJlc291cmNlIGlkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlc291cmNlTmFtZSB0byBiZSBkZWxldGVkXHJcbiAgICogQHBhcmFtIGlkIHJlc291cmNlIGlkXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBhZGRpdGlvbmFsIG9wdGlvbnMgdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgZGVsZXRlUmVzb3VyY2UocmVzb3VyY2VOYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBudW1iZXIgfCBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZXNvdXJjZU5hbWUsIGlkfSk7XHJcblxyXG4gICAgY29uc3QgdXJsID0gVXJsVXRpbHMuZ2VuZXJhdGVSZXNvdXJjZVVybChVcmxVdGlscy5nZXRBcGlVcmwoKSwgcmVzb3VyY2VOYW1lLCB0b1N0cmluZyhpZCkpO1xyXG5cclxuICAgIFN0YWdlTG9nZ2VyLnN0YWdlTG9nKFN0YWdlLlBSRVBBUkVfVVJMLCB7XHJcbiAgICAgIHJlc3VsdDogdXJsLFxyXG4gICAgICB1cmxQYXJ0czogYGJhc2VVcmw6ICckeyBVcmxVdGlscy5nZXRBcGlVcmwoKSB9JywgcmVzb3VyY2U6ICckeyByZXNvdXJjZU5hbWUgfScsIHJlc291cmNlSWQ6ICckeyBpZCB9J2AsXHJcbiAgICAgIG9wdGlvbnNcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmRlbGV0ZSh1cmwsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBzZWFyY2ggc2luZ2xlIHJlc291cmNlIHJlcXVlc3Qgd2l0aCB1cmwgYnVpbHQgYnkgdGhlIHJlc291cmNlIG5hbWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVzb3VyY2VOYW1lIHVzZWQgdG8gYnVpbGQgcm9vdCB1cmwgdG8gdGhlIHJlc291cmNlXHJcbiAgICogQHBhcmFtIHNlYXJjaFF1ZXJ5IG5hbWUgb2YgdGhlIHNlYXJjaCBtZXRob2RcclxuICAgKiBAcGFyYW0gb3B0aW9ucyAob3B0aW9uYWwpIG9wdGlvbnMgdGhhdCBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIHNlYXJjaDxUIGV4dGVuZHMgQmFzZVJlc291cmNlPihyZXNvdXJjZU5hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogR2V0T3B0aW9uKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VOYW1lLCBzZWFyY2hRdWVyeX0pO1xyXG5cclxuICAgIGNvbnN0IHVybCA9IFVybFV0aWxzLmdlbmVyYXRlUmVzb3VyY2VVcmwoVXJsVXRpbHMuZ2V0QXBpVXJsKCksIHJlc291cmNlTmFtZSkuY29uY2F0KCcvc2VhcmNoLycgKyBzZWFyY2hRdWVyeSk7XHJcblxyXG4gICAgU3RhZ2VMb2dnZXIuc3RhZ2VMb2coU3RhZ2UuUFJFUEFSRV9VUkwsIHtcclxuICAgICAgcmVzdWx0OiB1cmwsXHJcbiAgICAgIHVybFBhcnRzOiBgYmFzZVVybDogJyR7IFVybFV0aWxzLmdldEFwaVVybCgpIH0nLCByZXNvdXJjZTogJyR7IHJlc291cmNlTmFtZSB9Jywgc2VhcmNoUXVlcnk6ICckeyBzZWFyY2hRdWVyeSB9J2AsXHJcbiAgICAgIG9wdGlvbnNcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmdldCh1cmwsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19