import { Resource } from './resource/resource';
import { BaseResource } from './resource/base-resource';
/**
 * Decorator used to classes that extend {@link Resource} class to register 'resourceName' and 'resourceType'
 * information about this resource.
 *
 * @param resourceName resource name which will be used to build a resource URL.
 */
export declare function HateoasResource(resourceName: string): <T extends new (...args: any[]) => any>(constructor: T) => T;
/**
 * Decorator used to classes that extend {@link EmbeddedResource} class to register 'relationNames' and 'resourceType'
 * information about this resource.
 *
 * @param relationNames names of the properties that using to hold this embedded resource in resource objects.
 */
export declare function HateoasEmbeddedResource(relationNames: Array<string>): <T extends new (...args: any[]) => any>(constructor: T) => void;
/**
 * Decorator used to create a projection representation of {@link Resource} heirs.
 *
 * @param resourceType type of resource that using for projection.
 * @param projectionName name of projection, will be used as projection request param.
 */
export declare function HateoasProjection(resourceType: new () => Resource, projectionName: string): <T extends new (...args: any[]) => any>(constructor: T) => T;
/**
 * Decorator used to mark projection class properties that are resources and specifying class type used to create this relation.
 * This decorator used with class marked as {@link HateoasProjection}.
 *
 * @param relationType resource relation type that will be used to create resource with this type when parsed server response.
 */
export declare function ProjectionRel(relationType: new () => BaseResource): (target: object, propertyKey: string) => void;
