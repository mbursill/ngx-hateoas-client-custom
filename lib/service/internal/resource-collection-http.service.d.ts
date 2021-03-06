import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { BaseResource } from '../../model/resource/base-resource';
import { GetOption } from '../../model/declarations';
import { HttpExecutor } from '../http-executor';
import { ResourceCacheService } from './cache/resource-cache.service';
import * as i0 from "@angular/core";
export declare function getResourceCollectionHttpService(): ResourceCollectionHttpService;
/**
 * Service to perform HTTP requests to get {@link ResourceCollection} type.
 */
export declare class ResourceCollectionHttpService extends HttpExecutor {
    constructor(httpClient: HttpClient, cacheService: ResourceCacheService);
    /**
     * Perform GET request to retrieve collection of the resources.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid or returned resource type is not collection of the resources
     */
    get<T extends ResourceCollection<BaseResource>>(url: string, options?: GetOption): Observable<T>;
    /**
     * Perform get resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    getResourceCollection<T extends ResourceCollection<BaseResource>>(resourceName: string, options?: GetOption): Observable<T>;
    /**
     *  Perform search resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param searchQuery name of the search method
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    search<T extends ResourceCollection<BaseResource>>(resourceName: string, searchQuery: string, options?: GetOption): Observable<T>;
    static ??fac: i0.????FactoryDeclaration<ResourceCollectionHttpService, never>;
    static ??prov: i0.????InjectableDeclaration<ResourceCollectionHttpService>;
}
