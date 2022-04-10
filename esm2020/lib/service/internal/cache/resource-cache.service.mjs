import { Injectable } from '@angular/core';
import { CachedResource } from './model/cached-resource';
import { StageLogger } from '../../../logger/stage-logger';
import { Stage } from '../../../logger/stage.enum';
import { ValidationUtils } from '../../../util/validation.utils';
import { LibConfig } from '../../../config/lib-config';
import { UrlUtils } from '../../../util/url.utils';
import { isNil } from 'lodash-es';
import * as i0 from "@angular/core";
export class ResourceCacheService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UtY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1oYXRlb2FzLWNsaWVudC9zcmMvbGliL3NlcnZpY2UvaW50ZXJuYWwvY2FjaGUvcmVzb3VyY2UtY2FjaGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDM0QsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRW5ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7O0FBR2xDLE1BQU0sT0FBTyxvQkFBb0I7SUFEakM7UUFHVSxhQUFRLEdBQWdDLElBQUksR0FBRyxFQUEwQixDQUFDO0tBdUVuRjtJQXJFQzs7Ozs7T0FLRztJQUNJLFdBQVcsQ0FBQyxHQUFhO1FBQzlCLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7UUFFM0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3JCLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFF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bnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDYWNoZWRSZXNvdXJjZSB9IGZyb20gJy4vbW9kZWwvY2FjaGVkLXJlc291cmNlJztcclxuaW1wb3J0IHsgU3RhZ2VMb2dnZXIgfSBmcm9tICcuLi8uLi8uLi9sb2dnZXIvc3RhZ2UtbG9nZ2VyJztcclxuaW1wb3J0IHsgU3RhZ2UgfSBmcm9tICcuLi8uLi8uLi9sb2dnZXIvc3RhZ2UuZW51bSc7XHJcbmltcG9ydCB7IENhY2hlS2V5IH0gZnJvbSAnLi9tb2RlbC9jYWNoZS1rZXknO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uVXRpbHMgfSBmcm9tICcuLi8uLi8uLi91dGlsL3ZhbGlkYXRpb24udXRpbHMnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUlkZW50aWZpYWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVsL2RlY2xhcmF0aW9ucyc7XHJcbmltcG9ydCB7IExpYkNvbmZpZyB9IGZyb20gJy4uLy4uLy4uL2NvbmZpZy9saWItY29uZmlnJztcclxuaW1wb3J0IHsgVXJsVXRpbHMgfSBmcm9tICcuLi8uLi8uLi91dGlsL3VybC51dGlscyc7XHJcbmltcG9ydCB7IGlzTmlsIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJlc291cmNlQ2FjaGVTZXJ2aWNlIHtcclxuXHJcbiAgcHJpdmF0ZSBjYWNoZU1hcDogTWFwPHN0cmluZywgQ2FjaGVkUmVzb3VyY2U+ID0gbmV3IE1hcDxzdHJpbmcsIENhY2hlZFJlc291cmNlPigpO1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgY2FjaGVkIHJlc291cmNlIHZhbHVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGtleSBjYWNoZSBrZXlcclxuICAgKiBAcmV0dXJuIGNhY2hlZCB2YWx1ZSBvciB7QGNvZGUgbnVsbH0gd2hlbiBjYWNoZWQgdmFsdWUgaXMgbm90IGV4aXN0IG9yIGV4cGlyZWRcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0UmVzb3VyY2Uoa2V5OiBDYWNoZUtleSk6IFJlc291cmNlSWRlbnRpZmlhYmxlIHtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtrZXl9KTtcclxuXHJcbiAgICBjb25zdCBjYWNoZVZhbHVlID0gdGhpcy5jYWNoZU1hcC5nZXQoa2V5LnZhbHVlKTtcclxuICAgIGlmIChpc05pbChjYWNoZVZhbHVlKSkge1xyXG4gICAgICBTdGFnZUxvZ2dlci5zdGFnZUxvZyhTdGFnZS5DQUNIRV9HRVQsIHtjYWNoZUtleToga2V5LnZhbHVlLCByZXN1bHQ6IG51bGx9KTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FjaGVFeHBpcmVkVGltZSA9IG5ldyBEYXRlKGNhY2hlVmFsdWUuY2FjaGVkVGltZSk7XHJcbiAgICBjYWNoZUV4cGlyZWRUaW1lLnNldE1pbGxpc2Vjb25kcyhjYWNoZUV4cGlyZWRUaW1lLmdldE1pbGxpc2Vjb25kcygpICsgTGliQ29uZmlnLmNvbmZpZy5jYWNoZS5saWZlVGltZSk7XHJcbiAgICBpZiAoY2FjaGVFeHBpcmVkVGltZS5nZXRUaW1lKCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKSkge1xyXG4gICAgICB0aGlzLmV2aWN0UmVzb3VyY2Uoa2V5KTtcclxuICAgICAgU3RhZ2VMb2dnZXIuc3RhZ2VMb2coU3RhZ2UuQ0FDSEVfR0VULCB7Y2FjaGVLZXk6IGtleS52YWx1ZSwgbWVzc2FnZTogJ2NhY2hlIHdhcyBleHBpcmVkJywgcmVzdWx0OiBudWxsfSk7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIFN0YWdlTG9nZ2VyLnN0YWdlTG9nKFN0YWdlLkNBQ0hFX0dFVCwge2NhY2hlS2V5OiBrZXkudmFsdWUsIHJlc3VsdDogY2FjaGVWYWx1ZS52YWx1ZX0pO1xyXG4gICAgcmV0dXJuIGNhY2hlVmFsdWUudmFsdWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgcmVzb3VyY2UgdmFsdWUgdG8gdGhlIGNhY2hlLlxyXG4gICAqIEJlZm9yZSBhZGQgbmV3IHZhbHVlLCBwcmV2aW91cyB3aWxsIGJlIGRlbGV0ZWQgaWYgaXQgd2FzIGV4aXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGtleSBjYWNoZSBrZXlcclxuICAgKiBAcGFyYW0gdmFsdWUgY2FjaGUgdmFsdWVcclxuICAgKi9cclxuICBwdWJsaWMgcHV0UmVzb3VyY2Uoa2V5OiBDYWNoZUtleSwgdmFsdWU6IFJlc291cmNlSWRlbnRpZmlhYmxlKTogdm9pZCB7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7a2V5LCB2YWx1ZX0pO1xyXG5cclxuICAgIHRoaXMuY2FjaGVNYXAuc2V0KGtleS52YWx1ZSwgbmV3IENhY2hlZFJlc291cmNlKHZhbHVlLCBuZXcgRGF0ZSgpKSk7XHJcblxyXG4gICAgU3RhZ2VMb2dnZXIuc3RhZ2VMb2coU3RhZ2UuQ0FDSEVfUFVULCB7Y2FjaGVLZXk6IGtleS52YWx1ZSwgdmFsdWV9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlbGV0ZSBjYWNoZWQgcmVzb3VyY2UgdmFsdWUgYnkgcGFzc2VkIGtleS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBrZXkgY2FjaGUga2V5XHJcbiAgICovXHJcbiAgcHVibGljIGV2aWN0UmVzb3VyY2Uoa2V5OiBDYWNoZUtleSk6IHZvaWQge1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe2tleX0pO1xyXG5cclxuICAgIC8vIEdldCByZXNvdXJjZSBuYW1lIGJ5IHVybCB0byBldmljdCBhbGwgcmVzb3VyY2UgY2FjaGUgd2l0aCBjb2xsZWN0aW9uL3BhZ2VkIGNvbGxlY3Rpb24gZGF0YVxyXG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0ga2V5LnVybC5yZXBsYWNlKGAkeyBVcmxVdGlscy5nZXRBcGlVcmwoKSB9L2AsICcnKS5zcGxpdCgnLycpWzBdO1xyXG4gICAgaWYgKCFyZXNvdXJjZU5hbWUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZXZpY3RlZENhY2hlID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGNhY2hlS2V5IG9mIHRoaXMuY2FjaGVNYXAua2V5cygpKSB7XHJcbiAgICAgIGlmIChjYWNoZUtleS5zdGFydHNXaXRoKGB1cmw9JHsgVXJsVXRpbHMuZ2V0QXBpVXJsKCkgfS8keyByZXNvdXJjZU5hbWUgfWApKSB7XHJcbiAgICAgICAgZXZpY3RlZENhY2hlLnB1c2goe1xyXG4gICAgICAgICAga2V5OiBjYWNoZUtleVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY2FjaGVNYXAuZGVsZXRlKGNhY2hlS2V5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGV2aWN0ZWRDYWNoZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIFN0YWdlTG9nZ2VyLnN0YWdlTG9nKFN0YWdlLkNBQ0hFX0VWSUNULCB7Y2FjaGVLZXk6IGtleS52YWx1ZSwgZXZpY3RlZDogZXZpY3RlZENhY2hlfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=