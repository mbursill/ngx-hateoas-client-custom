import { Link, LinkData } from '../declarations';
/**
 * Abstract impl identifies resource interface.
 */
export declare abstract class AbstractResource {
    /**
     * List of links related with the resource.
     */
    protected _links: Link;
    /**
     * Get relation link by relation name.
     *
     * @param relationName used to get the specific resource relation link
     * @throws error if no link is found by passed relation name
     */
    getRelationLink(relationName: string): LinkData;
    /**
     * Checks if relation link is present.
     *
     * @param relationName used to check for the specified relation name
     * @returns true if link is present, false otherwise
     */
    hasRelation(relationName: string): boolean;
}
