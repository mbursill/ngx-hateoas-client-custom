/**
 * Contains all needed information about a resource.
 * It generates a string cache key to hold in a cache map from information about a resource.
 */
export class CacheKey {
    constructor(url, options) {
        this.url = url;
        this.options = options;
        this.value = `url=${this.url}`;
        if (options) {
            if (options.params && options.params.keys().length > 0) {
                this.value += `${this.value.includes('?') ? '&' : '?'}${this.options?.params?.toString()}`;
            }
            if (options.observe) {
                this.value += `&observe=${this.options?.observe}`;
            }
        }
    }
    /**
     * Create cache key from resource url and request params.
     *
     * @param url resource url
     * @param params request params
     */
    static of(url, params) {
        return new CacheKey(url, params);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUta2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWhhdGVvYXMtY2xpZW50L3NyYy9saWIvc2VydmljZS9pbnRlcm5hbC9jYWNoZS9tb2RlbC9jYWNoZS1rZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLFFBQVE7SUFPbkIsWUFBb0MsR0FBVyxFQUFtQixPQUdqRTtRQUhtQyxRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQW1CLFlBQU8sR0FBUCxPQUFPLENBR3hFO1FBQ0MsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFRLElBQUksQ0FBQyxHQUFJLEVBQUUsQ0FBQztRQUNqQyxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3RELElBQUksQ0FBQyxLQUFLLElBQUksR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFJLEdBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFHLEVBQUUsQ0FBQzthQUNoRztZQUNELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDbkIsSUFBSSxDQUFDLEtBQUssSUFBSSxZQUFhLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBUSxFQUFFLENBQUM7YUFDckQ7U0FDRjtJQUNILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBVyxFQUFFLE1BRzdCO1FBQ0MsT0FBTyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbi8qKlxyXG4gKiBDb250YWlucyBhbGwgbmVlZGVkIGluZm9ybWF0aW9uIGFib3V0IGEgcmVzb3VyY2UuXHJcbiAqIEl0IGdlbmVyYXRlcyBhIHN0cmluZyBjYWNoZSBrZXkgdG8gaG9sZCBpbiBhIGNhY2hlIG1hcCBmcm9tIGluZm9ybWF0aW9uIGFib3V0IGEgcmVzb3VyY2UuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FjaGVLZXkge1xyXG5cclxuICAvKipcclxuICAgKiBTdHJpbmcgY2FjaGUga2V5IHZhbHVlLlxyXG4gICAqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG5cclxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB1cmw6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiB7XHJcbiAgICBvYnNlcnZlPzogJ2JvZHknIHwgJ3Jlc3BvbnNlJztcclxuICAgIHBhcmFtcz86IEh0dHBQYXJhbXNcclxuICB9KSB7XHJcbiAgICB0aGlzLnZhbHVlID0gYHVybD0keyB0aGlzLnVybCB9YDtcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLnBhcmFtcyAmJiBvcHRpb25zLnBhcmFtcy5rZXlzKCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMudmFsdWUgKz0gYCR7IHRoaXMudmFsdWUuaW5jbHVkZXMoJz8nKSA/ICcmJyA6ICc/JyB9JHsgdGhpcy5vcHRpb25zPy5wYXJhbXM/LnRvU3RyaW5nKCkgfWA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG9wdGlvbnMub2JzZXJ2ZSkge1xyXG4gICAgICAgIHRoaXMudmFsdWUgKz0gYCZvYnNlcnZlPSR7IHRoaXMub3B0aW9ucz8ub2JzZXJ2ZSB9YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGNhY2hlIGtleSBmcm9tIHJlc291cmNlIHVybCBhbmQgcmVxdWVzdCBwYXJhbXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXJsIHJlc291cmNlIHVybFxyXG4gICAqIEBwYXJhbSBwYXJhbXMgcmVxdWVzdCBwYXJhbXNcclxuICAgKi9cclxuICBwdWJsaWMgc3RhdGljIG9mKHVybDogc3RyaW5nLCBwYXJhbXM6IHtcclxuICAgIG9ic2VydmU/OiAnYm9keScgfCAncmVzcG9uc2UnO1xyXG4gICAgcGFyYW1zPzogSHR0cFBhcmFtc1xyXG4gIH0pOiBDYWNoZUtleSB7XHJcbiAgICByZXR1cm4gbmV3IENhY2hlS2V5KHVybCwgcGFyYW1zKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==