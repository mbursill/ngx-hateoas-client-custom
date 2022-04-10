import { isEmpty } from 'lodash-es';
/**
 * Abstract impl identifies resource interface.
 */
export class AbstractResource {
    /**
     * Get relation link by relation name.
     *
     * @param relationName used to get the specific resource relation link
     * @throws error if no link is found by passed relation name
     */
    getRelationLink(relationName) {
        if (isEmpty(this._links)) {
            throw new Error(`Resource '${this.constructor.name}' relation links are empty, can not to get relation with the name '${relationName}'.`);
        }
        const relationLink = this._links[relationName];
        if (isEmpty(relationLink) || isEmpty(relationLink.href)) {
            throw new Error(`Resource '${this.constructor.name}' has not relation link with the name '${relationName}'.`);
        }
        return relationLink;
    }
    /**
     * Checks if relation link is present.
     *
     * @param relationName used to check for the specified relation name
     * @returns true if link is present, false otherwise
     */
    hasRelation(relationName) {
        if (isEmpty(this._links)) {
            return false;
        }
        else {
            return !isEmpty(this._links[relationName]);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaGF0ZW9hcy1jbGllbnQvc3JjL2xpYi9tb2RlbC9yZXNvdXJjZS9hYnN0cmFjdC1yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRXBDOztHQUVHO0FBQ0gsTUFBTSxPQUFnQixnQkFBZ0I7SUFRcEM7Ozs7O09BS0c7SUFDSSxlQUFlLENBQUMsWUFBb0I7UUFDekMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUssc0VBQXVFLFlBQWEsSUFBSSxDQUFDLENBQUM7U0FDL0k7UUFFRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9DLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxhQUFjLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSywwQ0FBMkMsWUFBYSxJQUFJLENBQUMsQ0FBQztTQUNuSDtRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFdBQVcsQ0FBQyxZQUFvQjtRQUNyQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDeEIsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNO1lBQ0wsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMaW5rLCBMaW5rRGF0YSB9IGZyb20gJy4uL2RlY2xhcmF0aW9ucyc7XHJcbmltcG9ydCB7IGlzRW1wdHkgfSBmcm9tICdsb2Rhc2gtZXMnO1xyXG5cclxuLyoqXHJcbiAqIEFic3RyYWN0IGltcGwgaWRlbnRpZmllcyByZXNvdXJjZSBpbnRlcmZhY2UuXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RSZXNvdXJjZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3Qgb2YgbGlua3MgcmVsYXRlZCB3aXRoIHRoZSByZXNvdXJjZS5cclxuICAgKi9cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXHJcbiAgcHJvdGVjdGVkIF9saW5rczogTGluaztcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHJlbGF0aW9uIGxpbmsgYnkgcmVsYXRpb24gbmFtZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUgdXNlZCB0byBnZXQgdGhlIHNwZWNpZmljIHJlc291cmNlIHJlbGF0aW9uIGxpbmtcclxuICAgKiBAdGhyb3dzIGVycm9yIGlmIG5vIGxpbmsgaXMgZm91bmQgYnkgcGFzc2VkIHJlbGF0aW9uIG5hbWVcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0UmVsYXRpb25MaW5rKHJlbGF0aW9uTmFtZTogc3RyaW5nKTogTGlua0RhdGEge1xyXG4gICAgaWYgKGlzRW1wdHkodGhpcy5fbGlua3MpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUmVzb3VyY2UgJyR7IHRoaXMuY29uc3RydWN0b3IubmFtZSB9JyByZWxhdGlvbiBsaW5rcyBhcmUgZW1wdHksIGNhbiBub3QgdG8gZ2V0IHJlbGF0aW9uIHdpdGggdGhlIG5hbWUgJyR7IHJlbGF0aW9uTmFtZSB9Jy5gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZWxhdGlvbkxpbmsgPSB0aGlzLl9saW5rc1tyZWxhdGlvbk5hbWVdO1xyXG4gICAgaWYgKGlzRW1wdHkocmVsYXRpb25MaW5rKSB8fCBpc0VtcHR5KHJlbGF0aW9uTGluay5ocmVmKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlc291cmNlICckeyB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgfScgaGFzIG5vdCByZWxhdGlvbiBsaW5rIHdpdGggdGhlIG5hbWUgJyR7IHJlbGF0aW9uTmFtZSB9Jy5gKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVsYXRpb25MaW5rO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2tzIGlmIHJlbGF0aW9uIGxpbmsgaXMgcHJlc2VudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUgdXNlZCB0byBjaGVjayBmb3IgdGhlIHNwZWNpZmllZCByZWxhdGlvbiBuYW1lXHJcbiAgICogQHJldHVybnMgdHJ1ZSBpZiBsaW5rIGlzIHByZXNlbnQsIGZhbHNlIG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBoYXNSZWxhdGlvbihyZWxhdGlvbk5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKGlzRW1wdHkodGhpcy5fbGlua3MpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAhaXNFbXB0eSh0aGlzLl9saW5rc1tyZWxhdGlvbk5hbWVdKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiJdfQ==