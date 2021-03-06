import { ResourceCollection } from './resource-collection';
import { BaseResource } from './base-resource';
import { Observable } from 'rxjs';
import { PageData, Sort, SortedPageParam } from '../declarations';
/**
 * Collection of resources with pagination.
 */
export declare class PagedResourceCollection<T extends BaseResource> extends ResourceCollection<T> {
    private readonly selfLink;
    private readonly nextLink;
    private readonly prevLink;
    private readonly firstLink;
    private readonly lastLink;
    readonly totalElements: number;
    readonly totalPages: number;
    readonly pageNumber: number;
    readonly pageSize: number;
    /**
     * Create a new paged resource collection from resource collection with the page data.
     *
     * @param resourceCollection collection that will be paged
     * @param pageData contains data about characteristics of the page.
     */
    constructor(resourceCollection: ResourceCollection<T>, pageData?: PageData);
    hasFirst(): boolean;
    hasLast(): boolean;
    hasNext(): boolean;
    hasPrev(): boolean;
    first(options?: {
        useCache: true;
    }): Observable<PagedResourceCollection<T>>;
    last(options?: {
        useCache: true;
    }): Observable<PagedResourceCollection<T>>;
    next(options?: {
        useCache: true;
    }): Observable<PagedResourceCollection<T>>;
    prev(options?: {
        useCache: true;
    }): Observable<PagedResourceCollection<T>>;
    page(pageNumber: number, options?: {
        useCache: true;
    }): Observable<PagedResourceCollection<T>>;
    size(size: number, options?: {
        useCache: true;
    }): Observable<PagedResourceCollection<T>>;
    sortElements(sortParam: Sort, options?: {
        useCache: true;
    }): Observable<PagedResourceCollection<T>>;
    /**
     * Perform query with custom page data.
     * That allows you change page size, current page or sort options.
     *
     * @param params contains data about new characteristics of the page.
     * @param options (optional) additional options that will be applied to the request
     * @throws error when required params are not valid or when passed inconsistent data
     */
    customPage(params: SortedPageParam, options?: {
        useCache: true;
    }): Observable<PagedResourceCollection<T>>;
}
