import { Observable } from 'rxjs';
import { AbstractResource } from './abstract-resource';
import { ResourceCollection } from './resource-collection';
import { GetOption, PagedGetOption, RequestBody, RequestOption } from '../declarations';
import { HttpResponse } from '@angular/common/http';
import { PagedResourceCollection } from './paged-resource-collection';
/**
 * Common resource class.
 */
export declare abstract class BaseResource extends AbstractResource {
    /**
     * Get single resource by the relation name.
     *
     * @param relationName used to get the specific relation link
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    getRelation<T extends BaseResource>(relationName: string, options?: GetOption): Observable<T>;
    /**
     * Get collection of resources by the relation name.
     *
     * @param relationName used to get the specific relation link
     * @param options (optional) options that will be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    getRelatedCollection<T extends ResourceCollection<BaseResource>>(relationName: string, options?: GetOption): Observable<T>;
    /**
     * Get paged collection of resources by the relation name.
     *
     * @param relationName used to get the specific relation link
     * @param options (optional) additional options that should be applied to the request
     *        if options didn't contains {@link PageParam} then will be used default page params.
     * @throws error when required params are not valid or link not found by relation name
     */
    getRelatedPage<T extends PagedResourceCollection<BaseResource>>(relationName: string, options?: PagedGetOption): Observable<T>;
    /**
     *  Perform POST request to the relation with the body and url params.
     *
     * @param relationName used to get the specific relation link
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) request options that will be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    postRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<HttpResponse<any> | any>;
    /**
     * Perform PATCH request to relation with body and url params.
     *
     * @param relationName used to get the specific relation link
     * @param requestBody contains the body directly and body values option {@link ValuesOption}
     *        to clarify what specific values need to be included or not included in result request body
     * @param options (optional) request options that will be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    patchRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<HttpResponse<any> | any>;
    /**
     * Perform PUT request to relation with body and url params.
     *
     * @param relationName used to get the specific relation link
     * @param requestBody contains the body directly and body values option {@link ValuesOption}
     *        to clarify what specific values need to be included or not included in result request body
     * @param options (optional) request options that will be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    putRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<HttpResponse<any> | any>;
}
