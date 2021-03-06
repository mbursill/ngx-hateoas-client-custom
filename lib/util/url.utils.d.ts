import { HttpParams } from '@angular/common/http';
import { HttpClientOptions, LinkData, PagedGetOption } from '../model/declarations';
export declare class UrlUtils {
    /**
     * Convert passed params to the {@link HttpParams}.
     *
     * @param options which need to convert
     * @param httpParams (optional) if passed then will be applied to this one, otherwise created a new one
     */
    static convertToHttpParams(options: PagedGetOption, httpParams?: HttpParams): HttpParams;
    /**
     * Convert ngx-hateoas-client option to Angular HttpClient.
     * @param options ngx-hateoas-client options
     */
    static convertToHttpOptions(options: PagedGetOption): HttpClientOptions;
    /**
     * Generate link url.
     * If proxyUrl is not empty then relation url will be use proxy.
     *
     * @param relationLink resource link to which need to generate the url
     * @param options (optional) additional options that should be applied to the request
     * @throws error when required params are not valid
     */
    static generateLinkUrl(relationLink: LinkData, options?: PagedGetOption): string;
    /**
     * Return server api url based on proxy url when it is not empty or root url otherwise.
     */
    static getApiUrl(): string;
    /**
     * Generate url use base and the resource name.
     *
     * @param baseUrl will be as first part as a result url
     * @param resourceName added to the base url through slash
     * @param query (optional) if passed then adds to end of the url
     * @throws error when required params are not valid
     */
    static generateResourceUrl(baseUrl: string, resourceName: string, query?: string): string;
    /**
     * Retrieve a resource name from resource url.
     *
     * @param url resource url
     */
    static getResourceNameFromUrl(url: string): string;
    /**
     * Clear url from template params.
     *
     * @param url to be cleaned
     * @throws error when required params are not valid
     */
    static removeTemplateParams(url: string): string;
    /**
     * Clear all url params.
     *
     * @param url to clear params
     * @throws error when required params are not valid
     */
    static clearUrlParams(url: string): string;
    /**
     * Fill url template params.
     *
     * @param url to be filled
     * @param options contains params to apply to result url, if empty then template params will be cleared
     * @throws error when required params are not valid
     */
    static fillTemplateParams(url: string, options: PagedGetOption): string;
    static fillDefaultPageDataIfNoPresent(options: PagedGetOption): PagedGetOption;
    private static generateSortParams;
    private static checkDuplicateParams;
}
