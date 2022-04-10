import { AbstractResource } from './abstract-resource';
/**
 * Collection of resources without pagination.
 *
 * If you want to have a pagination {@see PagedResourceCollection}.
 */
export class ResourceCollection extends AbstractResource {
    /**
     * Resource collection constructor.
     * If passed param then it used as a copy constructor.
     *
     * @param that (optional) another resource collection using to copy data from to current object
     */
    constructor(that) {
        super();
        this.resources = [];
        if (that) {
            this._links = that._links;
            this.resources = that.resources;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UtY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1oYXRlb2FzLWNsaWVudC9zcmMvbGliL21vZGVsL3Jlc291cmNlL3Jlc291cmNlLWNvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHdkQ7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxrQkFBMkMsU0FBUSxnQkFBZ0I7SUFJOUU7Ozs7O09BS0c7SUFDSCxZQUFZLElBQTRCO1FBQ3RDLEtBQUssRUFBRSxDQUFDO1FBVEgsY0FBUyxHQUFhLEVBQUUsQ0FBQztRQVU5QixJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDakM7SUFDSCxDQUFDO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnN0cmFjdFJlc291cmNlIH0gZnJvbSAnLi9hYnN0cmFjdC1yZXNvdXJjZSc7XHJcbmltcG9ydCB7IEJhc2VSZXNvdXJjZSB9IGZyb20gJy4vYmFzZS1yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogQ29sbGVjdGlvbiBvZiByZXNvdXJjZXMgd2l0aG91dCBwYWdpbmF0aW9uLlxyXG4gKlxyXG4gKiBJZiB5b3Ugd2FudCB0byBoYXZlIGEgcGFnaW5hdGlvbiB7QHNlZSBQYWdlZFJlc291cmNlQ29sbGVjdGlvbn0uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VDb2xsZWN0aW9uPFQgZXh0ZW5kcyBCYXNlUmVzb3VyY2U+IGV4dGVuZHMgQWJzdHJhY3RSZXNvdXJjZSB7XHJcblxyXG4gIHB1YmxpYyByZXNvdXJjZXM6IEFycmF5PFQ+ID0gW107XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc291cmNlIGNvbGxlY3Rpb24gY29uc3RydWN0b3IuXHJcbiAgICogSWYgcGFzc2VkIHBhcmFtIHRoZW4gaXQgdXNlZCBhcyBhIGNvcHkgY29uc3RydWN0b3IuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdGhhdCAob3B0aW9uYWwpIGFub3RoZXIgcmVzb3VyY2UgY29sbGVjdGlvbiB1c2luZyB0byBjb3B5IGRhdGEgZnJvbSB0byBjdXJyZW50IG9iamVjdFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHRoYXQ/OiBSZXNvdXJjZUNvbGxlY3Rpb248VD4pIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBpZiAodGhhdCkge1xyXG4gICAgICB0aGlzLl9saW5rcyA9IHRoYXQuX2xpbmtzO1xyXG4gICAgICB0aGlzLnJlc291cmNlcyA9IHRoYXQucmVzb3VyY2VzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19