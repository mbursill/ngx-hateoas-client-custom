import { of as observableOf } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StageLogger } from '../logger/stage-logger';
import { Stage } from '../logger/stage.enum';
import { ValidationUtils } from '../util/validation.utils';
import { CacheKey } from './internal/cache/model/cache-key';
import { isResourceObject } from '../model/resource-type';
import { LibConfig } from '../config/lib-config';
/**
 * Base class with common logics to perform HTTP requests.
 */
/* tslint:disable:no-string-literal */
export class HttpExecutor {
    constructor(httpClient, cacheService) {
        this.httpClient = httpClient;
        this.cacheService = cacheService;
    }
    static logRequest(method, url, options, body) {
        const params = {
            method,
            url,
            options: {
                ...options,
                params: options?.params?.keys().length > 0 ? options?.params.toString() : '',
            }
        };
        if (body) {
            params['body'] = body;
        }
        StageLogger.stageLog(Stage.HTTP_REQUEST, params);
    }
    static logResponse(method, url, options, data) {
        StageLogger.stageLog(Stage.HTTP_RESPONSE, {
            method,
            url,
            options: {
                ...options,
                params: options?.params?.keys().length > 0 ? options?.params.toString() : '',
            },
            result: data
        });
    }
    /**
     * Perform GET request.
     *
     * @param url to perform request
     * @param options (optional) options that applied to the request
     * @param useCache value {@code true} if need to use cache, {@code false} otherwise
     * @throws error when required params are not valid
     */
    getHttp(url, options, useCache = true) {
        ValidationUtils.validateInputParams({ url });
        if (LibConfig.config.cache.enabled && useCache) {
            const cachedValue = this.cacheService.getResource(CacheKey.of(url, options));
            if (cachedValue != null) {
                return observableOf(cachedValue);
            }
        }
        HttpExecutor.logRequest('GET', url, options);
        let response;
        if (options?.observe === 'response') {
            response = this.httpClient.get(url, { ...options, observe: 'response' });
        }
        else {
            response = this.httpClient.get(url, { ...options, observe: 'body' });
        }
        return response.pipe(tap((data) => {
            HttpExecutor.logResponse('GET', url, options, data);
            if (LibConfig.config.cache.enabled && useCache && isResourceObject(data)) {
                this.cacheService.putResource(CacheKey.of(url, options), data);
            }
        }));
    }
    /**
     * Perform POST request.
     *
     * @param url to perform request
     * @param body to send with request
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    postHttp(url, body, options) {
        HttpExecutor.logRequest('POST', url, options, body);
        ValidationUtils.validateInputParams({ url });
        let response;
        if (options?.observe === 'response') {
            response = this.httpClient.post(url, body, { ...options, observe: 'response' });
        }
        else {
            response = this.httpClient.post(url, body, { ...options, observe: 'body' });
        }
        return response.pipe(tap((data) => {
            HttpExecutor.logResponse('POST', url, options, data);
            if (LibConfig.config.cache.enabled) {
                this.cacheService.evictResource(CacheKey.of(url, options));
            }
        }));
    }
    /**
     * Perform PUT request.
     *
     * @param url to perform request
     * @param body to send with request
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    putHttp(url, body, options) {
        HttpExecutor.logRequest('PUT', url, options, body);
        ValidationUtils.validateInputParams({ url });
        let response;
        if (options?.observe === 'response') {
            response = this.httpClient.put(url, body, { ...options, observe: 'response' });
        }
        else {
            response = this.httpClient.put(url, body, { ...options, observe: 'body' });
        }
        return response.pipe(tap((data) => {
            HttpExecutor.logResponse('PUT', url, options, data);
            if (LibConfig.config.cache.enabled) {
                this.cacheService.evictResource(CacheKey.of(url, options));
            }
        }));
    }
    /**
     * Perform PATCH request.
     *
     * @param url to perform request
     * @param body to send with request
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    patchHttp(url, body, options) {
        HttpExecutor.logRequest('PATCH', url, options, body);
        ValidationUtils.validateInputParams({ url });
        let response;
        if (options?.observe === 'response') {
            response = this.httpClient.patch(url, body, { ...options, observe: 'response' });
        }
        else {
            response = this.httpClient.patch(url, body, { ...options, observe: 'body' });
        }
        return response.pipe(tap((data) => {
            HttpExecutor.logResponse('PATCH', url, options, data);
            if (LibConfig.config.cache.enabled) {
                this.cacheService.evictResource(CacheKey.of(url, options));
            }
        }));
    }
    /**
     * Perform DELETE request.
     *
     * @param url to perform request
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    deleteHttp(url, options) {
        HttpExecutor.logRequest('DELETE', url, options);
        ValidationUtils.validateInputParams({ url });
        let response;
        if (options?.observe === 'response') {
            response = this.httpClient.delete(url, { ...options, observe: 'response' });
        }
        else {
            response = this.httpClient.delete(url, { ...options, observe: 'body' });
        }
        return response.pipe(tap((data) => {
            HttpExecutor.logResponse('DELETE', url, options, data);
            if (LibConfig.config.cache.enabled) {
                this.cacheService.evictResource(CacheKey.of(url, options));
            }
        }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1leGVjdXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1oYXRlb2FzLWNsaWVudC9zcmMvbGliL3NlcnZpY2UvaHR0cC1leGVjdXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQWMsRUFBRSxJQUFJLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0RCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQzVELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUdqRDs7R0FFRztBQUVILHNDQUFzQztBQUN0QyxNQUFNLE9BQU8sWUFBWTtJQUV2QixZQUFzQixVQUFzQixFQUN0QixZQUFrQztRQURsQyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGlCQUFZLEdBQVosWUFBWSxDQUFzQjtJQUN4RCxDQUFDO0lBRU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFjLEVBQ2QsR0FBVyxFQUNYLE9BQTBCLEVBQzFCLElBQVU7UUFDbEMsTUFBTSxNQUFNLEdBQUc7WUFDYixNQUFNO1lBQ04sR0FBRztZQUNILE9BQU8sRUFBRTtnQkFDUCxHQUFHLE9BQU87Z0JBQ1YsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFR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QUNYLFlBQVksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkQsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDNUQ7UUFDSCxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgU3RhZ2VMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvc3RhZ2UtbG9nZ2VyJztcclxuaW1wb3J0IHsgU3RhZ2UgfSBmcm9tICcuLi9sb2dnZXIvc3RhZ2UuZW51bSc7XHJcbmltcG9ydCB7IFZhbGlkYXRpb25VdGlscyB9IGZyb20gJy4uL3V0aWwvdmFsaWRhdGlvbi51dGlscyc7XHJcbmltcG9ydCB7IENhY2hlS2V5IH0gZnJvbSAnLi9pbnRlcm5hbC9jYWNoZS9tb2RlbC9jYWNoZS1rZXknO1xyXG5pbXBvcnQgeyBpc1Jlc291cmNlT2JqZWN0IH0gZnJvbSAnLi4vbW9kZWwvcmVzb3VyY2UtdHlwZSc7XHJcbmltcG9ydCB7IFJlc291cmNlQ2FjaGVTZXJ2aWNlIH0gZnJvbSAnLi9pbnRlcm5hbC9jYWNoZS9yZXNvdXJjZS1jYWNoZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTGliQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2xpYi1jb25maWcnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50T3B0aW9ucyB9IGZyb20gJy4uL21vZGVsL2RlY2xhcmF0aW9ucyc7XHJcblxyXG4vKipcclxuICogQmFzZSBjbGFzcyB3aXRoIGNvbW1vbiBsb2dpY3MgdG8gcGVyZm9ybSBIVFRQIHJlcXVlc3RzLlxyXG4gKi9cclxuXHJcbi8qIHRzbGludDpkaXNhYmxlOm5vLXN0cmluZy1saXRlcmFsICovXHJcbmV4cG9ydCBjbGFzcyBIdHRwRXhlY3V0b3Ige1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaHR0cENsaWVudDogSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgY2FjaGVTZXJ2aWNlOiBSZXNvdXJjZUNhY2hlU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgbG9nUmVxdWVzdChtZXRob2Q6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogSHR0cENsaWVudE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5PzogYW55KSB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG1ldGhvZCxcclxuICAgICAgdXJsLFxyXG4gICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgICBwYXJhbXM6IG9wdGlvbnM/LnBhcmFtcz8ua2V5cygpLmxlbmd0aCA+IDAgPyBvcHRpb25zPy5wYXJhbXMudG9TdHJpbmcoKSA6ICcnLFxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgaWYgKGJvZHkpIHtcclxuICAgICAgcGFyYW1zWydib2R5J10gPSBib2R5O1xyXG4gICAgfVxyXG4gICAgU3RhZ2VMb2dnZXIuc3RhZ2VMb2coU3RhZ2UuSFRUUF9SRVFVRVNULCBwYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgbG9nUmVzcG9uc2UobWV0aG9kOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogSHR0cENsaWVudE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogYW55KSB7XHJcbiAgICBTdGFnZUxvZ2dlci5zdGFnZUxvZyhTdGFnZS5IVFRQX1JFU1BPTlNFLCB7XHJcbiAgICAgIG1ldGhvZCxcclxuICAgICAgdXJsLFxyXG4gICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgICBwYXJhbXM6IG9wdGlvbnM/LnBhcmFtcz8ua2V5cygpLmxlbmd0aCA+IDAgPyBvcHRpb25zPy5wYXJhbXMudG9TdHJpbmcoKSA6ICcnLFxyXG4gICAgICB9LFxyXG4gICAgICByZXN1bHQ6IGRhdGFcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBHRVQgcmVxdWVzdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgdG8gcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgYXBwbGllZCB0byB0aGUgcmVxdWVzdFxyXG4gICAqIEBwYXJhbSB1c2VDYWNoZSB2YWx1ZSB7QGNvZGUgdHJ1ZX0gaWYgbmVlZCB0byB1c2UgY2FjaGUsIHtAY29kZSBmYWxzZX0gb3RoZXJ3aXNlXHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIGdldEh0dHAodXJsOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEh0dHBDbGllbnRPcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgIHVzZUNhY2hlOiBib29sZWFuID0gdHJ1ZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7dXJsfSk7XHJcbiAgICBpZiAoTGliQ29uZmlnLmNvbmZpZy5jYWNoZS5lbmFibGVkICYmIHVzZUNhY2hlKSB7XHJcbiAgICAgIGNvbnN0IGNhY2hlZFZhbHVlID0gdGhpcy5jYWNoZVNlcnZpY2UuZ2V0UmVzb3VyY2UoQ2FjaGVLZXkub2YodXJsLCBvcHRpb25zKSk7XHJcbiAgICAgIGlmIChjYWNoZWRWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihjYWNoZWRWYWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIEh0dHBFeGVjdXRvci5sb2dSZXF1ZXN0KCdHRVQnLCB1cmwsIG9wdGlvbnMpO1xyXG5cclxuICAgIGxldCByZXNwb25zZTtcclxuICAgIGlmIChvcHRpb25zPy5vYnNlcnZlID09PSAncmVzcG9uc2UnKSB7XHJcbiAgICAgIHJlc3BvbnNlID0gdGhpcy5odHRwQ2xpZW50LmdldCh1cmwsIHsuLi5vcHRpb25zLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNwb25zZSA9IHRoaXMuaHR0cENsaWVudC5nZXQodXJsLCB7Li4ub3B0aW9ucywgb2JzZXJ2ZTogJ2JvZHknfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLnBpcGUoXHJcbiAgICAgIHRhcCgoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgSHR0cEV4ZWN1dG9yLmxvZ1Jlc3BvbnNlKCdHRVQnLCB1cmwsIG9wdGlvbnMsIGRhdGEpO1xyXG4gICAgICAgIGlmIChMaWJDb25maWcuY29uZmlnLmNhY2hlLmVuYWJsZWQgJiYgdXNlQ2FjaGUgJiYgaXNSZXNvdXJjZU9iamVjdChkYXRhKSkge1xyXG4gICAgICAgICAgdGhpcy5jYWNoZVNlcnZpY2UucHV0UmVzb3VyY2UoQ2FjaGVLZXkub2YodXJsLCBvcHRpb25zKSwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gUE9TVCByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVybCB0byBwZXJmb3JtIHJlcXVlc3RcclxuICAgKiBAcGFyYW0gYm9keSB0byBzZW5kIHdpdGggcmVxdWVzdFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgcG9zdEh0dHAodXJsOiBzdHJpbmcsIGJvZHk6IGFueSB8IG51bGwsIG9wdGlvbnM/OiBIdHRwQ2xpZW50T3B0aW9ucyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBIdHRwRXhlY3V0b3IubG9nUmVxdWVzdCgnUE9TVCcsIHVybCwgb3B0aW9ucywgYm9keSk7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7dXJsfSk7XHJcblxyXG4gICAgbGV0IHJlc3BvbnNlO1xyXG4gICAgaWYgKG9wdGlvbnM/Lm9ic2VydmUgPT09ICdyZXNwb25zZScpIHtcclxuICAgICAgcmVzcG9uc2UgPSB0aGlzLmh0dHBDbGllbnQucG9zdCh1cmwsIGJvZHksIHsuLi5vcHRpb25zLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNwb25zZSA9IHRoaXMuaHR0cENsaWVudC5wb3N0KHVybCwgYm9keSwgey4uLm9wdGlvbnMsIG9ic2VydmU6ICdib2R5J30pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXNwb25zZS5waXBlKFxyXG4gICAgICB0YXAoKGRhdGEpID0+IHtcclxuICAgICAgICBIdHRwRXhlY3V0b3IubG9nUmVzcG9uc2UoJ1BPU1QnLCB1cmwsIG9wdGlvbnMsIGRhdGEpO1xyXG4gICAgICAgIGlmIChMaWJDb25maWcuY29uZmlnLmNhY2hlLmVuYWJsZWQpIHtcclxuICAgICAgICAgIHRoaXMuY2FjaGVTZXJ2aWNlLmV2aWN0UmVzb3VyY2UoQ2FjaGVLZXkub2YodXJsLCBvcHRpb25zKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gUFVUIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXJsIHRvIHBlcmZvcm0gcmVxdWVzdFxyXG4gICAqIEBwYXJhbSBib2R5IHRvIHNlbmQgd2l0aCByZXF1ZXN0XHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBvcHRpb25zIHRoYXQgYXBwbGllZCB0byB0aGUgcmVxdWVzdFxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwdXRIdHRwKHVybDogc3RyaW5nLCBib2R5OiBhbnkgfCBudWxsLCBvcHRpb25zPzogSHR0cENsaWVudE9wdGlvbnMpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgSHR0cEV4ZWN1dG9yLmxvZ1JlcXVlc3QoJ1BVVCcsIHVybCwgb3B0aW9ucywgYm9keSk7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7dXJsfSk7XHJcblxyXG4gICAgbGV0IHJlc3BvbnNlO1xyXG4gICAgaWYgKG9wdGlvbnM/Lm9ic2VydmUgPT09ICdyZXNwb25zZScpIHtcclxuICAgICAgcmVzcG9uc2UgPSB0aGlzLmh0dHBDbGllbnQucHV0KHVybCwgYm9keSwgey4uLm9wdGlvbnMsIG9ic2VydmU6ICdyZXNwb25zZSd9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3BvbnNlID0gdGhpcy5odHRwQ2xpZW50LnB1dCh1cmwsIGJvZHksIHsuLi5vcHRpb25zLCBvYnNlcnZlOiAnYm9keSd9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzcG9uc2UucGlwZShcclxuICAgICAgdGFwKChkYXRhKSA9PiB7XHJcbiAgICAgICAgSHR0cEV4ZWN1dG9yLmxvZ1Jlc3BvbnNlKCdQVVQnLCB1cmwsIG9wdGlvbnMsIGRhdGEpO1xyXG4gICAgICAgIGlmIChMaWJDb25maWcuY29uZmlnLmNhY2hlLmVuYWJsZWQpIHtcclxuICAgICAgICAgIHRoaXMuY2FjaGVTZXJ2aWNlLmV2aWN0UmVzb3VyY2UoQ2FjaGVLZXkub2YodXJsLCBvcHRpb25zKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gUEFUQ0ggcmVxdWVzdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgdG8gcGVyZm9ybSByZXF1ZXN0XHJcbiAgICogQHBhcmFtIGJvZHkgdG8gc2VuZCB3aXRoIHJlcXVlc3RcclxuICAgKiBAcGFyYW0gb3B0aW9ucyAob3B0aW9uYWwpIG9wdGlvbnMgdGhhdCBhcHBsaWVkIHRvIHRoZSByZXF1ZXN0XHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIHBhdGNoSHR0cCh1cmw6IHN0cmluZywgYm9keTogYW55IHwgbnVsbCwgb3B0aW9ucz86IEh0dHBDbGllbnRPcHRpb25zKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIEh0dHBFeGVjdXRvci5sb2dSZXF1ZXN0KCdQQVRDSCcsIHVybCwgb3B0aW9ucywgYm9keSk7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7dXJsfSk7XHJcblxyXG4gICAgbGV0IHJlc3BvbnNlO1xyXG4gICAgaWYgKG9wdGlvbnM/Lm9ic2VydmUgPT09ICdyZXNwb25zZScpIHtcclxuICAgICAgcmVzcG9uc2UgPSB0aGlzLmh0dHBDbGllbnQucGF0Y2godXJsLCBib2R5LCB7Li4ub3B0aW9ucywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJ30pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzcG9uc2UgPSB0aGlzLmh0dHBDbGllbnQucGF0Y2godXJsLCBib2R5LCB7Li4ub3B0aW9ucywgb2JzZXJ2ZTogJ2JvZHknfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLnBpcGUoXHJcbiAgICAgIHRhcCgoZGF0YSkgPT4ge1xyXG4gICAgICAgIEh0dHBFeGVjdXRvci5sb2dSZXNwb25zZSgnUEFUQ0gnLCB1cmwsIG9wdGlvbnMsIGRhdGEpO1xyXG4gICAgICAgIGlmIChMaWJDb25maWcuY29uZmlnLmNhY2hlLmVuYWJsZWQpIHtcclxuICAgICAgICAgIHRoaXMuY2FjaGVTZXJ2aWNlLmV2aWN0UmVzb3VyY2UoQ2FjaGVLZXkub2YodXJsLCBvcHRpb25zKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm0gREVMRVRFIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXJsIHRvIHBlcmZvcm0gcmVxdWVzdFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIChvcHRpb25hbCkgb3B0aW9ucyB0aGF0IGFwcGxpZWQgdG8gdGhlIHJlcXVlc3RcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgZGVsZXRlSHR0cCh1cmw6IHN0cmluZywgb3B0aW9ucz86IEh0dHBDbGllbnRPcHRpb25zKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIEh0dHBFeGVjdXRvci5sb2dSZXF1ZXN0KCdERUxFVEUnLCB1cmwsIG9wdGlvbnMpO1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3VybH0pO1xyXG5cclxuICAgIGxldCByZXNwb25zZTtcclxuICAgIGlmIChvcHRpb25zPy5vYnNlcnZlID09PSAncmVzcG9uc2UnKSB7XHJcbiAgICAgIHJlc3BvbnNlID0gdGhpcy5odHRwQ2xpZW50LmRlbGV0ZSh1cmwsIHsuLi5vcHRpb25zLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNwb25zZSA9IHRoaXMuaHR0cENsaWVudC5kZWxldGUodXJsLCB7Li4ub3B0aW9ucywgb2JzZXJ2ZTogJ2JvZHknfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLnBpcGUoXHJcbiAgICAgIHRhcCgoZGF0YSkgPT4ge1xyXG4gICAgICAgIEh0dHBFeGVjdXRvci5sb2dSZXNwb25zZSgnREVMRVRFJywgdXJsLCBvcHRpb25zLCBkYXRhKTtcclxuICAgICAgICBpZiAoTGliQ29uZmlnLmNvbmZpZy5jYWNoZS5lbmFibGVkKSB7XHJcbiAgICAgICAgICB0aGlzLmNhY2hlU2VydmljZS5ldmljdFJlc291cmNlKENhY2hlS2V5Lm9mKHVybCwgb3B0aW9ucykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=