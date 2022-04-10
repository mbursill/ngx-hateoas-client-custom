import { StageLogger } from '../logger/stage-logger';
import { Stage } from '../logger/stage.enum';
import { isArray, isEmpty, isFunction, isNil, isObject, isPlainObject, isString } from 'lodash-es';
export class ValidationUtils {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi51dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1oYXRlb2FzLWNsaWVudC9zcmMvbGliL3V0aWwvdmFsaWRhdGlvbi51dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFbkcsTUFBTSxPQUFPLGVBQWU7SUFFMUI7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQWM7UUFDOUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDakIsTUFBTSxNQUFNLEdBQUcsbUNBQW1DLENBQUM7WUFDbkQsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7WUFDL0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN6QjtRQUVELE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUMxQixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNqRCw2Q0FBNkM7WUFDN0MsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO2dCQUNwRixNQUFNLElBQUksS0FBSyxDQUFDLGFBQWMsS0FBSyxDQUFDLElBQUssOEVBQStFLEtBQUssQ0FBQyxJQUFLLFVBQVUsQ0FBQyxDQUFDO2FBQ2hKO1lBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDO21CQUNYLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO21CQUMzQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7bUJBQ3hDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBRTNDLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztnQkFDM0IsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ25CLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2pEO2dCQUNELGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSyxHQUFJLE1BQU8sY0FBZSxHQUFHLENBQUMsQ0FBQzthQUN6RDtTQUNGO1FBQ0QsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM3QixNQUFNLE1BQU0sR0FBRyxtQkFBb0IsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsSUFBSyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFLLFlBQVksQ0FBQztZQUN4SCxXQUFXLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztZQUMvRCxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhZ2VMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvc3RhZ2UtbG9nZ2VyJztcclxuaW1wb3J0IHsgU3RhZ2UgfSBmcm9tICcuLi9sb2dnZXIvc3RhZ2UuZW51bSc7XHJcbmltcG9ydCB7IGlzQXJyYXksIGlzRW1wdHksIGlzRnVuY3Rpb24sIGlzTmlsLCBpc09iamVjdCwgaXNQbGFpbk9iamVjdCwgaXNTdHJpbmcgfSBmcm9tICdsb2Rhc2gtZXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25VdGlscyB7XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrcyB0aGF0IHBhc3NlZCBvYmplY3Qgd2l0aCBwYXJhbXMgaGFzIGFsbCB2YWxpZCBwYXJhbXMuXHJcbiAgICogUGFyYW1zIHNob3VsZCBub3QgaGFzIG51bGwsIHVuZGVmaW5lZCwgZW1wdHkgb2JqZWN0LCBlbXB0eSBzdHJpbmcgdmFsdWVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhcmFtcyBvYmplY3Qgd2l0aCBwYXJhbXMgdG8gY2hlY2tcclxuICAgKiBAdGhyb3dzIGVycm9yIGlmIGFueSBwYXJhbXMgYXJlIG5vdCBkZWZpbmVkXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyB2YWxpZGF0ZUlucHV0UGFyYW1zKHBhcmFtczogb2JqZWN0KTogdm9pZCB7XHJcbiAgICBpZiAoaXNOaWwocGFyYW1zKSkge1xyXG4gICAgICBjb25zdCBlcnJNc2cgPSAnUGFzc2VkIHBhcmFtcyBvYmplY3QgaXMgbm90IHZhbGlkJztcclxuICAgICAgU3RhZ2VMb2dnZXIuc3RhZ2VFcnJvckxvZyhTdGFnZS5DSEVDS19QQVJBTVMsIHtlcnJvcjogZXJyTXNnfSk7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5vdFZhbGlkUGFyYW1zID0gW107XHJcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwYXJhbXMpKSB7XHJcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zdHJpbmctbGl0ZXJhbFxyXG4gICAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkgJiYgaXNGdW5jdGlvbih2YWx1ZS5jb25zdHJ1Y3RvcikgJiYgIXZhbHVlWydfX3Jlc291cmNlTmFtZV9fJ10pIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlc291cmNlICckeyB2YWx1ZS5uYW1lIH0nIGhhcyBub3QgJ3Jlc291cmNlTmFtZScgdmFsdWUuIFNldCBpdCB3aXRoIEBIYXRlb2FzUmVzb3VyY2UgZGVjb3JhdG9yIG9uICckeyB2YWx1ZS5uYW1lIH0nIGNsYXNzLmApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNOaWwodmFsdWUpXHJcbiAgICAgICAgfHwgKGlzU3RyaW5nKHZhbHVlKSAmJiAhdmFsdWUpXHJcbiAgICAgICAgfHwgKGlzUGxhaW5PYmplY3QodmFsdWUpICYmIGlzRW1wdHkodmFsdWUpKVxyXG4gICAgICAgIHx8IChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApKSB7XHJcblxyXG4gICAgICAgIGxldCBmb3JtYXR0ZWRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgICAgIGZvcm1hdHRlZFZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUsIG51bGwsIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBub3RWYWxpZFBhcmFtcy5wdXNoKGAnJHsga2V5IH0gPSAkeyBmb3JtYXR0ZWRWYWx1ZSB9J2ApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobm90VmFsaWRQYXJhbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCBlcnJNc2cgPSBgUGFzc2VkIHBhcmFtKHMpICR7IG5vdFZhbGlkUGFyYW1zLmpvaW4oJywgJykgfSAkeyBub3RWYWxpZFBhcmFtcy5sZW5ndGggPiAxID8gJ2FyZScgOiAnaXMnIH0gbm90IHZhbGlkYDtcclxuICAgICAgU3RhZ2VMb2dnZXIuc3RhZ2VFcnJvckxvZyhTdGFnZS5DSEVDS19QQVJBTVMsIHtlcnJvcjogZXJyTXNnfSk7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19