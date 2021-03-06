import { HttpExecutor } from '../http-executor';
import { Observable } from 'rxjs';
import { HttpMethod, PagedGetOption } from '../../model/declarations';
import { HttpClient } from '@angular/common/http';
import { ResourceCacheService } from './cache/resource-cache.service';
import * as i0 from "@angular/core";
/**
 * Service to perform HTTP requests to get any type of the {@link Resource}, {@link PagedResourceCollection}, {@link ResourceCollection}.
 */
export declare class CommonResourceHttpService extends HttpExecutor {
    constructor(httpClient: HttpClient, cacheService: ResourceCacheService);
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
    customQuery(resourceName: string, method: HttpMethod, query: string, body?: any, options?: PagedGetOption): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CommonResourceHttpService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CommonResourceHttpService>;
}
