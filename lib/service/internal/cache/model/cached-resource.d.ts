/**
 * Represents cache resource model that contains resource and time when resource was added to the cache.
 */
import { ResourceIdentifiable } from '../../../../model/declarations';
export declare class CachedResource {
    /**
     * Cached resource value.
     * It's can be {@link Resource}, {@link ResourceCollection}, {@link PagedResourceCollection}.
     */
    value: ResourceIdentifiable;
    /**
     * Time when value was added to the cache.
     */
    cachedTime: Date;
    constructor(value: any, cachedTime: Date);
}
