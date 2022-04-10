import { HttpParams } from '@angular/common/http';
import { isResource } from '../model/resource-type';
import { ValidationUtils } from './validation.utils';
import { LibConfig } from '../config/lib-config';
import { isArray, isEmpty, isNil, isObject, toString } from 'lodash-es';
import { UriTemplate } from 'uri-templates-es';
export class UrlUtils {
    /**
     * Convert passed params to the {@link HttpParams}.
     *
     * @param options which need to convert
     * @param httpParams (optional) if passed then will be applied to this one, otherwise created a new one
     */
    static convertToHttpParams(options, httpParams) {
        let resultParams = httpParams ? httpParams : new HttpParams();
        if (isEmpty(options) || isNil(options)) {
            return resultParams;
        }
        UrlUtils.checkDuplicateParams(options);
        if (isObject(options.params) && !isEmpty(options.params)) {
            for (const [key, value] of Object.entries(options.params)) {
                if (options.params.hasOwnProperty(key)) {
                    if (isResource(value)) {
                        // Append resource as resource link
                        resultParams = resultParams.append(key, value.getSelfLinkHref());
                    }
                    else if (isArray(options.params[key])) {
                        // Append arrays params as repeated key with each value from array
                        options.params[key].forEach((item) => {
                            resultParams = resultParams.append(`${key.toString()}`, item);
                        });
                    }
                    else {
                        // Else append simple param as is
                        resultParams = resultParams.append(key, value.toString());
                    }
                }
            }
        }
        if (!isEmpty(options.pageParams)) {
            resultParams = resultParams.append('page', toString(options.pageParams.page));
            resultParams = resultParams.append('size', toString(options.pageParams.size));
        }
        if (!isEmpty(options.sort)) {
            resultParams = UrlUtils.generateSortParams(options.sort, resultParams);
        }
        return resultParams;
    }
    /**
     * Convert ngx-hateoas-client option to Angular HttpClient.
     * @param options ngx-hateoas-client options
     */
    static convertToHttpOptions(options) {
        if (isEmpty(options) || isNil(options)) {
            return {};
        }
        return {
            params: UrlUtils.convertToHttpParams(options),
            headers: options.headers,
            observe: options.observe,
            reportProgress: options.reportProgress,
            withCredentials: options.withCredentials,
        };
    }
    /**
     * Generate link url.
     * If proxyUrl is not empty then relation url will be use proxy.
     *
     * @param relationLink resource link to which need to generate the url
     * @param options (optional) additional options that should be applied to the request
     * @throws error when required params are not valid
     */
    static generateLinkUrl(relationLink, options) {
        ValidationUtils.validateInputParams({ relationLink, linkUrl: relationLink?.href });
        let url;
        if (options && !isEmpty(options)) {
            url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options) : relationLink.href;
        }
        else {
            url = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;
        }
        if (LibConfig.config.http.proxyUrl) {
            return url.replace(LibConfig.config.http.rootUrl, LibConfig.config.http.proxyUrl);
        }
        return url;
    }
    /**
     * Return server api url based on proxy url when it is not empty or root url otherwise.
     */
    static getApiUrl() {
        if (LibConfig.config.http.proxyUrl) {
            return LibConfig.config.http.proxyUrl;
        }
        else {
            return LibConfig.config.http.rootUrl;
        }
    }
    /**
     * Generate url use base and the resource name.
     *
     * @param baseUrl will be as first part as a result url
     * @param resourceName added to the base url through slash
     * @param query (optional) if passed then adds to end of the url
     * @throws error when required params are not valid
     */
    static generateResourceUrl(baseUrl, resourceName, query) {
        ValidationUtils.validateInputParams({ baseUrl, resourceName });
        let url = baseUrl;
        if (!url.endsWith('/')) {
            url = url.concat('/');
        }
        return url.concat(resourceName).concat(query ? `${query.startsWith('/') ? query : '/' + query}` : '');
    }
    /**
     * Retrieve a resource name from resource url.
     *
     * @param url resource url
     */
    static getResourceNameFromUrl(url) {
        ValidationUtils.validateInputParams({ url });
        const dividedBySlashUrl = url.toLowerCase().replace(`${UrlUtils.getApiUrl().toLowerCase()}/`, '').split('/');
        return dividedBySlashUrl[0];
    }
    /**
     * Clear url from template params.
     *
     * @param url to be cleaned
     * @throws error when required params are not valid
     */
    static removeTemplateParams(url) {
        ValidationUtils.validateInputParams({ url });
        return UrlUtils.fillTemplateParams(url, {});
    }
    /**
     * Clear all url params.
     *
     * @param url to clear params
     * @throws error when required params are not valid
     */
    static clearUrlParams(url) {
        ValidationUtils.validateInputParams({ url });
        const srcUrl = new URL(url);
        return srcUrl.origin + srcUrl.pathname;
    }
    /**
     * Fill url template params.
     *
     * @param url to be filled
     * @param options contains params to apply to result url, if empty then template params will be cleared
     * @throws error when required params are not valid
     */
    static fillTemplateParams(url, options) {
        ValidationUtils.validateInputParams({ url });
        UrlUtils.checkDuplicateParams(options);
        const paramsWithoutSortParam = {
            ...options,
            ...options?.params,
            ...options?.pageParams,
            /* Sets sort to null because sort is object and should be applied as multi params with sort name
               for each sort object property, but uriTemplates can't do that and we need to do it manually */
            sort: null
        };
        const resultUrl = new UriTemplate(url).fill(isNil(paramsWithoutSortParam) ? {} : paramsWithoutSortParam);
        if (options?.sort) {
            const sortParams = UrlUtils.generateSortParams(options.sort);
            if (sortParams.keys().length > 0) {
                return resultUrl.concat(resultUrl.includes('?') ? '&' : '').concat(sortParams.toString());
            }
        }
        return resultUrl;
    }
    static fillDefaultPageDataIfNoPresent(options) {
        const pagedOptions = !isEmpty(options) ? options : {};
        if (isEmpty(pagedOptions.pageParams)) {
            pagedOptions.pageParams = LibConfig.config.pagination.defaultPage;
        }
        else if (!pagedOptions.pageParams.size) {
            pagedOptions.pageParams.size = LibConfig.config.pagination.defaultPage.size;
        }
        else if (!pagedOptions.pageParams.page) {
            pagedOptions.pageParams.page = LibConfig.config.pagination.defaultPage.page;
        }
        return pagedOptions;
    }
    static generateSortParams(sort, httpParams) {
        let resultParams = httpParams ? httpParams : new HttpParams();
        if (!isEmpty(sort)) {
            for (const [sortPath, sortOrder] of Object.entries(sort)) {
                resultParams = resultParams.append('sort', `${sortPath},${sortOrder}`);
            }
        }
        return resultParams;
    }
    static checkDuplicateParams(options) {
        if (isEmpty(options) || isEmpty(options.params)) {
            return;
        }
        if ('page' in options.params || 'size' in options.params) {
            throw Error('Please, pass page params in page object key, not with params object!');
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLnV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWhhdGVvYXMtY2xpZW50L3NyYy9saWIvdXRpbC91cmwudXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUdwRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUUvQyxNQUFNLE9BQU8sUUFBUTtJQUVuQjs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUF1QixFQUFFLFVBQXVCO1FBQ2hGLElBQUksWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQzlELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN0QyxPQUFPLFlBQVksQ0FBQztTQUNyQjtRQUNELFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV2QyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3hELEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8s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VSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7U0FDN0U7YUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDeEMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztTQUM3RTtRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFTyxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBVSxFQUFFLFVBQXVCO1FBQ25FLElBQUksWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQzlELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEIsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hELFlBQVksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFJLFFBQVMsSUFBSyxTQUFVLEVBQUUsQ0FBQyxDQUFDO2FBQzVFO1NBQ0Y7UUFFRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRU8sTUFBTSxDQUFDLG9CQUFvQixDQUFDLE9BQWtCO1FBQ3BELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDL0MsT0FBTztTQUNSO1FBQ0QsSUFBSSxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUN4RCxNQUFNLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO1NBQ3JGO0lBQ0gsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgaXNSZXNvdXJjZSB9IGZyb20gJy4uL21vZGVsL3Jlc291cmNlLXR5cGUnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4uL21vZGVsL3Jlc291cmNlL3Jlc291cmNlJztcclxuaW1wb3J0IHsgR2V0T3B0aW9uLCBIdHRwQ2xpZW50T3B0aW9ucywgTGlua0RhdGEsIFBhZ2VkR2V0T3B0aW9uLCBTb3J0IH0gZnJvbSAnLi4vbW9kZWwvZGVjbGFyYXRpb25zJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblV0aWxzIH0gZnJvbSAnLi92YWxpZGF0aW9uLnV0aWxzJztcclxuaW1wb3J0IHsgTGliQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2xpYi1jb25maWcnO1xyXG5pbXBvcnQgeyBpc0FycmF5LCBpc0VtcHR5LCBpc05pbCwgaXNPYmplY3QsIHRvU3RyaW5nIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuaW1wb3J0IHsgVXJpVGVtcGxhdGUgfSBmcm9tICd1cmktdGVtcGxhdGVzLWVzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBVcmxVdGlscyB7XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlcnQgcGFzc2VkIHBhcmFtcyB0byB0aGUge0BsaW5rIEh0dHBQYXJhbXN9LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgd2hpY2ggbmVlZCB0byBjb252ZXJ0XHJcbiAgICogQHBhcmFtIGh0dHBQYXJhbXMgKG9wdGlvbmFsKSBpZiBwYXNzZWQgdGhlbiB3aWxsIGJlIGFwcGxpZWQgdG8gdGhpcyBvbmUsIG90aGVyd2lzZSBjcmVhdGVkIGEgbmV3IG9uZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgY29udmVydFRvSHR0cFBhcmFtcyhvcHRpb25zOiBQYWdlZEdldE9wdGlvbiwgaHR0cFBhcmFtcz86IEh0dHBQYXJhbXMpOiBIdHRwUGFyYW1zIHtcclxuICAgIGxldCByZXN1bHRQYXJhbXMgPSBodHRwUGFyYW1zID8gaHR0cFBhcmFtcyA6IG5ldyBIdHRwUGFyYW1zKCk7XHJcbiAgICBpZiAoaXNFbXB0eShvcHRpb25zKSB8fCBpc05pbChvcHRpb25zKSkge1xyXG4gICAgICByZXR1cm4gcmVzdWx0UGFyYW1zO1xyXG4gICAgfVxyXG4gICAgVXJsVXRpbHMuY2hlY2tEdXBsaWNhdGVQYXJhbXMob3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKGlzT2JqZWN0KG9wdGlvbnMucGFyYW1zKSAmJiAhaXNFbXB0eShvcHRpb25zLnBhcmFtcykpIHtcclxuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob3B0aW9ucy5wYXJhbXMpKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgIGlmIChpc1Jlc291cmNlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAvLyBBcHBlbmQgcmVzb3VyY2UgYXMgcmVzb3VyY2UgbGlua1xyXG4gICAgICAgICAgICByZXN1bHRQYXJhbXMgPSByZXN1bHRQYXJhbXMuYXBwZW5kKGtleSwgKHZhbHVlIGFzIFJlc291cmNlKS5nZXRTZWxmTGlua0hyZWYoKSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkob3B0aW9ucy5wYXJhbXNba2V5XSkpIHtcclxuICAgICAgICAgICAgLy8gQXBwZW5kIGFycmF5cyBwYXJhbXMgYXMgcmVwZWF0ZWQga2V5IHdpdGggZWFjaCB2YWx1ZSBmcm9tIGFycmF5XHJcbiAgICAgICAgICAgIChvcHRpb25zLnBhcmFtc1trZXldIGFzIEFycmF5PGFueT4pLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICByZXN1bHRQYXJhbXMgPSByZXN1bHRQYXJhbXMuYXBwZW5kKGAkeyBrZXkudG9TdHJpbmcoKSB9YCwgaXRlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gRWxzZSBhcHBlbmQgc2ltcGxlIHBhcmFtIGFzIGlzXHJcbiAgICAgICAgICAgIHJlc3VsdFBhcmFtcyA9IHJlc3VsdFBhcmFtcy5hcHBlbmQoa2V5LCB2YWx1ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWlzRW1wdHkob3B0aW9ucy5wYWdlUGFyYW1zKSkge1xyXG4gICAgICByZXN1bHRQYXJhbXMgPSByZXN1bHRQYXJhbXMuYXBwZW5kKCdwYWdlJywgdG9TdHJpbmcob3B0aW9ucy5wYWdlUGFyYW1zLnBhZ2UpKTtcclxuICAgICAgcmVzdWx0UGFyYW1zID0gcmVzdWx0UGFyYW1zLmFwcGVuZCgnc2l6ZScsIHRvU3RyaW5nKG9wdGlvbnMucGFnZVBhcmFtcy5zaXplKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWlzRW1wdHkob3B0aW9ucy5zb3J0KSkge1xyXG4gICAgICByZXN1bHRQYXJhbXMgPSBVcmxVdGlscy5nZW5lcmF0ZVNvcnRQYXJhbXMob3B0aW9ucy5zb3J0LCByZXN1bHRQYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHRQYXJhbXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb252ZXJ0IG5neC1oYXRlb2FzLWNsaWVudCBvcHRpb24gdG8gQW5ndWxhciBIdHRwQ2xpZW50LlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIG5neC1oYXRlb2FzLWNsaWVudCBvcHRpb25zXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyBjb252ZXJ0VG9IdHRwT3B0aW9ucyhvcHRpb25zOiBQYWdlZEdldE9wdGlvbik6IEh0dHBDbGllbnRPcHRpb25zIHtcclxuICAgIGlmIChpc0VtcHR5KG9wdGlvbnMpIHx8IGlzTmlsKG9wdGlvbnMpKSB7XHJcbiAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwYXJhbXM6IFVybFV0aWxzLmNvbnZlcnRUb0h0dHBQYXJhbXMob3B0aW9ucyksXHJcbiAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyxcclxuICAgICAgb2JzZXJ2ZTogb3B0aW9ucy5vYnNlcnZlLFxyXG4gICAgICByZXBvcnRQcm9ncmVzczogb3B0aW9ucy5yZXBvcnRQcm9ncmVzcyxcclxuICAgICAgd2l0aENyZWRlbnRpYWxzOiBvcHRpb25zLndpdGhDcmVkZW50aWFscyxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmF0ZSBsaW5rIHVybC5cclxuICAgKiBJZiBwcm94eVVybCBpcyBub3QgZW1wdHkgdGhlbiByZWxhdGlvbiB1cmwgd2lsbCBiZSB1c2UgcHJveHkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVsYXRpb25MaW5rIHJlc291cmNlIGxpbmsgdG8gd2hpY2ggbmVlZCB0byBnZW5lcmF0ZSB0aGUgdXJsXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbmFsKSBhZGRpdGlvbmFsIG9wdGlvbnMgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgcmVxdWVzdFxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgZ2VuZXJhdGVMaW5rVXJsKHJlbGF0aW9uTGluazogTGlua0RhdGEsIG9wdGlvbnM/OiBQYWdlZEdldE9wdGlvbik6IHN0cmluZyB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVsYXRpb25MaW5rLCBsaW5rVXJsOiByZWxhdGlvbkxpbms/LmhyZWZ9KTtcclxuICAgIGxldCB1cmw7XHJcbiAgICBpZiAob3B0aW9ucyAmJiAhaXNFbXB0eShvcHRpb25zKSkge1xyXG4gICAgICB1cmwgPSByZWxhdGlvbkxpbmsudGVtcGxhdGVkID8gVXJsVXRpbHMuZmlsbFRlbXBsYXRlUGFyYW1zKHJlbGF0aW9uTGluay5ocmVmLCBvcHRpb25zKSA6IHJlbGF0aW9uTGluay5ocmVmO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXJsID0gcmVsYXRpb25MaW5rLnRlbXBsYXRlZCA/IFVybFV0aWxzLnJlbW92ZVRlbXBsYXRlUGFyYW1zKHJlbGF0aW9uTGluay5ocmVmKSA6IHJlbGF0aW9uTGluay5ocmVmO1xyXG4gICAgfVxyXG4gICAgaWYgKExpYkNvbmZpZy5jb25maWcuaHR0cC5wcm94eVVybCkge1xyXG4gICAgICByZXR1cm4gdXJsLnJlcGxhY2UoTGliQ29uZmlnLmNvbmZpZy5odHRwLnJvb3RVcmwsIExpYkNvbmZpZy5jb25maWcuaHR0cC5wcm94eVVybCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJuIHNlcnZlciBhcGkgdXJsIGJhc2VkIG9uIHByb3h5IHVybCB3aGVuIGl0IGlzIG5vdCBlbXB0eSBvciByb290IHVybCBvdGhlcndpc2UuXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyBnZXRBcGlVcmwoKTogc3RyaW5nIHtcclxuICAgIGlmIChMaWJDb25maWcuY29uZmlnLmh0dHAucHJveHlVcmwpIHtcclxuICAgICAgcmV0dXJuIExpYkNvbmZpZy5jb25maWcuaHR0cC5wcm94eVVybDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBMaWJDb25maWcuY29uZmlnLmh0dHAucm9vdFVybDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlIHVybCB1c2UgYmFzZSBhbmQgdGhlIHJlc291cmNlIG5hbWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYmFzZVVybCB3aWxsIGJlIGFzIGZpcnN0IHBhcnQgYXMgYSByZXN1bHQgdXJsXHJcbiAgICogQHBhcmFtIHJlc291cmNlTmFtZSBhZGRlZCB0byB0aGUgYmFzZSB1cmwgdGhyb3VnaCBzbGFzaFxyXG4gICAqIEBwYXJhbSBxdWVyeSAob3B0aW9uYWwpIGlmIHBhc3NlZCB0aGVuIGFkZHMgdG8gZW5kIG9mIHRoZSB1cmxcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgc3RhdGljIGdlbmVyYXRlUmVzb3VyY2VVcmwoYmFzZVVybDogc3RyaW5nLCByZXNvdXJjZU5hbWU6IHN0cmluZywgcXVlcnk/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe2Jhc2VVcmwsIHJlc291cmNlTmFtZX0pO1xyXG5cclxuICAgIGxldCB1cmwgPSBiYXNlVXJsO1xyXG4gICAgaWYgKCF1cmwuZW5kc1dpdGgoJy8nKSkge1xyXG4gICAgICB1cmwgPSB1cmwuY29uY2F0KCcvJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsLmNvbmNhdChyZXNvdXJjZU5hbWUpLmNvbmNhdChxdWVyeSA/IGAkeyBxdWVyeS5zdGFydHNXaXRoKCcvJykgPyBxdWVyeSA6ICcvJyArIHF1ZXJ5IH1gIDogJycpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmUgYSByZXNvdXJjZSBuYW1lIGZyb20gcmVzb3VyY2UgdXJsLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVybCByZXNvdXJjZSB1cmxcclxuICAgKi9cclxuICBwdWJsaWMgc3RhdGljIGdldFJlc291cmNlTmFtZUZyb21VcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3VybH0pO1xyXG5cclxuICAgIGNvbnN0IGRpdmlkZWRCeVNsYXNoVXJsID0gdXJsLnRvTG93ZXJDYXNlKCkucmVwbGFjZShgJHsgVXJsVXRpbHMuZ2V0QXBpVXJsKCkudG9Mb3dlckNhc2UoKSB9L2AsICcnKS5zcGxpdCgnLycpO1xyXG4gICAgcmV0dXJuIGRpdmlkZWRCeVNsYXNoVXJsWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xlYXIgdXJsIGZyb20gdGVtcGxhdGUgcGFyYW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVybCB0byBiZSBjbGVhbmVkXHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyByZW1vdmVUZW1wbGF0ZVBhcmFtcyh1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7dXJsfSk7XHJcblxyXG4gICAgcmV0dXJuIFVybFV0aWxzLmZpbGxUZW1wbGF0ZVBhcmFtcyh1cmwsIHt9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsZWFyIGFsbCB1cmwgcGFyYW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVybCB0byBjbGVhciBwYXJhbXNcclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWRcclxuICAgKi9cclxuICBwdWJsaWMgc3RhdGljIGNsZWFyVXJsUGFyYW1zKHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHt1cmx9KTtcclxuICAgIGNvbnN0IHNyY1VybCA9IG5ldyBVUkwodXJsKTtcclxuXHJcbiAgICByZXR1cm4gc3JjVXJsLm9yaWdpbiArIHNyY1VybC5wYXRobmFtZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbGwgdXJsIHRlbXBsYXRlIHBhcmFtcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgdG8gYmUgZmlsbGVkXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgY29udGFpbnMgcGFyYW1zIHRvIGFwcGx5IHRvIHJlc3VsdCB1cmwsIGlmIGVtcHR5IHRoZW4gdGVtcGxhdGUgcGFyYW1zIHdpbGwgYmUgY2xlYXJlZFxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgZmlsbFRlbXBsYXRlUGFyYW1zKHVybDogc3RyaW5nLCBvcHRpb25zOiBQYWdlZEdldE9wdGlvbik6IHN0cmluZyB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7dXJsfSk7XHJcbiAgICBVcmxVdGlscy5jaGVja0R1cGxpY2F0ZVBhcmFtcyhvcHRpb25zKTtcclxuXHJcbiAgICBjb25zdCBwYXJhbXNXaXRob3V0U29ydFBhcmFtID0ge1xyXG4gICAgICAuLi5vcHRpb25zLFxyXG4gICAgICAuLi5vcHRpb25zPy5wYXJhbXMsXHJcbiAgICAgIC4uLm9wdGlvbnM/LnBhZ2VQYXJhbXMsXHJcbiAgICAgIC8qIFNldHMgc29ydCB0byBudWxsIGJlY2F1c2Ugc29ydCBpcyBvYmplY3QgYW5kIHNob3VsZCBiZSBhcHBsaWVkIGFzIG11bHRpIHBhcmFtcyB3aXRoIHNvcnQgbmFtZVxyXG4gICAgICAgICBmb3IgZWFjaCBzb3J0IG9iamVjdCBwcm9wZXJ0eSwgYnV0IHVyaVRlbXBsYXRlcyBjYW4ndCBkbyB0aGF0IGFuZCB3ZSBuZWVkIHRvIGRvIGl0IG1hbnVhbGx5ICovXHJcbiAgICAgIHNvcnQ6IG51bGxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVzdWx0VXJsID0gbmV3IFVyaVRlbXBsYXRlKHVybCkuZmlsbChpc05pbChwYXJhbXNXaXRob3V0U29ydFBhcmFtKSA/IHt9IDogcGFyYW1zV2l0aG91dFNvcnRQYXJhbSk7XHJcbiAgICBpZiAob3B0aW9ucz8uc29ydCkge1xyXG4gICAgICBjb25zdCBzb3J0UGFyYW1zID0gVXJsVXRpbHMuZ2VuZXJhdGVTb3J0UGFyYW1zKG9wdGlvbnMuc29ydCk7XHJcbiAgICAgIGlmIChzb3J0UGFyYW1zLmtleXMoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdFVybC5jb25jYXQocmVzdWx0VXJsLmluY2x1ZGVzKCc/JykgPyAnJicgOiAnJykuY29uY2F0KHNvcnRQYXJhbXMudG9TdHJpbmcoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0VXJsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBmaWxsRGVmYXVsdFBhZ2VEYXRhSWZOb1ByZXNlbnQob3B0aW9uczogUGFnZWRHZXRPcHRpb24pIHtcclxuICAgIGNvbnN0IHBhZ2VkT3B0aW9ucyA9ICFpc0VtcHR5KG9wdGlvbnMpID8gb3B0aW9ucyA6IHt9O1xyXG4gICAgaWYgKGlzRW1wdHkocGFnZWRPcHRpb25zLnBhZ2VQYXJhbXMpKSB7XHJcbiAgICAgIHBhZ2VkT3B0aW9ucy5wYWdlUGFyYW1zID0gTGliQ29uZmlnLmNvbmZpZy5wYWdpbmF0aW9uLmRlZmF1bHRQYWdlO1xyXG4gICAgfSBlbHNlIGlmICghcGFnZWRPcHRpb25zLnBhZ2VQYXJhbXMuc2l6ZSkge1xyXG4gICAgICBwYWdlZE9wdGlvbnMucGFnZVBhcmFtcy5zaXplID0gTGliQ29uZmlnLmNvbmZpZy5wYWdpbmF0aW9uLmRlZmF1bHRQYWdlLnNpemU7XHJcbiAgICB9IGVsc2UgaWYgKCFwYWdlZE9wdGlvbnMucGFnZVBhcmFtcy5wYWdlKSB7XHJcbiAgICAgIHBhZ2VkT3B0aW9ucy5wYWdlUGFyYW1zLnBhZ2UgPSBMaWJDb25maWcuY29uZmlnLnBhZ2luYXRpb24uZGVmYXVsdFBhZ2UucGFnZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFnZWRPcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVTb3J0UGFyYW1zKHNvcnQ6IFNvcnQsIGh0dHBQYXJhbXM/OiBIdHRwUGFyYW1zKTogSHR0cFBhcmFtcyB7XHJcbiAgICBsZXQgcmVzdWx0UGFyYW1zID0gaHR0cFBhcmFtcyA/IGh0dHBQYXJhbXMgOiBuZXcgSHR0cFBhcmFtcygpO1xyXG4gICAgaWYgKCFpc0VtcHR5KHNvcnQpKSB7XHJcbiAgICAgIGZvciAoY29uc3QgW3NvcnRQYXRoLCBzb3J0T3JkZXJdIG9mIE9iamVjdC5lbnRyaWVzKHNvcnQpKSB7XHJcbiAgICAgICAgcmVzdWx0UGFyYW1zID0gcmVzdWx0UGFyYW1zLmFwcGVuZCgnc29ydCcsIGAkeyBzb3J0UGF0aCB9LCR7IHNvcnRPcmRlciB9YCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0UGFyYW1zO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgY2hlY2tEdXBsaWNhdGVQYXJhbXMob3B0aW9uczogR2V0T3B0aW9uKTogdm9pZCB7XHJcbiAgICBpZiAoaXNFbXB0eShvcHRpb25zKSB8fCBpc0VtcHR5KG9wdGlvbnMucGFyYW1zKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoJ3BhZ2UnIGluIG9wdGlvbnMucGFyYW1zIHx8ICdzaXplJyBpbiBvcHRpb25zLnBhcmFtcykge1xyXG4gICAgICB0aHJvdyBFcnJvcignUGxlYXNlLCBwYXNzIHBhZ2UgcGFyYW1zIGluIHBhZ2Ugb2JqZWN0IGtleSwgbm90IHdpdGggcGFyYW1zIG9iamVjdCEnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiJdfQ==