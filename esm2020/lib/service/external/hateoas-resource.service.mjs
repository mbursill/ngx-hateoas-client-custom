import { Injectable } from '@angular/core';
import { HttpMethod } from '../../model/declarations';
import { ResourceUtils } from '../../util/resource.utils';
import { tap } from 'rxjs/operators';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';
import * as i0 from "@angular/core";
import * as i1 from "../internal/common-resource-http.service";
import * as i2 from "../internal/resource-http.service";
import * as i3 from "../internal/resource-collection-http.service";
import * as i4 from "../internal/paged-resource-collection-http.service";
/**
 * Service to operate with {@link Resource}.
 *
 * Can be injected as standalone service to work with {@link Resource}.
 */
/* tslint:disable:no-string-literal */
export class HateoasResourceService {
    constructor(commonHttpService, resourceHttpService, resourceCollectionHttpService, pagedResourceCollectionHttpService) {
        this.commonHttpService = commonHttpService;
        this.resourceHttpService = resourceHttpService;
        this.resourceCollectionHttpService = resourceCollectionHttpService;
        this.pagedResourceCollectionHttpService = pagedResourceCollectionHttpService;
    }
    /**
     * Get resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    getResource(resourceType, id, options) {
        ValidationUtils.validateInputParams({ resourceType, id });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_RESOURCE', { id, options });
        return this.resourceHttpService.getResource(resourceName, id, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService GET_RESOURCE', { result: `get resource '${resourceName}' was successful` });
        }));
    }
    /**
     * Get collection of the resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    getCollection(resourceType, options) {
        ValidationUtils.validateInputParams({ resourceType });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_COLLECTION', { options });
        return this.resourceCollectionHttpService.getResourceCollection(resourceName, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService GET_COLLECTION', { result: `get all resources by '${resourceName}' was successful` });
        }));
    }
    /**
     * Get paged collection of the resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    getPage(resourceType, options) {
        ValidationUtils.validateInputParams({ resourceType });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_PAGE', { options });
        return this.pagedResourceCollectionHttpService.getResourcePage(resourceName, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService GET_PAGE', { result: `get all page resources by '${resourceName}' was successful` });
        }));
    }
    /**
     * Create resource.
     *
     * @param resourceType resource for which will perform request
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    createResource(resourceType, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, requestBody });
        const resourceName = resourceType['__resourceName__'];
        StageLogger.resourceBeginLog(resourceName, 'ResourceService CREATE_RESOURCE', { requestBody, options });
        const body = ResourceUtils.resolveValues(requestBody);
        return this.resourceHttpService.postResource(resourceName, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService CREATE_RESOURCE', { result: `resource '${resourceName}' was created successful` });
        }));
    }
    /**
     * Updating all resource properties at the time to passed body properties. If some properties are not passed then will be used null value.
     * If you need update some part resource properties, use {@link HateoasResourceService#patchResource} method.
     *
     * @param entity to update
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    updateResource(entity, requestBody, options) {
        ValidationUtils.validateInputParams({ entity });
        StageLogger.resourceBeginLog(entity, 'ResourceService UPDATE_RESOURCE', { body: requestBody ? requestBody : entity, options });
        const resource = ResourceUtils.initResource(entity);
        const body = ResourceUtils.resolveValues(requestBody ? requestBody : { body: entity });
        return this.resourceHttpService.put(resource.getSelfLinkHref(), body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(entity, 'ResourceService UPDATE_RESOURCE', { result: `resource '${resource['__resourceName__']}' was updated successful` });
        }));
    }
    /**
     * Update resource by id.
     * Updating all resource properties at the time to passed body properties. If some properties are not passed then will be used null value.
     * If you need update some part resource properties, use {@link HateoasResourceService#patchResource} method.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    updateResourceById(resourceType, id, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, id, requestBody });
        const resourceName = resourceType['__resourceName__'];
        StageLogger.resourceBeginLog(resourceName, 'ResourceService UPDATE_RESOURCE_BY_ID', { id, body: requestBody, options });
        const body = ResourceUtils.resolveValues(requestBody);
        return this.resourceHttpService.putResource(resourceName, id, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService UPDATE_RESOURCE_BY_ID', { result: `resource '${resourceName}' with id ${id} was updated successful` });
        }));
    }
    /**
     * Patch resource.
     * Allows fine-grained update resource properties, it means that only passed properties in body will be changed,
     * other properties stay as is.
     *
     * @param entity to patch
     * @param requestBody (optional) contains the body that will be patched resource and optional body values option {@link ValuesOption}
     *        if not passed then entity will be passed as body directly
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    patchResource(entity, requestBody, options) {
        ValidationUtils.validateInputParams({ entity });
        StageLogger.resourceBeginLog(entity, 'ResourceService PATCH_RESOURCE', { body: requestBody ? requestBody : entity, options });
        const resource = ResourceUtils.initResource(entity);
        const body = ResourceUtils.resolveValues(requestBody ? requestBody : { body: entity });
        return this.resourceHttpService.patch(resource.getSelfLinkHref(), body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(entity, 'ResourceService PATCH_RESOURCE', { result: `resource '${entity['__resourceName__']}' was patched successful` });
        }));
    }
    /**
     * Patch resource by id.
     * Allows fine-grained update resource properties, it means that only passed properties in body will be changed,
     * other properties stay as is.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    patchResourceById(resourceType, id, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, id, requestBody });
        const resourceName = resourceType['__resourceName__'];
        StageLogger.resourceBeginLog(resourceName, 'ResourceService PATCH_RESOURCE_BY_ID', { id, body: requestBody, options });
        const body = ResourceUtils.resolveValues(requestBody);
        return this.resourceHttpService.patchResource(resourceName, id, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService PATCH_RESOURCE_BY_ID', { result: `resource '${resourceName}' with id ${id} was patched successful` });
        }));
    }
    /**
     * Delete resource.
     *
     * @param entity to delete
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    deleteResource(entity, options) {
        ValidationUtils.validateInputParams({ entity });
        StageLogger.resourceBeginLog(entity, 'ResourceService DELETE_RESOURCE', { options });
        const resource = ResourceUtils.initResource(entity);
        return this.resourceHttpService.delete(resource.getSelfLinkHref(), options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(entity, 'ResourceService DELETE_RESOURCE', { result: `resource '${resource['__resourceName__']}' was deleted successful` });
        }));
    }
    /**
     * Delete resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    deleteResourceById(resourceType, id, options) {
        ValidationUtils.validateInputParams({ resourceType, id });
        const resourceName = resourceType['__resourceName__'];
        StageLogger.resourceBeginLog(resourceName, 'ResourceService DELETE_RESOURCE_BY_ID', { id, options });
        return this.resourceHttpService.deleteResource(resourceName, id, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService DELETE_RESOURCE_BY_ID', { result: `resource '${resourceName}' with id ${id} was deleted successful` });
        }));
    }
    /**
     * {@see ResourceCollectionHttpService#search}
     */
    searchCollection(resourceType, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceType, searchQuery });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_COLLECTION', { query: searchQuery, options });
        return this.resourceCollectionHttpService.search(resourceName, searchQuery, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_COLLECTION', { result: `search collection by '${resourceName}' was performed successful` });
        }));
    }
    /**
     * {@see PagedResourceCollection#search}
     */
    searchPage(resourceType, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceType, searchQuery });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_PAGE', { query: searchQuery, options });
        return this.pagedResourceCollectionHttpService.search(resourceName, searchQuery, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_PAGE', { result: `search page by '${resourceName}' was performed successful` });
        }));
    }
    /**
     * {@see ResourceHttpService#search}
     */
    searchResource(resourceType, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceType, searchQuery });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_SINGLE', { query: searchQuery, options });
        return this.resourceHttpService.search(resourceName, searchQuery, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_SINGLE', { result: `search single by '${resourceName}' was performed successful` });
        }));
    }
    /**
     * {@see CommonResourceHttpService#customQuery}
     */
    customQuery(resourceType, method, query, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, method, query });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService CUSTOM_QUERY', {
            method: HttpMethod,
            query,
            requestBody,
            options
        });
        const body = ResourceUtils.resolveValues(requestBody);
        return this.commonHttpService.customQuery(resourceName, method, query, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService CUSTOM_QUERY', { result: `custom query by '${resourceName}' was performed successful` });
        }));
    }
    /**
     * Differences between {@link HateoasResourceService#customQuery} and this method
     * that this one puts 'search' path to the result url automatically.
     *
     * {@see CommonResourceHttpService#customQuery}
     */
    customSearchQuery(resourceType, method, searchQuery, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, method, searchQuery });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService CUSTOM_SEARCH_QUERY', {
            method: HttpMethod,
            searchQuery,
            requestBody,
            options
        });
        const body = ResourceUtils.resolveValues(requestBody);
        const query = `/search${searchQuery.startsWith('/') ? searchQuery : '/' + searchQuery}`;
        return this.commonHttpService.customQuery(resourceName, method, query, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService CUSTOM_SEARCH_QUERY', { result: `custom search query by '${resourceName}' was performed successful` });
        }));
    }
}
HateoasResourceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: HateoasResourceService, deps: [{ token: i1.CommonResourceHttpService }, { token: i2.ResourceHttpService }, { token: i3.ResourceCollectionHttpService }, { token: i4.PagedResourceCollectionHttpService }], target: i0.ɵɵFactoryTarget.Injectable });
HateoasResourceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: HateoasResourceService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: HateoasResourceService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CommonResourceHttpService }, { type: i2.ResourceHttpService }, { type: i3.ResourceCollectionHttpService }, { type: i4.PagedResourceCollectionHttpService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGF0ZW9hcy1yZXNvdXJjZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWhhdGVvYXMtY2xpZW50L3NyYy9saWIvc2VydmljZS9leHRlcm5hbC9oYXRlb2FzLXJlc291cmNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUszQyxPQUFPLEVBQWEsVUFBVSxFQUE4QyxNQUFNLDBCQUEwQixDQUFDO0FBQzdHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUkxRCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7Ozs7O0FBRzlEOzs7O0dBSUc7QUFFSCxzQ0FBc0M7QUFFdEMsTUFBTSxPQUFPLHNCQUFzQjtJQUVqQyxZQUFvQixpQkFBNEMsRUFDNUMsbUJBQXdDLEVBQ3hDLDZCQUE0RCxFQUM1RCxrQ0FBc0U7UUFIdEUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUEyQjtRQUM1Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLGtDQUE2QixHQUE3Qiw2QkFBNkIsQ0FBK0I7UUFDNUQsdUNBQWtDLEdBQWxDLGtDQUFrQyxDQUFvQztJQUMxRixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFdBQVcsQ0FBcUIsWUFBeUIsRUFBRSxFQUFtQixFQUFFLE9BQW1CO1FBQ3hHLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLFlBQVksRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sR0FBRyxhQUFh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QUFDLG1CQUFtQixDQUFDLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sR0FBRyxhQUFhLENBQUMsa0NBQWtDLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xGLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUscUNBQXFDLEVBQUU7WUFDaEYsTUFBTSxFQUFFLFVBQVU7WUFDbEIsV0FBVztZQUNYLFdBQVc7WUFDWCxPQUFPO1NBQ1IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RCxNQUFNLEtBQUssR0FBRyxVQUFXLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFdBQVksRUFBRSxDQUFDO1FBQzFGLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ2xGLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO1lBQ2IsV0FBVyxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUscUNBQXFDLEVBQzVFLEVBQUMsTUFBTSxFQUFFLDJCQUE0QixZQUFhLDRCQUE0QixFQUFDLENBQUMsQ0FBQztRQUNyRixDQUFDLENBQUMsQ0FBa0IsQ0FBQztJQUN6QixDQUFDOzttSEE5VlUsc0JBQXNCO3VIQUF0QixzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFEbEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUh0dHBTZXJ2aWNlIH0gZnJvbSAnLi4vaW50ZXJuYWwvcmVzb3VyY2UtaHR0cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb25IdHRwU2VydmljZSB9IGZyb20gJy4uL2ludGVybmFsL3BhZ2VkLXJlc291cmNlLWNvbGxlY3Rpb24taHR0cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb24gfSBmcm9tICcuLi8uLi9tb2RlbC9yZXNvdXJjZS9wYWdlZC1yZXNvdXJjZS1jb2xsZWN0aW9uJztcclxuaW1wb3J0IHsgR2V0T3B0aW9uLCBIdHRwTWV0aG9kLCBQYWdlZEdldE9wdGlvbiwgUmVxdWVzdEJvZHksIFJlcXVlc3RPcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbC9kZWNsYXJhdGlvbnMnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZVV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC9yZXNvdXJjZS51dGlscyc7XHJcbmltcG9ydCB7IFJlc291cmNlQ29sbGVjdGlvbiB9IGZyb20gJy4uLy4uL21vZGVsL3Jlc291cmNlL3Jlc291cmNlLWNvbGxlY3Rpb24nO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUNvbGxlY3Rpb25IdHRwU2VydmljZSB9IGZyb20gJy4uL2ludGVybmFsL3Jlc291cmNlLWNvbGxlY3Rpb24taHR0cC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29tbW9uUmVzb3VyY2VIdHRwU2VydmljZSB9IGZyb20gJy4uL2ludGVybmFsL2NvbW1vbi1yZXNvdXJjZS1odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi4vLi4vbW9kZWwvcmVzb3VyY2UvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBTdGFnZUxvZ2dlciB9IGZyb20gJy4uLy4uL2xvZ2dlci9zdGFnZS1sb2dnZXInO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3ZhbGlkYXRpb24udXRpbHMnO1xyXG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG4vKipcclxuICogU2VydmljZSB0byBvcGVyYXRlIHdpdGgge0BsaW5rIFJlc291cmNlfS5cclxuICpcclxuICogQ2FuIGJlIGluamVjdGVkIGFzIHN0YW5kYWxvbmUgc2VydmljZSB0byB3b3JrIHdpdGgge0BsaW5rIFJlc291cmNlfS5cclxuICovXHJcblxyXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1zdHJpbmctbGl0ZXJhbCAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBIYXRlb2FzUmVzb3VyY2VTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21tb25IdHRwU2VydmljZTogQ29tbW9uUmVzb3VyY2VIdHRwU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIHJlc291cmNlSHR0cFNlcnZpY2U6IFJlc291cmNlSHR0cFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZXNvdXJjZUNvbGxlY3Rpb25IdHRwU2VydmljZTogUmVzb3VyY2VDb2xsZWN0aW9uSHR0cFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwYWdlZFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlOiBQYWdlZFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgcmVzb3VyY2UgYnkgaWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVzb3VyY2VUeXBlIHJlc291cmNlIGZvciB3aGljaCB3aWxsIHBlcmZvcm0gcmVxdWVzdFxyXG4gICAqIEBwYXJhbSBpZCByZXNvdXJjZSBpZFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIGdldFJlc291cmNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VUeXBlOiBuZXcgKCkgPT4gVCwgaWQ6IG51bWJlciB8IHN0cmluZywgb3B0aW9ucz86IEdldE9wdGlvbik6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3Jlc291cmNlVHlwZSwgaWR9KTtcclxuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IHJlc291cmNlVHlwZVsnX19yZXNvdXJjZU5hbWVfXyddO1xyXG4gICAgb3B0aW9ucyA9IFJlc291cmNlVXRpbHMuZmlsbFByb2plY3Rpb25OYW1lRnJvbVJlc291cmNlVHlwZShyZXNvdXJjZVR5cGUsIG9wdGlvbnMpO1xyXG4gICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VCZWdpbkxvZyhyZXNvdXJjZU5hbWUsICdSZXNvdXJjZVNlcnZpY2UgR0VUX1JFU09VUkNFJywge2lkLCBvcHRpb25zfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VIdHRwU2VydmljZS5nZXRSZXNvdXJjZTxUPihyZXNvdXJjZU5hbWUsIGlkLCBvcHRpb25zKVxyXG4gICAgICAucGlwZSh0YXAoKCkgPT4ge1xyXG4gICAgICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlRW5kTG9nKHJlc291cmNlTmFtZSwgJ1Jlc291cmNlU2VydmljZSBHRVRfUkVTT1VSQ0UnLFxyXG4gICAgICAgICAge3Jlc3VsdDogYGdldCByZXNvdXJjZSAnJHsgcmVzb3VyY2VOYW1lIH0nIHdhcyBzdWNjZXNzZnVsYH0pO1xyXG4gICAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgY29sbGVjdGlvbiBvZiB0aGUgcmVzb3VyY2UgYnkgaWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVzb3VyY2VUeXBlIHJlc291cmNlIGZvciB3aGljaCB3aWxsIHBlcmZvcm0gcmVxdWVzdFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIGdldENvbGxlY3Rpb248VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZVR5cGU6IG5ldyAoKSA9PiBULCBvcHRpb25zPzogR2V0T3B0aW9uKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUNvbGxlY3Rpb248VD4+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZXNvdXJjZVR5cGV9KTtcclxuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IHJlc291cmNlVHlwZVsnX19yZXNvdXJjZU5hbWVfXyddO1xyXG4gICAgb3B0aW9ucyA9IFJlc291cmNlVXRpbHMuZmlsbFByb2plY3Rpb25OYW1lRnJvbVJlc291cmNlVHlwZShyZXNvdXJjZVR5cGUsIG9wdGlvbnMpO1xyXG4gICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VCZWdpbkxvZyhyZXNvdXJjZU5hbWUsICdSZXNvdXJjZVNlcnZpY2UgR0VUX0NPTExFQ1RJT04nLCB7b3B0aW9uc30pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlLmdldFJlc291cmNlQ29sbGVjdGlvbjxSZXNvdXJjZUNvbGxlY3Rpb248VD4+KHJlc291cmNlTmFtZSwgb3B0aW9ucylcclxuICAgICAgLnBpcGUodGFwKCgpID0+IHtcclxuICAgICAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUVuZExvZyhyZXNvdXJjZU5hbWUsICdSZXNvdXJjZVNlcnZpY2UgR0VUX0NPTExFQ1RJT04nLFxyXG4gICAgICAgICAge3Jlc3VsdDogYGdldCBhbGwgcmVzb3VyY2VzIGJ5ICckeyByZXNvdXJjZU5hbWUgfScgd2FzIHN1Y2Nlc3NmdWxgfSk7XHJcbiAgICAgIH0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBwYWdlZCBjb2xsZWN0aW9uIG9mIHRoZSByZXNvdXJjZSBieSBpZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZXNvdXJjZVR5cGUgcmVzb3VyY2UgZm9yIHdoaWNoIHdpbGwgcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0UGFnZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlVHlwZTogbmV3ICgpID0+IFQsIG9wdGlvbnM/OiBQYWdlZEdldE9wdGlvbik6IE9ic2VydmFibGU8UGFnZWRSZXNvdXJjZUNvbGxlY3Rpb248VD4+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZXNvdXJjZVR5cGV9KTtcclxuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IHJlc291cmNlVHlwZVsnX19yZXNvdXJjZU5hbWVfXyddO1xyXG4gICAgb3B0aW9ucyA9IFJlc291cmNlVXRpbHMuZmlsbFByb2plY3Rpb25OYW1lRnJvbVJlc291cmNlVHlwZShyZXNvdXJjZVR5cGUsIG9wdGlvbnMpO1xyXG4gICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VCZWdpbkxvZyhyZXNvdXJjZU5hbWUsICdSZXNvdXJjZVNlcnZpY2UgR0VUX1BBR0UnLCB7b3B0aW9uc30pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uSHR0cFNlcnZpY2UuZ2V0UmVzb3VyY2VQYWdlPFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uPFQ+PihyZXNvdXJjZU5hbWUsIG9wdGlvbnMpXHJcbiAgICAgIC5waXBlKHRhcCgoKSA9PiB7XHJcbiAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIEdFVF9QQUdFJyxcclxuICAgICAgICAgIHtyZXN1bHQ6IGBnZXQgYWxsIHBhZ2UgcmVzb3VyY2VzIGJ5ICckeyByZXNvdXJjZU5hbWUgfScgd2FzIHN1Y2Nlc3NmdWxgfSk7XHJcbiAgICAgIH0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSByZXNvdXJjZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZXNvdXJjZVR5cGUgcmVzb3VyY2UgZm9yIHdoaWNoIHdpbGwgcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIHJlcXVlc3RCb2R5IHRoYXQgY29udGFpbnMgdGhlIGJvZHkgZGlyZWN0bHkgYW5kIG9wdGlvbmFsIGJvZHkgdmFsdWVzIG9wdGlvbiB7QGxpbmsgVmFsdWVzT3B0aW9ufVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0IHtAbGluayBSZXF1ZXN0T3B0aW9ufVxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGVSZXNvdXJjZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlVHlwZTogbmV3ICgpID0+IFQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHk6IFJlcXVlc3RCb2R5PFQ+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxUIHwgYW55PiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VUeXBlLCByZXF1ZXN0Qm9keX0pO1xyXG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0gcmVzb3VyY2VUeXBlWydfX3Jlc291cmNlTmFtZV9fJ107XHJcbiAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUJlZ2luTG9nKHJlc291cmNlTmFtZSwgJ1Jlc291cmNlU2VydmljZSBDUkVBVEVfUkVTT1VSQ0UnLCB7cmVxdWVzdEJvZHksIG9wdGlvbnN9KTtcclxuXHJcbiAgICBjb25zdCBib2R5ID0gUmVzb3VyY2VVdGlscy5yZXNvbHZlVmFsdWVzKHJlcXVlc3RCb2R5KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUh0dHBTZXJ2aWNlLnBvc3RSZXNvdXJjZShyZXNvdXJjZU5hbWUsIGJvZHksIG9wdGlvbnMpXHJcbiAgICAgIC5waXBlKHRhcCgoKSA9PiB7XHJcbiAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIENSRUFURV9SRVNPVVJDRScsXHJcbiAgICAgICAgICB7cmVzdWx0OiBgcmVzb3VyY2UgJyR7IHJlc291cmNlTmFtZSB9JyB3YXMgY3JlYXRlZCBzdWNjZXNzZnVsYH0pO1xyXG4gICAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGluZyBhbGwgcmVzb3VyY2UgcHJvcGVydGllcyBhdCB0aGUgdGltZSB0byBwYXNzZWQgYm9keSBwcm9wZXJ0aWVzLiBJZiBzb21lIHByb3BlcnRpZXMgYXJlIG5vdCBwYXNzZWQgdGhlbiB3aWxsIGJlIHVzZWQgbnVsbCB2YWx1ZS5cclxuICAgKiBJZiB5b3UgbmVlZCB1cGRhdGUgc29tZSBwYXJ0IHJlc291cmNlIHByb3BlcnRpZXMsIHVzZSB7QGxpbmsgSGF0ZW9hc1Jlc291cmNlU2VydmljZSNwYXRjaFJlc291cmNlfSBtZXRob2QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZW50aXR5IHRvIHVwZGF0ZVxyXG4gICAqIEBwYXJhbSByZXF1ZXN0Qm9keSB0aGF0IGNvbnRhaW5zIHRoZSBib2R5IGRpcmVjdGx5IGFuZCBvcHRpb25hbCBib2R5IHZhbHVlcyBvcHRpb24ge0BsaW5rIFZhbHVlc09wdGlvbn1cclxuICAgKiBAcGFyYW0gb3B0aW9ucyAob3B0aW9uYWwpIG9wdGlvbnMgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgcmVxdWVzdCB7QGxpbmsgUmVxdWVzdE9wdGlvbn1cclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgdXBkYXRlUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHk/OiBSZXF1ZXN0Qm9keTxhbnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxUIHwgYW55PiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7ZW50aXR5fSk7XHJcbiAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUJlZ2luTG9nKGVudGl0eSwgJ1Jlc291cmNlU2VydmljZSBVUERBVEVfUkVTT1VSQ0UnLCB7Ym9keTogcmVxdWVzdEJvZHkgPyByZXF1ZXN0Qm9keSA6IGVudGl0eSwgb3B0aW9uc30pO1xyXG5cclxuICAgIGNvbnN0IHJlc291cmNlID0gUmVzb3VyY2VVdGlscy5pbml0UmVzb3VyY2UoZW50aXR5KSBhcyBSZXNvdXJjZTtcclxuICAgIGNvbnN0IGJvZHkgPSBSZXNvdXJjZVV0aWxzLnJlc29sdmVWYWx1ZXMocmVxdWVzdEJvZHkgPyByZXF1ZXN0Qm9keSA6IHtib2R5OiBlbnRpdHl9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUh0dHBTZXJ2aWNlLnB1dChyZXNvdXJjZS5nZXRTZWxmTGlua0hyZWYoKSwgYm9keSwgb3B0aW9ucylcclxuICAgICAgLnBpcGUodGFwKCgpID0+IHtcclxuICAgICAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUVuZExvZyhlbnRpdHksICdSZXNvdXJjZVNlcnZpY2UgVVBEQVRFX1JFU09VUkNFJyxcclxuICAgICAgICAgIHtyZXN1bHQ6IGByZXNvdXJjZSAnJHsgcmVzb3VyY2VbJ19fcmVzb3VyY2VOYW1lX18nXSB9JyB3YXMgdXBkYXRlZCBzdWNjZXNzZnVsYH0pO1xyXG4gICAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgcmVzb3VyY2UgYnkgaWQuXHJcbiAgICogVXBkYXRpbmcgYWxsIHJlc291cmNlIHByb3BlcnRpZXMgYXQgdGhlIHRpbWUgdG8gcGFzc2VkIGJvZHkgcHJvcGVydGllcy4gSWYgc29tZSBwcm9wZXJ0aWVzIGFyZSBub3QgcGFzc2VkIHRoZW4gd2lsbCBiZSB1c2VkIG51bGwgdmFsdWUuXHJcbiAgICogSWYgeW91IG5lZWQgdXBkYXRlIHNvbWUgcGFydCByZXNvdXJjZSBwcm9wZXJ0aWVzLCB1c2Uge0BsaW5rIEhhdGVvYXNSZXNvdXJjZVNlcnZpY2UjcGF0Y2hSZXNvdXJjZX0gbWV0aG9kLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlc291cmNlVHlwZSByZXNvdXJjZSBmb3Igd2hpY2ggd2lsbCBwZXJmb3JtIHJlcXVlc3RcclxuICAgKiBAcGFyYW0gaWQgcmVzb3VyY2UgaWRcclxuICAgKiBAcGFyYW0gcmVxdWVzdEJvZHkgdGhhdCBjb250YWlucyB0aGUgYm9keSBkaXJlY3RseSBhbmQgb3B0aW9uYWwgYm9keSB2YWx1ZXMgb3B0aW9uIHtAbGluayBWYWx1ZXNPcHRpb259XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIHJlcXVlc3Qge0BsaW5rIFJlcXVlc3RPcHRpb259XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIHVwZGF0ZVJlc291cmNlQnlJZDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlVHlwZTogbmV3ICgpID0+IFQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBudW1iZXIgfCBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5OiBSZXF1ZXN0Qm9keTxhbnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUmVxdWVzdE9wdGlvbik6IE9ic2VydmFibGU8VCB8IGFueT4ge1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3Jlc291cmNlVHlwZSwgaWQsIHJlcXVlc3RCb2R5fSk7XHJcbiAgICBjb25zdCByZXNvdXJjZU5hbWUgPSByZXNvdXJjZVR5cGVbJ19fcmVzb3VyY2VOYW1lX18nXTtcclxuICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlQmVnaW5Mb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIFVQREFURV9SRVNPVVJDRV9CWV9JRCcsIHtpZCwgYm9keTogcmVxdWVzdEJvZHksIG9wdGlvbnN9KTtcclxuXHJcbiAgICBjb25zdCBib2R5ID0gUmVzb3VyY2VVdGlscy5yZXNvbHZlVmFsdWVzKHJlcXVlc3RCb2R5KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUh0dHBTZXJ2aWNlLnB1dFJlc291cmNlKHJlc291cmNlTmFtZSwgaWQsIGJvZHksIG9wdGlvbnMpXHJcbiAgICAgIC5waXBlKHRhcCgoKSA9PiB7XHJcbiAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIFVQREFURV9SRVNPVVJDRV9CWV9JRCcsXHJcbiAgICAgICAgICB7cmVzdWx0OiBgcmVzb3VyY2UgJyR7IHJlc291cmNlTmFtZSB9JyB3aXRoIGlkICR7IGlkIH0gd2FzIHVwZGF0ZWQgc3VjY2Vzc2Z1bGB9KTtcclxuICAgICAgfSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGF0Y2ggcmVzb3VyY2UuXHJcbiAgICogQWxsb3dzIGZpbmUtZ3JhaW5lZCB1cGRhdGUgcmVzb3VyY2UgcHJvcGVydGllcywgaXQgbWVhbnMgdGhhdCBvbmx5IHBhc3NlZCBwcm9wZXJ0aWVzIGluIGJvZHkgd2lsbCBiZSBjaGFuZ2VkLFxyXG4gICAqIG90aGVyIHByb3BlcnRpZXMgc3RheSBhcyBpcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBlbnRpdHkgdG8gcGF0Y2hcclxuICAgKiBAcGFyYW0gcmVxdWVzdEJvZHkgKG9wdGlvbmFsKSBjb250YWlucyB0aGUgYm9keSB0aGF0IHdpbGwgYmUgcGF0Y2hlZCByZXNvdXJjZSBhbmQgb3B0aW9uYWwgYm9keSB2YWx1ZXMgb3B0aW9uIHtAbGluayBWYWx1ZXNPcHRpb259XHJcbiAgICogICAgICAgIGlmIG5vdCBwYXNzZWQgdGhlbiBlbnRpdHkgd2lsbCBiZSBwYXNzZWQgYXMgYm9keSBkaXJlY3RseVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0IHtAbGluayBSZXF1ZXN0T3B0aW9ufVxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwYXRjaFJlc291cmNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHk/OiBSZXF1ZXN0Qm9keTxhbnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IFJlcXVlc3RPcHRpb24pOiBPYnNlcnZhYmxlPFQgfCBhbnk+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtlbnRpdHl9KTtcclxuICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlQmVnaW5Mb2coZW50aXR5LCAnUmVzb3VyY2VTZXJ2aWNlIFBBVENIX1JFU09VUkNFJywge2JvZHk6IHJlcXVlc3RCb2R5ID8gcmVxdWVzdEJvZHkgOiBlbnRpdHksIG9wdGlvbnN9KTtcclxuXHJcbiAgICBjb25zdCByZXNvdXJjZSA9IFJlc291cmNlVXRpbHMuaW5pdFJlc291cmNlKGVudGl0eSkgYXMgUmVzb3VyY2U7XHJcbiAgICBjb25zdCBib2R5ID0gUmVzb3VyY2VVdGlscy5yZXNvbHZlVmFsdWVzKHJlcXVlc3RCb2R5ID8gcmVxdWVzdEJvZHkgOiB7Ym9keTogZW50aXR5fSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VIdHRwU2VydmljZS5wYXRjaChyZXNvdXJjZS5nZXRTZWxmTGlua0hyZWYoKSwgYm9keSwgb3B0aW9ucylcclxuICAgICAgLnBpcGUodGFwKCgpID0+IHtcclxuICAgICAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUVuZExvZyhlbnRpdHksICdSZXNvdXJjZVNlcnZpY2UgUEFUQ0hfUkVTT1VSQ0UnLFxyXG4gICAgICAgICAge3Jlc3VsdDogYHJlc291cmNlICckeyBlbnRpdHlbJ19fcmVzb3VyY2VOYW1lX18nXSB9JyB3YXMgcGF0Y2hlZCBzdWNjZXNzZnVsYH0pO1xyXG4gICAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXRjaCByZXNvdXJjZSBieSBpZC5cclxuICAgKiBBbGxvd3MgZmluZS1ncmFpbmVkIHVwZGF0ZSByZXNvdXJjZSBwcm9wZXJ0aWVzLCBpdCBtZWFucyB0aGF0IG9ubHkgcGFzc2VkIHByb3BlcnRpZXMgaW4gYm9keSB3aWxsIGJlIGNoYW5nZWQsXHJcbiAgICogb3RoZXIgcHJvcGVydGllcyBzdGF5IGFzIGlzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlc291cmNlVHlwZSByZXNvdXJjZSBmb3Igd2hpY2ggd2lsbCBwZXJmb3JtIHJlcXVlc3RcclxuICAgKiBAcGFyYW0gaWQgcmVzb3VyY2UgaWRcclxuICAgKiBAcGFyYW0gcmVxdWVzdEJvZHkgdGhhdCBjb250YWlucyB0aGUgYm9keSBkaXJlY3RseSBhbmQgb3B0aW9uYWwgYm9keSB2YWx1ZXMgb3B0aW9uIHtAbGluayBWYWx1ZXNPcHRpb259XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIHJlcXVlc3Qge0BsaW5rIFJlcXVlc3RPcHRpb259XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIHBhdGNoUmVzb3VyY2VCeUlkPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VUeXBlOiBuZXcgKCkgPT4gVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogbnVtYmVyIHwgc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5OiBSZXF1ZXN0Qm9keTxhbnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxUIHwgYW55PiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VUeXBlLCBpZCwgcmVxdWVzdEJvZHl9KTtcclxuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IHJlc291cmNlVHlwZVsnX19yZXNvdXJjZU5hbWVfXyddO1xyXG4gICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VCZWdpbkxvZyhyZXNvdXJjZU5hbWUsICdSZXNvdXJjZVNlcnZpY2UgUEFUQ0hfUkVTT1VSQ0VfQllfSUQnLCB7aWQsIGJvZHk6IHJlcXVlc3RCb2R5LCBvcHRpb25zfSk7XHJcblxyXG4gICAgY29uc3QgYm9keSA9IFJlc291cmNlVXRpbHMucmVzb2x2ZVZhbHVlcyhyZXF1ZXN0Qm9keSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VIdHRwU2VydmljZS5wYXRjaFJlc291cmNlKHJlc291cmNlTmFtZSwgaWQsIGJvZHksIG9wdGlvbnMpXHJcbiAgICAgIC5waXBlKHRhcCgoKSA9PiB7XHJcbiAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIFBBVENIX1JFU09VUkNFX0JZX0lEJyxcclxuICAgICAgICAgIHtyZXN1bHQ6IGByZXNvdXJjZSAnJHsgcmVzb3VyY2VOYW1lIH0nIHdpdGggaWQgJHsgaWQgfSB3YXMgcGF0Y2hlZCBzdWNjZXNzZnVsYH0pO1xyXG4gICAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWxldGUgcmVzb3VyY2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZW50aXR5IHRvIGRlbGV0ZVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIGRlbGV0ZVJlc291cmNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBULCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbik6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPGFueT4gfCBhbnk+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtlbnRpdHl9KTtcclxuICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlQmVnaW5Mb2coZW50aXR5LCAnUmVzb3VyY2VTZXJ2aWNlIERFTEVURV9SRVNPVVJDRScsIHtvcHRpb25zfSk7XHJcblxyXG4gICAgY29uc3QgcmVzb3VyY2UgPSBSZXNvdXJjZVV0aWxzLmluaXRSZXNvdXJjZShlbnRpdHkpIGFzIFJlc291cmNlO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnJlc291cmNlSHR0cFNlcnZpY2UuZGVsZXRlKHJlc291cmNlLmdldFNlbGZMaW5rSHJlZigpLCBvcHRpb25zKVxyXG4gICAgICAucGlwZSh0YXAoKCkgPT4ge1xyXG4gICAgICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlRW5kTG9nKGVudGl0eSwgJ1Jlc291cmNlU2VydmljZSBERUxFVEVfUkVTT1VSQ0UnLFxyXG4gICAgICAgICAge3Jlc3VsdDogYHJlc291cmNlICckeyByZXNvdXJjZVsnX19yZXNvdXJjZU5hbWVfXyddIH0nIHdhcyBkZWxldGVkIHN1Y2Nlc3NmdWxgfSk7XHJcbiAgICAgIH0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlbGV0ZSByZXNvdXJjZSBieSBpZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZXNvdXJjZVR5cGUgcmVzb3VyY2UgZm9yIHdoaWNoIHdpbGwgcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIGlkIHJlc291cmNlIGlkXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgZGVsZXRlUmVzb3VyY2VCeUlkPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VUeXBlOiBuZXcgKCkgPT4gVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG51bWJlciB8IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IFJlcXVlc3RPcHRpb24pOiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxhbnk+IHwgYW55PiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VUeXBlLCBpZH0pO1xyXG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0gcmVzb3VyY2VUeXBlWydfX3Jlc291cmNlTmFtZV9fJ107XHJcbiAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUJlZ2luTG9nKHJlc291cmNlTmFtZSwgJ1Jlc291cmNlU2VydmljZSBERUxFVEVfUkVTT1VSQ0VfQllfSUQnLCB7aWQsIG9wdGlvbnN9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUh0dHBTZXJ2aWNlLmRlbGV0ZVJlc291cmNlKHJlc291cmNlTmFtZSwgaWQsIG9wdGlvbnMpXHJcbiAgICAgIC5waXBlKHRhcCgoKSA9PiB7XHJcbiAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIERFTEVURV9SRVNPVVJDRV9CWV9JRCcsXHJcbiAgICAgICAgICB7cmVzdWx0OiBgcmVzb3VyY2UgJyR7IHJlc291cmNlTmFtZSB9JyB3aXRoIGlkICR7IGlkIH0gd2FzIGRlbGV0ZWQgc3VjY2Vzc2Z1bGB9KTtcclxuICAgICAgfSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICoge0BzZWUgUmVzb3VyY2VDb2xsZWN0aW9uSHR0cFNlcnZpY2Ujc2VhcmNofVxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZWFyY2hDb2xsZWN0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VUeXBlOiBuZXcgKCkgPT4gVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogR2V0T3B0aW9uKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUNvbGxlY3Rpb248VD4+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZXNvdXJjZVR5cGUsIHNlYXJjaFF1ZXJ5fSk7XHJcbiAgICBjb25zdCByZXNvdXJjZU5hbWUgPSByZXNvdXJjZVR5cGVbJ19fcmVzb3VyY2VOYW1lX18nXTtcclxuICAgIG9wdGlvbnMgPSBSZXNvdXJjZVV0aWxzLmZpbGxQcm9qZWN0aW9uTmFtZUZyb21SZXNvdXJjZVR5cGUocmVzb3VyY2VUeXBlLCBvcHRpb25zKTtcclxuICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlQmVnaW5Mb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIFNFQVJDSF9DT0xMRUNUSU9OJywge3F1ZXJ5OiBzZWFyY2hRdWVyeSwgb3B0aW9uc30pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlLnNlYXJjaDxSZXNvdXJjZUNvbGxlY3Rpb248VD4+KHJlc291cmNlTmFtZSwgc2VhcmNoUXVlcnksIG9wdGlvbnMpXHJcbiAgICAgIC5waXBlKHRhcCgoKSA9PiB7XHJcbiAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIFNFQVJDSF9DT0xMRUNUSU9OJyxcclxuICAgICAgICAgIHtyZXN1bHQ6IGBzZWFyY2ggY29sbGVjdGlvbiBieSAnJHsgcmVzb3VyY2VOYW1lIH0nIHdhcyBwZXJmb3JtZWQgc3VjY2Vzc2Z1bGB9KTtcclxuICAgICAgfSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICoge0BzZWUgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb24jc2VhcmNofVxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZWFyY2hQYWdlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VUeXBlOiBuZXcgKCkgPT4gVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUGFnZWRHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uPFQ+PiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VUeXBlLCBzZWFyY2hRdWVyeX0pO1xyXG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0gcmVzb3VyY2VUeXBlWydfX3Jlc291cmNlTmFtZV9fJ107XHJcbiAgICBvcHRpb25zID0gUmVzb3VyY2VVdGlscy5maWxsUHJvamVjdGlvbk5hbWVGcm9tUmVzb3VyY2VUeXBlKHJlc291cmNlVHlwZSwgb3B0aW9ucyk7XHJcbiAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUJlZ2luTG9nKHJlc291cmNlTmFtZSwgJ1Jlc291cmNlU2VydmljZSBTRUFSQ0hfUEFHRScsIHtxdWVyeTogc2VhcmNoUXVlcnksIG9wdGlvbnN9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5wYWdlZFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlLnNlYXJjaDxQYWdlZFJlc291cmNlQ29sbGVjdGlvbjxUPj4ocmVzb3VyY2VOYW1lLCBzZWFyY2hRdWVyeSwgb3B0aW9ucylcclxuICAgICAgLnBpcGUodGFwKCgpID0+IHtcclxuICAgICAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUVuZExvZyhyZXNvdXJjZU5hbWUsICdSZXNvdXJjZVNlcnZpY2UgU0VBUkNIX1BBR0UnLFxyXG4gICAgICAgICAge3Jlc3VsdDogYHNlYXJjaCBwYWdlIGJ5ICckeyByZXNvdXJjZU5hbWUgfScgd2FzIHBlcmZvcm1lZCBzdWNjZXNzZnVsYH0pO1xyXG4gICAgICB9KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB7QHNlZSBSZXNvdXJjZUh0dHBTZXJ2aWNlI3NlYXJjaH1cclxuICAgKi9cclxuICBwdWJsaWMgc2VhcmNoUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZVR5cGU6IG5ldyAoKSA9PiBULCBzZWFyY2hRdWVyeTogc3RyaW5nLCBvcHRpb25zPzogR2V0T3B0aW9uKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VUeXBlLCBzZWFyY2hRdWVyeX0pO1xyXG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0gcmVzb3VyY2VUeXBlWydfX3Jlc291cmNlTmFtZV9fJ107XHJcbiAgICBvcHRpb25zID0gUmVzb3VyY2VVdGlscy5maWxsUHJvamVjdGlvbk5hbWVGcm9tUmVzb3VyY2VUeXBlKHJlc291cmNlVHlwZSwgb3B0aW9ucyk7XHJcbiAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUJlZ2luTG9nKHJlc291cmNlTmFtZSwgJ1Jlc291cmNlU2VydmljZSBTRUFSQ0hfU0lOR0xFJywge3F1ZXJ5OiBzZWFyY2hRdWVyeSwgb3B0aW9uc30pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnJlc291cmNlSHR0cFNlcnZpY2Uuc2VhcmNoPFQ+KHJlc291cmNlTmFtZSwgc2VhcmNoUXVlcnksIG9wdGlvbnMpXHJcbiAgICAgIC5waXBlKHRhcCgoKSA9PiB7XHJcbiAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIFNFQVJDSF9TSU5HTEUnLFxyXG4gICAgICAgICAge3Jlc3VsdDogYHNlYXJjaCBzaW5nbGUgYnkgJyR7IHJlc291cmNlTmFtZSB9JyB3YXMgcGVyZm9ybWVkIHN1Y2Nlc3NmdWxgfSk7XHJcbiAgICAgIH0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHtAc2VlIENvbW1vblJlc291cmNlSHR0cFNlcnZpY2UjY3VzdG9tUXVlcnl9XHJcbiAgICovXHJcbiAgcHVibGljIGN1c3RvbVF1ZXJ5PFI+KHJlc291cmNlVHlwZTogbmV3ICgpID0+IFJlc291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IEh0dHBNZXRob2QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5PzogUmVxdWVzdEJvZHk8YW55PixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IFBhZ2VkR2V0T3B0aW9uKTogT2JzZXJ2YWJsZTxSPiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VUeXBlLCBtZXRob2QsIHF1ZXJ5fSk7XHJcbiAgICBjb25zdCByZXNvdXJjZU5hbWUgPSByZXNvdXJjZVR5cGVbJ19fcmVzb3VyY2VOYW1lX18nXTtcclxuICAgIG9wdGlvbnMgPSBSZXNvdXJjZVV0aWxzLmZpbGxQcm9qZWN0aW9uTmFtZUZyb21SZXNvdXJjZVR5cGUocmVzb3VyY2VUeXBlLCBvcHRpb25zKTtcclxuICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlQmVnaW5Mb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIENVU1RPTV9RVUVSWScsIHtcclxuICAgICAgbWV0aG9kOiBIdHRwTWV0aG9kLFxyXG4gICAgICBxdWVyeSxcclxuICAgICAgcmVxdWVzdEJvZHksXHJcbiAgICAgIG9wdGlvbnNcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBSZXNvdXJjZVV0aWxzLnJlc29sdmVWYWx1ZXMocmVxdWVzdEJvZHkpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmNvbW1vbkh0dHBTZXJ2aWNlLmN1c3RvbVF1ZXJ5KHJlc291cmNlTmFtZSwgbWV0aG9kLCBxdWVyeSwgYm9keSwgb3B0aW9ucylcclxuICAgICAgLnBpcGUodGFwKCgpID0+IHtcclxuICAgICAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUVuZExvZyhyZXNvdXJjZU5hbWUsICdSZXNvdXJjZVNlcnZpY2UgQ1VTVE9NX1FVRVJZJyxcclxuICAgICAgICAgIHtyZXN1bHQ6IGBjdXN0b20gcXVlcnkgYnkgJyR7IHJlc291cmNlTmFtZSB9JyB3YXMgcGVyZm9ybWVkIHN1Y2Nlc3NmdWxgfSk7XHJcbiAgICAgIH0pKSBhcyBPYnNlcnZhYmxlPFI+O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGlmZmVyZW5jZXMgYmV0d2VlbiB7QGxpbmsgSGF0ZW9hc1Jlc291cmNlU2VydmljZSNjdXN0b21RdWVyeX0gYW5kIHRoaXMgbWV0aG9kXHJcbiAgICogdGhhdCB0aGlzIG9uZSBwdXRzICdzZWFyY2gnIHBhdGggdG8gdGhlIHJlc3VsdCB1cmwgYXV0b21hdGljYWxseS5cclxuICAgKlxyXG4gICAqIHtAc2VlIENvbW1vblJlc291cmNlSHR0cFNlcnZpY2UjY3VzdG9tUXVlcnl9XHJcbiAgICovXHJcbiAgcHVibGljIGN1c3RvbVNlYXJjaFF1ZXJ5PFI+KHJlc291cmNlVHlwZTogbmV3ICgpID0+IFJlc291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IEh0dHBNZXRob2QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5PzogUmVxdWVzdEJvZHk8YW55PixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IFBhZ2VkR2V0T3B0aW9uKTogT2JzZXJ2YWJsZTxSPiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVzb3VyY2VUeXBlLCBtZXRob2QsIHNlYXJjaFF1ZXJ5fSk7XHJcbiAgICBjb25zdCByZXNvdXJjZU5hbWUgPSByZXNvdXJjZVR5cGVbJ19fcmVzb3VyY2VOYW1lX18nXTtcclxuICAgIG9wdGlvbnMgPSBSZXNvdXJjZVV0aWxzLmZpbGxQcm9qZWN0aW9uTmFtZUZyb21SZXNvdXJjZVR5cGUocmVzb3VyY2VUeXBlLCBvcHRpb25zKTtcclxuICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlQmVnaW5Mb2cocmVzb3VyY2VOYW1lLCAnUmVzb3VyY2VTZXJ2aWNlIENVU1RPTV9TRUFSQ0hfUVVFUlknLCB7XHJcbiAgICAgIG1ldGhvZDogSHR0cE1ldGhvZCxcclxuICAgICAgc2VhcmNoUXVlcnksXHJcbiAgICAgIHJlcXVlc3RCb2R5LFxyXG4gICAgICBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBib2R5ID0gUmVzb3VyY2VVdGlscy5yZXNvbHZlVmFsdWVzKHJlcXVlc3RCb2R5KTtcclxuICAgIGNvbnN0IHF1ZXJ5ID0gYC9zZWFyY2gkeyBzZWFyY2hRdWVyeS5zdGFydHNXaXRoKCcvJykgPyBzZWFyY2hRdWVyeSA6ICcvJyArIHNlYXJjaFF1ZXJ5IH1gO1xyXG4gICAgcmV0dXJuIHRoaXMuY29tbW9uSHR0cFNlcnZpY2UuY3VzdG9tUXVlcnkocmVzb3VyY2VOYW1lLCBtZXRob2QsIHF1ZXJ5LCBib2R5LCBvcHRpb25zKVxyXG4gICAgICAucGlwZSh0YXAoKCkgPT4ge1xyXG4gICAgICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlRW5kTG9nKHJlc291cmNlTmFtZSwgJ1Jlc291cmNlU2VydmljZSBDVVNUT01fU0VBUkNIX1FVRVJZJyxcclxuICAgICAgICAgIHtyZXN1bHQ6IGBjdXN0b20gc2VhcmNoIHF1ZXJ5IGJ5ICckeyByZXNvdXJjZU5hbWUgfScgd2FzIHBlcmZvcm1lZCBzdWNjZXNzZnVsYH0pO1xyXG4gICAgICB9KSkgYXMgT2JzZXJ2YWJsZTxSPjtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==