import { BaseResource } from './base-resource';
import { getResourceHttpService } from '../../service/internal/resource-http.service';
import { HttpHeaders } from '@angular/common/http';
import { ResourceUtils } from '../../util/resource.utils';
import { UrlUtils } from '../../util/url.utils';
import { tap } from 'rxjs/operators';
import { Stage } from '../../logger/stage.enum';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';
import { isArray, isNil, last, split } from 'lodash-es';
/**
 * Resource class.
 * Should be extended by client model classes that represent entity objects.
 *
 * If you have an embedded entity then consider to use the {@link EmbeddedResource} class.
 */
// tslint:disable:variable-name
export class Resource extends BaseResource {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaGF0ZW9hcy1jbGllbnQvc3JjL2xpYi9tb2RlbC9yZXNvdXJjZS9yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDdEYsT0FBTyxFQUFFLFdBQVcsRUFBZ0IsTUFBTSxzQkFBc0IsQ0FBQztBQUVqRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWhELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRXhEOzs7OztHQUtHO0FBQ0gsK0JBQStCO0FBQy9CLE1BQU0sT0FBTyxRQUFTLFNBQVEsWUFBWTtJQVV4Qzs7Ozs7Ozs7OztPQVVHO0lBQ0kscUJBQXFCLENBQXFCLFlBQW9CLEVBQUUsUUFBa0I7UUFDdkYsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRSxFQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQ3BILGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLFlBQVksRUFBRSxR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QUcsQ0FBQyxHQUFHLEVBQUU7WUFDUCxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFhLFlBQWEsMkJBQTJCLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZILENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRU0sZUFBZTtRQUNwQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMvQixDQUFDO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlUmVzb3VyY2UgfSBmcm9tICcuL2Jhc2UtcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBnZXRSZXNvdXJjZUh0dHBTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZS9pbnRlcm5hbC9yZXNvdXJjZS1odHRwLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBIdHRwSGVhZGVycywgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc291cmNlVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3Jlc291cmNlLnV0aWxzJztcclxuaW1wb3J0IHsgVXJsVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3VybC51dGlscyc7XHJcbmltcG9ydCB7IExpbmtEYXRhIH0gZnJvbSAnLi4vZGVjbGFyYXRpb25zJztcclxuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4uLy4uL2xvZ2dlci9zdGFnZS5lbnVtJztcclxuaW1wb3J0IHsgU3RhZ2VMb2dnZXIgfSBmcm9tICcuLi8uLi9sb2dnZXIvc3RhZ2UtbG9nZ2VyJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC92YWxpZGF0aW9uLnV0aWxzJztcclxuaW1wb3J0IHsgaXNBcnJheSwgaXNOaWwsIGxhc3QsIHNwbGl0IH0gZnJvbSAnbG9kYXNoLWVzJztcclxuXHJcbi8qKlxyXG4gKiBSZXNvdXJjZSBjbGFzcy5cclxuICogU2hvdWxkIGJlIGV4dGVuZGVkIGJ5IGNsaWVudCBtb2RlbCBjbGFzc2VzIHRoYXQgcmVwcmVzZW50IGVudGl0eSBvYmplY3RzLlxyXG4gKlxyXG4gKiBJZiB5b3UgaGF2ZSBhbiBlbWJlZGRlZCBlbnRpdHkgdGhlbiBjb25zaWRlciB0byB1c2UgdGhlIHtAbGluayBFbWJlZGRlZFJlc291cmNlfSBjbGFzcy5cclxuICovXHJcbi8vIHRzbGludDpkaXNhYmxlOnZhcmlhYmxlLW5hbWVcclxuZXhwb3J0IGNsYXNzIFJlc291cmNlIGV4dGVuZHMgQmFzZVJlc291cmNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVzb3VyY2Ugc2hvdWxkIGhhcyBzZWxmIGxpbmsuXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIF9saW5rczoge1xyXG4gICAgc2VsZjogTGlua0RhdGE7XHJcbiAgICBba2V5OiBzdHJpbmddOiBMaW5rRGF0YTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBBZGRpbmcgcGFzc2VkIGVudGl0aWVzIHRvIHRoZSByZXNvdXJjZSBjb2xsZWN0aW9uIGJlaGluZCB0aGUgcmVsYXRpb24gbmFtZS5cclxuICAgKiBVc2VkIFBPU1QgbWV0aG9kIHdpdGggJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3VyaS1saXN0Jy5cclxuICAgKlxyXG4gICAqIFRoaXMgbWV0aG9kIERPRVMgTk9UIFJFUExBQ0UgZXhpc3RpbmcgcmVzb3VyY2VzIGluIHRoZSBjb2xsZWN0aW9uIGluc3RlYWQgaXQgYWRkcyBuZXcgb25lcy5cclxuICAgKiBUbyByZXBsYWNlIGNvbGxlY3Rpb24gcmVzb3VyY2Ugd2l0aCBwYXNzZWQgZW50aXRpZXMgdXNlIHtAbGluayBiaW5kUmVsYXRpb259IG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUgdXNlZCB0byBnZXQgdGhlIHNwZWNpZmljIHJlc291cmNlIHJlbGF0aW9uIGxpbmsgdG8gdGhlIHJlc291cmNlIGNvbGxlY3Rpb25cclxuICAgKiBAcGFyYW0gZW50aXRpZXMgb25lIG9yIG1vcmUgZW50aXRpZXMgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHJlc291cmNlIGNvbGxlY3Rpb25cclxuICAgKiBAdGhyb3dzIGVycm9yIHdoZW4gcmVxdWlyZWQgcGFyYW1zIGFyZSBub3QgdmFsaWQgb3IgbGluayBub3QgZm91bmQgYnkgcmVsYXRpb24gbmFtZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBhZGRDb2xsZWN0aW9uUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbk5hbWU6IHN0cmluZywgZW50aXRpZXM6IEFycmF5PFQ+KTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8YW55Pj4ge1xyXG4gICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VCZWdpbkxvZyh0aGlzLCAnQUREX0NPTExFQ1RJT05fUkVMQVRJT04nLCB7cmVsYXRpb25OYW1lLCByZXNvdXJjZUxpbmtzOiB0aGlzLl9saW5rcywgZW50aXRpZXN9KTtcclxuICAgIFZhbGlkYXRpb25VdGlscy52YWxpZGF0ZUlucHV0UGFyYW1zKHtyZWxhdGlvbk5hbWUsIGVudGl0aWVzfSk7XHJcblxyXG4gICAgY29uc3QgcmVsYXRpb25MaW5rID0gdGhpcy5nZXRSZWxhdGlvbkxpbmsocmVsYXRpb25OYW1lKTtcclxuXHJcbiAgICBjb25zdCBib2R5ID0gZW50aXRpZXNcclxuICAgICAgLm1hcChlbnRpdHkgPT4ge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZVV0aWxzLmluaXRSZXNvdXJjZShlbnRpdHkpLmdldFNlbGZMaW5rSHJlZigpO1xyXG4gICAgICB9KVxyXG4gICAgICAuam9pbignXFxuJyk7XHJcblxyXG4gICAgcmV0dXJuIGdldFJlc291cmNlSHR0cFNlcnZpY2UoKS5wb3N0KFVybFV0aWxzLmdlbmVyYXRlTGlua1VybChyZWxhdGlvbkxpbmspLCBib2R5LCB7XHJcbiAgICAgIG9ic2VydmU6ICdyZXNwb25zZScsXHJcbiAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3VyaS1saXN0J30pXHJcbiAgICB9KS5waXBlKFxyXG4gICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlRW5kTG9nKHRoaXMsICdBRERfQ09MTEVDVElPTl9SRUxBVElPTicsXHJcbiAgICAgICAgICB7cmVzdWx0OiBgY29sbGVjdGlvbiByZWxhdGlvbiAkeyByZWxhdGlvbk5hbWUgfSB3YXMgdXBkYXRlZCBzdWNjZXNzZnVsbHlgfSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQm91bmRpbmcgdGhlIHBhc3NlZCBlbnRpdHkgb3IgY29sbGVjdGlvbiBvZiBlbnRpdGllcyB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSByZWxhdGlvbiBuYW1lLlxyXG4gICAqIFVzZWQgUFVUIG1ldGhvZCB3aXRoICdDb250ZW50LVR5cGUnOiAndGV4dC91cmktbGlzdCcuXHJcbiAgICpcclxuICAgKiBUaGlzIG1ldGhvZCBhbHNvIFJFUExBQ0VEIGV4aXN0aW5nIHJlc291cmNlcyBpbiB0aGUgY29sbGVjdGlvbiBieSBwYXNzZWQgZW50aXRpZXMuXHJcbiAgICogVG8gYWRkIGVudGl0aWVzIHRvIGNvbGxlY3Rpb24gcmVzb3VyY2UgdXNlIHtAbGluayBhZGRDb2xsZWN0aW9uUmVsYXRpb259IG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUgd2l0aCB3aGljaCB3aWxsIGJlIGFzc29jaWF0ZWQgcGFzc2VkIGVudGl0eSB0byB0aGlzIHJlc291cmNlXHJcbiAgICogQHBhcmFtIGVudGl0aWVzIG9uZSBvciBtb3JlIGVudGl0aWVzIHRoYXQgc2hvdWxkIGJlIGJpbmQgdG8gdGhpcyByZXNvdXJjZVxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZCBvciBsaW5rIG5vdCBmb3VuZCBieSByZWxhdGlvbiBuYW1lXHJcbiAgICovXHJcbiAgcHVibGljIGJpbmRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uTmFtZTogc3RyaW5nLCBlbnRpdGllczogVCB8IEFycmF5PFQ+KTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8YW55Pj4ge1xyXG4gICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VCZWdpbkxvZyh0aGlzLCAnQklORF9SRUxBVElPTicsIHtyZWxhdGlvbk5hbWUsIHJlc291cmNlTGlua3M6IHRoaXMuX2xpbmtzLCBlbnRpdGllc30pO1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3JlbGF0aW9uTmFtZSwgZW50aXRpZXN9KTtcclxuXHJcbiAgICBjb25zdCByZWxhdGlvbkxpbmsgPSB0aGlzLmdldFJlbGF0aW9uTGluayhyZWxhdGlvbk5hbWUpO1xyXG4gICAgbGV0IGJvZHk7XHJcbiAgICBpZiAoaXNBcnJheShlbnRpdGllcykpIHtcclxuICAgICAgYm9keSA9IGVudGl0aWVzXHJcbiAgICAgICAgLm1hcChlbnRpdHkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIFJlc291cmNlVXRpbHMuaW5pdFJlc291cmNlKGVudGl0eSkuZ2V0U2VsZkxpbmtIcmVmKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuam9pbignXFxuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBib2R5ID0gUmVzb3VyY2VVdGlscy5pbml0UmVzb3VyY2UoZW50aXRpZXMpLmdldFNlbGZMaW5rSHJlZigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnZXRSZXNvdXJjZUh0dHBTZXJ2aWNlKCkucHV0KFVybFV0aWxzLmdlbmVyYXRlTGlua1VybChyZWxhdGlvbkxpbmspLCBib2R5LCB7XHJcbiAgICAgIG9ic2VydmU6ICdyZXNwb25zZScsXHJcbiAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3VyaS1saXN0J30pXHJcbiAgICB9KS5waXBlKFxyXG4gICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlRW5kTG9nKHRoaXMsICdCSU5EX1JFTEFUSU9OJywge3Jlc3VsdDogYHJlbGF0aW9uICR7IHJlbGF0aW9uTmFtZSB9IHdhcyBib3VuZCBzdWNjZXNzZnVsbHlgfSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVW5iaW5kaW5nIHNpbmdsZSByZXNvdXJjZSByZWxhdGlvbiBiZWhpbmQgcmVzb3VyY2UgbmFtZS5cclxuICAgKiBVc2VkIERFTEVURSBtZXRob2QgdG8gcmVsYXRpb24gcmVzb3VyY2UgbGluayBVUkwuXHJcbiAgICpcclxuICAgKiBUaGlzIG1ldGhvZCBET0VTIE5PVCBXT1JLIFdJVEggQ09MTEVDVElPTiBSRVNPVVJDRSByZWxhdGlvbnMuXHJcbiAgICogVG8gY2xlYXIgY29sbGVjdGlvbiByZXNvdXJjZSByZWxhdGlvbiB1c2Uge0BsaW5rIHVuYmluZENvbGxlY3Rpb25SZWxhdGlvbn0gbWV0aG9kLlxyXG4gICAqIFRvIGRlbGV0ZSBvbmUgcmVzb3VyY2UgZnJvbSByZXNvdXJjZSBjb2xsZWN0aW9uIHVzZSB7QGxpbmsgZGVsZXRlUmVsYXRpb259IG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGlvbk5hbWUgcmVzb3VyY2UgcmVsYXRpb24gbmFtZSB0byB1bmJpbmRcclxuICAgKi9cclxuICBwdWJsaWMgdW5iaW5kUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbk5hbWU6IHN0cmluZyk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPGFueT4+IHtcclxuICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlQmVnaW5Mb2codGhpcywgJ1VOQklORF9SRUxBVElPTicsIHtyZWxhdGlvbk5hbWUsIHJlc291cmNlTGlua3M6IHRoaXMuX2xpbmtzfSk7XHJcbiAgICBWYWxpZGF0aW9uVXRpbHMudmFsaWRhdGVJbnB1dFBhcmFtcyh7cmVsYXRpb25OYW1lfSk7XHJcblxyXG4gICAgY29uc3QgcmVsYXRpb25MaW5rID0gdGhpcy5nZXRSZWxhdGlvbkxpbmsocmVsYXRpb25OYW1lKTtcclxuXHJcbiAgICByZXR1cm4gZ2V0UmVzb3VyY2VIdHRwU2VydmljZSgpLmRlbGV0ZShVcmxVdGlscy5nZW5lcmF0ZUxpbmtVcmwocmVsYXRpb25MaW5rKSwge1xyXG4gICAgICBvYnNlcnZlOiAncmVzcG9uc2UnLFxyXG4gICAgfSkucGlwZShcclxuICAgICAgdGFwKCgpID0+IHtcclxuICAgICAgICBTdGFnZUxvZ2dlci5yZXNvdXJjZUVuZExvZyh0aGlzLCAnVU5CSU5EX1JFTEFUSU9OJywge3Jlc3VsdDogYHJlbGF0aW9uICR7IHJlbGF0aW9uTmFtZSB9IHdhcyB1bmJvdW5kIHN1Y2Nlc3NmdWxseWB9KTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVbmJpbmQgYWxsIHJlc291cmNlcyBmcm9tIGNvbGxlY3Rpb24gYnkgdGhlIHJlbGF0aW9uIG5hbWUuXHJcbiAgICogVXNlZCBQVVQgbWV0aG9kIHdpdGggJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3VyaS1saXN0JyBhbmQgRU1QVFkgYm9keSB0byBjbGVhciByZWxhdGlvbnMuXHJcbiAgICpcclxuICAgKiBUbyBkZWxldGUgb25lIHJlc291cmNlIGZyb20gY29sbGVjdGlvbiB1c2Uge0BsaW5rIGRlbGV0ZVJlbGF0aW9ufSBtZXRob2QuXHJcbiAgICogVG8gZGVsZXRlIHNpbmdsZSByZXNvdXJjZSByZWxhdGlvbnMgdXNlIHtAbGluayB1bmJpbmRSZWxhdGlvbn0gb3Ige0BsaW5rIGRlbGV0ZVJlbGF0aW9ufSBtZXRob2RzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlbGF0aW9uTmFtZSB1c2VkIHRvIGdldCByZWxhdGlvbiBsaW5rIHRvIHVuYmluZFxyXG4gICAqIEB0aHJvd3MgZXJyb3Igd2hlbiByZXF1aXJlZCBwYXJhbXMgYXJlIG5vdCB2YWxpZCBvciBsaW5rIG5vdCBmb3VuZCBieSByZWxhdGlvbiBuYW1lXHJcbiAgICovXHJcbiAgcHVibGljIHVuYmluZENvbGxlY3Rpb25SZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uTmFtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8YW55Pj4ge1xyXG4gICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VCZWdpbkxvZyh0aGlzLCAnVU5CSU5EX0NPTExFQ1RJT05fUkVMQVRJT04nLCB7cmVsYXRpb25OYW1lLCByZXNvdXJjZUxpbmtzOiB0aGlzLl9saW5rc30pO1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3JlbGF0aW9uTmFtZX0pO1xyXG5cclxuICAgIGNvbnN0IHJlbGF0aW9uTGluayA9IHRoaXMuZ2V0UmVsYXRpb25MaW5rKHJlbGF0aW9uTmFtZSk7XHJcblxyXG4gICAgcmV0dXJuIGdldFJlc291cmNlSHR0cFNlcnZpY2UoKS5wdXQoVXJsVXRpbHMuZ2VuZXJhdGVMaW5rVXJsKHJlbGF0aW9uTGluayksICcnLCB7XHJcbiAgICAgIG9ic2VydmU6ICdyZXNwb25zZScsXHJcbiAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3VyaS1saXN0J30pXHJcbiAgICB9KS5waXBlKFxyXG4gICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlRW5kTG9nKHRoaXMsICdVTkJJTkRfQ09MTEVDVElPTl9SRUxBVElPTicsIHtyZXN1bHQ6IGByZWxhdGlvbiAkeyByZWxhdGlvbk5hbWUgfSB3YXMgdW5ib3VuZCBzdWNjZXNzZnVsbHlgfSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVsZXRpbmcgcmVzb3VyY2UgcmVsYXRpb24uXHJcbiAgICogRm9yIGNvbGxlY3Rpb24sIG1lYW5zIHRoYXQgb25seSBwYXNzZWQgZW50aXR5IHdpbGwgYmUgdW5ib3VuZCBmcm9tIHRoZSBjb2xsZWN0aW9uLlxyXG4gICAqIEZvciBzaW5nbGUgcmVzb3VyY2UsIGRlbGV0aW5nIHJlbGF0aW9uIHRoZSBzYW1lIGFzIEB7bGluayB1bmJpbmRSZWxhdGlvbn0gbWV0aG9kLlxyXG4gICAqXHJcbiAgICogVG8gZGVsZXRlIGFsbCByZXNvdXJjZSByZWxhdGlvbnMgZnJvbSBjb2xsZWN0aW9uIHVzZSB7QGxpbmsgdW5iaW5kQ29sbGVjdGlvblJlbGF0aW9ufSBtZXRob2QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVsYXRpb25OYW1lIHVzZWQgdG8gZ2V0IHJlbGF0aW9uIGxpbmsgdG8gdW5iaW5kXHJcbiAgICogQHBhcmFtIGVudGl0eSB0aGF0IHNob3VsZCBiZSB1bmJpbmQgZnJvbSB0aGlzIHJlbGF0aW9uXHJcbiAgICogQHRocm93cyBlcnJvciB3aGVuIHJlcXVpcmVkIHBhcmFtcyBhcmUgbm90IHZhbGlkIG9yIGxpbmsgbm90IGZvdW5kIGJ5IHJlbGF0aW9uIG5hbWVcclxuICAgKi9cclxuICBwdWJsaWMgZGVsZXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbk5hbWU6IHN0cmluZywgZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8YW55Pj4ge1xyXG4gICAgU3RhZ2VMb2dnZXIucmVzb3VyY2VCZWdpbkxvZyh0aGlzLCAnREVMRVRFX1JFTEFUSU9OJywge3JlbGF0aW9uTmFtZSwgcmVzb3VyY2VMaW5rczogdGhpcy5fbGlua3MsIGVudGl0eX0pO1xyXG4gICAgVmFsaWRhdGlvblV0aWxzLnZhbGlkYXRlSW5wdXRQYXJhbXMoe3JlbGF0aW9uTmFtZSwgZW50aXR5fSk7XHJcblxyXG4gICAgY29uc3QgcmVsYXRpb25MaW5rID0gdGhpcy5nZXRSZWxhdGlvbkxpbmsocmVsYXRpb25OYW1lKTtcclxuICAgIGNvbnN0IHJlc291cmNlID0gUmVzb3VyY2VVdGlscy5pbml0UmVzb3VyY2UoZW50aXR5KSBhcyBSZXNvdXJjZTtcclxuICAgIGNvbnN0IHJlc291cmNlSWQgPSBsYXN0KHNwbGl0KFVybFV0aWxzLmdlbmVyYXRlTGlua1VybChyZXNvdXJjZS5fbGlua3Muc2VsZiksICcvJykpO1xyXG5cclxuICAgIGlmIChpc05pbChyZXNvdXJjZUlkKSB8fCByZXNvdXJjZUlkID09PSAnJykge1xyXG4gICAgICBTdGFnZUxvZ2dlci5zdGFnZUVycm9yTG9nKFN0YWdlLlBSRVBBUkVfVVJMLCB7XHJcbiAgICAgICAgc3RlcDogJ1Jlc29sdmVSZXNvdXJjZUlkJyxcclxuICAgICAgICBlcnJvcjogJ1Bhc3NlZCByZXNvdXJjZSBzZWxmIGxpbmsgc2hvdWxkIGhhcyBpZCcsXHJcbiAgICAgICAgc2VsZkxpbms6IFVybFV0aWxzLmdlbmVyYXRlTGlua1VybChyZXNvdXJjZS5fbGlua3Muc2VsZilcclxuICAgICAgfSk7XHJcbiAgICAgIHRocm93IEVycm9yKCdQYXNzZWQgcmVzb3VyY2Ugc2VsZiBsaW5rIHNob3VsZCBoYXMgaWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBTdGFnZUxvZ2dlci5zdGFnZUxvZyhTdGFnZS5QUkVQQVJFX1VSTCwge1xyXG4gICAgICBzdGVwOiAnUmVzb2x2ZVJlc291cmNlSWQnLFxyXG4gICAgICByZXN1bHQ6IHJlc291cmNlSWRcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBnZXRSZXNvdXJjZUh0dHBTZXJ2aWNlKCkuZGVsZXRlKFVybFV0aWxzLmdlbmVyYXRlTGlua1VybChyZWxhdGlvbkxpbmspICsgJy8nICsgcmVzb3VyY2VJZCwge1xyXG4gICAgICBvYnNlcnZlOiAncmVzcG9uc2UnXHJcbiAgICB9KS5waXBlKFxyXG4gICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgIFN0YWdlTG9nZ2VyLnJlc291cmNlRW5kTG9nKHRoaXMsICdERUxFVEVfUkVMQVRJT04nLCB7cmVzdWx0OiBgcmVsYXRpb24gJHsgcmVsYXRpb25OYW1lIH0gd2FzIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5YH0pO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRTZWxmTGlua0hyZWYoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=