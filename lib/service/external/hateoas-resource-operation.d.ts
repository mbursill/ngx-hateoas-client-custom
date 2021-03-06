import { Observable } from 'rxjs';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption } from '../../model/declarations';
import { Resource } from '../../model/resource/resource';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { HttpResponse } from '@angular/common/http';
/**
 * Main resource operation class.
 * Extend this class to create resource service.
 */
export declare class HateoasResourceOperation<T extends Resource> {
    private readonly resourceType;
    private hateoasResourceService;
    constructor(resourceType: new () => T);
    /**
     * {@link HateoasResourceService#getResource}.
     */
    getResource(id: number | string, options?: GetOption): Observable<T>;
    /**
     * {@link HateoasResourceService#getCollection}.
     */
    getCollection(options?: GetOption): Observable<ResourceCollection<T>>;
    /**
     * {@link HateoasResourceService#getPage}.
     */
    getPage(options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
    /**
     * {@link HateoasResourceService#createResource}.
     */
    createResource(requestBody: RequestBody<T>, options?: RequestOption): Observable<any>;
    /**
     * {@link HateoasResourceService#updateResource}.
     */
    updateResource(entity: T, requestBody?: RequestBody<any>, options?: RequestOption): Observable<T | any>;
    /**
     * {@link HateoasResourceService#updateResourceById}.
     */
    updateResourceById(id: number | string, requestBody: RequestBody<any>, options?: RequestOption): Observable<T | any>;
    /**
     * {@link HateoasResourceService#patchResource}.
     */
    patchResource(entity: T, requestBody?: RequestBody<any>, options?: RequestOption): Observable<T | any>;
    /**
     * {@link HateoasResourceService#patchResourceById}.
     */
    patchResourceById(id: number | string, requestBody: RequestBody<any>, options?: RequestOption): Observable<T | any>;
    /**
     * {@link HateoasResourceService#deleteResource}.
     */
    deleteResource(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any>;
    /**
     * {@link HateoasResourceService#deleteResourceById}.
     */
    deleteResourceById(id: number | string, options?: RequestOption): Observable<HttpResponse<any> | any>;
    /**
     * {@see ResourceCollectionHttpService#search}
     */
    searchCollection(query: string, options?: GetOption): Observable<ResourceCollection<T>>;
    /**
     * {@see PagedResourceCollection#search}
     */
    searchPage(query: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
    /**
     * {@see ResourceHttpService#search}
     */
    searchResource(query: string, options?: GetOption): Observable<T>;
    /**
     * {@see ResourceHttpService#customQuery}
     */
    customQuery<R>(method: HttpMethod, query: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
    /**
     * {@see ResourceHttpService#customSearchQuery}
     */
    customSearchQuery<R>(method: HttpMethod, searchQuery: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
}
