import { HttpExecutor } from '../http-executor';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { HttpMethod } from '../../model/declarations';
import { UrlUtils } from '../../util/url.utils';
import { map } from 'rxjs/operators';
import { isPagedResourceCollection, isResource, isResourceCollection } from '../../model/resource-type';
import { ResourceUtils } from '../../util/resource.utils';
import { Stage } from '../../logger/stage.enum';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./cache/resource-cache.service";
/**
 * Service to perform HTTP requests to get any type of the {@link Resource}, {@link PagedResourceCollection}, {@link ResourceCollection}.
 */
export class CommonResourceHttpService extends HttpExecutor {
    constructor(httpClient, cacheService) {
        super(httpClient, cacheService);
    }
    /**
     * Perform custom HTTP request.
     *
     * Return type depends on result data it can be {@link Resource}, {@link ResourceCollection},
     * {@link PagedResourceCollection} or any data.
     *
     * @param resourceName used to build root url to the resource
     * @param method HTTP method that will be perform {@link HttpMethod}
     * @param query url path that applied to the result url at the end
     * @param body (optional) request body
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    customQuery(resourceName, method, query, body, options) {
        ValidationUtils.validateInputParams({ resourceName, method, query });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, query);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', query: '${query}'`,
            options
        });
        const httpOptions = UrlUtils.convertToHttpOptions(options);
        let result;
        switch (method) {
            case HttpMethod.GET:
                result = super.getHttp(url, httpOptions, false);
                break;
            case HttpMethod.POST:
                result = super.postHttp(url, body, httpOptions);
                break;
            case HttpMethod.PUT:
                result = super.putHttp(url, body, httpOptions);
                break;
            case HttpMethod.PATCH:
                result = super.patchHttp(url, body, httpOptions);
                break;
            default:
                const errMsg = `allowed ony GET/POST/PUT/PATCH http methods you pass ${method}`;
                StageLogger.stageErrorLog(Stage.HTTP_REQUEST, { error: errMsg, options });
                return observableThrowError(new Error(errMsg));
        }
        return result.pipe(map(data => {
            const isProjection = httpOptions?.params?.has('projection');
            if (isPagedResourceCollection(data)) {
                return ResourceUtils.instantiatePagedResourceCollection(data, isProjection);
            }
            else if (isResourceCollection(data)) {
                return ResourceUtils.instantiateResourceCollection(data, isProjection);
            }
            else if (isResource(data)) {
                return ResourceUtils.instantiateResource(data, isProjection);
            }
            else {
                return data;
            }
        }));
    }
}
CommonResourceHttpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: CommonResourceHttpService, deps: [{ token: i1.HttpClient }, { token: i2.ResourceCacheService }], target: i0.ɵɵFactoryTarget.Injectable });
CommonResourceHttpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: CommonResourceHttpService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: CommonResourceHttpService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.ResourceCacheService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLXJlc291cmNlLWh0dHAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1oYXRlb2FzLWNsaWVudC9zcmMvbGliL3NlcnZpY2UvaW50ZXJuYWwvY29tbW9uLXJlc291cmNlLWh0dHAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsVUFBVSxJQUFJLG9CQUFvQixFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxVQUFVLEVBQWtCLE1BQU0sMEJBQTBCLENBQUM7QUFDdEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWhELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDeEcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7O0FBRzlEOztHQUVHO0FBRUgsTUFBTSxPQUFPLHlCQUEwQixTQUFRLFlBQVk7SUFFekQsWUFBWSxVQUFzQixFQUN0QixZQUFrQztRQUM1QyxLQUFLLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSSxXQUFXLENBQUMsWUFBb0IsRUFBRSxNQUFrQixFQUFFLEtBQWEsRUFBRSxJQUFVLEVBQUUsT0FBd0I7UUFDOUcsZUFBZSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBRW5FLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXBGLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUN0QyxNQUFNLEVBQUUsR0FBRztZQUNYLFFBQVEsRUFBRSxhQUFjLFFBQVEsQ0FBQyxTQUFTLEVBQUcsaUJBQWtCLFlBQWEsY0FBZSxLQUFNLEdBQUc7WUFDcEcsT0FBTztTQUNSLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUzRCxJQUFJLE1BQXVCLENBQUM7UUFDNUIsUUFBUSxNQUFNLEVBQUU7WUFDZCxLQUFLLFVBQVUsQ0FBQyxHQUFHO2dCQUNqQixNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNoRCxNQUFNO1lBQ1IsS0FBSyxVQUFVLENBQUMsSUFBSTtnQkFDbEIsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDaEQsTUFBTTtZQUNSLEtBQUssVUFBVSxDQUFDLEdBQUc7Z0JBQ2pCLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQy9DLE1BQU07WUFDUixLQUFLLFVBQVUsQ0FBQyxLQUFLO2dCQUNuQixNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNO1lBQ1I7Z0JBQ0UsTUFBTSxNQUFNLEdBQUcsd0RBQXlELE1BQU8sRUFBRSxDQUFDO2dCQUNsRixXQUFXLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7Z0JBQ3hFLE9BQU8sb0JBQW9CLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNsRDtRQUVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ1QsTUFBTSxZQUFZLEdBQUcsV0FBVyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUQsSUFBSSx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkMsT0FBTyxhQUFhLENBQUMsa0NBQWtDLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO2FBQzdFO2lCQUFNLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3JDLE9BQU8sYUFBYSxDQUFDLDZCQUE2QixDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQzthQUN4RTtpQkFBTSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDM0IsT0FBTyxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO2FBQzlEO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDO2FBQ2I7UUFDSCxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7c0hBbkVVLHlCQUF5QjswSEFBekIseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBRHJDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwRXhlY3V0b3IgfSBmcm9tICcuLi9odHRwLWV4ZWN1dG9yJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEh0dHBNZXRob2QsIFBhZ2VkR2V0T3B0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWwvZGVjbGFyYXRpb25zJztcclxuaW1wb3J0IHsgVXJsVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3VybC51dGlscyc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgaXNQYWdlZFJlc291cmNlQ29sbGVjdGlvbiwgaXNSZXNvdXJjZSwgaXNSZXNvdXJjZUNvbGxlY3Rpb24gfSBmcm9tICcuLi8uLi9tb2RlbC9yZXNvdXJjZS10eXBlJztcclxuaW1wb3J0IHsgUmVzb3VyY2VVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvcmVzb3VyY2UudXRpbHMnO1xyXG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4uLy4uL2xvZ2dlci9zdGFnZS5lbnVtJztcclxuaW1wb3J0IHsgU3RhZ2VMb2dnZXIgfSBmcm9tICcuLi8uLi9sb2dnZXIvc3RhZ2UtbG9nZ2VyJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC92YWxpZGF0aW9uLnV0aWxzJztcclxuaW1wb3J0IHsgUmVzb3VyY2VDYWNoZVNlcnZpY2UgfSBmcm9tICcuL2NhY2hlL3Jlc291cmNlLWNhY2hlLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIFNlcnZpY2UgdG8gcGVyZm9ybSBIVFRQIHJlcXVlc3RzIHRvIGdldCBhbnkgdHlwZSBvZiB0aGUge0BsaW5rIFJlc291cmNlfSwge0BsaW5rIFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9ufSwge0BsaW5rIFJlc291cmNlQ29sbGVjdGlvbn0uXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb21tb25SZXNvdXJjZUh0dHBTZXJ2aWNlIGV4dGVuZHMgSHR0cEV4ZWN1dG9yIHtcclxuXHJcbiAgY29uc3RydWN0b3IoaHR0cENsaWVudDogSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICBjYWNoZVNlcnZpY2U6IFJlc291cmNlQ2FjaGVTZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihodHRwQ2xpZW50LCBjYWNoZVNlcnZpY2UpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBjdXN0b20gSFRUUCByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogUmV0dXJuIHR5cGUgZGVwZW5kcyBvbiByZXN1bHQgZGF0YSBpdCBjYW4gYmUge0BsaW5rIFJlc291cmNlfSwge0BsaW5rIFJlc291cmNlQ29sbGVjdGlvbn0sXHJcbiAgICoge0BsaW5rIFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9ufSBvciBhbnkgZGF0YS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZXNvdXJjZU5hbWUgdXNlZCB0byBidWlsZCByb290IHVybCB0byB0aGUgcmVzb3VyY2VcclxuICAgKiBAcGFyYW0gbWV0aG9kIEhUVFAgbWV0aG9kIHRoYXQgd2lsbCBiZSBwZXJmb3JtIHtAbGluayBIdHRwTWV0aG9kfVxyXG4gICAqIEBwYXJhbSBxdWVyeSB1cmwgcGF0aCB0aGF0IGFwcGxpZWQgdG8gdGhlIHJlc3VsdCB1cmwgYXQgdGhlIGVuZFxyXG4gICAqIEBwYXJhbSBib2R5IChvcHRpb25hbCkgcmVxdWVzdCBib2R5XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgYXBwbGllZCB0byB0aGUgcmVxdWVzdFxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjdXN0b21RdWVyeShyZXNvdXJjZU5hbWU6IHN0cmluZywgbWV0aG9kOiBIdHRwTWV0aG9kLCBxdWVyeTogc3RyaW5nLCBib2R5PzogYW55LCBvcHRpb25zPzogUGFnZWRHZXRPcHRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3Jlc291cmNlTmFtZSwgbWV0aG9kLCBxdWVyeX0pO1xyXG5cclxuICAgIGNvbnN0IHVybCA9IFVybFV0aWxzLmdlbmVyYXRlUmVzb3VyY2VVcmwoVXJsVXRpbHMuZ2V0QXBpVXJsKCksIHJlc291cmNlTmFtZSwgcXVlcnkpO1xyXG5cclxuICAgIFN0YWdlTG9nZ2VyLnN0YWdlTG9nKFN0YWdlLlBSRVBBUkVfVVJMLCB7XHJcbiAgICAgIHJlc3VsdDogdXJsLFxyXG4gICAgICB1cmxQYXJ0czogYGJhc2VVcmw6ICckeyBVcmxVdGlscy5nZXRBcGlVcmwoKSB9JywgcmVzb3VyY2U6ICckeyByZXNvdXJjZU5hbWUgfScsIHF1ZXJ5OiAnJHsgcXVlcnkgfSdgLFxyXG4gICAgICBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBodHRwT3B0aW9ucyA9IFVybFV0aWxzLmNvbnZlcnRUb0h0dHBPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8YW55PjtcclxuICAgIHN3aXRjaCAobWV0aG9kKSB7XHJcbiAgICAgIGNhc2UgSHR0cE1ldGhvZC5HRVQ6XHJcbiAgICAgICAgcmVzdWx0ID0gc3VwZXIuZ2V0SHR0cCh1cmwsIGh0dHBPcHRpb25zLCBmYWxzZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgSHR0cE1ldGhvZC5QT1NUOlxyXG4gICAgICAgIHJlc3VsdCA9IHN1cGVyLnBvc3RIdHRwKHVybCwgYm9keSwgaHR0cE9wdGlvbnMpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIEh0dHBNZXRob2QuUFVUOlxyXG4gICAgICAgIHJlc3VsdCA9IHN1cGVyLnB1dEh0dHAodXJsLCBib2R5LCBodHRwT3B0aW9ucyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgSHR0cE1ldGhvZC5QQVRDSDpcclxuICAgICAgICByZXN1bHQgPSBzdXBlci5wYXRjaEh0dHAodXJsLCBib2R5LCBodHRwT3B0aW9ucyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgY29uc3QgZXJyTXNnID0gYGFsbG93ZWQgb255IEdFVC9QT1NUL1BVVC9QQVRDSCBodHRwIG1ldGhvZHMgeW91IHBhc3MgJHsgbWV0aG9kIH1gO1xyXG4gICAgICAgIFN0YWdlTG9nZ2VyLnN0YWdlRXJyb3JMb2coU3RhZ2UuSFRUUF9SRVFVRVNULCB7ZXJyb3I6IGVyck1zZywgb3B0aW9uc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihuZXcgRXJyb3IoZXJyTXNnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdC5waXBlKFxyXG4gICAgICBtYXAoZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNQcm9qZWN0aW9uID0gaHR0cE9wdGlvbnM/LnBhcmFtcz8uaGFzKCdwcm9qZWN0aW9uJyk7XHJcbiAgICAgICAgaWYgKGlzUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb24oZGF0YSkpIHtcclxuICAgICAgICAgIHJldHVybiBSZXNvdXJjZVV0aWxzLmluc3RhbnRpYXRlUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb24oZGF0YSwgaXNQcm9qZWN0aW9uKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzUmVzb3VyY2VDb2xsZWN0aW9uKGRhdGEpKSB7XHJcbiAgICAgICAgICByZXR1cm4gUmVzb3VyY2VVdGlscy5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbihkYXRhLCBpc1Byb2plY3Rpb24pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNSZXNvdXJjZShkYXRhKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFJlc291cmNlVXRpbHMuaW5zdGFudGlhdGVSZXNvdXJjZShkYXRhLCBpc1Byb2plY3Rpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn1cclxuIl19