export declare function isEmbeddedResource(object: any): boolean;
export declare function isResource(object: any): boolean;
export declare function isResourceCollection(object: any): boolean;
export declare function isPagedResourceCollection(object: any): boolean;
/**
 * Check that passed object has links property.
 *
 * @param object which need to check links property
 */
export declare function isResourceObject(object: any): boolean;
/**
 * Defining resource type bypassed object.
 *
 * @param object that presumably is one of resource type
 */
export declare function getResourceType(object: any): string;
