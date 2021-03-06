import { Observable } from 'rxjs';
import { ResourceHttpService } from '../internal/resource-http.service';
import { PagedResourceCollectionHttpService } from '../internal/paged-resource-collection-http.service';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption } from '../../model/declarations';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { ResourceCollectionHttpService } from '../internal/resource-collection-http.service';
import { CommonResourceHttpService } from '../internal/common-resource-http.service';
import { Resource } from '../../model/resource/resource';
import { HttpResponse } from '@angular/common/http';
import * as i0 from "@angular/core";
/**
 * Service to operate with {@link Resource}.
 *
 * Can be injected as standalone service to work with {@link Resource}.
 */
export declare class HateoasResourceService {
    private commonHttpService;
    private resourceHttpService;
    private resourceCollectionHttpService;
    private pagedResourceCollectionHttpService;
    constructor(commonHttpService: CommonResourceHttpService, resourceHttpService: ResourceHttpService, resourceCollectionHttpService: ResourceCollectionHttpService, pagedResourceCollectionHttpService: PagedResourceCollectionHttpService);
    /**
     * Get resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    getResource<T extends Resource>(resourceType: new () => T, id: number | string, options?: GetOption): Observable<T>;
    /**
     * Get collection of the resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    getCollection<T extends Resource>(resourceType: new () => T, options?: GetOption): Observable<ResourceCollection<T>>;
    /**
     * Get paged collection of the resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    getPage<T extends Resource>(resourceType: new () => T, options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
    /**
     * Create resource.
     *
     * @param resourceType resource for which will perform request
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    createResource<T extends Resource>(resourceType: new () => T, requestBody: RequestBody<T>, options?: RequestOption): Observable<T | any>;
    /**
     * Updating all resource properties at the time to passed body properties. If some properties are not passed then will be used null value.
     * If you need update some part resource properties, use {@link HateoasResourceService#patchResource} method.
     *
     * @param entity to update
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    updateResource<T extends Resource>(entity: T, requestBody?: RequestBody<any>, options?: RequestOption): Observable<T | any>;
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
    updateResourceById<T extends Resource>(resourceType: new () => T, id: number | string, requestBody: RequestBody<any>, options?: RequestOption): Observable<T | any>;
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
    patchResource<T extends Resource>(entity: T, requestBody?: RequestBody<any>, options?: RequestOption): Observable<T | any>;
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
    patchResourceById<T extends Resource>(resourceType: new () => T, id: number | string, requestBody: RequestBody<any>, options?: RequestOption): Observable<T | any>;
    /**
     * Delete resource.
     *
     * @param entity to delete
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    deleteResource<T extends Resource>(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any>;
    /**
     * Delete resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    deleteResourceById<T extends Resource>(resourceType: new () => T, id: number | string, options?: RequestOption): Observable<HttpResponse<any> | any>;
    /**
     * {@see ResourceCollectionHttpService#search}
     */
    searchCollection<T extends Resource>(resourceType: new () => T, searchQuery: string, options?: GetOption): Observable<ResourceCollection<T>>;
    /**
     * {@see PagedResourceCollection#search}
     */
    searchPage<T extends Resource>(resourceType: new () => T, searchQuery: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
    /**
     * {@see ResourceHttpService#search}
     */
    searchResource<T extends Resource>(resourceType: new () => T, searchQuery: string, options?: GetOption): Observable<T>;
    /**
     * {@see CommonResourceHttpService#customQuery}
     */
    customQuery<R>(resourceType: new () => Resource, method: HttpMethod, query: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
    /**
     * Differences between {@link HateoasResourceService#customQuery} and this method
     * that this one puts 'search' path to the result url automatically.
     *
     * {@see CommonResourceHttpService#customQuery}
     */
    customSearchQuery<R>(resourceType: new () => Resource, method: HttpMethod, searchQuery: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
    static ??fac: i0.????FactoryDeclaration<HateoasResourceService, never>;
    static ??prov: i0.????InjectableDeclaration<HateoasResourceService>;
}
