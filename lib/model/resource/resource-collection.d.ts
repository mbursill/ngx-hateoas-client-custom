import { AbstractResource } from './abstract-resource';
import { BaseResource } from './base-resource';
/**
 * Collection of resources without pagination.
 *
 * If you want to have a pagination {@see PagedResourceCollection}.
 */
export declare class ResourceCollection<T extends BaseResource> extends AbstractResource {
    resources: Array<T>;
    /**
     * Resource collection constructor.
     * If passed param then it used as a copy constructor.
     *
     * @param that (optional) another resource collection using to copy data from to current object
     */
    constructor(that?: ResourceCollection<T>);
}
