import * as i0 from '@angular/core';
import { Injectable, NgModule } from '@angular/core';
import { isEmpty, capitalize, camelCase, isObject, isString, isNil, isFunction, isPlainObject, isArray, toString, last, split, result, isNumber, isNull, isUndefined } from 'lodash-es';
import * as i1 from '@angular/common/http';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { UriTemplate } from 'uri-templates-es';
import { of, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

/**
 * Holds dependency injector to allow use ше in internal the lib classes.
 */
/* tslint:disable:variable-name */
class DependencyInjector {
    static get(type) {
        if (this._injector) {
            return this._injector.get(type);
        }
        throw new Error('You need initialize Injector');
    }
    static set injector(value) {
        this._injector = value;
    }
}
DependencyInjector._injector = null;

/**
 * Contains all configuration lib params.
 */
class LibConfig {
    static setConfig(hateoasConfiguration) {
        LibConfig.config = {
            ...LibConfig.DEFAULT_CONFIG,
            ...hateoasConfiguration
        };
    }
}
LibConfig.DEFAULT_CONFIG = {
    http: {
        rootUrl: 'http://localhost:8080/api/v1'
    },
    logs: {
        verboseLogs: false
    },
    cache: {
        enabled: true,
        lifeTime: 5 * 60 * 1000
    },
    useTypes: {
        resources: []
    },
    pagination: {
        defaultPage: {
            size: 20,
            page: 0
        }
    },
    isProduction: false
};
LibConfig.config = LibConfig.DEFAULT_CONFIG;

/* tslint:disable:variable-name no-console */
class ConsoleLogger {
    static info(message, ...optionalParams) {
        if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
            return;
        }
        console.info(message, ...optionalParams);
    }
    static warn(message, ...optionalParams) {
        if (LibConfig.config.isProduction) {
            return;
        }
        console.warn(message, ...optionalParams);
    }
    static error(message, ...optionalParams) {
        if (LibConfig.config.isProduction) {
            return;
        }
        console.error(message, ...optionalParams);
    }
    /**
     * Log info messages in pretty format.
     *
     * @param message log message
     * @param params additional params for verbose log
     */
    static prettyInfo(message, params) {
        if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
            return;
        }
        let msg = `%c${message}\n`;
        const color = [
            'color: #201AB3;'
        ];
        if (!isEmpty(params)) {
            for (const [key, value] of Object.entries(params)) {
                if (key.toLowerCase() === 'result') {
                    msg += `%c${capitalize(key)}: %c${value}\n`;
                    color.push('color: #3AA6D0;', 'color: #00BA45;');
                }
                else {
                    msg += `%c${camelCase(key)}: %c${value}\n`;
                    color.push('color: #3AA6D0;', 'color: default;');
                }
            }
        }
        ConsoleLogger.info(msg, ...color);
    }
    /**
     * Log resource info messages in pretty format.
     *
     * @param message log message
     * @param resourceName resource name
     * @param params additional params for verbose log
     */
    static resourcePrettyInfo(resourceName, message, params) {
        if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
            return;
        }
        let msg = `%c${resourceName} %c${message}\n`;
        const color = [
            'color: #DA005C;',
            'color: #201AB3;'
        ];
        if (!isEmpty(params)) {
            for (const [key, value] of Object.entries(params)) {
                if (key.toLowerCase() === 'result') {
                    msg += `%c${capitalize(key)}: %c${value}\n`;
                    color.push('color: #3AA6D0;', 'color: #00BA45;');
                }
                else {
                    msg += `%c${camelCase(key)}: %c${value}\n`;
                    color.push('color: #3AA6D0;', 'color: default;');
                }
            }
        }
        ConsoleLogger.info(msg, ...color);
    }
    /**
     * Log error messages in pretty format.
     *
     * @param message log message
     * @param params additional params for verbose log
     */
    static prettyError(message, params) {
        if (LibConfig.config.isProduction) {
            return;
        }
        let msg = `%c${message}\n`;
        const color = [
            'color: #df004f;'
        ];
        if (!isEmpty(params)) {
            for (const [key, value] of Object.entries(params)) {
                if (key.toLowerCase() === 'error') {
                    msg += `%c${capitalize(key)}: %c${value}\n`;
                    color.push('color: #df004f;', 'color: #ff0000;');
                }
                else {
                    msg += `%c${capitalize(key)}: %c${value}\n`;
                    color.push('color: #3AA6D0;', 'color: #000;');
                }
            }
        }
        ConsoleLogger.error(msg, ...color);
    }
    /**
     * Log warn messages in pretty format.
     *
     * @param message log message
     * @param params additional params for verbose log
     */
    static prettyWarn(message, params) {
        if (LibConfig.config.isProduction) {
            return;
        }
        let msg = `%c${message}\n`;
        const color = [
            'color: #ffbe00;'
        ];
        if (!isEmpty(params)) {
            for (const [key, value] of Object.entries(params)) {
                msg += `%c${capitalize(key)}: %c${value}\n`;
                color.push('color: #3AA6D0;', 'color: #000;');
            }
        }
        ConsoleLogger.warn(msg, ...color);
    }
}

function isEmbeddedResource(object) {
    // Embedded resource doesn't have self link in _links object
    return !isPagedResourceCollection(object) && !isResourceCollection(object) && isResourceObject(object) && !('self' in object._links);
}
function isResource(object) {
    return !isPagedResourceCollection(object) && !isResourceCollection(object) && isResourceObject(object) && ('self' in object._links);
}
function isResourceCollection(object) {
    return isObject(object) &&
        ('_embedded' in object) &&
        ('_links' in object) &&
        !('page' in object) &&
        (Object.keys(object).length === 2);
}
function isPagedResourceCollection(object) {
    return isObject(object) &&
        ('_embedded' in object) &&
        ('_links' in object) &&
        ('page' in object) &&
        (Object.keys(object).length === 3);
}
/**
 * Check that passed object has links property.
 *
 * @param object which need to check links property
 */
function isResourceObject(object) {
    return isObject(object) && ('_links' in object);
}
/**
 * Defining resource type bypassed object.
 *
 * @param object that presumably is one of resource type
 */
function getResourceType(object) {
    if (isEmbeddedResource(object)) {
        return 'EmbeddedResource';
    }
    else if (isResource(object)) {
        return 'Resource';
    }
    else if (isResourceCollection(object)) {
        return 'ResourceCollection';
    }
    else if (isPagedResourceCollection(object)) {
        return 'PagedResourceCollection';
    }
    else {
        return 'Unknown';
    }
}

var Include;
(function (Include) {
    Include["NULL_VALUES"] = "NULL_VALUES";
})(Include || (Include = {}));
/**
 * Supported http methods for custom query.
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
})(HttpMethod || (HttpMethod = {}));

var Stage;
(function (Stage) {
    Stage["BEGIN"] = "BEGIN";
    Stage["PREPARE_URL"] = "PREPARE_URL";
    Stage["CHECK_PARAMS"] = "CHECK_PARAMS";
    Stage["PREPARE_PARAMS"] = "PREPARE_PARAMS";
    Stage["INIT_RESOURCE"] = "INIT_RESOURCE";
    Stage["RESOLVE_VALUES"] = "RESOLVE_VALUES";
    Stage["CACHE_PUT"] = "CACHE_PUT";
    Stage["CACHE_GET"] = "CACHE_GET";
    Stage["CACHE_EVICT"] = "CACHE_EVICT";
    Stage["HTTP_REQUEST"] = "HTTP_REQUEST";
    Stage["HTTP_RESPONSE"] = "HTTP_RESPONSE";
    Stage["END"] = "END";
})(Stage || (Stage = {}));

/**
 * Simplify logger calls.
 */
/* tslint:disable:no-string-literal */
class StageLogger {
    static resourceBeginLog(resource, method, params) {
        if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
            return;
        }
        const paramToLog = this.prepareParams(params);
        let resourceName;
        if (isString(resource)) {
            resourceName = resource;
        }
        else if (!isNil(resource)) {
            resourceName = '__resourceName__' in resource ? resource['__resourceName__'] : 'EmbeddedResource';
        }
        else {
            resourceName = 'NOT_DEFINED_RESOURCE_NAME';
        }
        ConsoleLogger.resourcePrettyInfo(`${capitalize(resourceName)} ${method}`, `STAGE ${Stage.BEGIN}`, paramToLog);
    }
    static resourceEndLog(resource, method, params) {
        if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
            return;
        }
        const paramToLog = this.prepareParams(params);
        let resourceName;
        if (isString(resource)) {
            resourceName = resource;
        }
        else {
            resourceName = '__resourceName__' in resource ? resource['__resourceName__'] : 'EmbeddedResource';
        }
        ConsoleLogger.resourcePrettyInfo(`${capitalize(resourceName)} ${method}`, `STAGE ${Stage.END}`, paramToLog);
    }
    static stageLog(stage, params) {
        if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
            return;
        }
        const paramToLog = this.prepareParams(params);
        ConsoleLogger.prettyInfo(`STAGE ${stage}`, paramToLog);
    }
    static stageErrorLog(stage, params) {
        if (LibConfig.config.isProduction) {
            return;
        }
        const paramToLog = this.prepareParams(params);
        ConsoleLogger.prettyError(`STAGE ${stage}`, paramToLog);
    }
    static stageWarnLog(stage, params) {
        if (LibConfig.config.isProduction) {
            return;
        }
        const paramToLog = this.prepareParams(params);
        ConsoleLogger.prettyWarn(`STAGE ${stage}`, paramToLog);
    }
    static prepareParams(params) {
        const paramToLog = {};
        if (isEmpty(params)) {
            return paramToLog;
        }
        for (const [key, value] of Object.entries(params)) {
            if (!params.hasOwnProperty(key)) {
                continue;
            }
            if (isObject(value)) {
                paramToLog[key] = JSON.stringify(value, null, 2);
            }
            else {
                paramToLog[key] = value;
            }
        }
        return paramToLog;
    }
}

class ValidationUtils {
    /**
     * Checks that passed object with params has all valid params.
     * Params should not has null, undefined, empty object, empty string values.
     *
     * @param params object with params to check
     * @throws error if any params are not defined
     */
    static validateInputParams(params) {
        if (isNil(params)) {
            const errMsg = 'Passed params object is not valid';
            StageLogger.stageErrorLog(Stage.CHECK_PARAMS, { error: errMsg });
            throw new Error(errMsg);
        }
        const notValidParams = [];
        for (const [key, value] of Object.entries(params)) {
            // tslint:disable-next-line:no-string-literal
            if (isFunction(value) && isFunction(value.constructor) && !value['__resourceName__']) {
                throw new Error(`Resource '${value.name}' has not 'resourceName' value. Set it with @HateoasResource decorator on '${value.name}' class.`);
            }
            if (isNil(value)
                || (isString(value) && !value)
                || (isPlainObject(value) && isEmpty(value))
                || (isArray(value) && value.length === 0)) {
                let formattedValue = value;
                if (isObject(value)) {
                    formattedValue = JSON.stringify(value, null, 2);
                }
                notValidParams.push(`'${key} = ${formattedValue}'`);
            }
        }
        if (notValidParams.length > 0) {
            const errMsg = `Passed param(s) ${notValidParams.join(', ')} ${notValidParams.length > 1 ? 'are' : 'is'} not valid`;
            StageLogger.stageErrorLog(Stage.CHECK_PARAMS, { error: errMsg });
            throw new Error(errMsg);
        }
    }
}

class UrlUtils {
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

/* tslint:disable:no-string-literal */
class ResourceUtils {
    static useResourceType(type) {
        this.resourceType = type;
    }
    static useResourceCollectionType(type) {
        this.resourceCollectionType = type;
    }
    static usePagedResourceCollectionType(type) {
        this.pagedResourceCollectionType = type;
    }
    static useEmbeddedResourceType(type) {
        this.embeddedResourceType = type;
    }
    static instantiateResource(payload, isProjection) {
        // @ts-ignore
        if (isEmpty(payload)
            || (!isObject(payload['_links']) || isEmpty(payload['_links']))) {
            ConsoleLogger.warn('Incorrect resource object! Returned \'null\' value, because it has not \'_links\' array. Check that server send right resource object.', { incorrectResource: payload });
            return null;
        }
        return this.createResource(this.resolvePayloadProperties(payload, isProjection), isProjection);
    }
    static resolvePayloadProperties(payload, isProjection) {
        for (const key of Object.keys(payload)) {
            if (key === 'hibernateLazyInitializer') {
                delete payload[key];
                continue;
            }
            if (key === '_links') {
                payload[key] = payload[key];
                continue;
            }
            payload[key] = this.resolvePayloadType(key, payload[key], isProjection);
        }
        return payload;
    }
    static resolvePayloadType(key, payload, isProjection) {
        if (isNil(payload)) {
            return payload;
        }
        else if (isArray(payload)) {
            for (let i = 0; i < payload.length; i++) {
                payload[i] = this.resolvePayloadType(key, payload[i], isProjection);
            }
        }
        else if (isProjection && isPlainObject(payload)) {
            // Need to check resource projection relation props because some inner props can be objects that can be also resources
            payload = this.resolvePayloadProperties(this.createResourceProjectionRel(key, payload), isProjection);
        }
        else if (isEmbeddedResource(payload) || ResourceUtils.EMBEDDED_RESOURCE_TYPE_MAP.get(key)) {
            // Need to check embedded resource props because some inner props can be objects that can be also resources
            payload = this.resolvePayloadProperties(this.createEmbeddedResource(key, payload), isProjection);
        }
        else if (isResource(payload)) {
            // Need to check resource props because some inner props can be objects that can be also resources
            payload = this.resolvePayloadProperties(this.createResource(payload), isProjection);
        }
        return payload;
    }
    static createResource(payload, isProjection) {
        const resourceName = this.findResourceName(payload);
        let resourceClass;
        if (isProjection && !ResourceUtils.RESOURCE_NAME_PROJECTION_TYPE_MAP.get(resourceName)) {
            resourceClass = ResourceUtils.RESOURCE_NAME_TYPE_MAP.get(resourceName);
            ConsoleLogger.prettyWarn('Not found projection resource type when create resource projection: \'' + resourceName + '\' so used resource type: \'' + (resourceClass ? resourceClass?.name : ' default Resource') + '\'. \n\r' +
                'It can be when you pass projection param as http request directly instead use projection type with @HateoasProjection.\n\r' +
                '\n\rSee more how to use @HateoasProjection here https://github.com/lagoshny/ngx-hateoas-client#resource-projection-support.');
        }
        else {
            resourceClass = isProjection
                ? ResourceUtils.RESOURCE_NAME_PROJECTION_TYPE_MAP.get(resourceName)
                : ResourceUtils.RESOURCE_NAME_TYPE_MAP.get(resourceName);
        }
        if (resourceClass) {
            return Object.assign(new (resourceClass)(), payload);
        }
        else {
            ConsoleLogger.prettyWarn('Not found resource type when create resource: \'' + resourceName + '\' so used default Resource type, for this can be some reasons: \n\r' +
                '1) You did not pass resource property name as \'' + resourceName + '\' with @HateoasResource decorator. \n\r' +
                '2) You did not declare resource type in configuration "configuration.useTypes.resources". \n\r' +
                '\n\rSee more about declare resource types here: https://github.com/lagoshny/ngx-hateoas-client#usetypes-params..');
            return Object.assign(new this.resourceType(), payload);
        }
    }
    static createResourceProjectionRel(relationName, payload) {
        const relationClass = ResourceUtils.RESOURCE_PROJECTION_REL_NAME_TYPE_MAP.get(relationName);
        if (relationClass) {
            return Object.assign(new (relationClass)(), payload);
        }
        else {
            ConsoleLogger.prettyWarn('Not found resource relation type when create relation: \'' + relationName + '\' so used default Resource type, for this can be some reasons: \n\r' +
                'You did not pass relation type property with @ProjectionRel decorator on relation property \'' + relationName + '\'. \n\r' +
                '\n\rSee more how to use @ProjectionRel here https://github.com/lagoshny/ngx-hateoas-client#resource-projection-support.');
            return Object.assign(new this.resourceType(), payload);
        }
    }
    static createEmbeddedResource(key, payload) {
        const resourceClass = ResourceUtils.EMBEDDED_RESOURCE_TYPE_MAP.get(key);
        if (resourceClass) {
            return Object.assign(new (resourceClass)(), payload);
        }
        else {
            ConsoleLogger.prettyWarn('Not found embedded resource type when create resource: \'' + key + '\' so used default EmbeddedResource type, for this can be some reasons:. \n\r' +
                '1) You did not pass embedded resource property name as \'' + key + '\' with @HateoasEmbeddedResource decorator. \n\r' +
                '2) You did not declare embedded resource type in configuration "configuration.useTypes.embeddedResources". \n\r' +
                '\n\r See more about declare resource types here: https://github.com/lagoshny/ngx-hateoas-client#usetypes-params.');
            return Object.assign(new this.embeddedResourceType(), payload);
        }
    }
    static instantiateResourceCollection(payload, isProjection) {
        if (isEmpty(payload)
            || (!isObject(payload['_links']) || isEmpty(payload['_links']))
            || (!isObject(payload['_embedded']) || isEmpty(payload['_embedded']))) {
            return null;
        }
        const result = new this.resourceCollectionType();
        for (const resourceName of Object.keys(payload['_embedded'])) {
            payload['_embedded'][resourceName].forEach((resource) => {
                result.resources.push(this.instantiateResource(resource, isProjection));
            });
        }
        result['_links'] = { ...payload['_links'] };
        return result;
    }
    static instantiatePagedResourceCollection(payload, isProjection) {
        const resourceCollection = this.instantiateResourceCollection(payload, isProjection);
        if (resourceCollection == null) {
            return null;
        }
        let result;
        if (payload['page']) {
            result = new this.pagedResourceCollectionType(resourceCollection, payload);
        }
        else {
            result = new this.pagedResourceCollectionType(resourceCollection);
        }
        return result;
    }
    /**
     * Resolve request body relations.
     * If request body has {@link Resource} value then this value will be replaced by resource self link.
     * If request body has {@link ValuesOption} it will be applied to body values.
     *
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     */
    static resolveValues(requestBody) {
        if (isEmpty(requestBody) || isNil(requestBody.body)
            || (isObject(requestBody.body) && isEmpty(requestBody.body))) {
            StageLogger.stageLog(Stage.RESOLVE_VALUES, { result: 'body is empty return null' });
            return null;
        }
        const body = requestBody.body;
        if (!isObject(body) || isArray(body)) {
            StageLogger.stageLog(Stage.RESOLVE_VALUES, { result: 'body is not object or array return as is' });
            return body;
        }
        const result = {};
        for (const key in body) {
            if (!body.hasOwnProperty(key)) {
                continue;
            }
            if (body[key] == null && Include.NULL_VALUES === requestBody?.valuesOption?.include) {
                result[key] = null;
                continue;
            }
            if (isNil(body[key])) {
                continue;
            }
            if (isArray(body[key])) {
                const array = body[key];
                result[key] = [];
                array.forEach((element) => {
                    if (isResource(element)) {
                        result[key].push(element?._links?.self?.href);
                    }
                    else {
                        result[key].push(this.resolveValues({ body: element, valuesOption: requestBody?.valuesOption }));
                    }
                });
            }
            else if (isResource(body[key])) {
                result[key] = body[key]._links?.self?.href;
            }
            else if (isPlainObject(body[key])) {
                result[key] = this.resolveValues({ body: body[key], valuesOption: requestBody?.valuesOption });
            }
            else {
                result[key] = body[key];
            }
        }
        StageLogger.stageLog(Stage.RESOLVE_VALUES, { result });
        return result;
    }
    /**
     * Assign {@link Resource} or {@link EmbeddedResource} properties to passed entity.
     *
     * @param entity to be converter to resource
     */
    static initResource(entity) {
        if (isResource(entity)) {
            return Object.assign(new this.resourceType(), entity);
        }
        else if (isEmbeddedResource(entity)) {
            return Object.assign(new this.embeddedResourceType(), entity);
        }
        else {
            return entity;
        }
    }
    /**
     * Define resource name based on resource links.
     * It will get link name that href equals to self href resource link.
     *
     * @param payload that can be a resource for which to find the name
     */
    static findResourceName(payload) {
        if (!payload || !payload['_links'] || !payload['_links'].self) {
            return '';
        }
        const resourceLinks = payload['_links'];
        if (isEmpty(resourceLinks) || isEmpty(resourceLinks.self) || isNil(resourceLinks.self.href)) {
            return '';
        }
        return UrlUtils.getResourceNameFromUrl(UrlUtils.removeTemplateParams(resourceLinks.self.href));
    }
    /**
     * Checks is a resource projection or not.
     *
     * @param payload object that can be resource or resource projection
     */
    static isResourceProjection(payload) {
        if (!payload || !payload['_links'] || !payload['_links'].self) {
            return false;
        }
        const selfLink = payload['_links'].self;
        const resourceLinks = payload['_links'];
        for (const key of Object.keys(resourceLinks)) {
            if (key !== 'self' && resourceLinks[key].href.includes(selfLink.href)) {
                return new URL(resourceLinks[key].href).search.includes('projection');
            }
        }
        return false;
    }
    /**
     * Try to get projectionName from resource type and set it to options. If resourceType has not projectionName then return options as is.
     *
     * @param resourceType from get projectionName
     * @param options to set projectionName
     */
    static fillProjectionNameFromResourceType(resourceType, options) {
        if (!resourceType) {
            return;
        }
        const projectionName = resourceType['__projectionName__'];
        if (projectionName) {
            options = options ? options : { params: {} };
            options = {
                ...options,
                params: {
                    ...options.params,
                    projection: projectionName
                }
            };
        }
        return options;
    }
}
ResourceUtils.RESOURCE_NAME_TYPE_MAP = new Map();
ResourceUtils.RESOURCE_NAME_PROJECTION_TYPE_MAP = new Map();
ResourceUtils.RESOURCE_PROJECTION_REL_NAME_TYPE_MAP = new Map();
ResourceUtils.EMBEDDED_RESOURCE_TYPE_MAP = new Map();

/**
 * Contains all needed information about a resource.
 * It generates a string cache key to hold in a cache map from information about a resource.
 */
class CacheKey {
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

/**
 * Base class with common logics to perform HTTP requests.
 */
/* tslint:disable:no-string-literal */
class HttpExecutor {
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
                return of(cachedValue);
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

class CachedResource {
    constructor(value, cachedTime) {
        this.value = value;
        this.cachedTime = cachedTime;
    }
}

class ResourceCacheService {
    constructor() {
        this.cacheMap = new Map();
    }
    /**
     * Get cached resource value.
     *
     * @param key cache key
     * @return cached value or {@code null} when cached value is not exist or expired
     */
    getResource(key) {
        ValidationUtils.validateInputParams({ key });
        const cacheValue = this.cacheMap.get(key.value);
        if (isNil(cacheValue)) {
            StageLogger.stageLog(Stage.CACHE_GET, { cacheKey: key.value, result: null });
            return null;
        }
        const cacheExpiredTime = new Date(cacheValue.cachedTime);
        cacheExpiredTime.setMilliseconds(cacheExpiredTime.getMilliseconds() + LibConfig.config.cache.lifeTime);
        if (cacheExpiredTime.getTime() < new Date().getTime()) {
            this.evictResource(key);
            StageLogger.stageLog(Stage.CACHE_GET, { cacheKey: key.value, message: 'cache was expired', result: null });
            return null;
        }
        StageLogger.stageLog(Stage.CACHE_GET, { cacheKey: key.value, result: cacheValue.value });
        return cacheValue.value;
    }
    /**
     * Add resource value to the cache.
     * Before add new value, previous will be deleted if it was exist.
     *
     * @param key cache key
     * @param value cache value
     */
    putResource(key, value) {
        ValidationUtils.validateInputParams({ key, value });
        this.cacheMap.set(key.value, new CachedResource(value, new Date()));
        StageLogger.stageLog(Stage.CACHE_PUT, { cacheKey: key.value, value });
    }
    /**
     * Delete cached resource value by passed key.
     *
     * @param key cache key
     */
    evictResource(key) {
        ValidationUtils.validateInputParams({ key });
        // Get resource name by url to evict all resource cache with collection/paged collection data
        const resourceName = key.url.replace(`${UrlUtils.getApiUrl()}/`, '').split('/')[0];
        if (!resourceName) {
            return;
        }
        const evictedCache = [];
        for (const cacheKey of this.cacheMap.keys()) {
            if (cacheKey.startsWith(`url=${UrlUtils.getApiUrl()}/${resourceName}`)) {
                evictedCache.push({
                    key: cacheKey
                });
                this.cacheMap.delete(cacheKey);
            }
        }
        if (evictedCache.length > 0) {
            StageLogger.stageLog(Stage.CACHE_EVICT, { cacheKey: key.value, evicted: evictedCache });
        }
    }
}
ResourceCacheService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceCacheService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ResourceCacheService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceCacheService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceCacheService, decorators: [{
            type: Injectable
        }] });

/**
 * Get instance of the ResourceHttpService by Angular DependencyInjector.
 */
function getResourceHttpService() {
    return DependencyInjector.get(ResourceHttpService);
}
/**
 * Service to perform HTTP requests to get {@link Resource} type.
 */
class ResourceHttpService extends HttpExecutor {
    constructor(httpClient, cacheService) {
        super(httpClient, cacheService);
    }
    /**
     * Perform GET request to retrieve resource.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid or returned resource type is not resource
     */
    get(url, options) {
        const httpOptions = UrlUtils.convertToHttpOptions(options);
        return super.getHttp(url, httpOptions, options?.useCache)
            .pipe(map((data) => {
            if (!isResource(data)) {
                if (LibConfig.config.cache.enabled) {
                    this.cacheService.evictResource(CacheKey.of(url, httpOptions));
                }
                const errMsg = `You try to get wrong resource type: expected Resource type, actual ${getResourceType(data)} type.`;
                StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {
                    options,
                    error: errMsg
                });
                throw new Error(errMsg);
            }
            return ResourceUtils.instantiateResource(data, httpOptions?.params?.has('projection'));
        }), catchError(error => throwError(error)));
    }
    /**
     * Perform POST request.
     *
     * @param url to perform request
     * @param body request body
     * @param options request options
     * @throws error when required params are not valid
     */
    post(url, body, options) {
        return super.postHttp(url, body, UrlUtils.convertToHttpOptions(options))
            .pipe(map((data) => {
            if (isResource(data)) {
                return ResourceUtils.instantiateResource(data);
            }
            return data;
        }), catchError(error => throwError(error)));
    }
    /**
     * Perform PUT request.
     *
     * @param url to perform request
     * @param body request body
     * @param options request options
     * @throws error when required params are not valid
     */
    put(url, body, options) {
        return super.putHttp(url, body, UrlUtils.convertToHttpOptions(options))
            .pipe(map((data) => {
            if (isResource(data)) {
                return ResourceUtils.instantiateResource(data);
            }
            return data;
        }), catchError(error => throwError(error)));
    }
    /**
     * Perform PATCH request.
     *
     * @param url to perform request
     * @param body request body
     * @param options request options
     * @throws error when required params are not valid
     */
    patch(url, body, options) {
        return super.patchHttp(url, body, UrlUtils.convertToHttpOptions(options))
            .pipe(map((data) => {
            if (isResource(data)) {
                return ResourceUtils.instantiateResource(data);
            }
            return data;
        }), catchError(error => throwError(error)));
    }
    /**
     * Perform DELETE request.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid
     */
    delete(url, options) {
        return super.deleteHttp(url, {
            ...UrlUtils.convertToHttpOptions(options),
            observe: options?.observe ? options?.observe : 'response'
        })
            .pipe(map((data) => {
            if (isResource(data)) {
                return ResourceUtils.instantiateResource(data);
            }
            return data;
        }), catchError(error => throwError(error)));
    }
    /**
     * Perform get resource request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param id resource id
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    getResource(resourceName, id, options) {
        ValidationUtils.validateInputParams({ resourceName, id });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName).concat('/', toString(id));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', id: '${id}'`,
            options
        });
        return this.get(url, options);
    }
    /**
     * Perform POST resource request with url built by the resource name.
     *
     * @param resourceName to be post
     * @param body resource to create
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    postResource(resourceName, body, options) {
        ValidationUtils.validateInputParams({ resourceName, body });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}'`,
            options
        });
        return this.post(url, body, options);
    }
    /**
     * Perform PATCH resource request with url built by the resource name and resource id.
     *
     * @param resourceName to be patched
     * @param id resource id
     * @param body contains data to patch resource properties
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    patchResource(resourceName, id, body, options) {
        ValidationUtils.validateInputParams({ resourceName, id, body });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, toString(id));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', resourceId: '${id}'`,
            options
        });
        return this.patch(url, body, options);
    }
    /**
     * Perform PUT resource request with url built by the resource name and resource id.
     *
     * @param resourceName to be put
     * @param id resource id
     * @param body contains data to replace resource properties
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    putResource(resourceName, id, body, options) {
        ValidationUtils.validateInputParams({ resourceName, id, body });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, toString(id));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', resourceId: '${id}'`,
            options
        });
        return this.put(url, body, options);
    }
    /**
     * Perform DELETE resource request with url built by the resource name and resource id.
     *
     * @param resourceName to be deleted
     * @param id resource id
     * @param options (optional) additional options that will be applied to the request
     * @throws error when required params are not valid
     */
    deleteResource(resourceName, id, options) {
        ValidationUtils.validateInputParams({ resourceName, id });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, toString(id));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', resourceId: '${id}'`,
            options
        });
        return this.delete(url, options);
    }
    /**
     * Perform search single resource request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param searchQuery name of the search method
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    search(resourceName, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceName, searchQuery });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName).concat('/search/' + searchQuery);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', searchQuery: '${searchQuery}'`,
            options
        });
        return this.get(url, options);
    }
}
ResourceHttpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceHttpService, deps: [{ token: i1.HttpClient }, { token: ResourceCacheService }], target: i0.ɵɵFactoryTarget.Injectable });
ResourceHttpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceHttpService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceHttpService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: ResourceCacheService }]; } });

/**
 * Abstract impl identifies resource interface.
 */
class AbstractResource {
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

function getResourceCollectionHttpService() {
    return DependencyInjector.get(ResourceCollectionHttpService);
}
/**
 * Service to perform HTTP requests to get {@link ResourceCollection} type.
 */
class ResourceCollectionHttpService extends HttpExecutor {
    constructor(httpClient, cacheService) {
        super(httpClient, cacheService);
    }
    /**
     * Perform GET request to retrieve collection of the resources.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid or returned resource type is not collection of the resources
     */
    get(url, options) {
        const httpOptions = UrlUtils.convertToHttpOptions(options);
        return super.getHttp(url, httpOptions)
            .pipe(map((data) => {
            if (!isResourceCollection(data)) {
                if (LibConfig.config.cache.enabled) {
                    this.cacheService.evictResource(CacheKey.of(url, httpOptions));
                }
                const errMsg = `You try to get the wrong resource type: expected ResourceCollection type, actual ${getResourceType(data)} type.`;
                StageLogger.stageErrorLog(Stage.INIT_RESOURCE, { error: errMsg, options });
                throw new Error(errMsg);
            }
            return ResourceUtils.instantiateResourceCollection(data, httpOptions?.params?.has('projection'));
        }), catchError(error => throwError(error)));
    }
    /**
     * Perform get resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    getResourceCollection(resourceName, options) {
        ValidationUtils.validateInputParams({ resourceName });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}'`,
            options
        });
        return this.get(url, options);
    }
    /**
     *  Perform search resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param searchQuery name of the search method
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    search(resourceName, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceName, searchQuery });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName).concat('/search/' + searchQuery);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', searchQuery: '${searchQuery}'`,
            options
        });
        return this.get(url, options);
    }
}
ResourceCollectionHttpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceCollectionHttpService, deps: [{ token: i1.HttpClient }, { token: ResourceCacheService }], target: i0.ɵɵFactoryTarget.Injectable });
ResourceCollectionHttpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceCollectionHttpService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: ResourceCollectionHttpService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: ResourceCacheService }]; } });

/**
 * Get instance of the PagedResourceCollectionHttpService by Angular DependencyInjector.
 */
function getPagedResourceCollectionHttpService() {
    return DependencyInjector.get(PagedResourceCollectionHttpService);
}
/**
 * Service to perform HTTP requests to get {@link PagedResourceCollection} type.
 */
class PagedResourceCollectionHttpService extends HttpExecutor {
    constructor(httpClient, cacheService) {
        super(httpClient, cacheService);
    }
    /**
     * Perform GET request to retrieve paged collection of the resources.
     *
     * @param url to perform request
     * @param options request options
     * @throws error when required params are not valid or returned resource type is not paged collection of the resources
     */
    get(url, options) {
        const httpOptions = UrlUtils.convertToHttpOptions(options);
        return super.getHttp(url, httpOptions, options?.useCache)
            .pipe(map((data) => {
            if (!isPagedResourceCollection(data)) {
                if (LibConfig.config.cache.enabled) {
                    this.cacheService.evictResource(CacheKey.of(url, httpOptions));
                }
                const errMsg = `You try to get wrong resource type: expected PagedResourceCollection type, actual ${getResourceType(data)} type.`;
                StageLogger.stageErrorLog(Stage.INIT_RESOURCE, { error: errMsg, options });
                throw new Error(errMsg);
            }
            return ResourceUtils.instantiatePagedResourceCollection(data, httpOptions?.params?.has('projection'));
        }), catchError(error => throwError(error)));
    }
    /**
     * Perform get paged resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    getResourcePage(resourceName, options) {
        ValidationUtils.validateInputParams({ resourceName });
        const url = UrlUtils.removeTemplateParams(UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName));
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}'`,
            options
        });
        return this.get(url, UrlUtils.fillDefaultPageDataIfNoPresent(options));
    }
    /**
     *  Perform search paged resource collection request with url built by the resource name.
     *
     * @param resourceName used to build root url to the resource
     * @param searchQuery name of the search method
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    search(resourceName, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceName, searchQuery });
        const url = UrlUtils.removeTemplateParams(UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName)).concat('/search/' + searchQuery);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}'`,
            options
        });
        return this.get(url, UrlUtils.fillDefaultPageDataIfNoPresent(options));
    }
}
PagedResourceCollectionHttpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: PagedResourceCollectionHttpService, deps: [{ token: i1.HttpClient }, { token: ResourceCacheService }], target: i0.ɵɵFactoryTarget.Injectable });
PagedResourceCollectionHttpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: PagedResourceCollectionHttpService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: PagedResourceCollectionHttpService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: ResourceCacheService }]; } });

/**
 * Common resource class.
 */
class BaseResource extends AbstractResource {
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

/**
 * Resource class.
 * Should be extended by client model classes that represent entity objects.
 *
 * If you have an embedded entity then consider to use the {@link EmbeddedResource} class.
 */
// tslint:disable:variable-name
class Resource extends BaseResource {
    /**
     * Adding passed entities to the resource collection behind the relation name.
     * Used POST method with 'Content-Type': 'text/uri-list'.
     *
     * This method DOES NOT REPLACE existing resources in the collection instead it adds new ones.
     * To replace collection resource with passed entities use {@link bindRelation} method.
     *
     * @param relationName used to get the specific resource relation link to the resource collection
     * @param entities one or more entities that should be added to the resource collection
     * @throws error when required params are not valid or link not found by relation name
     */
    addCollectionRelation(relationName, entities) {
        StageLogger.resourceBeginLog(this, 'ADD_COLLECTION_RELATION', { relationName, resourceLinks: this._links, entities });
        ValidationUtils.validateInputParams({ relationName, entities });
        const relationLink = this.getRelationLink(relationName);
        const body = entities
            .map(entity => {
            return ResourceUtils.initResource(entity).getSelfLinkHref();
        })
            .join('\n');
        return getResourceHttpService().post(UrlUtils.generateLinkUrl(relationLink), body, {
            observe: 'response',
            headers: new HttpHeaders({ 'Content-Type': 'text/uri-list' })
        }).pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'ADD_COLLECTION_RELATION', { result: `collection relation ${relationName} was updated successfully` });
        }));
    }
    /**
     * Bounding the passed entity or collection of entities to this resource by the relation name.
     * Used PUT method with 'Content-Type': 'text/uri-list'.
     *
     * This method also REPLACED existing resources in the collection by passed entities.
     * To add entities to collection resource use {@link addCollectionRelation} method.
     *
     * @param relationName with which will be associated passed entity to this resource
     * @param entities one or more entities that should be bind to this resource
     * @throws error when required params are not valid or link not found by relation name
     */
    bindRelation(relationName, entities) {
        StageLogger.resourceBeginLog(this, 'BIND_RELATION', { relationName, resourceLinks: this._links, entities });
        ValidationUtils.validateInputParams({ relationName, entities });
        const relationLink = this.getRelationLink(relationName);
        let body;
        if (isArray(entities)) {
            body = entities
                .map(entity => {
                return ResourceUtils.initResource(entity).getSelfLinkHref();
            })
                .join('\n');
        }
        else {
            body = ResourceUtils.initResource(entities).getSelfLinkHref();
        }
        return getResourceHttpService().put(UrlUtils.generateLinkUrl(relationLink), body, {
            observe: 'response',
            headers: new HttpHeaders({ 'Content-Type': 'text/uri-list' })
        }).pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'BIND_RELATION', { result: `relation ${relationName} was bound successfully` });
        }));
    }
    /**
     * Unbinding single resource relation behind resource name.
     * Used DELETE method to relation resource link URL.
     *
     * This method DOES NOT WORK WITH COLLECTION RESOURCE relations.
     * To clear collection resource relation use {@link unbindCollectionRelation} method.
     * To delete one resource from resource collection use {@link deleteRelation} method.
     *
     * @param relationName resource relation name to unbind
     */
    unbindRelation(relationName) {
        StageLogger.resourceBeginLog(this, 'UNBIND_RELATION', { relationName, resourceLinks: this._links });
        ValidationUtils.validateInputParams({ relationName });
        const relationLink = this.getRelationLink(relationName);
        return getResourceHttpService().delete(UrlUtils.generateLinkUrl(relationLink), {
            observe: 'response',
        }).pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'UNBIND_RELATION', { result: `relation ${relationName} was unbound successfully` });
        }));
    }
    /**
     * Unbind all resources from collection by the relation name.
     * Used PUT method with 'Content-Type': 'text/uri-list' and EMPTY body to clear relations.
     *
     * To delete one resource from collection use {@link deleteRelation} method.
     * To delete single resource relations use {@link unbindRelation} or {@link deleteRelation} methods.
     *
     * @param relationName used to get relation link to unbind
     * @throws error when required params are not valid or link not found by relation name
     */
    unbindCollectionRelation(relationName) {
        StageLogger.resourceBeginLog(this, 'UNBIND_COLLECTION_RELATION', { relationName, resourceLinks: this._links });
        ValidationUtils.validateInputParams({ relationName });
        const relationLink = this.getRelationLink(relationName);
        return getResourceHttpService().put(UrlUtils.generateLinkUrl(relationLink), '', {
            observe: 'response',
            headers: new HttpHeaders({ 'Content-Type': 'text/uri-list' })
        }).pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'UNBIND_COLLECTION_RELATION', { result: `relation ${relationName} was unbound successfully` });
        }));
    }
    /**
     * Deleting resource relation.
     * For collection, means that only passed entity will be unbound from the collection.
     * For single resource, deleting relation the same as @{link unbindRelation} method.
     *
     * To delete all resource relations from collection use {@link unbindCollectionRelation} method.
     *
     * @param relationName used to get relation link to unbind
     * @param entity that should be unbind from this relation
     * @throws error when required params are not valid or link not found by relation name
     */
    deleteRelation(relationName, entity) {
        StageLogger.resourceBeginLog(this, 'DELETE_RELATION', { relationName, resourceLinks: this._links, entity });
        ValidationUtils.validateInputParams({ relationName, entity });
        const relationLink = this.getRelationLink(relationName);
        const resource = ResourceUtils.initResource(entity);
        const resourceId = last(split(UrlUtils.generateLinkUrl(resource._links.self), '/'));
        if (isNil(resourceId) || resourceId === '') {
            StageLogger.stageErrorLog(Stage.PREPARE_URL, {
                step: 'ResolveResourceId',
                error: 'Passed resource self link should has id',
                selfLink: UrlUtils.generateLinkUrl(resource._links.self)
            });
            throw Error('Passed resource self link should has id');
        }
        StageLogger.stageLog(Stage.PREPARE_URL, {
            step: 'ResolveResourceId',
            result: resourceId
        });
        return getResourceHttpService().delete(UrlUtils.generateLinkUrl(relationLink) + '/' + resourceId, {
            observe: 'response'
        }).pipe(tap(() => {
            StageLogger.resourceEndLog(this, 'DELETE_RELATION', { result: `relation ${relationName} was deleted successfully` });
        }));
    }
    getSelfLinkHref() {
        return this._links.self.href;
    }
}

/**
 * Collection of resources without pagination.
 *
 * If you want to have a pagination {@see PagedResourceCollection}.
 */
class ResourceCollection extends AbstractResource {
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
class EmbeddedResource extends BaseResource {
}

/**
 * Collection of resources with pagination.
 */
class PagedResourceCollection extends ResourceCollection {
    /**
     * Create a new paged resource collection from resource collection with the page data.
     *
     * @param resourceCollection collection that will be paged
     * @param pageData contains data about characteristics of the page.
     */
    constructor(resourceCollection, pageData) {
        super(resourceCollection);
        this.totalElements = result(pageData, 'page.totalElements', 0);
        this.totalPages = result(pageData, 'page.totalPages', 1);
        this.pageSize = result(pageData, 'page.size', 20);
        this.pageNumber = result(pageData, 'page.number', 0);
        this.selfLink = result(pageData, '_links.self', null);
        this.nextLink = result(pageData, '_links.next', null);
        this.prevLink = result(pageData, '_links.prev', null);
        this.firstLink = result(pageData, '_links.first', null);
        this.lastLink = result(pageData, '_links.last', null);
    }
    hasFirst() {
        return !!this.firstLink && !!this.firstLink.href;
    }
    hasLast() {
        return !!this.lastLink && !!this.lastLink.href;
    }
    hasNext() {
        return !!this.nextLink && !!this.nextLink.href;
    }
    hasPrev() {
        return !!this.prevLink && !!this.prevLink.href;
    }
    first(options) {
        StageLogger.resourceBeginLog(this.resources[0], 'GET_FIRST_PAGE');
        if (!this.hasFirst()) {
            const errMsg = 'Page has not first url';
            StageLogger.stageErrorLog(Stage.PREPARE_URL, { error: errMsg });
            return throwError(new Error(errMsg));
        }
        return doRequest(this.firstLink.href, options?.useCache).pipe(tap(() => {
            StageLogger.resourceEndLog(this.resources[0], 'GET_FIRST_PAGE', { result: 'get first page was performed successful' });
        }));
    }
    last(options) {
        StageLogger.resourceBeginLog(this.resources[0], 'GET_LAST_PAGE');
        if (!this.hasLast()) {
            const errMsg = 'Page has not last url';
            StageLogger.stageErrorLog(Stage.PREPARE_URL, { error: errMsg });
            return throwError(new Error(errMsg));
        }
        return doRequest(this.lastLink.href, options?.useCache).pipe(tap(() => {
            StageLogger.resourceEndLog(this.resources[0], 'GET_LAST_PAGE', { result: 'get last page was performed successful' });
        }));
    }
    next(options) {
        StageLogger.resourceBeginLog(this.resources[0], 'GET_NEXT_PAGE');
        if (!this.hasNext()) {
            const errMsg = 'Page has not next url';
            StageLogger.stageErrorLog(Stage.PREPARE_URL, { error: errMsg });
            return throwError(new Error(errMsg));
        }
        return doRequest(this.nextLink.href, options?.useCache).pipe(tap(() => {
            StageLogger.resourceEndLog(this.resources[0], 'GET_NEXT_PAGE', { result: 'get next page was performed successful' });
        }));
    }
    prev(options) {
        StageLogger.resourceBeginLog(this.resources[0], 'GET_PREV_PAGE');
        if (!this.hasPrev()) {
            const errMsg = 'Page has not prev url';
            StageLogger.stageErrorLog(Stage.PREPARE_URL, { error: errMsg });
            return throwError(new Error(errMsg));
        }
        return doRequest(this.prevLink.href, options?.useCache).pipe(tap(() => {
            StageLogger.resourceEndLog(this.resources[0], 'GET_PREV_PAGE', { result: 'get prev page was performed successful' });
        }));
    }
    page(pageNumber, options) {
        return this.customPage({ pageParams: { page: pageNumber } }, options);
    }
    size(size, options) {
        return this.customPage({ pageParams: { page: 0, size } }, options);
    }
    sortElements(sortParam, options) {
        return this.customPage({ sort: sortParam }, options);
    }
    /**
     * Perform query with custom page data.
     * That allows you change page size, current page or sort options.
     *
     * @param params contains data about new characteristics of the page.
     * @param options (optional) additional options that will be applied to the request
     * @throws error when required params are not valid or when passed inconsistent data
     */
    customPage(params, options) {
        StageLogger.resourceBeginLog(this.resources[0], 'CustomPage', { pageParam: params.pageParams });
        if (!params.pageParams || isEmpty(params.pageParams)) {
            params.pageParams = {};
            params.pageParams.page = this.pageNumber;
            params.pageParams.size = this.pageSize;
        }
        if (!isNumber(params.pageParams.page) || params.pageParams.page < 0) {
            params.pageParams.page = this.pageNumber;
            StageLogger.stageLog(Stage.PREPARE_PARAMS, {
                message: 'Page number is not passed will be used current value',
                currentPageNumber: this.pageNumber
            });
        }
        if (!isNumber(params.pageParams.size) || params.pageParams.size < 0) {
            params.pageParams.size = this.pageSize;
            StageLogger.stageLog(Stage.PREPARE_PARAMS, {
                message: 'Page size is not passed will be used current value',
                currentPageSize: this.pageSize
            });
        }
        const maxPageNumber = (this.totalElements / params.pageParams.size);
        if (params.pageParams.page > maxPageNumber) {
            const errMsg = `Error page number. Max page number is ${parseInt(maxPageNumber + '', 10)}`;
            StageLogger.stageErrorLog(Stage.PREPARE_PARAMS, { error: errMsg });
            return throwError(errMsg);
        }
        const requestUrl = new URL(this.selfLink.href);
        requestUrl.searchParams.delete('page');
        requestUrl.searchParams.delete('size');
        requestUrl.searchParams.delete('sort');
        return doRequest(requestUrl.href, options?.useCache, params).pipe(tap(() => {
            StageLogger.resourceEndLog(this.resources[0], 'CustomPage', { result: 'custom page was performed successful' });
        }));
    }
}
function doRequest(url, useCache = true, params) {
    ValidationUtils.validateInputParams({ url });
    return getPagedResourceCollectionHttpService()
        .get(url, { ...params, useCache });
}

/**
 * This service for configuration library.
 *
 * You should inject this service in your main AppModule and pass
 * configuration using {@link #configure()} method.
 */
class NgxHateoasClientConfigurationService {
    constructor(injector) {
        this.injector = injector;
        DependencyInjector.injector = injector;
        // Setting resource types to prevent circular dependencies
        ResourceUtils.useResourceType(Resource);
        ResourceUtils.useResourceCollectionType(ResourceCollection);
        ResourceUtils.usePagedResourceCollectionType(PagedResourceCollection);
        ResourceUtils.useEmbeddedResourceType(EmbeddedResource);
    }
    /**
     * Configure library with client params.
     *
     * @param config suitable client properties needed to properly library work
     */
    configure(config) {
        ValidationUtils.validateInputParams({ config, baseApi: config?.http?.rootUrl });
        LibConfig.setConfig(config);
        ConsoleLogger.prettyInfo('HateoasClient was configured with options', {
            rootUrl: config.http.rootUrl
        });
    }
}
NgxHateoasClientConfigurationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientConfigurationService, deps: [{ token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
NgxHateoasClientConfigurationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientConfigurationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientConfigurationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.Injector }]; } });

/**
 * Service to perform HTTP requests to get any type of the {@link Resource}, {@link PagedResourceCollection}, {@link ResourceCollection}.
 */
class CommonResourceHttpService extends HttpExecutor {
    constructor(httpClient, cacheService) {
        super(httpClient, cacheService);
    }
    /**
     * Perform custom HTTP request.
     *
     * Return type depends on result data it can be {@link Resource}, {@link ResourceCollection},
     * {@link PagedResourceCollection} or any data.
     *
     * @param resourceName used to build root url to the resource
     * @param method HTTP method that will be perform {@link HttpMethod}
     * @param query url path that applied to the result url at the end
     * @param body (optional) request body
     * @param options (optional) options that applied to the request
     * @throws error when required params are not valid
     */
    customQuery(resourceName, method, query, body, options) {
        ValidationUtils.validateInputParams({ resourceName, method, query });
        const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, query);
        StageLogger.stageLog(Stage.PREPARE_URL, {
            result: url,
            urlParts: `baseUrl: '${UrlUtils.getApiUrl()}', resource: '${resourceName}', query: '${query}'`,
            options
        });
        const httpOptions = UrlUtils.convertToHttpOptions(options);
        let result;
        switch (method) {
            case HttpMethod.GET:
                result = super.getHttp(url, httpOptions, false);
                break;
            case HttpMethod.POST:
                result = super.postHttp(url, body, httpOptions);
                break;
            case HttpMethod.PUT:
                result = super.putHttp(url, body, httpOptions);
                break;
            case HttpMethod.PATCH:
                result = super.patchHttp(url, body, httpOptions);
                break;
            default:
                const errMsg = `allowed ony GET/POST/PUT/PATCH http methods you pass ${method}`;
                StageLogger.stageErrorLog(Stage.HTTP_REQUEST, { error: errMsg, options });
                return throwError(new Error(errMsg));
        }
        return result.pipe(map(data => {
            const isProjection = httpOptions?.params?.has('projection');
            if (isPagedResourceCollection(data)) {
                return ResourceUtils.instantiatePagedResourceCollection(data, isProjection);
            }
            else if (isResourceCollection(data)) {
                return ResourceUtils.instantiateResourceCollection(data, isProjection);
            }
            else if (isResource(data)) {
                return ResourceUtils.instantiateResource(data, isProjection);
            }
            else {
                return data;
            }
        }));
    }
}
CommonResourceHttpService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: CommonResourceHttpService, deps: [{ token: i1.HttpClient }, { token: ResourceCacheService }], target: i0.ɵɵFactoryTarget.Injectable });
CommonResourceHttpService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: CommonResourceHttpService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: CommonResourceHttpService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: ResourceCacheService }]; } });

/**
 * Service to operate with {@link Resource}.
 *
 * Can be injected as standalone service to work with {@link Resource}.
 */
/* tslint:disable:no-string-literal */
class HateoasResourceService {
    constructor(commonHttpService, resourceHttpService, resourceCollectionHttpService, pagedResourceCollectionHttpService) {
        this.commonHttpService = commonHttpService;
        this.resourceHttpService = resourceHttpService;
        this.resourceCollectionHttpService = resourceCollectionHttpService;
        this.pagedResourceCollectionHttpService = pagedResourceCollectionHttpService;
    }
    /**
     * Get resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    getResource(resourceType, id, options) {
        ValidationUtils.validateInputParams({ resourceType, id });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_RESOURCE', { id, options });
        return this.resourceHttpService.getResource(resourceName, id, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService GET_RESOURCE', { result: `get resource '${resourceName}' was successful` });
        }));
    }
    /**
     * Get collection of the resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    getCollection(resourceType, options) {
        ValidationUtils.validateInputParams({ resourceType });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_COLLECTION', { options });
        return this.resourceCollectionHttpService.getResourceCollection(resourceName, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService GET_COLLECTION', { result: `get all resources by '${resourceName}' was successful` });
        }));
    }
    /**
     * Get paged collection of the resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    getPage(resourceType, options) {
        ValidationUtils.validateInputParams({ resourceType });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_PAGE', { options });
        return this.pagedResourceCollectionHttpService.getResourcePage(resourceName, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService GET_PAGE', { result: `get all page resources by '${resourceName}' was successful` });
        }));
    }
    /**
     * Create resource.
     *
     * @param resourceType resource for which will perform request
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    createResource(resourceType, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, requestBody });
        const resourceName = resourceType['__resourceName__'];
        StageLogger.resourceBeginLog(resourceName, 'ResourceService CREATE_RESOURCE', { requestBody, options });
        const body = ResourceUtils.resolveValues(requestBody);
        return this.resourceHttpService.postResource(resourceName, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService CREATE_RESOURCE', { result: `resource '${resourceName}' was created successful` });
        }));
    }
    /**
     * Updating all resource properties at the time to passed body properties. If some properties are not passed then will be used null value.
     * If you need update some part resource properties, use {@link HateoasResourceService#patchResource} method.
     *
     * @param entity to update
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    updateResource(entity, requestBody, options) {
        ValidationUtils.validateInputParams({ entity });
        StageLogger.resourceBeginLog(entity, 'ResourceService UPDATE_RESOURCE', { body: requestBody ? requestBody : entity, options });
        const resource = ResourceUtils.initResource(entity);
        const body = ResourceUtils.resolveValues(requestBody ? requestBody : { body: entity });
        return this.resourceHttpService.put(resource.getSelfLinkHref(), body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(entity, 'ResourceService UPDATE_RESOURCE', { result: `resource '${resource['__resourceName__']}' was updated successful` });
        }));
    }
    /**
     * Update resource by id.
     * Updating all resource properties at the time to passed body properties. If some properties are not passed then will be used null value.
     * If you need update some part resource properties, use {@link HateoasResourceService#patchResource} method.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    updateResourceById(resourceType, id, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, id, requestBody });
        const resourceName = resourceType['__resourceName__'];
        StageLogger.resourceBeginLog(resourceName, 'ResourceService UPDATE_RESOURCE_BY_ID', { id, body: requestBody, options });
        const body = ResourceUtils.resolveValues(requestBody);
        return this.resourceHttpService.putResource(resourceName, id, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService UPDATE_RESOURCE_BY_ID', { result: `resource '${resourceName}' with id ${id} was updated successful` });
        }));
    }
    /**
     * Patch resource.
     * Allows fine-grained update resource properties, it means that only passed properties in body will be changed,
     * other properties stay as is.
     *
     * @param entity to patch
     * @param requestBody (optional) contains the body that will be patched resource and optional body values option {@link ValuesOption}
     *        if not passed then entity will be passed as body directly
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    patchResource(entity, requestBody, options) {
        ValidationUtils.validateInputParams({ entity });
        StageLogger.resourceBeginLog(entity, 'ResourceService PATCH_RESOURCE', { body: requestBody ? requestBody : entity, options });
        const resource = ResourceUtils.initResource(entity);
        const body = ResourceUtils.resolveValues(requestBody ? requestBody : { body: entity });
        return this.resourceHttpService.patch(resource.getSelfLinkHref(), body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(entity, 'ResourceService PATCH_RESOURCE', { result: `resource '${entity['__resourceName__']}' was patched successful` });
        }));
    }
    /**
     * Patch resource by id.
     * Allows fine-grained update resource properties, it means that only passed properties in body will be changed,
     * other properties stay as is.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
     * @param options (optional) options that should be applied to the request {@link RequestOption}
     * @throws error when required params are not valid
     */
    patchResourceById(resourceType, id, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, id, requestBody });
        const resourceName = resourceType['__resourceName__'];
        StageLogger.resourceBeginLog(resourceName, 'ResourceService PATCH_RESOURCE_BY_ID', { id, body: requestBody, options });
        const body = ResourceUtils.resolveValues(requestBody);
        return this.resourceHttpService.patchResource(resourceName, id, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService PATCH_RESOURCE_BY_ID', { result: `resource '${resourceName}' with id ${id} was patched successful` });
        }));
    }
    /**
     * Delete resource.
     *
     * @param entity to delete
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    deleteResource(entity, options) {
        ValidationUtils.validateInputParams({ entity });
        StageLogger.resourceBeginLog(entity, 'ResourceService DELETE_RESOURCE', { options });
        const resource = ResourceUtils.initResource(entity);
        return this.resourceHttpService.delete(resource.getSelfLinkHref(), options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(entity, 'ResourceService DELETE_RESOURCE', { result: `resource '${resource['__resourceName__']}' was deleted successful` });
        }));
    }
    /**
     * Delete resource by id.
     *
     * @param resourceType resource for which will perform request
     * @param id resource id
     * @param options (optional) options that should be applied to the request
     * @throws error when required params are not valid
     */
    deleteResourceById(resourceType, id, options) {
        ValidationUtils.validateInputParams({ resourceType, id });
        const resourceName = resourceType['__resourceName__'];
        StageLogger.resourceBeginLog(resourceName, 'ResourceService DELETE_RESOURCE_BY_ID', { id, options });
        return this.resourceHttpService.deleteResource(resourceName, id, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService DELETE_RESOURCE_BY_ID', { result: `resource '${resourceName}' with id ${id} was deleted successful` });
        }));
    }
    /**
     * {@see ResourceCollectionHttpService#search}
     */
    searchCollection(resourceType, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceType, searchQuery });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_COLLECTION', { query: searchQuery, options });
        return this.resourceCollectionHttpService.search(resourceName, searchQuery, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_COLLECTION', { result: `search collection by '${resourceName}' was performed successful` });
        }));
    }
    /**
     * {@see PagedResourceCollection#search}
     */
    searchPage(resourceType, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceType, searchQuery });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_PAGE', { query: searchQuery, options });
        return this.pagedResourceCollectionHttpService.search(resourceName, searchQuery, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_PAGE', { result: `search page by '${resourceName}' was performed successful` });
        }));
    }
    /**
     * {@see ResourceHttpService#search}
     */
    searchResource(resourceType, searchQuery, options) {
        ValidationUtils.validateInputParams({ resourceType, searchQuery });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_SINGLE', { query: searchQuery, options });
        return this.resourceHttpService.search(resourceName, searchQuery, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_SINGLE', { result: `search single by '${resourceName}' was performed successful` });
        }));
    }
    /**
     * {@see CommonResourceHttpService#customQuery}
     */
    customQuery(resourceType, method, query, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, method, query });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService CUSTOM_QUERY', {
            method: HttpMethod,
            query,
            requestBody,
            options
        });
        const body = ResourceUtils.resolveValues(requestBody);
        return this.commonHttpService.customQuery(resourceName, method, query, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService CUSTOM_QUERY', { result: `custom query by '${resourceName}' was performed successful` });
        }));
    }
    /**
     * Differences between {@link HateoasResourceService#customQuery} and this method
     * that this one puts 'search' path to the result url automatically.
     *
     * {@see CommonResourceHttpService#customQuery}
     */
    customSearchQuery(resourceType, method, searchQuery, requestBody, options) {
        ValidationUtils.validateInputParams({ resourceType, method, searchQuery });
        const resourceName = resourceType['__resourceName__'];
        options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
        StageLogger.resourceBeginLog(resourceName, 'ResourceService CUSTOM_SEARCH_QUERY', {
            method: HttpMethod,
            searchQuery,
            requestBody,
            options
        });
        const body = ResourceUtils.resolveValues(requestBody);
        const query = `/search${searchQuery.startsWith('/') ? searchQuery : '/' + searchQuery}`;
        return this.commonHttpService.customQuery(resourceName, method, query, body, options)
            .pipe(tap(() => {
            StageLogger.resourceEndLog(resourceName, 'ResourceService CUSTOM_SEARCH_QUERY', { result: `custom search query by '${resourceName}' was performed successful` });
        }));
    }
}
HateoasResourceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: HateoasResourceService, deps: [{ token: CommonResourceHttpService }, { token: ResourceHttpService }, { token: ResourceCollectionHttpService }, { token: PagedResourceCollectionHttpService }], target: i0.ɵɵFactoryTarget.Injectable });
HateoasResourceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: HateoasResourceService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: HateoasResourceService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CommonResourceHttpService }, { type: ResourceHttpService }, { type: ResourceCollectionHttpService }, { type: PagedResourceCollectionHttpService }]; } });

/**
 * Main resource operation class.
 * Extend this class to create resource service.
 */
class HateoasResourceOperation {
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

/* tslint:disable:no-string-literal */
/**
 * Decorator used to classes that extend {@link Resource} class to register 'resourceName' and 'resourceType'
 * information about this resource.
 *
 * @param resourceName resource name which will be used to build a resource URL.
 */
function HateoasResource(resourceName) {
    return (constructor) => {
        if (isNull(resourceName) || isUndefined(resourceName) || !resourceName) {
            throw new Error(`Init resource '${constructor.name}' error. @HateoasResource decorator param resourceName can not be null/undefined/empty, please pass a valid resourceName.`);
        }
        if (!isInstanceOfParent(constructor, Resource)) {
            throw new Error(`Init resource '${constructor.name}' error. @HateoasResource decorator applied only to 'Resource' type, you used it with ${Object.getPrototypeOf(constructor)} type.`);
        }
        constructor['__resourceName__'] = resourceName;
        ResourceUtils.RESOURCE_NAME_TYPE_MAP.set(resourceName.toLowerCase(), constructor);
        return constructor;
    };
}
/**
 * Decorator used to classes that extend {@link EmbeddedResource} class to register 'relationNames' and 'resourceType'
 * information about this resource.
 *
 * @param relationNames names of the properties that using to hold this embedded resource in resource objects.
 */
function HateoasEmbeddedResource(relationNames) {
    return (constructor) => {
        if (isNull(relationNames)
            || isUndefined(relationNames)
            || (isArray(relationNames) && isEmpty(relationNames))) {
            throw new Error(`Init resource '${constructor.name}' error. @HateoasEmbeddedResource decorator param relationNames can not be null/undefined/empty, please pass a valid relationNames.`);
        }
        if (!isInstanceOfParent(constructor, EmbeddedResource)) {
            throw new Error(`Init resource '${constructor.name}' error. @HateoasEmbeddedResource decorator applied only to 'EmbeddedResource' type, you used it with ${Object.getPrototypeOf(constructor)} type.`);
        }
        relationNames.forEach(relationName => {
            ResourceUtils.EMBEDDED_RESOURCE_TYPE_MAP.set(relationName, constructor);
        });
    };
}
/**
 * Decorator used to create a projection representation of {@link Resource} heirs.
 *
 * @param resourceType type of resource that using for projection.
 * @param projectionName name of projection, will be used as projection request param.
 */
function HateoasProjection(resourceType, projectionName) {
    return (constructor) => {
        if (isNull(resourceType) || isUndefined(resourceType)) {
            throw new Error(`Init resource projection '${constructor.name}' error. @HateoasProjection decorator param resourceType can not be null/undefined, please pass a valid resourceType.`);
        }
        if (isNull(projectionName) || isUndefined(projectionName) || !projectionName) {
            throw new Error(`Init resource projection '${constructor.name}' error. @HateoasProjection decorator param projectionName can not be null/undefined/empty, please pass a valid projectionName.`);
        }
        if (!isInstanceOfParent(constructor, Resource)) {
            throw new Error(`Init resource projection '${constructor.name}' error. @HateoasProjection decorator applied only to 'Resource' type, you used it with ${Object.getPrototypeOf(constructor)} type.`);
        }
        constructor['__resourceName__'] = resourceType['__resourceName__'];
        constructor['__projectionName__'] = projectionName;
        ResourceUtils.RESOURCE_NAME_PROJECTION_TYPE_MAP.set(resourceType['__resourceName__'].toLowerCase(), constructor);
        return constructor;
    };
}
/**
 * Decorator used to mark projection class properties that are resources and specifying class type used to create this relation.
 * This decorator used with class marked as {@link HateoasProjection}.
 *
 * @param relationType resource relation type that will be used to create resource with this type when parsed server response.
 */
function ProjectionRel(relationType) {
    return (target, propertyKey) => {
        if (isNull(relationType) || isUndefined(relationType)) {
            throw new Error(`Init resource projection '${target.constructor.name}' relation type error. @ProjectionRel decorator param relationType can not be null/undefined, please pass a valid relationType.`);
        }
        ResourceUtils.RESOURCE_PROJECTION_REL_NAME_TYPE_MAP.set(propertyKey, relationType);
    };
}
function isInstanceOfParent(constructor, parentClass) {
    if (Object.getPrototypeOf(constructor).name === '') {
        return false;
    }
    if (Object.getPrototypeOf(constructor) === parentClass) {
        return true;
    }
    return isInstanceOfParent(Object.getPrototypeOf(constructor), parentClass);
}

class NgxHateoasClientModule {
    constructor(config) {
    }
    static forRoot() {
        return {
            ngModule: NgxHateoasClientModule,
            providers: [
                NgxHateoasClientConfigurationService,
                CommonResourceHttpService,
                ResourceHttpService,
                ResourceCollectionHttpService,
                PagedResourceCollectionHttpService,
                HateoasResourceService,
                ResourceCacheService
            ]
        };
    }
}
NgxHateoasClientModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientModule, deps: [{ token: NgxHateoasClientConfigurationService }], target: i0.ɵɵFactoryTarget.NgModule });
NgxHateoasClientModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientModule });
NgxHateoasClientModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientModule, imports: [[]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxHateoasClientModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: []
                }]
        }], ctorParameters: function () { return [{ type: NgxHateoasClientConfigurationService }]; } });

/*
 * Public API Surface of ngx-hateoas-client
 */

/**
 * Generated bundle index. Do not edit.
 */

export { EmbeddedResource, HateoasEmbeddedResource, HateoasProjection, HateoasResource, HateoasResourceOperation, HateoasResourceService, HttpMethod, Include, NgxHateoasClientConfigurationService, NgxHateoasClientModule, PagedResourceCollection, ProjectionRel, Resource, ResourceCollection };
//# sourceMappingURL=lagoshny-ngx-hateoas-client.mjs.map
