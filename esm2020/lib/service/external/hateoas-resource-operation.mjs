import { DependencyInjector } from '../../util/dependency-injector';
import { HateoasResourceService } from './hateoas-resource.service';
/**
 * Main resource operation class.
 * Extend this class to create resource service.
 */
export class HateoasResourceOperation {
    constructor(resourceType) {
        this.resourceType = resourceType;
        this.hateoasResourceService = DependencyInjector.get(HateoasResourceService);
    }
    /**
     * {@link HateoasResourceService#getResource}.
     */
    getResource(id, options) {
        return this.hateoasResourceService.getResource(this.resourceType, id, options);
    }
    /**
     * {@link HateoasResourceService#getCollection}.
     */
    getCollection(options) {
        return this.hateoasResourceService.getCollection(this.resourceType, options);
    }
    /**
     * {@link HateoasResourceService#getPage}.
     */
    getPage(options) {
        return this.hateoasResourceService.getPage(this.resourceType, options);
    }
    /**
     * {@link HateoasResourceService#createResource}.
     */
    createResource(requestBody, options) {
        return this.hateoasResourceService.createResource(this.resourceType, requestBody, options);
    }
    /**
     * {@link HateoasResourceService#updateResource}.
     */
    updateResource(entity, requestBody, options) {
        return this.hateoasResourceService.updateResource(entity, requestBody, options);
    }
    /**
     * {@link HateoasResourceService#updateResourceById}.
     */
    updateResourceById(id, requestBody, options) {
        return this.hateoasResourceService.updateResourceById(this.resourceType, id, requestBody, options);
    }
    /**
     * {@link HateoasResourceService#patchResource}.
     */
    patchResource(entity, requestBody, options) {
        return this.hateoasResourceService.patchResource(entity, requestBody, options);
    }
    /**
     * {@link HateoasResourceService#patchResourceById}.
     */
    patchResourceById(id, requestBody, options) {
        return this.hateoasResourceService.patchResourceById(this.resourceType, id, requestBody, options);
    }
    /**
     * {@link HateoasResourceService#deleteResource}.
     */
    deleteResource(entity, options) {
        return this.hateoasResourceService.deleteResource(entity, options);
    }
    /**
     * {@link HateoasResourceService#deleteResourceById}.
     */
    deleteResourceById(id, options) {
        return this.hateoasResourceService.deleteResourceById(this.resourceType, id, options);
    }
    /**
     * {@see ResourceCollectionHttpService#search}
     */
    searchCollection(query, options) {
        return this.hateoasResourceService.searchCollection(this.resourceType, query, options);
    }
    /**
     * {@see PagedResourceCollection#search}
     */
    searchPage(query, options) {
        return this.hateoasResourceService.searchPage(this.resourceType, query, options);
    }
    /**
     * {@see ResourceHttpService#search}
     */
    searchResource(query, options) {
        return this.hateoasResourceService.searchResource(this.resourceType, query, options);
    }
    /**
     * {@see ResourceHttpService#customQuery}
     */
    customQuery(method, query, requestBody, options) {
        return this.hateoasResourceService.customQuery(this.resourceType, method, query, requestBody, options);
    }
    /**
     * {@see ResourceHttpService#customSearchQuery}
     */
    customSearchQuery(method, searchQuery, requestBody, options) {
        return this.hateoasResourceService.customSearchQuery(this.resourceType, method, searchQuery, requestBody, options);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGF0ZW9hcy1yZXNvdXJjZS1vcGVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaGF0ZW9hcy1jbGllbnQvc3JjL2xpYi9zZXJ2aWNlL2V4dGVybmFsL2hhdGVvYXMtcmVzb3VyY2Utb3BlcmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBT3BFOzs7R0FHRztBQUNILE1BQU0sT0FBTyx3QkFBd0I7SUFNbkMsWUFBWSxZQUF3QjtRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVEOztPQUVHO0lBQ0ksV0FBVyxDQUFDLEVBQW1CLEVBQUUsT0FBbUI7UUFDekQsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBa0IsQ0FBQztJQUNsRyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxhQUFhLENBQUMsT0FBbUI7UUFDdEMsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVEOztPQUVHO0lBQ0ksT0FBTyxDQUFDLE9BQXdCO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRDs7T0FFRztJQUNJLGNBQWMsQ0FBQyxXQUEyQixFQUFFLE9BQXVCO1FBQ3hFLE9BQU8s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ImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgRGVwZW5kZW5jeUluamVjdG9yIH0gZnJvbSAnLi4vLi4vdXRpbC9kZXBlbmRlbmN5LWluamVjdG9yJztcclxuaW1wb3J0IHsgSGF0ZW9hc1Jlc291cmNlU2VydmljZSB9IGZyb20gJy4vaGF0ZW9hcy1yZXNvdXJjZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgR2V0T3B0aW9uLCBIdHRwTWV0aG9kLCBQYWdlZEdldE9wdGlvbiwgUmVxdWVzdEJvZHksIFJlcXVlc3RPcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbC9kZWNsYXJhdGlvbnMnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4uLy4uL21vZGVsL3Jlc291cmNlL3Jlc291cmNlJztcclxuaW1wb3J0IHsgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb24gfSBmcm9tICcuLi8uLi9tb2RlbC9yZXNvdXJjZS9wYWdlZC1yZXNvdXJjZS1jb2xsZWN0aW9uJztcclxuaW1wb3J0IHsgUmVzb3VyY2VDb2xsZWN0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWwvcmVzb3VyY2UvcmVzb3VyY2UtY29sbGVjdGlvbic7XHJcbmltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbi8qKlxyXG4gKiBNYWluIHJlc291cmNlIG9wZXJhdGlvbiBjbGFzcy5cclxuICogRXh0ZW5kIHRoaXMgY2xhc3MgdG8gY3JlYXRlIHJlc291cmNlIHNlcnZpY2UuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSGF0ZW9hc1Jlc291cmNlT3BlcmF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ge1xyXG5cclxuICBwcml2YXRlIHJlYWRvbmx5IHJlc291cmNlVHlwZTogbmV3KCkgPT4gVDtcclxuXHJcbiAgcHJpdmF0ZSBoYXRlb2FzUmVzb3VyY2VTZXJ2aWNlOiBIYXRlb2FzUmVzb3VyY2VTZXJ2aWNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXNvdXJjZVR5cGU6IG5ldygpID0+IFQpIHtcclxuICAgIHRoaXMucmVzb3VyY2VUeXBlID0gcmVzb3VyY2VUeXBlO1xyXG4gICAgdGhpcy5oYXRlb2FzUmVzb3VyY2VTZXJ2aWNlID0gRGVwZW5kZW5jeUluamVjdG9yLmdldChIYXRlb2FzUmVzb3VyY2VTZXJ2aWNlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHtAbGluayBIYXRlb2FzUmVzb3VyY2VTZXJ2aWNlI2dldFJlc291cmNlfS5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0UmVzb3VyY2UoaWQ6IG51bWJlciB8IHN0cmluZywgb3B0aW9ucz86IEdldE9wdGlvbik6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaGF0ZW9hc1Jlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZSh0aGlzLnJlc291cmNlVHlwZSwgaWQsIG9wdGlvbnMpIGFzIE9ic2VydmFibGU8VD47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB7QGxpbmsgSGF0ZW9hc1Jlc291cmNlU2VydmljZSNnZXRDb2xsZWN0aW9ufS5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0Q29sbGVjdGlvbihvcHRpb25zPzogR2V0T3B0aW9uKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUNvbGxlY3Rpb248VD4+IHtcclxuICAgIHJldHVybiB0aGlzLmhhdGVvYXNSZXNvdXJjZVNlcnZpY2UuZ2V0Q29sbGVjdGlvbih0aGlzLnJlc291cmNlVHlwZSwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB7QGxpbmsgSGF0ZW9hc1Jlc291cmNlU2VydmljZSNnZXRQYWdlfS5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0UGFnZShvcHRpb25zPzogUGFnZWRHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uPFQ+PiB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXRlb2FzUmVzb3VyY2VTZXJ2aWNlLmdldFBhZ2UodGhpcy5yZXNvdXJjZVR5cGUsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICoge0BsaW5rIEhhdGVvYXNSZXNvdXJjZVNlcnZpY2UjY3JlYXRlUmVzb3VyY2V9LlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGVSZXNvdXJjZShyZXF1ZXN0Qm9keTogUmVxdWVzdEJvZHk8VD4sIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmhhdGVvYXNSZXNvdXJjZVNlcnZpY2UuY3JlYXRlUmVzb3VyY2UodGhpcy5yZXNvdXJjZVR5cGUsIHJlcXVlc3RCb2R5LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHtAbGluayBIYXRlb2FzUmVzb3VyY2VTZXJ2aWNlI3VwZGF0ZVJlc291cmNlfS5cclxuICAgKi9cclxuICBwdWJsaWMgdXBkYXRlUmVzb3VyY2UoZW50aXR5OiBULCByZXF1ZXN0Qm9keT86IFJlcXVlc3RCb2R5PGFueT4sIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxUIHwgYW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXRlb2FzUmVzb3VyY2VTZXJ2aWNlLnVwZGF0ZVJlc291cmNlKGVudGl0eSwgcmVxdWVzdEJvZHksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICoge0BsaW5rIEhhdGVvYXNSZXNvdXJjZVNlcnZpY2UjdXBkYXRlUmVzb3VyY2VCeUlkfS5cclxuICAgKi9cclxuICBwdWJsaWMgdXBkYXRlUmVzb3VyY2VCeUlkKGlkOiBudW1iZXIgfCBzdHJpbmcsIHJlcXVlc3RCb2R5OiBSZXF1ZXN0Qm9keTxhbnk+LCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbik6IE9ic2VydmFibGU8VCB8IGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaGF0ZW9hc1Jlc291cmNlU2VydmljZS51cGRhdGVSZXNvdXJjZUJ5SWQodGhpcy5yZXNvdXJjZVR5cGUsIGlkLCByZXF1ZXN0Qm9keSwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB7QGxpbmsgSGF0ZW9hc1Jlc291cmNlU2VydmljZSNwYXRjaFJlc291cmNlfS5cclxuICAgKi9cclxuICBwdWJsaWMgcGF0Y2hSZXNvdXJjZShlbnRpdHk6IFQsIHJlcXVlc3RCb2R5PzogUmVxdWVzdEJvZHk8YW55Piwgb3B0aW9ucz86IFJlcXVlc3RPcHRpb24pOiBPYnNlcnZhYmxlPFQgfCBhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmhhdGVvYXNSZXNvdXJjZVNlcnZpY2UucGF0Y2hSZXNvdXJjZShlbnRpdHksIHJlcXVlc3RCb2R5LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHtAbGluayBIYXRlb2FzUmVzb3VyY2VTZXJ2aWNlI3BhdGNoUmVzb3VyY2VCeUlkfS5cclxuICAgKi9cclxuICBwdWJsaWMgcGF0Y2hSZXNvdXJjZUJ5SWQoaWQ6IG51bWJlciB8IHN0cmluZywgcmVxdWVzdEJvZHk6IFJlcXVlc3RCb2R5PGFueT4sIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxUIHwgYW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXRlb2FzUmVzb3VyY2VTZXJ2aWNlLnBhdGNoUmVzb3VyY2VCeUlkKHRoaXMucmVzb3VyY2VUeXBlLCBpZCwgcmVxdWVzdEJvZHksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICoge0BsaW5rIEhhdGVvYXNSZXNvdXJjZVNlcnZpY2UjZGVsZXRlUmVzb3VyY2V9LlxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWxldGVSZXNvdXJjZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8YW55PiB8IGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaGF0ZW9hc1Jlc291cmNlU2VydmljZS5kZWxldGVSZXNvdXJjZShlbnRpdHksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICoge0BsaW5rIEhhdGVvYXNSZXNvdXJjZVNlcnZpY2UjZGVsZXRlUmVzb3VyY2VCeUlkfS5cclxuICAgKi9cclxuICBwdWJsaWMgZGVsZXRlUmVzb3VyY2VCeUlkKGlkOiBudW1iZXIgfCBzdHJpbmcsIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8YW55PiB8IGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaGF0ZW9hc1Jlc291cmNlU2VydmljZS5kZWxldGVSZXNvdXJjZUJ5SWQodGhpcy5yZXNvdXJjZVR5cGUsIGlkLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHtAc2VlIFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlI3NlYXJjaH1cclxuICAgKi9cclxuICBwdWJsaWMgc2VhcmNoQ29sbGVjdGlvbihxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogR2V0T3B0aW9uKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUNvbGxlY3Rpb248VD4+IHtcclxuICAgIHJldHVybiB0aGlzLmhhdGVvYXNSZXNvdXJjZVNlcnZpY2Uuc2VhcmNoQ29sbGVjdGlvbih0aGlzLnJlc291cmNlVHlwZSwgcXVlcnksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICoge0BzZWUgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb24jc2VhcmNofVxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZWFyY2hQYWdlKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBQYWdlZEdldE9wdGlvbik6IE9ic2VydmFibGU8UGFnZWRSZXNvdXJjZUNvbGxlY3Rpb248VD4+IHtcclxuICAgIHJldHVybiB0aGlzLmhhdGVvYXNSZXNvdXJjZVNlcnZpY2Uuc2VhcmNoUGFnZSh0aGlzLnJlc291cmNlVHlwZSwgcXVlcnksIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICoge0BzZWUgUmVzb3VyY2VIdHRwU2VydmljZSNzZWFyY2h9XHJcbiAgICovXHJcbiAgcHVibGljIHNlYXJjaFJlc291cmNlKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIHJldHVybiB0aGlzLmhhdGVvYXNSZXNvdXJjZVNlcnZpY2Uuc2VhcmNoUmVzb3VyY2UodGhpcy5yZXNvdXJjZVR5cGUsIHF1ZXJ5LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHtAc2VlIFJlc291cmNlSHR0cFNlcnZpY2UjY3VzdG9tUXVlcnl9XHJcbiAgICovXHJcbiAgcHVibGljIGN1c3RvbVF1ZXJ5PFI+KG1ldGhvZDogSHR0cE1ldGhvZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnk6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHk/OiBSZXF1ZXN0Qm9keTxhbnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUGFnZWRHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFI+IHtcclxuICAgIHJldHVybiB0aGlzLmhhdGVvYXNSZXNvdXJjZVNlcnZpY2UuY3VzdG9tUXVlcnkodGhpcy5yZXNvdXJjZVR5cGUsIG1ldGhvZCwgcXVlcnksIHJlcXVlc3RCb2R5LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHtAc2VlIFJlc291cmNlSHR0cFNlcnZpY2UjY3VzdG9tU2VhcmNoUXVlcnl9XHJcbiAgICovXHJcbiAgcHVibGljIGN1c3RvbVNlYXJjaFF1ZXJ5PFI+KG1ldGhvZDogSHR0cE1ldGhvZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoUXVlcnk6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHk/OiBSZXF1ZXN0Qm9keTxhbnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUGFnZWRHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFI+IHtcclxuICAgIHJldHVybiB0aGlzLmhhdGVvYXNSZXNvdXJjZVNlcnZpY2UuY3VzdG9tU2VhcmNoUXVlcnkodGhpcy5yZXNvdXJjZVR5cGUsIG1ldGhvZCwgc2VhcmNoUXVlcnksIHJlcXVlc3RCb2R5LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==