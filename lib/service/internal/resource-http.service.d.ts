import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseResource } from '../../model/resource/base-resource';
import { GetOption, RequestOption } from '../../model/declarations';
import { HttpExecutor } from '../http-executor';
import { ResourceCacheService } from './cache/resource-cache.service';
import * as i0 from "@angular/core";
/**
 * Get instance of the ResourceHttpService by Angular DependencyInjector.
 */
export declare function getResourceHttpService(): ResourceHttpService;
/**
 * Service to perform HTTP requests to get {@link Resource} type.
 */
export declare class ResourceHttpService extends HttpExecutor {
    constructor(httpClient: HttpClient, cacheService: ResourceCacheService);
    /**
     * Perform GET request to retrieve resource.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid or returned resource type is not resource
     */
    get<T extends BaseResource>(url: string, options?: GetOption): Observable<T>;
    /**
     * Perform POST request.
     *
     * @param url to perform request
     * @param body request body
     * @param options request options
     * @throws error when required params are not valid
     */
    post(url: string, body: any | null, options?: RequestOption): Observable<any>;
    /**
     * Perform PUT request.
     *
     * @param url to perform request
     * @param body request body
     * @param options request options
     * @throws error when required params are not valid
     */
    put(url: string, body: any | null, options?: RequestOption): Observable<any>;
    /**
     * Perform PATCH request.
     *
     * @param url to perform request
     * @param body request body
     * @param options request options
     * @throws error when required params are not valid
     */
    patch(url: string, body: any | null, options?: RequestOption): Observable<any>;
    /**
     * Perform DELETE request.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid
     */
    delete(url: string, options?: RequestOption): Observable<any>;
    /**
     * Perform get resource request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param id resource id
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    getResource<T extends BaseResource>(resourceName: string, id: number | string, options?: GetOption): Observable<T>;
    /**
     * Perform POST resource request with url built by the resource name.
     *
     * @param resourceName to be post
     * @param body resource to create
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    postResource(resourceName: string, body: BaseResource, options?: RequestOption): Observable<any>;
    /**
     * Perform PATCH resource request with url built by the resource name and resource id.
     *
     * @param resourceName to be patched
     * @param id resource id
     * @param body contains data to patch resource properties
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    patchResource(resourceName: string, id: number | string, body: any, options?: RequestOption): Observable<any>;
    /**
     * Perform PUT resource request with url built by the resource name and resource id.
     *
     * @param resourceName to be put
     * @param id resource id
     * @param body contains data to replace resource properties
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    putResource(resourceName: string, id: number | string, body: any, options?: RequestOption): Observable<any>;
    /**
     * Perform DELETE resource request with url built by the resource name and resource id.
     *
     * @param resourceName to be deleted
     * @param id resource id
     * @param options (optional) additional options that will be applied to the request
     * @throws error when required params are not valid
     */
    deleteResource(resourceName: string, id: number | string, options?: RequestOption): Observable<any>;
    /**
     * Perform search single resource request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param searchQuery name of the search method
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    search<T extends BaseResource>(resourceName: string, searchQuery: string, options?: GetOption): Observable<T>;
    static ??fac: i0.????FactoryDeclaration<ResourceHttpService, never>;
    static ??prov: i0.????InjectableDeclaration<ResourceHttpService>;
}
