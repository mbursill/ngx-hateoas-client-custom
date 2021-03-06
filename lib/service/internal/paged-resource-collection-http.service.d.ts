import { BaseResource } from '../../model/resource/base-resource';
import { HttpClient } from '@angular/common/http';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { Observable } from 'rxjs';
import { PagedGetOption } from '../../model/declarations';
import { HttpExecutor } from '../http-executor';
import { ResourceCacheService } from './cache/resource-cache.service';
import * as i0 from "@angular/core";
/**
 * Get instance of the PagedResourceCollectionHttpService by Angular DependencyInjector.
 */
export declare function getPagedResourceCollectionHttpService(): PagedResourceCollectionHttpService;
/**
 * Service to perform HTTP requests to get {@link PagedResourceCollection} type.
 */
export declare class PagedResourceCollectionHttpService extends HttpExecutor {
    constructor(httpClient: HttpClient, cacheService: ResourceCacheService);
    /**
     * Perform GET request to retrieve paged collection of the resources.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid or returned resource type is not paged collection of the resources
     */
    get<T extends PagedResourceCollection<BaseResource>>(url: string, options?: PagedGetOption): Observable<T>;
    /**
     * Perform get paged resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    getResourcePage<T extends PagedResourceCollection<BaseResource>>(resourceName: string, options?: PagedGetOption): Observable<T>;
    /**
     *  Perform search paged resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param searchQuery name of the search method
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    search<T extends PagedResourceCollection<BaseResource>>(resourceName: string, searchQuery: string, options?: PagedGetOption): Observable<T>;
    static ??fac: i0.????FactoryDeclaration<PagedResourceCollectionHttpService, never>;
    static ??prov: i0.????InjectableDeclaration<PagedResourceCollectionHttpService>;
}
