import { BaseResource } from './base-resource';
/**
 * Using for model classes that it's not Resource but can hold Resources as property, for example is Embeddable entity.
 * A distinctive feature of such resources is that they do not have the <b>self</b> link while {@link Resource} has.
 * It's related with that Embeddable entity can't have an id property.
 *
 * Usage example:
 *
 * // Regular resource
 * class Product extends Resource {
 *   name: string;
 * }
 *
 * // EmbeddedResource that holds Product resource.
 * class CartItem extends EmbeddedResource {
 *   product: Product;
 * }
 */
export class EmbeddedResource extends BaseResource {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWRkZWQtcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaGF0ZW9hcy1jbGllbnQvc3JjL2xpYi9tb2RlbC9yZXNvdXJjZS9lbWJlZGRlZC1yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0M7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsWUFBWTtDQUNqRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VSZXNvdXJjZSB9IGZyb20gJy4vYmFzZS1yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVXNpbmcgZm9yIG1vZGVsIGNsYXNzZXMgdGhhdCBpdCdzIG5vdCBSZXNvdXJjZSBidXQgY2FuIGhvbGQgUmVzb3VyY2VzIGFzIHByb3BlcnR5LCBmb3IgZXhhbXBsZSBpcyBFbWJlZGRhYmxlIGVudGl0eS5cclxuICogQSBkaXN0aW5jdGl2ZSBmZWF0dXJlIG9mIHN1Y2ggcmVzb3VyY2VzIGlzIHRoYXQgdGhleSBkbyBub3QgaGF2ZSB0aGUgPGI+c2VsZjwvYj4gbGluayB3aGlsZSB7QGxpbmsgUmVzb3VyY2V9IGhhcy5cclxuICogSXQncyByZWxhdGVkIHdpdGggdGhhdCBFbWJlZGRhYmxlIGVudGl0eSBjYW4ndCBoYXZlIGFuIGlkIHByb3BlcnR5LlxyXG4gKlxyXG4gKiBVc2FnZSBleGFtcGxlOlxyXG4gKlxyXG4gKiAvLyBSZWd1bGFyIHJlc291cmNlXHJcbiAqIGNsYXNzIFByb2R1Y3QgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAqICAgbmFtZTogc3RyaW5nO1xyXG4gKiB9XHJcbiAqXHJcbiAqIC8vIEVtYmVkZGVkUmVzb3VyY2UgdGhhdCBob2xkcyBQcm9kdWN0IHJlc291cmNlLlxyXG4gKiBjbGFzcyBDYXJ0SXRlbSBleHRlbmRzIEVtYmVkZGVkUmVzb3VyY2Uge1xyXG4gKiAgIHByb2R1Y3Q6IFByb2R1Y3Q7XHJcbiAqIH1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBFbWJlZGRlZFJlc291cmNlIGV4dGVuZHMgQmFzZVJlc291cmNlIHtcclxufVxyXG4iXX0=