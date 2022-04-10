import { isEmbeddedResource, isResource } from '../model/resource-type';
import { Include } from '../model/declarations';
import { UrlUtils } from './url.utils';
import { Stage } from '../logger/stage.enum';
import { StageLogger } from '../logger/stage-logger';
import { isArray, isEmpty, isNil, isObject, isPlainObject } from 'lodash-es';
import { ConsoleLogger } from '../logger/console-logger';
/* tslint:disable:no-string-literal */
export class ResourceUtils {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UudXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaGF0ZW9hcy1jbGllbnQvc3JjL2xpYi91dGlsL3Jlc291cmNlLnV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUd4RSxPQUFPLEVBQWEsT0FBTyxFQUErQixNQUFNLHVCQUF1QixDQUFDO0FBR3hGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdkMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUM3RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFekQsc0NBQXNDO0FBQ3RDLE1BQU0sT0FBTyxhQUFhO0lBZ0JqQixNQUFNLENBQUMsZUFBZSxDQUFDLElBQXdCO1FBQ3BELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFFTSxNQUFNLENBQUMseUJBQXlCLENBQUMsSUFBK0M7UUFDckYsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztJQUNyQyxDQUFDO0lBRU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDLElBQ0g7UUFDeEMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQztJQUMxQyxDQUFDO0lBRU0sTUFBTSxDQUFDLHVCQUF1QixDQUFDLElBQStCO1FBQ25FLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7SUFDbkMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FB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QUFHLE9BQU87Z0JBQ1YsTUFBTSxFQUFFO29CQUNOLEdBQUcsT0FBTyxDQUFDLE1BQU07b0JBQ2pCLFVBQVUsRUFBRSxjQUFjO2lCQUMzQjthQUNGLENBQUM7U0FDSDtRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7O0FBeFNhLG9DQUFzQixHQUFxQixJQUFJLEdBQUcsRUFBZSxDQUFDO0FBQ2xFLCtDQUFpQyxHQUFxQixJQUFJLEdBQUcsRUFBZSxDQUFDO0FBQzdFLG1EQUFxQyxHQUFxQixJQUFJLEdBQUcsRUFBZSxDQUFDO0FBQ2pGLHdDQUEwQixHQUFxQixJQUFJLEdBQUcsRUFBZSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZVJlc291cmNlIH0gZnJvbSAnLi4vbW9kZWwvcmVzb3VyY2UvYmFzZS1yZXNvdXJjZSc7XHJcbmltcG9ydCB7IGlzRW1iZWRkZWRSZXNvdXJjZSwgaXNSZXNvdXJjZSB9IGZyb20gJy4uL21vZGVsL3Jlc291cmNlLXR5cGUnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9tb2RlbC9yZXNvdXJjZS9yZXNvdXJjZS1jb2xsZWN0aW9uJztcclxuaW1wb3J0IHsgUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9tb2RlbC9yZXNvdXJjZS9wYWdlZC1yZXNvdXJjZS1jb2xsZWN0aW9uJztcclxuaW1wb3J0IHsgR2V0T3B0aW9uLCBJbmNsdWRlLCBMaW5rLCBQYWdlRGF0YSwgUmVxdWVzdEJvZHkgfSBmcm9tICcuLi9tb2RlbC9kZWNsYXJhdGlvbnMnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4uL21vZGVsL3Jlc291cmNlL3Jlc291cmNlJztcclxuaW1wb3J0IHsgRW1iZWRkZWRSZXNvdXJjZSB9IGZyb20gJy4uL21vZGVsL3Jlc291cmNlL2VtYmVkZGVkLXJlc291cmNlJztcclxuaW1wb3J0IHsgVXJsVXRpbHMgfSBmcm9tICcuL3VybC51dGlscyc7XHJcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnLi4vbG9nZ2VyL3N0YWdlLmVudW0nO1xyXG5pbXBvcnQgeyBTdGFnZUxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9zdGFnZS1sb2dnZXInO1xyXG5pbXBvcnQgeyBpc0FycmF5LCBpc0VtcHR5LCBpc05pbCwgaXNPYmplY3QsIGlzUGxhaW5PYmplY3QgfSBmcm9tICdsb2Rhc2gtZXMnO1xyXG5pbXBvcnQgeyBDb25zb2xlTG9nZ2VyIH0gZnJvbSAnLi4vbG9nZ2VyL2NvbnNvbGUtbG9nZ2VyJztcclxuXHJcbi8qIHRzbGludDpkaXNhYmxlOm5vLXN0cmluZy1saXRlcmFsICovXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZVV0aWxzIHtcclxuXHJcbiAgcHVibGljIHN0YXRpYyBSRVNPVVJDRV9OQU1FX1RZUEVfTUFQOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcclxuICBwdWJsaWMgc3RhdGljIFJFU09VUkNFX05BTUVfUFJPSkVDVElPTl9UWVBFX01BUDogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XHJcbiAgcHVibGljIHN0YXRpYyBSRVNPVVJDRV9QUk9KRUNUSU9OX1JFTF9OQU1FX1RZUEVfTUFQOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcclxuICBwdWJsaWMgc3RhdGljIEVNQkVEREVEX1JFU09VUkNFX1RZUEVfTUFQOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgcmVzb3VyY2VUeXBlOiBuZXcoKSA9PiBCYXNlUmVzb3VyY2U7XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHJlc291cmNlQ29sbGVjdGlvblR5cGU6IG5ldygpID0+IFJlc291cmNlQ29sbGVjdGlvbjxCYXNlUmVzb3VyY2U+O1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBwYWdlZFJlc291cmNlQ29sbGVjdGlvblR5cGU6IG5ldyhjb2xsZWN0aW9uOiBSZXNvdXJjZUNvbGxlY3Rpb248QmFzZVJlc291cmNlPiwgcGFnZURhdGE/OiBQYWdlRGF0YSlcclxuICAgID0+IFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uPEJhc2VSZXNvdXJjZT47XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIGVtYmVkZGVkUmVzb3VyY2VUeXBlOiBuZXcoKSA9PiBFbWJlZGRlZFJlc291cmNlO1xyXG5cclxuICBwdWJsaWMgc3RhdGljIHVzZVJlc291cmNlVHlwZSh0eXBlOiBuZXcgKCkgPT4gUmVzb3VyY2UpIHtcclxuICAgIHRoaXMucmVzb3VyY2VUeXBlID0gdHlwZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgdXNlUmVzb3VyY2VDb2xsZWN0aW9uVHlwZSh0eXBlOiBuZXcoKSA9PiBSZXNvdXJjZUNvbGxlY3Rpb248QmFzZVJlc291cmNlPikge1xyXG4gICAgdGhpcy5yZXNvdXJjZUNvbGxlY3Rpb25UeXBlID0gdHlwZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgdXNlUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb25UeXBlKHR5cGU6IG5ldyhjb2xsZWN0aW9uOiBSZXNvdXJjZUNvbGxlY3Rpb248QmFzZVJlc291cmNlPilcclxuICAgID0+IFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uPEJhc2VSZXNvdXJjZT4pIHtcclxuICAgIHRoaXMucGFnZWRSZXNvdXJjZUNvbGxlY3Rpb25UeXBlID0gdHlwZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgdXNlRW1iZWRkZWRSZXNvdXJjZVR5cGUodHlwZTogbmV3KCkgPT4gRW1iZWRkZWRSZXNvdXJjZSkge1xyXG4gICAgdGhpcy5lbWJlZGRlZFJlc291cmNlVHlwZSA9IHR5cGU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2U8VCBleHRlbmRzIEJhc2VSZXNvdXJjZT4ocGF5bG9hZDogb2JqZWN0LCBpc1Byb2plY3Rpb24/OiBib29sZWFuKTogVCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBpZiAoaXNFbXB0eShwYXlsb2FkKVxyXG4gICAgICB8fCAoIWlzT2JqZWN0KHBheWxvYWRbJ19saW5rcyddKSB8fCBpc0VtcHR5KHBheWxvYWRbJ19saW5rcyddKSkpIHtcclxuICAgICAgQ29uc29sZUxvZ2dlci53YXJuKCdJbmNvcnJlY3QgcmVzb3VyY2Ugb2JqZWN0ISBSZXR1cm5lZCBcXCdudWxsXFwnIHZhbHVlLCBiZWNhdXNlIGl0IGhhcyBub3QgXFwnX2xpbmtzXFwnIGFycmF5LiBDaGVjayB0aGF0IHNlcnZlciBzZW5kIHJpZ2h0IHJlc291cmNlIG9iamVjdC4nLCB7aW5jb3JyZWN0UmVzb3VyY2U6IHBheWxvYWR9KTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlUmVzb3VyY2UodGhpcy5yZXNvbHZlUGF5bG9hZFByb3BlcnRpZXMocGF5bG9hZCwgaXNQcm9qZWN0aW9uKSwgaXNQcm9qZWN0aW9uKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHJlc29sdmVQYXlsb2FkUHJvcGVydGllczxUIGV4dGVuZHMgQmFzZVJlc291cmNlPihwYXlsb2FkOiBvYmplY3QsIGlzUHJvamVjdGlvbj86IGJvb2xlYW4pOiBvYmplY3Qge1xyXG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocGF5bG9hZCkpIHtcclxuICAgICAgaWYgKGtleSA9PT0gJ2hpYmVybmF0ZUxhenlJbml0aWFsaXplcicpIHtcclxuICAgICAgICBkZWxldGUgcGF5bG9hZFtrZXldO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChrZXkgPT09ICdfbGlua3MnKSB7XHJcbiAgICAgICAgcGF5bG9hZFtrZXldID0gcGF5bG9hZFtrZXldO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHBheWxvYWRba2V5XSA9IHRoaXMucmVzb2x2ZVBheWxvYWRUeXBlKGtleSwgcGF5bG9hZFtrZXldLCBpc1Byb2plY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXlsb2FkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgcmVzb2x2ZVBheWxvYWRUeXBlPFQgZXh0ZW5kcyBCYXNlUmVzb3VyY2U+KGtleTogc3RyaW5nLCBwYXlsb2FkOiBvYmplY3QsIGlzUHJvamVjdGlvbj86IGJvb2xlYW4pOiBvYmplY3Qge1xyXG4gICAgaWYgKGlzTmlsKHBheWxvYWQpKSB7XHJcbiAgICAgIHJldHVybiBwYXlsb2FkO1xyXG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHBheWxvYWQpKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF5bG9hZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHBheWxvYWRbaV0gPSB0aGlzLnJlc29sdmVQYXlsb2FkVHlwZShrZXksIHBheWxvYWRbaV0sIGlzUHJvamVjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoaXNQcm9qZWN0aW9uICYmIGlzUGxhaW5PYmplY3QocGF5bG9hZCkpIHtcclxuICAgICAgLy8gTmVlZCB0byBjaGVjayByZXNvdXJjZSBwcm9qZWN0aW9uIHJlbGF0aW9uIHByb3BzIGJlY2F1c2Ugc29tZSBpbm5lciBwcm9wcyBjYW4gYmUgb2JqZWN0cyB0aGF0IGNhbiBiZSBhbHNvIHJlc291cmNlc1xyXG4gICAgICBwYXlsb2FkID0gdGhpcy5yZXNvbHZlUGF5bG9hZFByb3BlcnRpZXModGhpcy5jcmVhdGVSZXNvdXJjZVByb2plY3Rpb25SZWwoa2V5LCBwYXlsb2FkKSwgaXNQcm9qZWN0aW9uKTtcclxuICAgIH0gZWxzZSBpZiAoaXNFbWJlZGRlZFJlc291cmNlKHBheWxvYWQpIHx8IFJlc291cmNlVXRpbHMuRU1CRURERURfUkVTT1VSQ0VfVFlQRV9NQVAuZ2V0KGtleSkpIHtcclxuICAgICAgLy8gTmVlZCB0byBjaGVjayBlbWJlZGRlZCByZXNvdXJjZSBwcm9wcyBiZWNhdXNlIHNvbWUgaW5uZXIgcHJvcHMgY2FuIGJlIG9iamVjdHMgdGhhdCBjYW4gYmUgYWxzbyByZXNvdXJjZXNcclxuICAgICAgcGF5bG9hZCA9IHRoaXMucmVzb2x2ZVBheWxvYWRQcm9wZXJ0aWVzKHRoaXMuY3JlYXRlRW1iZWRkZWRSZXNvdXJjZShrZXksIHBheWxvYWQpLCBpc1Byb2plY3Rpb24pO1xyXG4gICAgfSBlbHNlIGlmIChpc1Jlc291cmNlKHBheWxvYWQpKSB7XHJcbiAgICAgIC8vIE5lZWQgdG8gY2hlY2sgcmVzb3VyY2UgcHJvcHMgYmVjYXVzZSBzb21lIGlubmVyIHByb3BzIGNhbiBiZSBvYmplY3RzIHRoYXQgY2FuIGJlIGFsc28gcmVzb3VyY2VzXHJcbiAgICAgIHBheWxvYWQgPSB0aGlzLnJlc29sdmVQYXlsb2FkUHJvcGVydGllcyh0aGlzLmNyZWF0ZVJlc291cmNlKHBheWxvYWQpLCBpc1Byb2plY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXlsb2FkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlUmVzb3VyY2U8VCBleHRlbmRzIEJhc2VSZXNvdXJjZT4ocGF5bG9hZDogYW55LCBpc1Byb2plY3Rpb24/OiBib29sZWFuKTogVCB7XHJcbiAgICBjb25zdCByZXNvdXJjZU5hbWUgPSB0aGlzLmZpbmRSZXNvdXJjZU5hbWUocGF5bG9hZCk7XHJcbiAgICBsZXQgcmVzb3VyY2VDbGFzcztcclxuICAgIGlmIChpc1Byb2plY3Rpb24gJiYgIVJlc291cmNlVXRpbHMuUkVTT1VSQ0VfTkFNRV9QUk9KRUNUSU9OX1RZUEVfTUFQLmdldChyZXNvdXJjZU5hbWUpKSB7XHJcbiAgICAgIHJlc291cmNlQ2xhc3MgPSBSZXNvdXJjZVV0aWxzLlJFU09VUkNFX05BTUVfVFlQRV9NQVAuZ2V0KHJlc291cmNlTmFtZSk7XHJcbiAgICAgIENvbnNvbGVMb2dnZXIucHJldHR5V2FybignTm90IGZvdW5kIHByb2plY3Rpb24gcmVzb3VyY2UgdHlwZSB3aGVuIGNyZWF0ZSByZXNvdXJjZSBwcm9qZWN0aW9uOiBcXCcnICsgcmVzb3VyY2VOYW1lICsgJ1xcJyBzbyB1c2VkIHJlc291cmNlIHR5cGU6IFxcJycgKyAocmVzb3VyY2VDbGFzcyA/IHJlc291cmNlQ2xhc3M/Lm5hbWUgOiAnIGRlZmF1bHQgUmVzb3VyY2UnKSArICdcXCcuIFxcblxccicgK1xyXG4gICAgICAgICdJdCBjYW4gYmUgd2hlbiB5b3UgcGFzcyBwcm9qZWN0aW9uIHBhcmFtIGFzIGh0dHAgcmVxdWVzdCBkaXJlY3RseSBpbnN0ZWFkIHVzZSBwcm9qZWN0aW9uIHR5cGUgd2l0aCBASGF0ZW9hc1Byb2plY3Rpb24uXFxuXFxyJyArXHJcbiAgICAgICAgJ1xcblxcclNlZSBtb3JlIGhvdyB0byB1c2UgQEhhdGVvYXNQcm9qZWN0aW9uIGhlcmUgaHR0cHM6Ly9naXRodWIuY29tL2xhZ29zaG55L25neC1oYXRlb2FzLWNsaWVudCNyZXNvdXJjZS1wcm9qZWN0aW9uLXN1cHBvcnQuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNvdXJjZUNsYXNzID0gaXNQcm9qZWN0aW9uXHJcbiAgICAgICAgPyBSZXNvdXJjZVV0aWxzLlJFU09VUkNFX05BTUVfUFJPSkVDVElPTl9UWVBFX01BUC5nZXQocmVzb3VyY2VOYW1lKVxyXG4gICAgICAgIDogUmVzb3VyY2VVdGlscy5SRVNPVVJDRV9OQU1FX1RZUEVfTUFQLmdldChyZXNvdXJjZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXNvdXJjZUNsYXNzKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyAocmVzb3VyY2VDbGFzcykoKSBhcyBULCBwYXlsb2FkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIENvbnNvbGVMb2dnZXIucHJldHR5V2FybignTm90IGZvdW5kIHJlc291cmNlIHR5cGUgd2hlbiBjcmVhdGUgcmVzb3VyY2U6IFxcJycgKyByZXNvdXJjZU5hbWUgKyAnXFwnIHNvIHVzZWQgZGVmYXVsdCBSZXNvdXJjZSB0eXBlLCBmb3IgdGhpcyBjYW4gYmUgc29tZSByZWFzb25zOiBcXG5cXHInICtcclxuICAgICAgICAnMSkgWW91IGRpZCBub3QgcGFzcyByZXNvdXJjZSBwcm9wZXJ0eSBuYW1lIGFzIFxcJycgKyByZXNvdXJjZU5hbWUgKyAnXFwnIHdpdGggQEhhdGVvYXNSZXNvdXJjZSBkZWNvcmF0b3IuIFxcblxccicgK1xyXG4gICAgICAgICcyKSBZb3UgZGlkIG5vdCBkZWNsYXJlIHJlc291cmNlIHR5cGUgaW4gY29uZmlndXJhdGlvbiBcImNvbmZpZ3VyYXRpb24udXNlVHlwZXMucmVzb3VyY2VzXCIuIFxcblxccicgK1xyXG4gICAgICAgICdcXG5cXHJTZWUgbW9yZSBhYm91dCBkZWNsYXJlIHJlc291cmNlIHR5cGVzIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9sYWdvc2hueS9uZ3gtaGF0ZW9hcy1jbGllbnQjdXNldHlwZXMtcGFyYW1zLi4nKTtcclxuXHJcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyB0aGlzLnJlc291cmNlVHlwZSgpLCBwYXlsb2FkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIGNyZWF0ZVJlc291cmNlUHJvamVjdGlvblJlbDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uTmFtZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpOiBUIHtcclxuICAgIGNvbnN0IHJlbGF0aW9uQ2xhc3MgPSBSZXNvdXJjZVV0aWxzLlJFU09VUkNFX1BST0pFQ1RJT05fUkVMX05BTUVfVFlQRV9NQVAuZ2V0KHJlbGF0aW9uTmFtZSk7XHJcbiAgICBpZiAocmVsYXRpb25DbGFzcykge1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgKHJlbGF0aW9uQ2xhc3MpKCkgYXMgVCwgcGF5bG9hZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBDb25zb2xlTG9nZ2VyLnByZXR0eVdhcm4oJ05vdCBmb3VuZCByZXNvdXJjZSByZWxhdGlvbiB0eXBlIHdoZW4gY3JlYXRlIHJlbGF0aW9uOiBcXCcnICsgcmVsYXRpb25OYW1lICsgJ1xcJyBzbyB1c2VkIGRlZmF1bHQgUmVzb3VyY2UgdHlwZSwgZm9yIHRoaXMgY2FuIGJlIHNvbWUgcmVhc29uczogXFxuXFxyJyArXHJcbiAgICAgICAgJ1lvdSBkaWQgbm90IHBhc3MgcmVsYXRpb24gdHlwZSBwcm9wZXJ0eSB3aXRoIEBQcm9qZWN0aW9uUmVsIGRlY29yYXRvciBvbiByZWxhdGlvbiBwcm9wZXJ0eSBcXCcnICsgcmVsYXRpb25OYW1lICsgJ1xcJy4gXFxuXFxyJyArXHJcbiAgICAgICAgJ1xcblxcclNlZSBtb3JlIGhvdyB0byB1c2UgQFByb2plY3Rpb25SZWwgaGVyZSBodHRwczovL2dpdGh1Yi5jb20vbGFnb3Nobnkvbmd4LWhhdGVvYXMtY2xpZW50I3Jlc291cmNlLXByb2plY3Rpb24tc3VwcG9ydC4nKTtcclxuXHJcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyB0aGlzLnJlc291cmNlVHlwZSgpLCBwYXlsb2FkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIGNyZWF0ZUVtYmVkZGVkUmVzb3VyY2U8VCBleHRlbmRzIEJhc2VSZXNvdXJjZT4oa2V5OiBzdHJpbmcsIHBheWxvYWQ6IGFueSk6IFQge1xyXG4gICAgY29uc3QgcmVzb3VyY2VDbGFzcyA9IFJlc291cmNlVXRpbHMuRU1CRURERURfUkVTT1VSQ0VfVFlQRV9NQVAuZ2V0KGtleSk7XHJcbiAgICBpZiAocmVzb3VyY2VDbGFzcykge1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgKHJlc291cmNlQ2xhc3MpKCkgYXMgVCwgcGF5bG9hZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBDb25zb2xlTG9nZ2VyLnByZXR0eVdhcm4oJ05vdCBmb3VuZCBlbWJlZGRlZCByZXNvdXJjZSB0eXBlIHdoZW4gY3JlYXRlIHJlc291cmNlOiBcXCcnICsga2V5ICsgJ1xcJyBzbyB1c2VkIGRlZmF1bHQgRW1iZWRkZWRSZXNvdXJjZSB0eXBlLCBmb3IgdGhpcyBjYW4gYmUgc29tZSByZWFzb25zOi4gXFxuXFxyJyArXHJcbiAgICAgICAgJzEpIFlvdSBkaWQgbm90IHBhc3MgZW1iZWRkZWQgcmVzb3VyY2UgcHJvcGVydHkgbmFtZSBhcyBcXCcnICsga2V5ICsgJ1xcJyB3aXRoIEBIYXRlb2FzRW1iZWRkZWRSZXNvdXJjZSBkZWNvcmF0b3IuIFxcblxccicgK1xyXG4gICAgICAgICcyKSBZb3UgZGlkIG5vdCBkZWNsYXJlIGVtYmVkZGVkIHJlc291cmNlIHR5cGUgaW4gY29uZmlndXJhdGlvbiBcImNvbmZpZ3VyYXRpb24udXNlVHlwZXMuZW1iZWRkZWRSZXNvdXJjZXNcIi4gXFxuXFxyJyArXHJcbiAgICAgICAgJ1xcblxcciBTZWUgbW9yZSBhYm91dCBkZWNsYXJlIHJlc291cmNlIHR5cGVzIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9sYWdvc2hueS9uZ3gtaGF0ZW9hcy1jbGllbnQjdXNldHlwZXMtcGFyYW1zLicpO1xyXG5cclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IHRoaXMuZW1iZWRkZWRSZXNvdXJjZVR5cGUoKSwgcGF5bG9hZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZUNvbGxlY3Rpb248QmFzZVJlc291cmNlPj4ocGF5bG9hZDogb2JqZWN0LCBpc1Byb2plY3Rpb24/OiBib29sZWFuKTogVCB7XHJcbiAgICBpZiAoaXNFbXB0eShwYXlsb2FkKVxyXG4gICAgICB8fCAoIWlzT2JqZWN0KHBheWxvYWRbJ19saW5rcyddKSB8fCBpc0VtcHR5KHBheWxvYWRbJ19saW5rcyddKSlcclxuICAgICAgfHwgKCFpc09iamVjdChwYXlsb2FkWydfZW1iZWRkZWQnXSkgfHwgaXNFbXB0eShwYXlsb2FkWydfZW1iZWRkZWQnXSkpKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IHRoaXMucmVzb3VyY2VDb2xsZWN0aW9uVHlwZSgpIGFzIFQ7XHJcbiAgICBmb3IgKGNvbnN0IHJlc291cmNlTmFtZSBvZiBPYmplY3Qua2V5cyhwYXlsb2FkWydfZW1iZWRkZWQnXSkpIHtcclxuICAgICAgcGF5bG9hZFsnX2VtYmVkZGVkJ11bcmVzb3VyY2VOYW1lXS5mb3JFYWNoKChyZXNvdXJjZSkgPT4ge1xyXG4gICAgICAgIHJlc3VsdC5yZXNvdXJjZXMucHVzaCh0aGlzLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzb3VyY2UsIGlzUHJvamVjdGlvbikpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlc3VsdFsnX2xpbmtzJ10gPSB7Li4ucGF5bG9hZFsnX2xpbmtzJ119O1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlUGFnZWRSZXNvdXJjZUNvbGxlY3Rpb248VCBleHRlbmRzIFBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uPEJhc2VSZXNvdXJjZT4+KHBheWxvYWQ6IG9iamVjdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJvamVjdGlvbj86IGJvb2xlYW4pOiBUIHtcclxuICAgIGNvbnN0IHJlc291cmNlQ29sbGVjdGlvbiA9IHRoaXMuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24ocGF5bG9hZCwgaXNQcm9qZWN0aW9uKTtcclxuICAgIGlmIChyZXNvdXJjZUNvbGxlY3Rpb24gPT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgaWYgKHBheWxvYWRbJ3BhZ2UnXSkge1xyXG4gICAgICByZXN1bHQgPSBuZXcgdGhpcy5wYWdlZFJlc291cmNlQ29sbGVjdGlvblR5cGUocmVzb3VyY2VDb2xsZWN0aW9uLCBwYXlsb2FkIGFzIFBhZ2VEYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IG5ldyB0aGlzLnBhZ2VkUmVzb3VyY2VDb2xsZWN0aW9uVHlwZShyZXNvdXJjZUNvbGxlY3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdCBhcyBUO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzb2x2ZSByZXF1ZXN0IGJvZHkgcmVsYXRpb25zLlxyXG4gICAqIElmIHJlcXVlc3QgYm9keSBoYXMge0BsaW5rIFJlc291cmNlfSB2YWx1ZSB0aGVuIHRoaXMgdmFsdWUgd2lsbCBiZSByZXBsYWNlZCBieSByZXNvdXJjZSBzZWxmIGxpbmsuXHJcbiAgICogSWYgcmVxdWVzdCBib2R5IGhhcyB7QGxpbmsgVmFsdWVzT3B0aW9ufSBpdCB3aWxsIGJlIGFwcGxpZWQgdG8gYm9keSB2YWx1ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVxdWVzdEJvZHkgdGhhdCBjb250YWlucyB0aGUgYm9keSBkaXJlY3RseSBhbmQgb3B0aW9uYWwgYm9keSB2YWx1ZXMgb3B0aW9uIHtAbGluayBWYWx1ZXNPcHRpb259XHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyByZXNvbHZlVmFsdWVzKHJlcXVlc3RCb2R5OiBSZXF1ZXN0Qm9keTxhbnk+KTogYW55IHtcclxuICAgIGlmIChpc0VtcHR5KHJlcXVlc3RCb2R5KSB8fCBpc05pbChyZXF1ZXN0Qm9keS5ib2R5KVxyXG4gICAgICB8fCAoaXNPYmplY3QocmVxdWVzdEJvZHkuYm9keSkgJiYgaXNFbXB0eShyZXF1ZXN0Qm9keS5ib2R5KSkpIHtcclxuICAgICAgU3RhZ2VMb2dnZXIuc3RhZ2VMb2coU3RhZ2UuUkVTT0xWRV9WQUxVRVMsIHtyZXN1bHQ6ICdib2R5IGlzIGVtcHR5IHJldHVybiBudWxsJ30pO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbnN0IGJvZHkgPSByZXF1ZXN0Qm9keS5ib2R5O1xyXG4gICAgaWYgKCFpc09iamVjdChib2R5KSB8fCBpc0FycmF5KGJvZHkpKSB7XHJcbiAgICAgIFN0YWdlTG9nZ2VyLnN0YWdlTG9nKFN0YWdlLlJFU09MVkVfVkFMVUVTLCB7cmVzdWx0OiAnYm9keSBpcyBub3Qgb2JqZWN0IG9yIGFycmF5IHJldHVybiBhcyBpcyd9KTtcclxuICAgICAgcmV0dXJuIGJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBvYmplY3QgPSB7fTtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIGJvZHkpIHtcclxuICAgICAgaWYgKCFib2R5Lmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoYm9keVtrZXldID09IG51bGwgJiYgSW5jbHVkZS5OVUxMX1ZBTFVFUyA9PT0gcmVxdWVzdEJvZHk/LnZhbHVlc09wdGlvbj8uaW5jbHVkZSkge1xyXG4gICAgICAgIHJlc3VsdFtrZXldID0gbnVsbDtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXNOaWwoYm9keVtrZXldKSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpc0FycmF5KGJvZHlba2V5XSkpIHtcclxuICAgICAgICBjb25zdCBhcnJheTogYW55W10gPSBib2R5W2tleV07XHJcbiAgICAgICAgcmVzdWx0W2tleV0gPSBbXTtcclxuICAgICAgICBhcnJheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXNSZXNvdXJjZShlbGVtZW50KSkge1xyXG4gICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKGVsZW1lbnQ/Ll9saW5rcz8uc2VsZj8uaHJlZik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHRoaXMucmVzb2x2ZVZhbHVlcyh7Ym9keTogZWxlbWVudCwgdmFsdWVzT3B0aW9uOiByZXF1ZXN0Qm9keT8udmFsdWVzT3B0aW9ufSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgaWYgKGlzUmVzb3VyY2UoYm9keVtrZXldKSkge1xyXG4gICAgICAgIHJlc3VsdFtrZXldID0gYm9keVtrZXldLl9saW5rcz8uc2VsZj8uaHJlZjtcclxuICAgICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KGJvZHlba2V5XSkpIHtcclxuICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMucmVzb2x2ZVZhbHVlcyh7Ym9keTogYm9keVtrZXldLCB2YWx1ZXNPcHRpb246IHJlcXVlc3RCb2R5Py52YWx1ZXNPcHRpb259KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHRba2V5XSA9IGJvZHlba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgU3RhZ2VMb2dnZXIuc3RhZ2VMb2coU3RhZ2UuUkVTT0xWRV9WQUxVRVMsIHtyZXN1bHR9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXNzaWduIHtAbGluayBSZXNvdXJjZX0gb3Ige0BsaW5rIEVtYmVkZGVkUmVzb3VyY2V9IHByb3BlcnRpZXMgdG8gcGFzc2VkIGVudGl0eS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBlbnRpdHkgdG8gYmUgY29udmVydGVyIHRvIHJlc291cmNlXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyBpbml0UmVzb3VyY2UoZW50aXR5OiBhbnkpOiBCYXNlUmVzb3VyY2UgfCBhbnkge1xyXG4gICAgaWYgKGlzUmVzb3VyY2UoZW50aXR5KSkge1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgdGhpcy5yZXNvdXJjZVR5cGUoKSwgZW50aXR5KTtcclxuICAgIH0gZWxzZSBpZiAoaXNFbWJlZGRlZFJlc291cmNlKGVudGl0eSkpIHtcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IHRoaXMuZW1iZWRkZWRSZXNvdXJjZVR5cGUoKSwgZW50aXR5KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBlbnRpdHk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWZpbmUgcmVzb3VyY2UgbmFtZSBiYXNlZCBvbiByZXNvdXJjZSBsaW5rcy5cclxuICAgKiBJdCB3aWxsIGdldCBsaW5rIG5hbWUgdGhhdCBocmVmIGVxdWFscyB0byBzZWxmIGhyZWYgcmVzb3VyY2UgbGluay5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBwYXlsb2FkIHRoYXQgY2FuIGJlIGEgcmVzb3VyY2UgZm9yIHdoaWNoIHRvIGZpbmQgdGhlIG5hbWVcclxuICAgKi9cclxuICBwcml2YXRlIHN0YXRpYyBmaW5kUmVzb3VyY2VOYW1lKHBheWxvYWQ6IG9iamVjdCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWRbJ19saW5rcyddIHx8ICFwYXlsb2FkWydfbGlua3MnXS5zZWxmKSB7XHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc291cmNlTGlua3MgPSBwYXlsb2FkWydfbGlua3MnXSBhcyBMaW5rO1xyXG4gICAgaWYgKGlzRW1wdHkocmVzb3VyY2VMaW5rcykgfHwgaXNFbXB0eShyZXNvdXJjZUxpbmtzLnNlbGYpIHx8IGlzTmlsKHJlc291cmNlTGlua3Muc2VsZi5ocmVmKSkge1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFVybFV0aWxzLmdldFJlc291cmNlTmFtZUZyb21VcmwoVXJsVXRpbHMucmVtb3ZlVGVtcGxhdGVQYXJhbXMocmVzb3VyY2VMaW5rcy5zZWxmLmhyZWYpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrcyBpcyBhIHJlc291cmNlIHByb2plY3Rpb24gb3Igbm90LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBheWxvYWQgb2JqZWN0IHRoYXQgY2FuIGJlIHJlc291cmNlIG9yIHJlc291cmNlIHByb2plY3Rpb25cclxuICAgKi9cclxuICBwcml2YXRlIHN0YXRpYyBpc1Jlc291cmNlUHJvamVjdGlvbihwYXlsb2FkOiBvYmplY3QpOiBib29sZWFuIHtcclxuICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZFsnX2xpbmtzJ10gfHwgIXBheWxvYWRbJ19saW5rcyddLnNlbGYpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlbGZMaW5rID0gcGF5bG9hZFsnX2xpbmtzJ10uc2VsZjtcclxuICAgIGNvbnN0IHJlc291cmNlTGlua3MgPSBwYXlsb2FkWydfbGlua3MnXTtcclxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHJlc291cmNlTGlua3MpKSB7XHJcbiAgICAgIGlmIChrZXkgIT09ICdzZWxmJyAmJiByZXNvdXJjZUxpbmtzW2tleV0uaHJlZi5pbmNsdWRlcyhzZWxmTGluay5ocmVmKSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVVJMKHJlc291cmNlTGlua3Nba2V5XS5ocmVmKS5zZWFyY2guaW5jbHVkZXMoJ3Byb2plY3Rpb24nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyeSB0byBnZXQgcHJvamVjdGlvbk5hbWUgZnJvbSByZXNvdXJjZSB0eXBlIGFuZCBzZXQgaXQgdG8gb3B0aW9ucy4gSWYgcmVzb3VyY2VUeXBlIGhhcyBub3QgcHJvamVjdGlvbk5hbWUgdGhlbiByZXR1cm4gb3B0aW9ucyBhcyBpcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZXNvdXJjZVR5cGUgZnJvbSBnZXQgcHJvamVjdGlvbk5hbWVcclxuICAgKiBAcGFyYW0gb3B0aW9ucyB0byBzZXQgcHJvamVjdGlvbk5hbWVcclxuICAgKi9cclxuICBwdWJsaWMgc3RhdGljIGZpbGxQcm9qZWN0aW9uTmFtZUZyb21SZXNvdXJjZVR5cGU8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZVR5cGU6IG5ldyAoKSA9PiBULCBvcHRpb25zPzogR2V0T3B0aW9uKSB7XHJcbiAgICBpZiAoIXJlc291cmNlVHlwZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBwcm9qZWN0aW9uTmFtZSA9IHJlc291cmNlVHlwZVsnX19wcm9qZWN0aW9uTmFtZV9fJ107XHJcbiAgICBpZiAocHJvamVjdGlvbk5hbWUpIHtcclxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgPyBvcHRpb25zIDoge3BhcmFtczoge319O1xyXG4gICAgICBvcHRpb25zID0ge1xyXG4gICAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAuLi5vcHRpb25zLnBhcmFtcyxcclxuICAgICAgICAgIHByb2plY3Rpb246IHByb2plY3Rpb25OYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH1cclxuXHJcbn1cclxuIl19