import { BaseResource } from './base-resource';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LinkData } from '../declarations';
/**
 * Resource class.
 * Should be extended by client model classes that represent entity objects.
 *
 * If you have an embedded entity then consider to use the {@link EmbeddedResource} class.
 */
export declare class Resource extends BaseResource {
    /**
     * Resource should has self link.
     */
    protected _links: {
        self: LinkData;
        [key: string]: LinkData;
    };
    /**
     * Adding passed entities to the resource collection behind the relation name.
     * Used POST method with 'Content-Type': 'text/uri-list'.
     *
     * This method DOES NOT REPLACE existing resources in the collection instead it adds new ones.
     * To replace collection resource with passed entities use {@link bindRelation} method.
     *
     * @param relationName used to get the specific resource relation link to the resource collection
     * @param entities one or more entities that should be added to the resource collection
     * @throws error when required params are not valid or link not found by relation name
     */
    addCollectionRelation<T extends Resource>(relationName: string, entities: Array<T>): Observable<HttpResponse<any>>;
    /**
     * Bounding the passed entity or collection of entities to this resource by the relation name.
     * Used PUT method with 'Content-Type': 'text/uri-list'.
     *
     * This method also REPLACED existing resources in the collection by passed entities.
     * To add entities to collection resource use {@link addCollectionRelation} method.
     *
     * @param relationName with which will be associated passed entity to this resource
     * @param entities one or more entities that should be bind to this resource
     * @throws error when required params are not valid or link not found by relation name
     */
    bindRelation<T extends Resource>(relationName: string, entities: T | Array<T>): Observable<HttpResponse<any>>;
    /**
     * Unbinding single resource relation behind resource name.
     * Used DELETE method to relation resource link URL.
     *
     * This method DOES NOT WORK WITH COLLECTION RESOURCE relations.
     * To clear collection resource relation use {@link unbindCollectionRelation} method.
     * To delete one resource from resource collection use {@link deleteRelation} method.
     *
     * @param relationName resource relation name to unbind
     */
    unbindRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>>;
    /**
     * Unbind all resources from collection by the relation name.
     * Used PUT method with 'Content-Type': 'text/uri-list' and EMPTY body to clear relations.
     *
     * To delete one resource from collection use {@link deleteRelation} method.
     * To delete single resource relations use {@link unbindRelation} or {@link deleteRelation} methods.
     *
     * @param relationName used to get relation link to unbind
     * @throws error when required params are not valid or link not found by relation name
     */
    unbindCollectionRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>>;
    /**
     * Deleting resource relation.
     * For collection, means that only passed entity will be unbound from the collection.
     * For single resource, deleting relation the same as @{link unbindRelation} method.
     *
     * To delete all resource relations from collection use {@link unbindCollectionRelation} method.
     *
     * @param relationName used to get relation link to unbind
     * @param entity that should be unbind from this relation
     * @throws error when required params are not valid or link not found by relation name
     */
    deleteRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>>;
    getSelfLinkHref(): string;
}
