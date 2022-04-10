import { Injectable } from '@angular/core';
import { LibConfig } from '../../config/lib-config';
import { catchError, map } from 'rxjs/operators';
import { getResourceType, isPagedResourceCollection } from '../../model/resource-type';
import { throwError as observableThrowError } from 'rxjs';
import { ResourceUtils } from '../../util/resource.utils';
import { UrlUtils } from '../../util/url.utils';
import { DependencyInjector } from '../../util/dependency-injector';
import { HttpExecutor } from '../http-executor';
import { StageLogger } from '../../logger/stage-logger';
import { Stage } from '../../logger/stage.enum';
import { ValidationUtils } from '../../util/validation.utils';
import { CacheKey } from './cache/model/cache-key';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./cache/resource-cache.service";
/**
 * Get instance of the PagedResourceCollectionHttpService by Angular DependencyInjector.
 */
export function getPagedResourceCollectionHttpService() {
    return DependencyInjector.get(PagedResourceCollectionHttpService);
}
/**
 * Service to perform HTTP requests to get {@link PagedResourceCollection} type.
 */
export class PagedResourceCollectionHttpService extends HttpExecutor {
    constructor(httpClient, cacheService) {
        super(httpClient, cacheService);
    }
    /**
     * Perform GET request to retrieve paged collection of the resources.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid or returned resource type is not paged collection of the resources
     */
    get(url, options) {
        const httpOptions = UrlUtils.convertToHttpOptions(options);
        return super.getHttp(url, httpOptions, options?.useCache)
            .pipe(map((data) => {
            if (!isPagedResourceCollection(data)) {
                if (LibConfig.config.cache.enabled) {
                    this.cacheService.evictResource(CacheKey.of(url, httpOptions));
                }
                const errMsg = `You try to get wrong resource type: expected PagedResourceCollection type, actual ${getResourceType(data)} type.`;
                StageLogger.stageErrorLog(Stage.INIT_RESOURCE, { error: errMsg, options });
                throw new Error(errMsg);
            }
            return ResourceUtils.instantiatePagedResourceCollection(data, httpOptions?.params?.has('projection'));
        }), catchError(error => observableThrowError(error)));
    }
    /**
     * Perform get paged resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    getResourcePage(resourceName, options) {
        ValidationUtils.validateInputParams({ resourceName });
        const url = UrlUtils.removeTemplateParams(UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}'`,
            options
        });
        return this.get(url, UrlUtils.fillDefaultPageDataIfNoPresent(options));
    }
    /**
     *  Perform search paged resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param searchQuery name of the search method
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    search(resourceName, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceName, searchQuery });
        const url = UrlUtils.removeTemplateParams(UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName)).concat('/search/' + searchQuery);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}'`,
            options
        });
        return this.get(url, UrlUtils.fillDefaultPageDataIfNoPresent(options));
    }
}
PagedResourceCollectionHttpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: PagedResourceCollectionHttpService, deps: [{ token: i1.HttpClient }, { token: i2.ResourceCacheService }], target: i0.ɵɵFactoryTarget.Injectable });
PagedResourceCollectionHttpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: PagedResourceCollectionHttpService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: PagedResourceCollectionHttpService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.ResourceCacheService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZWQtcmVzb3VyY2UtY29sbGVjdGlvbi1odHRwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaGF0ZW9hcy1jbGllbnQvc3JjL2xpYi9zZXJ2aWNlL2ludGVybmFsL3BhZ2VkLXJlc291cmNlLWNvbGxlY3Rpb24taHR0cC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXBELE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUFFLGVBQWUsRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3ZGLE9BQU8sRUFBYyxVQUFVLElBQUksb0JBQW9CLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVwRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHlCQUF5QixDQUFDOzs7O0FBR25EOztHQUVHO0FBQ0gsTUFBTSxVQUFVLHFDQUFxQztJQUNuRCxPQUFPLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FB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QU87U0FDUixDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7OytIQWhGVSxrQ0FBa0M7bUlBQWxDLGtDQUFrQzsyRkFBbEMsa0NBQWtDO2tCQUQ5QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCYXNlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9tb2RlbC9yZXNvdXJjZS9iYXNlLXJlc291cmNlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgTGliQ29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL2xpYi1jb25maWcnO1xyXG5pbXBvcnQgeyBQYWdlZFJlc291cmNlQ29sbGVjdGlvbiB9IGZyb20gJy4uLy4uL21vZGVsL3Jlc291cmNlL3BhZ2VkLXJlc291cmNlLWNvbGxlY3Rpb24nO1xyXG5pbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IGdldFJlc291cmNlVHlwZSwgaXNQYWdlZFJlc291cmNlQ29sbGVjdGlvbiB9IGZyb20gJy4uLy4uL21vZGVsL3Jlc291cmNlLXR5cGUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc291cmNlVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3Jlc291cmNlLnV0aWxzJztcclxuaW1wb3J0IHsgVXJsVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3VybC51dGlscyc7XHJcbmltcG9ydCB7IERlcGVuZGVuY3lJbmplY3RvciB9IGZyb20gJy4uLy4uL3V0aWwvZGVwZW5kZW5jeS1pbmplY3Rvcic7XHJcbmltcG9ydCB7IFBhZ2VkR2V0T3B0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWwvZGVjbGFyYXRpb25zJztcclxuaW1wb3J0IHsgSHR0cEV4ZWN1dG9yIH0gZnJvbSAnLi4vaHR0cC1leGVjdXRvcic7XHJcbmltcG9ydCB7IFN0YWdlTG9nZ2VyIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL3N0YWdlLWxvZ2dlcic7XHJcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL3N0YWdlLmVudW0nO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3ZhbGlkYXRpb24udXRpbHMnO1xyXG5pbXBvcnQgeyBDYWNoZUtleSB9IGZyb20gJy4vY2FjaGUvbW9kZWwvY2FjaGUta2V5JztcclxuaW1wb3J0IHsgUmVzb3VyY2VDYWNoZVNlcnZpY2UgfSBmcm9tICcuL2NhY2hlL3Jlc291cmNlLWNhY2hlLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEdldCBpbnN0YW5jZSBvZiB0aGUgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb25IdHRwU2VydmljZSBieSBBbmd1bGFyIERlcGVuZGVuY3lJbmplY3Rvci5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWdlZFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlKCk6IFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uSHR0cFNlcnZpY2Uge1xyXG4gIHJldHVybiBEZXBlbmRlbmN5SW5qZWN0b3IuZ2V0KFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uSHR0cFNlcnZpY2UpO1xyXG59XHJcblxyXG4vKipcclxuICogU2VydmljZSB0byBwZXJmb3JtIEhUVFAgcmVxdWVzdHMgdG8gZ2V0IHtAbGluayBQYWdlZFJlc291cmNlQ29sbGVjdGlvbn0gdHlwZS5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uSHR0cFNlcnZpY2UgZXh0ZW5kcyBIdHRwRXhlY3V0b3Ige1xyXG5cclxuICBjb25zdHJ1Y3RvcihodHRwQ2xpZW50OiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgIGNhY2hlU2VydmljZTogUmVzb3VyY2VDYWNoZVNlcnZpY2UpIHtcclxuICAgIHN1cGVyKGh0dHBDbGllbnQsIGNhY2hlU2VydmljZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtIEdFVCByZXF1ZXN0IHRvIHJldHJpZXZlIHBhZ2VkIGNvbGxlY3Rpb24gb2YgdGhlIHJlc291cmNlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgdG8gcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgcmVxdWVzdCBvcHRpb25zXHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkIG9yIHJldHVybmVkIHJlc291cmNlIHR5cGUgaXMgbm90IHBhZ2VkIGNvbGxlY3Rpb24gb2YgdGhlIHJlc291cmNlc1xyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXQ8VCBleHRlbmRzIFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uPEJhc2VSZXNvdXJjZT4+KHVybDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBQYWdlZEdldE9wdGlvbik6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgY29uc3QgaHR0cE9wdGlvbnMgPSBVcmxVdGlscy5jb252ZXJ0VG9IdHRwT3B0aW9ucyhvcHRpb25zKTtcclxuXHJcbiAgICByZXR1cm4gc3VwZXIuZ2V0SHR0cCh1cmwsIGh0dHBPcHRpb25zLCBvcHRpb25zPy51c2VDYWNoZSlcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgbWFwKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmICghaXNQYWdlZFJlc291cmNlQ29sbGVjdGlvbihkYXRhKSkge1xyXG4gICAgICAgICAgICBpZiAoTGliQ29uZmlnLmNvbmZpZy5jYWNoZS5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jYWNoZVNlcnZpY2UuZXZpY3RSZXNvdXJjZShDYWNoZUtleS5vZih1cmwsIGh0dHBPcHRpb25zKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZXJyTXNnID0gYFlvdSB0cnkgdG8gZ2V0IHdyb25nIHJlc291cmNlIHR5cGU6IGV4cGVjdGVkIFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uIHR5cGUsIGFjdHVhbCAkeyBnZXRSZXNvdXJjZVR5cGUoZGF0YSkgfSB0eXBlLmA7XHJcbiAgICAgICAgICAgIFN0YWdlTG9nZ2VyLnN0YWdlRXJyb3JMb2coU3RhZ2UuSU5JVF9SRVNPVVJDRSwge2Vycm9yOiBlcnJNc2csIG9wdGlvbnN9KTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIFJlc291cmNlVXRpbHMuaW5zdGFudGlhdGVQYWdlZFJlc291cmNlQ29sbGVjdGlvbihkYXRhLCBodHRwT3B0aW9ucz8ucGFyYW1zPy5oYXMoJ3Byb2plY3Rpb24nKSkgYXMgVDtcclxuICAgICAgICB9KSxcclxuICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBnZXQgcGFnZWQgcmVzb3VyY2UgY29sbGVjdGlvbiByZXF1ZXN0IHdpdGggdXJsIGJ1aWx0IGJ5IHRoZSByZXNvdXJjZSBuYW1lLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlc291cmNlTmFtZSB1c2VkIHRvIGJ1aWxkIHJvb3QgdXJsIHRvIHRoZSByZXNvdXJjZVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0UmVzb3VyY2VQYWdlPFQgZXh0ZW5kcyBQYWdlZFJlc291cmNlQ29sbGVjdGlvbjxCYXNlUmVzb3VyY2U+PihyZXNvdXJjZU5hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUGFnZWRHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZXNvdXJjZU5hbWV9KTtcclxuXHJcbiAgICBjb25zdCB1cmwgPSBVcmxVdGlscy5yZW1vdmVUZW1wbGF0ZVBhcmFtcyhVcmxVdGlscy5nZW5lcmF0ZVJlc291cmNlVXJsKFVybFV0aWxzLmdldEFwaVVybCgpLCByZXNvdXJjZU5hbWUpKTtcclxuXHJcbiAgICBTdGFnZUxvZ2dlci5zdGFnZUxvZyhTdGFnZS5QUkVQQVJFX1VSTCwge1xyXG4gICAgICByZXN1bHQ6IHVybCxcclxuICAgICAgdXJsUGFydHM6IGBiYXNlVXJsOiAnJHsgVXJsVXRpbHMuZ2V0QXBpVXJsKCkgfScsIHJlc291cmNlOiAnJHsgcmVzb3VyY2VOYW1lIH0nYCxcclxuICAgICAgb3B0aW9uc1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0KHVybCwgVXJsVXRpbHMuZmlsbERlZmF1bHRQYWdlRGF0YUlmTm9QcmVzZW50KG9wdGlvbnMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBQZXJmb3JtIHNlYXJjaCBwYWdlZCByZXNvdXJjZSBjb2xsZWN0aW9uIHJlcXVlc3Qgd2l0aCB1cmwgYnVpbHQgYnkgdGhlIHJlc291cmNlIG5hbWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVzb3VyY2VOYW1lIHVzZWQgdG8gYnVpbGQgcm9vdCB1cmwgdG8gdGhlIHJlc291cmNlXHJcbiAgICogQHBhcmFtIHNlYXJjaFF1ZXJ5IG5hbWUgb2YgdGhlIHNlYXJjaCBtZXRob2RcclxuICAgKiBAcGFyYW0gb3B0aW9ucyAob3B0aW9uYWwpIG9wdGlvbnMgdGhhdCBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIHNlYXJjaDxUIGV4dGVuZHMgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb248QmFzZVJlc291cmNlPj4ocmVzb3VyY2VOYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoUXVlcnk6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUGFnZWRHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZXNvdXJjZU5hbWUsIHNlYXJjaFF1ZXJ5fSk7XHJcblxyXG4gICAgY29uc3QgdXJsID0gVXJsVXRpbHMucmVtb3ZlVGVtcGxhdGVQYXJhbXMoXHJcbiAgICAgIFVybFV0aWxzLmdlbmVyYXRlUmVzb3VyY2VVcmwoVXJsVXRpbHMuZ2V0QXBpVXJsKCksIHJlc291cmNlTmFtZSkpLmNvbmNhdCgnL3NlYXJjaC8nICsgc2VhcmNoUXVlcnkpO1xyXG5cclxuICAgIFN0YWdlTG9nZ2VyLnN0YWdlTG9nKFN0YWdlLlBSRVBBUkVfVVJMLCB7XHJcbiAgICAgIHJlc3VsdDogdXJsLFxyXG4gICAgICB1cmxQYXJ0czogYGJhc2VVcmw6ICckeyBVcmxVdGlscy5nZXRBcGlVcmwoKSB9JywgcmVzb3VyY2U6ICckeyByZXNvdXJjZU5hbWUgfSdgLFxyXG4gICAgICBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5nZXQodXJsLCBVcmxVdGlscy5maWxsRGVmYXVsdFBhZ2VEYXRhSWZOb1ByZXNlbnQob3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19