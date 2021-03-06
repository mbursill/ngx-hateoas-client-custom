import { CacheKey } from './model/cache-key';
import { ResourceIdentifiable } from '../../../model/declarations';
import * as i0 from "@angular/core";
export declare class ResourceCacheService {
    private cacheMap;
    /**
     * Get cached resource value.
     *
     * @param key cache key
     * @return cached value or {@code null} when cached value is not exist or expired
     */
    getResource(key: CacheKey): ResourceIdentifiable;
    /**
     * Add resource value to the cache.
     * Before add new value, previous will be deleted if it was exist.
     *
     * @param key cache key
     * @param value cache value
     */
    putResource(key: CacheKey, value: ResourceIdentifiable): void;
    /**
     * Delete cached resource value by passed key.
     *
     * @param key cache key
     */
    evictResource(key: CacheKey): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResourceCacheService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ResourceCacheService>;
}
