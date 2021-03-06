import { HttpParams } from '@angular/common/http';
/**
 * Contains all needed information about a resource.
 * It generates a string cache key to hold in a cache map from information about a resource.
 */
export declare class CacheKey {
    readonly url: string;
    private readonly options;
    /**
     * String cache key value.
     */
    value: string;
    private constructor();
    /**
     * Create cache key from resource url and request params.
     *
     * @param url resource url
     * @param params request params
     */
    static of(url: string, params: {
        observe?: 'body' | 'response';
        params?: HttpParams;
    }): CacheKey;
}
