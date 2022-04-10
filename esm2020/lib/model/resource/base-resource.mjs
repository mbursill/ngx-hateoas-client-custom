import { getResourceHttpService } from '../../service/internal/resource-http.service';
import { UrlUtils } from '../../util/url.utils';
import { AbstractResource } from './abstract-resource';
import { getResourceCollectionHttpService } from '../../service/internal/resource-collection-http.service';
import { getPagedResourceCollectionHttpService } from '../../service/internal/paged-resource-collection-http.service';
import { ResourceUtils } from '../../util/resource.utils';
import { tap } from 'rxjs/operators';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';
/**
 * Common resource class.
 */
export class BaseResource extends AbstractResource {
    /**
     * Get single resource by the relation name.
     *
     * @param relationName used to get the specific relation link
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    getRelation(relationName, options) {
        ValidationUtils.validateInputParams({ relationName });
        StageLogger.resourceBeginLog(this, 'GET_RELATION', { relationName, options });
        const relationLink = this.getRelationLink(relationName);
        const optionsToRequest = relationLink.templated
            ? { ...options, params: undefined, sort: undefined }
            : options;
        return getResourceHttpService()
            .get(UrlUtils.generateLinkUrl(relationLink, options), optionsToRequest)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'GET_RELATION', { result: `relation ${relationName} was got successful` });
        }));
    }
    /**
     * Get collection of resources by the relation name.
     *
     * @param relationName used to get the specific relation link
     * @param options (optional) options that will be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    getRelatedCollection(relationName, options) {
        ValidationUtils.validateInputParams({ relationName });
        StageLogger.resourceBeginLog(this, 'GET_RELATED_COLLECTION', { relationName, options });
        const relationLink = this.getRelationLink(relationName);
        const optionsToRequest = relationLink.templated
            ? { ...options, params: undefined, sort: undefined }
            : options;
        return getResourceCollectionHttpService()
            .get(UrlUtils.generateLinkUrl(relationLink, options), optionsToRequest)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'GET_RELATED_COLLECTION', { result: `related collection ${relationName} was got successful` });
        }));
    }
    /**
     * Get paged collection of resources by the relation name.
     *
     * @param relationName used to get the specific relation link
     * @param options (optional) additional options that should be applied to the request
     *        if options didn't contains {@link PageParam} then will be used default page params.
     * @throws error when required params are not valid or link not found by relation name
     */
    getRelatedPage(relationName, options) {
        ValidationUtils.validateInputParams({ relationName });
        StageLogger.resourceBeginLog(this, 'GET_RELATED_PAGE', { relationName, options });
        const relationLink = this.getRelationLink(relationName);
        const optionsToRequest = relationLink.templated
            ? { ...options, params: undefined, pageParams: undefined, sort: undefined }
            : options;
        return getPagedResourceCollectionHttpService()
            .get(UrlUtils.generateLinkUrl(relationLink, UrlUtils.fillDefaultPageDataIfNoPresent(options)), optionsToRequest)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'GET_RELATED_PAGE', { result: `related page ${relationName} was got successful` });
        }));
    }
    /**
     *  Perform POST request to the relation with the body and url params.
     *
     * @param relationName used to get the specific relation link
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) request options that will be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    postRelation(relationName, requestBody, options) {
        ValidationUtils.validateInputParams({ relationName, requestBody });
        StageLogger.resourceBeginLog(this, 'POST_RELATION', { relationName, requestBody, options });
        const relationLink = this.getRelationLink(relationName);
        return getResourceHttpService()
            .post(UrlUtils.generateLinkUrl(relationLink, options), ResourceUtils.resolveValues(requestBody), {
            ...options,
            observe: options?.observe ? options.observe : 'body',
            params: relationLink.templated ? undefined : options?.params
        })
            .pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'POST_RELATION', { result: `relation ${relationName} was posted successful` });
        }));
    }
    /**
     * Perform PATCH request to relation with body and url params.
     *
     * @param relationName used to get the specific relation link
     * @param requestBody contains the body directly and body values option {@link ValuesOption}
     *        to clarify what specific values need to be included or not included in result request body
     * @param options (optional) request options that will be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    patchRelation(relationName, requestBody, options) {
        ValidationUtils.validateInputParams({ relationName, requestBody });
        StageLogger.resourceBeginLog(this, 'PATCH_RELATION', { relationName, requestBody, options });
        const relationLink = this.getRelationLink(relationName);
        return getResourceHttpService()
            .patch(UrlUtils.generateLinkUrl(relationLink, options), ResourceUtils.resolveValues(requestBody), {
            ...options,
            observe: options?.observe ? options.observe : 'body',
            params: relationLink.templated ? undefined : options?.params
        })
            .pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'PATCH_RELATION', { result: `relation ${relationName} was patched successful` });
        }));
    }
    /**
     * Perform PUT request to relation with body and url params.
     *
     * @param relationName used to get the specific relation link
     * @param requestBody contains the body directly and body values option {@link ValuesOption}
     *        to clarify what specific values need to be included or not included in result request body
     * @param options (optional) request options that will be applied to the request
     * @throws error when required params are not valid or link not found by relation name
     */
    putRelation(relationName, requestBody, options) {
        ValidationUtils.validateInputParams({ relationName, requestBody });
        StageLogger.resourceBeginLog(this, 'PUT_RELATION', { relationName, requestBody, options });
        const relationLink = this.getRelationLink(relationName);
        return getResourceHttpService()
            .put(UrlUtils.generateLinkUrl(relationLink, options), ResourceUtils.resolveValues(requestBody), {
            ...options,
            observe: options?.observe ? options.observe : 'body',
            params: relationLink.templated ? undefined : options?.params
        })
            .pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'PUT_RELATION', { result: `relation ${relationName} was put successful` });
        }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1oYXRlb2FzLWNsaWVudC9zcmMvbGliL21vZGVsL3Jlc291cmNlL2Jhc2UtcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDdEYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXZELE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBRzNHLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBRXRILE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUU5RDs7R0FFRztBQUNILE1BQU0sT0FBZ0IsWUFBYSxTQUFRLGdCQUFnQjtJQUV6RDs7Ozs7O09BTUc7SUFDSSxXQUFXLENBQXlCLFlBQW9CLEVBQ3BCLE9BQW1CO1FBRTVELGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLFlBQVksRUFBQyxDQUFDLENBQUM7UUFDcEQsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsRUFBQyxZQUFZLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUU1RSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3hELE1BQU0sZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLFNBQVM7WUFD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LE9BQU87WUFDVixPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTTtZQUNwRCxNQUFNLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtTQUM3RCxDQUFDO2FBQ0gsSUFBSSxDQUNILEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDUCxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsRUFBQyxNQUFNLEVBQUUsWUFBYSxZQUFhLHFCQUFxQixFQUFDLENBQUMsQ0FBQztRQUM5RyxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ04sQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBnZXRSZXNvdXJjZUh0dHBTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZS9pbnRlcm5hbC9yZXNvdXJjZS1odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVcmxVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvdXJsLnV0aWxzJztcclxuaW1wb3J0IHsgQWJzdHJhY3RSZXNvdXJjZSB9IGZyb20gJy4vYWJzdHJhY3QtcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUNvbGxlY3Rpb24gfSBmcm9tICcuL3Jlc291cmNlLWNvbGxlY3Rpb24nO1xyXG5pbXBvcnQgeyBnZXRSZXNvdXJjZUNvbGxlY3Rpb25IdHRwU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2UvaW50ZXJuYWwvcmVzb3VyY2UtY29sbGVjdGlvbi1odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBHZXRPcHRpb24sIFBhZ2VkR2V0T3B0aW9uLCBSZXF1ZXN0Qm9keSwgUmVxdWVzdE9wdGlvbiB9IGZyb20gJy4uL2RlY2xhcmF0aW9ucyc7XHJcbmltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgZ2V0UGFnZWRSZXNvdXJjZUNvbGxlY3Rpb25IdHRwU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2UvaW50ZXJuYWwvcGFnZWQtcmVzb3VyY2UtY29sbGVjdGlvbi1odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQYWdlZFJlc291cmNlQ29sbGVjdGlvbiB9IGZyb20gJy4vcGFnZWQtcmVzb3VyY2UtY29sbGVjdGlvbic7XHJcbmltcG9ydCB7IFJlc291cmNlVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3Jlc291cmNlLnV0aWxzJztcclxuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBTdGFnZUxvZ2dlciB9IGZyb20gJy4uLy4uL2xvZ2dlci9zdGFnZS1sb2dnZXInO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3ZhbGlkYXRpb24udXRpbHMnO1xyXG5cclxuLyoqXHJcbiAqIENvbW1vbiByZXNvdXJjZSBjbGFzcy5cclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlUmVzb3VyY2UgZXh0ZW5kcyBBYnN0cmFjdFJlc291cmNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHNpbmdsZSByZXNvdXJjZSBieSB0aGUgcmVsYXRpb24gbmFtZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUgdXNlZCB0byBnZXQgdGhlIHNwZWNpZmljIHJlbGF0aW9uIGxpbmtcclxuICAgKiBAcGFyYW0gb3B0aW9ucyAob3B0aW9uYWwpIG9wdGlvbnMgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgcmVxdWVzdFxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZCBvciBsaW5rIG5vdCBmb3VuZCBieSByZWxhdGlvbiBuYW1lXHJcbiAgICovXHJcbiAgcHVibGljIGdldFJlbGF0aW9uPFQgZXh0ZW5kcyBCYXNlUmVzb3VyY2U+KHJlbGF0aW9uTmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogR2V0T3B0aW9uXHJcbiAgKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVsYXRpb25OYW1lfSk7XHJcbiAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUJlZ2luTG9nKHRoaXMsICdHRVRfUkVMQVRJT04nLCB7cmVsYXRpb25OYW1lLCBvcHRpb25zfSk7XHJcblxyXG4gICAgY29uc3QgcmVsYXRpb25MaW5rID0gdGhpcy5nZXRSZWxhdGlvbkxpbmsocmVsYXRpb25OYW1lKTtcclxuICAgIGNvbnN0IG9wdGlvbnNUb1JlcXVlc3QgPSByZWxhdGlvbkxpbmsudGVtcGxhdGVkXHJcbiAgICAgID8gey4uLm9wdGlvbnMsIHBhcmFtczogdW5kZWZpbmVkLCBzb3J0OiB1bmRlZmluZWR9XHJcbiAgICAgIDogb3B0aW9ucztcclxuXHJcbiAgICByZXR1cm4gZ2V0UmVzb3VyY2VIdHRwU2VydmljZSgpXHJcbiAgICAgIC5nZXQoVXJsVXRpbHMuZ2VuZXJhdGVMaW5rVXJsKHJlbGF0aW9uTGluaywgb3B0aW9ucyksIG9wdGlvbnNUb1JlcXVlc3QpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIHRhcCgoKSA9PiB7XHJcbiAgICAgICAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUVuZExvZyh0aGlzLCAnR0VUX1JFTEFUSU9OJywge3Jlc3VsdDogYHJlbGF0aW9uICR7IHJlbGF0aW9uTmFtZSB9IHdhcyBnb3Qgc3VjY2Vzc2Z1bGB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICApIGFzIE9ic2VydmFibGU8VD47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgY29sbGVjdGlvbiBvZiByZXNvdXJjZXMgYnkgdGhlIHJlbGF0aW9uIG5hbWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHVzZWQgdG8gZ2V0IHRoZSBzcGVjaWZpYyByZWxhdGlvbiBsaW5rXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkIG9yIGxpbmsgbm90IGZvdW5kIGJ5IHJlbGF0aW9uIG5hbWVcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0UmVsYXRlZENvbGxlY3Rpb248VCBleHRlbmRzIFJlc291cmNlQ29sbGVjdGlvbjxCYXNlUmVzb3VyY2U+PihyZWxhdGlvbk5hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogR2V0T3B0aW9uXHJcbiAgKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVsYXRpb25OYW1lfSk7XHJcbiAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUJlZ2luTG9nKHRoaXMsICdHRVRfUkVMQVRFRF9DT0xMRUNUSU9OJywge3JlbGF0aW9uTmFtZSwgb3B0aW9uc30pO1xyXG5cclxuICAgIGNvbnN0IHJlbGF0aW9uTGluayA9IHRoaXMuZ2V0UmVsYXRpb25MaW5rKHJlbGF0aW9uTmFtZSk7XHJcbiAgICBjb25zdCBvcHRpb25zVG9SZXF1ZXN0ID0gcmVsYXRpb25MaW5rLnRlbXBsYXRlZFxyXG4gICAgICA/IHsuLi5vcHRpb25zLCBwYXJhbXM6IHVuZGVmaW5lZCwgc29ydDogdW5kZWZpbmVkfVxyXG4gICAgICA6IG9wdGlvbnM7XHJcblxyXG4gICAgcmV0dXJuIGdldFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlKClcclxuICAgICAgLmdldChVcmxVdGlscy5nZW5lcmF0ZUxpbmtVcmwocmVsYXRpb25MaW5rLCBvcHRpb25zKSwgb3B0aW9uc1RvUmVxdWVzdClcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgdGFwKCgpID0+IHtcclxuICAgICAgICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlRW5kTG9nKHRoaXMsICdHRVRfUkVMQVRFRF9DT0xMRUNUSU9OJywge3Jlc3VsdDogYHJlbGF0ZWQgY29sbGVjdGlvbiAkeyByZWxhdGlvbk5hbWUgfSB3YXMgZ290IHN1Y2Nlc3NmdWxgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKSBhcyBPYnNlcnZhYmxlPFQ+O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHBhZ2VkIGNvbGxlY3Rpb24gb2YgcmVzb3VyY2VzIGJ5IHRoZSByZWxhdGlvbiBuYW1lLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB1c2VkIHRvIGdldCB0aGUgc3BlY2lmaWMgcmVsYXRpb24gbGlua1xyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgYWRkaXRpb25hbCBvcHRpb25zIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiAgICAgICAgaWYgb3B0aW9ucyBkaWRuJ3QgY29udGFpbnMge0BsaW5rIFBhZ2VQYXJhbX0gdGhlbiB3aWxsIGJlIHVzZWQgZGVmYXVsdCBwYWdlIHBhcmFtcy5cclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWQgb3IgbGluayBub3QgZm91bmQgYnkgcmVsYXRpb24gbmFtZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRSZWxhdGVkUGFnZTxUIGV4dGVuZHMgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb248QmFzZVJlc291cmNlPj4ocmVsYXRpb25OYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUGFnZWRHZXRPcHRpb24pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZWxhdGlvbk5hbWV9KTtcclxuICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlQmVnaW5Mb2codGhpcywgJ0dFVF9SRUxBVEVEX1BBR0UnLCB7cmVsYXRpb25OYW1lLCBvcHRpb25zfSk7XHJcblxyXG4gICAgY29uc3QgcmVsYXRpb25MaW5rID0gdGhpcy5nZXRSZWxhdGlvbkxpbmsocmVsYXRpb25OYW1lKTtcclxuICAgIGNvbnN0IG9wdGlvbnNUb1JlcXVlc3QgPSByZWxhdGlvbkxpbmsudGVtcGxhdGVkXHJcbiAgICAgID8gey4uLm9wdGlvbnMsIHBhcmFtczogdW5kZWZpbmVkLCBwYWdlUGFyYW1zOiB1bmRlZmluZWQsIHNvcnQ6IHVuZGVmaW5lZH1cclxuICAgICAgOiBvcHRpb25zO1xyXG5cclxuICAgIHJldHVybiBnZXRQYWdlZFJlc291cmNlQ29sbGVjdGlvbkh0dHBTZXJ2aWNlKClcclxuICAgICAgLmdldChVcmxVdGlscy5nZW5lcmF0ZUxpbmtVcmwocmVsYXRpb25MaW5rLCBVcmxVdGlscy5maWxsRGVmYXVsdFBhZ2VEYXRhSWZOb1ByZXNlbnQob3B0aW9ucykpLCBvcHRpb25zVG9SZXF1ZXN0KVxyXG4gICAgICAucGlwZShcclxuICAgICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2codGhpcywgJ0dFVF9SRUxBVEVEX1BBR0UnLCB7cmVzdWx0OiBgcmVsYXRlZCBwYWdlICR7IHJlbGF0aW9uTmFtZSB9IHdhcyBnb3Qgc3VjY2Vzc2Z1bGB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICApIGFzIE9ic2VydmFibGU8VD47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgUGVyZm9ybSBQT1NUIHJlcXVlc3QgdG8gdGhlIHJlbGF0aW9uIHdpdGggdGhlIGJvZHkgYW5kIHVybCBwYXJhbXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHVzZWQgdG8gZ2V0IHRoZSBzcGVjaWZpYyByZWxhdGlvbiBsaW5rXHJcbiAgICogQHBhcmFtIHJlcXVlc3RCb2R5IHRoYXQgY29udGFpbnMgdGhlIGJvZHkgZGlyZWN0bHkgYW5kIG9wdGlvbmFsIGJvZHkgdmFsdWVzIG9wdGlvbiB7QGxpbmsgVmFsdWVzT3B0aW9ufVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgcmVxdWVzdCBvcHRpb25zIHRoYXQgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkIG9yIGxpbmsgbm90IGZvdW5kIGJ5IHJlbGF0aW9uIG5hbWVcclxuICAgKi9cclxuICBwdWJsaWMgcG9zdFJlbGF0aW9uKHJlbGF0aW9uTmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHk6IFJlcXVlc3RCb2R5PGFueT4sXHJcbiAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUmVxdWVzdE9wdGlvbik6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPGFueT4gfCBhbnk+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZWxhdGlvbk5hbWUsIHJlcXVlc3RCb2R5fSk7XHJcbiAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUJlZ2luTG9nKHRoaXMsICdQT1NUX1JFTEFUSU9OJywge3JlbGF0aW9uTmFtZSwgcmVxdWVzdEJvZHksIG9wdGlvbnN9KTtcclxuXHJcbiAgICBjb25zdCByZWxhdGlvbkxpbmsgPSB0aGlzLmdldFJlbGF0aW9uTGluayhyZWxhdGlvbk5hbWUpO1xyXG5cclxuICAgIHJldHVybiBnZXRSZXNvdXJjZUh0dHBTZXJ2aWNlKClcclxuICAgICAgLnBvc3QoXHJcbiAgICAgICAgVXJsVXRpbHMuZ2VuZXJhdGVMaW5rVXJsKHJlbGF0aW9uTGluaywgb3B0aW9ucyksXHJcbiAgICAgICAgUmVzb3VyY2VVdGlscy5yZXNvbHZlVmFsdWVzKHJlcXVlc3RCb2R5KSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAuLi5vcHRpb25zLFxyXG4gICAgICAgICAgb2JzZXJ2ZTogb3B0aW9ucz8ub2JzZXJ2ZSA/IG9wdGlvbnMub2JzZXJ2ZSA6ICdib2R5JyxcclxuICAgICAgICAgIHBhcmFtczogcmVsYXRpb25MaW5rLnRlbXBsYXRlZCA/IHVuZGVmaW5lZCA6IG9wdGlvbnM/LnBhcmFtc1xyXG4gICAgICAgIH0pXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIHRhcCgoKSA9PiB7XHJcbiAgICAgICAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUVuZExvZyh0aGlzLCAnUE9TVF9SRUxBVElPTicsIHtyZXN1bHQ6IGByZWxhdGlvbiAkeyByZWxhdGlvbk5hbWUgfSB3YXMgcG9zdGVkIHN1Y2Nlc3NmdWxgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gUEFUQ0ggcmVxdWVzdCB0byByZWxhdGlvbiB3aXRoIGJvZHkgYW5kIHVybCBwYXJhbXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHVzZWQgdG8gZ2V0IHRoZSBzcGVjaWZpYyByZWxhdGlvbiBsaW5rXHJcbiAgICogQHBhcmFtIHJlcXVlc3RCb2R5IGNvbnRhaW5zIHRoZSBib2R5IGRpcmVjdGx5IGFuZCBib2R5IHZhbHVlcyBvcHRpb24ge0BsaW5rIFZhbHVlc09wdGlvbn1cclxuICAgKiAgICAgICAgdG8gY2xhcmlmeSB3aGF0IHNwZWNpZmljIHZhbHVlcyBuZWVkIHRvIGJlIGluY2x1ZGVkIG9yIG5vdCBpbmNsdWRlZCBpbiByZXN1bHQgcmVxdWVzdCBib2R5XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSByZXF1ZXN0IG9wdGlvbnMgdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWQgb3IgbGluayBub3QgZm91bmQgYnkgcmVsYXRpb24gbmFtZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBwYXRjaFJlbGF0aW9uKHJlbGF0aW9uTmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5OiBSZXF1ZXN0Qm9keTxhbnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8YW55PiB8IGFueT4ge1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3JlbGF0aW9uTmFtZSwgcmVxdWVzdEJvZHl9KTtcclxuICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlQmVnaW5Mb2codGhpcywgJ1BBVENIX1JFTEFUSU9OJywge3JlbGF0aW9uTmFtZSwgcmVxdWVzdEJvZHksIG9wdGlvbnN9KTtcclxuXHJcbiAgICBjb25zdCByZWxhdGlvbkxpbmsgPSB0aGlzLmdldFJlbGF0aW9uTGluayhyZWxhdGlvbk5hbWUpO1xyXG5cclxuICAgIHJldHVybiBnZXRSZXNvdXJjZUh0dHBTZXJ2aWNlKClcclxuICAgICAgLnBhdGNoKFxyXG4gICAgICAgIFVybFV0aWxzLmdlbmVyYXRlTGlua1VybChyZWxhdGlvbkxpbmssIG9wdGlvbnMpLFxyXG4gICAgICAgIFJlc291cmNlVXRpbHMucmVzb2x2ZVZhbHVlcyhyZXF1ZXN0Qm9keSksXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgICAgIG9ic2VydmU6IG9wdGlvbnM/Lm9ic2VydmUgPyBvcHRpb25zLm9ic2VydmUgOiAnYm9keScsXHJcbiAgICAgICAgICBwYXJhbXM6IHJlbGF0aW9uTGluay50ZW1wbGF0ZWQgPyB1bmRlZmluZWQgOiBvcHRpb25zPy5wYXJhbXNcclxuICAgICAgICB9KVxyXG4gICAgICAucGlwZShcclxuICAgICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2codGhpcywgJ1BBVENIX1JFTEFUSU9OJywge3Jlc3VsdDogYHJlbGF0aW9uICR7IHJlbGF0aW9uTmFtZSB9IHdhcyBwYXRjaGVkIHN1Y2Nlc3NmdWxgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gUFVUIHJlcXVlc3QgdG8gcmVsYXRpb24gd2l0aCBib2R5IGFuZCB1cmwgcGFyYW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB1c2VkIHRvIGdldCB0aGUgc3BlY2lmaWMgcmVsYXRpb24gbGlua1xyXG4gICAqIEBwYXJhbSByZXF1ZXN0Qm9keSBjb250YWlucyB0aGUgYm9keSBkaXJlY3RseSBhbmQgYm9keSB2YWx1ZXMgb3B0aW9uIHtAbGluayBWYWx1ZXNPcHRpb259XHJcbiAgICogICAgICAgIHRvIGNsYXJpZnkgd2hhdCBzcGVjaWZpYyB2YWx1ZXMgbmVlZCB0byBiZSBpbmNsdWRlZCBvciBub3QgaW5jbHVkZWQgaW4gcmVzdWx0IHJlcXVlc3QgYm9keVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgcmVxdWVzdCBvcHRpb25zIHRoYXQgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkIG9yIGxpbmsgbm90IGZvdW5kIGJ5IHJlbGF0aW9uIG5hbWVcclxuICAgKi9cclxuICBwdWJsaWMgcHV0UmVsYXRpb24ocmVsYXRpb25OYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5OiBSZXF1ZXN0Qm9keTxhbnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogUmVxdWVzdE9wdGlvbik6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPGFueT4gfCBhbnk+IHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZWxhdGlvbk5hbWUsIHJlcXVlc3RCb2R5fSk7XHJcbiAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUJlZ2luTG9nKHRoaXMsICdQVVRfUkVMQVRJT04nLCB7cmVsYXRpb25OYW1lLCByZXF1ZXN0Qm9keSwgb3B0aW9uc30pO1xyXG5cclxuICAgIGNvbnN0IHJlbGF0aW9uTGluayA9IHRoaXMuZ2V0UmVsYXRpb25MaW5rKHJlbGF0aW9uTmFtZSk7XHJcblxyXG4gICAgcmV0dXJuIGdldFJlc291cmNlSHR0cFNlcnZpY2UoKVxyXG4gICAgICAucHV0KFxyXG4gICAgICAgIFVybFV0aWxzLmdlbmVyYXRlTGlua1VybChyZWxhdGlvbkxpbmssIG9wdGlvbnMpLFxyXG4gICAgICAgIFJlc291cmNlVXRpbHMucmVzb2x2ZVZhbHVlcyhyZXF1ZXN0Qm9keSksXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgICAgIG9ic2VydmU6IG9wdGlvbnM/Lm9ic2VydmUgPyBvcHRpb25zLm9ic2VydmUgOiAnYm9keScsXHJcbiAgICAgICAgICBwYXJhbXM6IHJlbGF0aW9uTGluay50ZW1wbGF0ZWQgPyB1bmRlZmluZWQgOiBvcHRpb25zPy5wYXJhbXNcclxuICAgICAgICB9KVxyXG4gICAgICAucGlwZShcclxuICAgICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VFbmRMb2codGhpcywgJ1BVVF9SRUxBVElPTicsIHtyZXN1bHQ6IGByZWxhdGlvbiAkeyByZWxhdGlvbk5hbWUgfSB3YXMgcHV0IHN1Y2Nlc3NmdWxgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==