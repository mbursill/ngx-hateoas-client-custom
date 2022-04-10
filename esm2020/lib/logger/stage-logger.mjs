import { ConsoleLogger } from './console-logger';
import { Stage } from './stage.enum';
import { LibConfig } from '../config/lib-config';
import { capitalize, isEmpty, isNil, isObject, isString } from 'lodash-es';
/**
 * Simplify logger calls.
 */
/* tslint:disable:no-string-literal */
export class StageLogger {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UtbG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWhhdGVvYXMtY2xpZW50L3NyYy9saWIvbG9nZ2VyL3N0YWdlLWxvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNyQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFM0U7O0dBRUc7QUFFSCxzQ0FBc0M7QUFDdEMsTUFBTSxPQUFPLFdBQVc7SUFFZixNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBeUIsRUFBRSxNQUFjLEVBQUUsTUFBZTtRQUN2RixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDeEUsT0FBTztTQUNSO1FBQ0QsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QyxJQUFJLFlBQVksQ0FBQztRQUNqQixJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN0QixZQUFZLEdBQUcsUUFBUSxDQUFDO1NBQ3pCO2FBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixZQUFZLEdBQUcsa0JBQWtCLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUM7U0FDbkc7YUFBTTtZQUNMLFlBQVksR0FBRywyQkFBMkIsQ0FBQztTQUM1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Q0wsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQzthQUN6QjtTQUNGO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc29sZUxvZ2dlciB9IGZyb20gJy4vY29uc29sZS1sb2dnZXInO1xyXG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4vc3RhZ2UuZW51bSc7XHJcbmltcG9ydCB7IExpYkNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9saWItY29uZmlnJztcclxuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgaXNFbXB0eSwgaXNOaWwsIGlzT2JqZWN0LCBpc1N0cmluZyB9IGZyb20gJ2xvZGFzaC1lcyc7XHJcblxyXG4vKipcclxuICogU2ltcGxpZnkgbG9nZ2VyIGNhbGxzLlxyXG4gKi9cclxuXHJcbi8qIHRzbGludDpkaXNhYmxlOm5vLXN0cmluZy1saXRlcmFsICovXHJcbmV4cG9ydCBjbGFzcyBTdGFnZUxvZ2dlciB7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgcmVzb3VyY2VCZWdpbkxvZyhyZXNvdXJjZTogb2JqZWN0IHwgc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgcGFyYW1zPzogb2JqZWN0KTogdm9pZCB7XHJcbiAgICBpZiAoIUxpYkNvbmZpZy5jb25maWcubG9ncy52ZXJib3NlTG9ncyAmJiAhTGliQ29uZmlnLmNvbmZpZy5pc1Byb2R1Y3Rpb24pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGFyYW1Ub0xvZyA9IHRoaXMucHJlcGFyZVBhcmFtcyhwYXJhbXMpO1xyXG5cclxuICAgIGxldCByZXNvdXJjZU5hbWU7XHJcbiAgICBpZiAoaXNTdHJpbmcocmVzb3VyY2UpKSB7XHJcbiAgICAgIHJlc291cmNlTmFtZSA9IHJlc291cmNlO1xyXG4gICAgfSBlbHNlIGlmICghaXNOaWwocmVzb3VyY2UpKSB7XHJcbiAgICAgIHJlc291cmNlTmFtZSA9ICdfX3Jlc291cmNlTmFtZV9fJyBpbiByZXNvdXJjZSA/IHJlc291cmNlWydfX3Jlc291cmNlTmFtZV9fJ10gOiAnRW1iZWRkZWRSZXNvdXJjZSc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNvdXJjZU5hbWUgPSAnTk9UX0RFRklORURfUkVTT1VSQ0VfTkFNRSc7XHJcbiAgICB9XHJcbiAgICBDb25zb2xlTG9nZ2VyLnJlc291cmNlUHJldHR5SW5mbyhgJHsgY2FwaXRhbGl6ZShyZXNvdXJjZU5hbWUpIH0gJHsgbWV0aG9kIH1gLFxyXG4gICAgICBgU1RBR0UgJHsgU3RhZ2UuQkVHSU4gfWAsIHBhcmFtVG9Mb2cpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyByZXNvdXJjZUVuZExvZyhyZXNvdXJjZTogb2JqZWN0IHwgc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgcGFyYW1zOiBvYmplY3QpOiB2b2lkIHtcclxuICAgIGlmICghTGliQ29uZmlnLmNvbmZpZy5sb2dzLnZlcmJvc2VMb2dzICYmICFMaWJDb25maWcuY29uZmlnLmlzUHJvZHVjdGlvbikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBwYXJhbVRvTG9nID0gdGhpcy5wcmVwYXJlUGFyYW1zKHBhcmFtcyk7XHJcblxyXG4gICAgbGV0IHJlc291cmNlTmFtZTtcclxuICAgIGlmIChpc1N0cmluZyhyZXNvdXJjZSkpIHtcclxuICAgICAgcmVzb3VyY2VOYW1lID0gcmVzb3VyY2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNvdXJjZU5hbWUgPSAnX19yZXNvdXJjZU5hbWVfXycgaW4gcmVzb3VyY2UgPyByZXNvdXJjZVsnX19yZXNvdXJjZU5hbWVfXyddIDogJ0VtYmVkZGVkUmVzb3VyY2UnO1xyXG4gICAgfVxyXG5cclxuICAgIENvbnNvbGVMb2dnZXIucmVzb3VyY2VQcmV0dHlJbmZvKGAkeyBjYXBpdGFsaXplKHJlc291cmNlTmFtZSkgfSAkeyBtZXRob2QgfWAsXHJcbiAgICAgIGBTVEFHRSAkeyBTdGFnZS5FTkQgfWAsIHBhcmFtVG9Mb2cpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBzdGFnZUxvZyhzdGFnZTogU3RhZ2UsIHBhcmFtczogb2JqZWN0KTogdm9pZCB7XHJcbiAgICBpZiAoIUxpYkNvbmZpZy5jb25maWcubG9ncy52ZXJib3NlTG9ncyAmJiAhTGliQ29uZmlnLmNvbmZpZy5pc1Byb2R1Y3Rpb24pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGFyYW1Ub0xvZyA9IHRoaXMucHJlcGFyZVBhcmFtcyhwYXJhbXMpO1xyXG5cclxuICAgIENvbnNvbGVMb2dnZXIucHJldHR5SW5mbyhgU1RBR0UgJHsgc3RhZ2UgfWAsIHBhcmFtVG9Mb2cpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBzdGFnZUVycm9yTG9nKHN0YWdlOiBTdGFnZSwgcGFyYW1zOiBvYmplY3QpOiB2b2lkIHtcclxuICAgIGlmIChMaWJDb25maWcuY29uZmlnLmlzUHJvZHVjdGlvbikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBwYXJhbVRvTG9nID0gdGhpcy5wcmVwYXJlUGFyYW1zKHBhcmFtcyk7XHJcblxyXG4gICAgQ29uc29sZUxvZ2dlci5wcmV0dHlFcnJvcihgU1RBR0UgJHsgc3RhZ2UgfWAsIHBhcmFtVG9Mb2cpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBzdGFnZVdhcm5Mb2coc3RhZ2U6IFN0YWdlLCBwYXJhbXM6IG9iamVjdCk6IHZvaWQge1xyXG4gICAgaWYgKExpYkNvbmZpZy5jb25maWcuaXNQcm9kdWN0aW9uKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IHBhcmFtVG9Mb2cgPSB0aGlzLnByZXBhcmVQYXJhbXMocGFyYW1zKTtcclxuXHJcbiAgICBDb25zb2xlTG9nZ2VyLnByZXR0eVdhcm4oYFNUQUdFICR7IHN0YWdlIH1gLCBwYXJhbVRvTG9nKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHByZXBhcmVQYXJhbXMocGFyYW1zOiBvYmplY3QpIHtcclxuICAgIGNvbnN0IHBhcmFtVG9Mb2cgPSB7fTtcclxuICAgIGlmIChpc0VtcHR5KHBhcmFtcykpIHtcclxuICAgICAgcmV0dXJuIHBhcmFtVG9Mb2c7XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwYXJhbXMpKSB7XHJcbiAgICAgIGlmICghcGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgcGFyYW1Ub0xvZ1trZXldID0gSlNPTi5zdHJpbmdpZnkodmFsdWUsIG51bGwsIDIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhcmFtVG9Mb2dba2V5XSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyYW1Ub0xvZztcclxuICB9XHJcbn1cclxuIl19