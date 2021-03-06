import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceCacheService } from './internal/cache/resource-cache.service';
import { HttpClientOptions } from '../model/declarations';
/**
 * Base class with common logics to perform HTTP requests.
 */
export declare class HttpExecutor {
    protected httpClient: HttpClient;
    protected cacheService: ResourceCacheService;
    constructor(httpClient: HttpClient, cacheService: ResourceCacheService);
    private static logRequest;
    private static logResponse;
    /**
     * Perform GET request.
     *
     * @param url to perform request
     * @param options (optional) options that applied to the request
     * @param useCache value {@code true} if need to use cache, {@code false} otherwise
     * @throws error when required params are not valid
     */
    getHttp(url: string, options?: HttpClientOptions, useCache?: boolean): Observable<any>;
    /**
     * Perform POST request.
     *
     * @param url to perform request
     * @param body to send with request
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    postHttp(url: string, body: any | null, options?: HttpClientOptions): Observable<any>;
    /**
     * Perform PUT request.
     *
     * @param url to perform request
     * @param body to send with request
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    putHttp(url: string, body: any | null, options?: HttpClientOptions): Observable<any>;
    /**
     * Perform PATCH request.
     *
     * @param url to perform request
     * @param body to send with request
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    patchHttp(url: string, body: any | null, options?: HttpClientOptions): Observable<any>;
    /**
     * Perform DELETE request.
     *
     * @param url to perform request
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    deleteHttp(url: string, options?: HttpClientOptions): Observable<any>;
}
