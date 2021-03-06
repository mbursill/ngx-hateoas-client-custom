import { BaseResource } from '../model/resource/base-resource';
import { ResourceCollection } from '../model/resource/resource-collection';
import { PagedResourceCollection } from '../model/resource/paged-resource-collection';
import { GetOption, RequestBody } from '../model/declarations';
import { Resource } from '../model/resource/resource';
import { EmbeddedResource } from '../model/resource/embedded-resource';
export declare class ResourceUtils {
    static RESOURCE_NAME_TYPE_MAP: Map<string, any>;
    static RESOURCE_NAME_PROJECTION_TYPE_MAP: Map<string, any>;
    static RESOURCE_PROJECTION_REL_NAME_TYPE_MAP: Map<string, any>;
    static EMBEDDED_RESOURCE_TYPE_MAP: Map<string, any>;
    private static resourceType;
    private static resourceCollectionType;
    private static pagedResourceCollectionType;
    private static embeddedResourceType;
    static useResourceType(type: new () => Resource): void;
    static useResourceCollectionType(type: new () => ResourceCollection<BaseResource>): void;
    static usePagedResourceCollectionType(type: new (collection: ResourceCollection<BaseResource>) => PagedResourceCollection<BaseResource>): void;
    static useEmbeddedResourceType(type: new () => EmbeddedResource): void;
    static instantiateResource<T extends BaseResource>(payload: object, isProjection?: boolean): T;
    private static resolvePayloadProperties;
    private static resolvePayloadType;
    private static createResource;
    private static createResourceProjectionRel;
    private static createEmbeddedResource;
    static instantiateResourceCollection<T extends ResourceCollection<BaseResource>>(payload: object, isProjection?: boolean): T;
    static instantiatePagedResourceCollection<T extends PagedResourceCollection<BaseResource>>(payload: object, isProjection?: boolean): T;
    /**
     * Resolve request body relations.
     * If request body has {@link Resource} value then this value will be replaced by resource self link.
     * If request body has {@link ValuesOption} it will be applied to body values.
     *
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     */
    static resolveValues(requestBody: RequestBody<any>): any;
    /**
     * Assign {@link Resource} or {@link EmbeddedResource} properties to passed entity.
     *
     * @param entity to be converter to resource
     */
    static initResource(entity: any): BaseResource | any;
    /**
     * Define resource name based on resource links.
     * It will get link name that href equals to self href resource link.
     *
     * @param payload that can be a resource for which to find the name
     */
    private static findResourceName;
    /**
     * Checks is a resource projection or not.
     *
     * @param payload object that can be resource or resource projection
     */
    private static isResourceProjection;
    /**
     * Try to get projectionName from resource type and set it to options. If resourceType has not projectionName then return options as is.
     *
     * @param resourceType from get projectionName
     * @param options to set projectionName
     */
    static fillProjectionNameFromResourceType<T extends Resource>(resourceType: new () => T, options?: GetOption): GetOption;
}
