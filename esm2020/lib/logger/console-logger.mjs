import { LibConfig } from '../config/lib-config';
import { camelCase, capitalize, isEmpty } from 'lodash-es';
/* tslint:disable:variable-name no-console */
export class ConsoleLogger {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaGF0ZW9hcy1jbGllbnQvc3JjL2xpYi9sb2dnZXIvY29uc29sZS1sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUUzRCw2Q0FBNkM7QUFDN0MsTUFBTSxPQUFPLGFBQWE7SUFFakIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFhLEVBQUUsR0FBRyxjQUFxQjtRQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDeEUsT0FBTztTQUNSO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFhLEVBQUUsR0FBRyxjQUFxQjtRQUN4RCxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO1lBQ2pDLE9BQU87U0FDUjtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBYSxFQUFFLEdBQUcsY0FBcUI7UUFDekQsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtZQUNqQyxPQUFPO1NBQ1I7UUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLGNBQWMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENB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cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGliQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2xpYi1jb25maWcnO1xyXG5pbXBvcnQgeyBjYW1lbENhc2UsIGNhcGl0YWxpemUsIGlzRW1wdHkgfSBmcm9tICdsb2Rhc2gtZXMnO1xyXG5cclxuLyogdHNsaW50OmRpc2FibGU6dmFyaWFibGUtbmFtZSBuby1jb25zb2xlICovXHJcbmV4cG9ydCBjbGFzcyBDb25zb2xlTG9nZ2VyIHtcclxuXHJcbiAgcHVibGljIHN0YXRpYyBpbmZvKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgaWYgKCFMaWJDb25maWcuY29uZmlnLmxvZ3MudmVyYm9zZUxvZ3MgJiYgIUxpYkNvbmZpZy5jb25maWcuaXNQcm9kdWN0aW9uKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnNvbGUuaW5mbyhtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHdhcm4obWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICBpZiAoTGliQ29uZmlnLmNvbmZpZy5pc1Byb2R1Y3Rpb24pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS53YXJuKG1lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZXJyb3IobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICBpZiAoTGliQ29uZmlnLmNvbmZpZy5pc1Byb2R1Y3Rpb24pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5lcnJvcihtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2cgaW5mbyBtZXNzYWdlcyBpbiBwcmV0dHkgZm9ybWF0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1lc3NhZ2UgbG9nIG1lc3NhZ2VcclxuICAgKiBAcGFyYW0gcGFyYW1zIGFkZGl0aW9uYWwgcGFyYW1zIGZvciB2ZXJib3NlIGxvZ1xyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgcHJldHR5SW5mbyhtZXNzYWdlOiBzdHJpbmcsIHBhcmFtcz86IG9iamVjdCk6IHZvaWQge1xyXG4gICAgaWYgKCFMaWJDb25maWcuY29uZmlnLmxvZ3MudmVyYm9zZUxvZ3MgJiYgIUxpYkNvbmZpZy5jb25maWcuaXNQcm9kdWN0aW9uKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbXNnID0gYCVjJHsgbWVzc2FnZSB9XFxuYDtcclxuICAgIGNvbnN0IGNvbG9yID0gW1xyXG4gICAgICAnY29sb3I6ICMyMDFBQjM7J1xyXG4gICAgXTtcclxuXHJcbiAgICBpZiAoIWlzRW1wdHkocGFyYW1zKSkge1xyXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwYXJhbXMpKSB7XHJcbiAgICAgICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSAncmVzdWx0Jykge1xyXG4gICAgICAgICAgbXNnICs9IGAlYyR7IGNhcGl0YWxpemUoa2V5KSB9OiAlYyR7IHZhbHVlIH1cXG5gO1xyXG4gICAgICAgICAgY29sb3IucHVzaCgnY29sb3I6ICMzQUE2RDA7JywgJ2NvbG9yOiAjMDBCQTQ1OycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBtc2cgKz0gYCVjJHsgY2FtZWxDYXNlKGtleSkgfTogJWMkeyB2YWx1ZSB9XFxuYDtcclxuICAgICAgICAgIGNvbG9yLnB1c2goJ2NvbG9yOiAjM0FBNkQwOycsICdjb2xvcjogZGVmYXVsdDsnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBDb25zb2xlTG9nZ2VyLmluZm8obXNnLCAuLi5jb2xvcik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2cgcmVzb3VyY2UgaW5mbyBtZXNzYWdlcyBpbiBwcmV0dHkgZm9ybWF0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1lc3NhZ2UgbG9nIG1lc3NhZ2VcclxuICAgKiBAcGFyYW0gcmVzb3VyY2VOYW1lIHJlc291cmNlIG5hbWVcclxuICAgKiBAcGFyYW0gcGFyYW1zIGFkZGl0aW9uYWwgcGFyYW1zIGZvciB2ZXJib3NlIGxvZ1xyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgcmVzb3VyY2VQcmV0dHlJbmZvKHJlc291cmNlTmFtZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIHBhcmFtcz86IG9iamVjdCk6IHZvaWQge1xyXG4gICAgaWYgKCFMaWJDb25maWcuY29uZmlnLmxvZ3MudmVyYm9zZUxvZ3MgJiYgIUxpYkNvbmZpZy5jb25maWcuaXNQcm9kdWN0aW9uKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbXNnID0gYCVjJHsgcmVzb3VyY2VOYW1lIH0gJWMkeyBtZXNzYWdlIH1cXG5gO1xyXG4gICAgY29uc3QgY29sb3IgPSBbXHJcbiAgICAgICdjb2xvcjogI0RBMDA1QzsnLFxyXG4gICAgICAnY29sb3I6ICMyMDFBQjM7J1xyXG4gICAgXTtcclxuXHJcbiAgICBpZiAoIWlzRW1wdHkocGFyYW1zKSkge1xyXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwYXJhbXMpKSB7XHJcbiAgICAgICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSAncmVzdWx0Jykge1xyXG4gICAgICAgICAgbXNnICs9IGAlYyR7IGNhcGl0YWxpemUoa2V5KSB9OiAlYyR7IHZhbHVlIH1cXG5gO1xyXG4gICAgICAgICAgY29sb3IucHVzaCgnY29sb3I6ICMzQUE2RDA7JywgJ2NvbG9yOiAjMDBCQTQ1OycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBtc2cgKz0gYCVjJHsgY2FtZWxDYXNlKGtleSkgfTogJWMkeyB2YWx1ZSB9XFxuYDtcclxuICAgICAgICAgIGNvbG9yLnB1c2goJ2NvbG9yOiAjM0FBNkQwOycsICdjb2xvcjogZGVmYXVsdDsnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBDb25zb2xlTG9nZ2VyLmluZm8obXNnLCAuLi5jb2xvcik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2cgZXJyb3IgbWVzc2FnZXMgaW4gcHJldHR5IGZvcm1hdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBtZXNzYWdlIGxvZyBtZXNzYWdlXHJcbiAgICogQHBhcmFtIHBhcmFtcyBhZGRpdGlvbmFsIHBhcmFtcyBmb3IgdmVyYm9zZSBsb2dcclxuICAgKi9cclxuICBwdWJsaWMgc3RhdGljIHByZXR0eUVycm9yKG1lc3NhZ2U6IHN0cmluZywgcGFyYW1zPzogb2JqZWN0KTogdm9pZCB7XHJcbiAgICBpZiAoTGliQ29uZmlnLmNvbmZpZy5pc1Byb2R1Y3Rpb24pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtc2cgPSBgJWMkeyBtZXNzYWdlIH1cXG5gO1xyXG4gICAgY29uc3QgY29sb3IgPSBbXHJcbiAgICAgICdjb2xvcjogI2RmMDA0ZjsnXHJcbiAgICBdO1xyXG5cclxuICAgIGlmICghaXNFbXB0eShwYXJhbXMpKSB7XHJcbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHBhcmFtcykpIHtcclxuICAgICAgICBpZiAoa2V5LnRvTG93ZXJDYXNlKCkgPT09ICdlcnJvcicpIHtcclxuICAgICAgICAgIG1zZyArPSBgJWMkeyBjYXBpdGFsaXplKGtleSkgfTogJWMkeyB2YWx1ZSB9XFxuYDtcclxuICAgICAgICAgIGNvbG9yLnB1c2goJ2NvbG9yOiAjZGYwMDRmOycsICdjb2xvcjogI2ZmMDAwMDsnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbXNnICs9IGAlYyR7IGNhcGl0YWxpemUoa2V5KSB9OiAlYyR7IHZhbHVlIH1cXG5gO1xyXG4gICAgICAgICAgY29sb3IucHVzaCgnY29sb3I6ICMzQUE2RDA7JywgJ2NvbG9yOiAjMDAwOycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIENvbnNvbGVMb2dnZXIuZXJyb3IobXNnLCAuLi5jb2xvcik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2cgd2FybiBtZXNzYWdlcyBpbiBwcmV0dHkgZm9ybWF0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1lc3NhZ2UgbG9nIG1lc3NhZ2VcclxuICAgKiBAcGFyYW0gcGFyYW1zIGFkZGl0aW9uYWwgcGFyYW1zIGZvciB2ZXJib3NlIGxvZ1xyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgcHJldHR5V2FybihtZXNzYWdlOiBzdHJpbmcsIHBhcmFtcz86IG9iamVjdCk6IHZvaWQge1xyXG4gICAgaWYgKExpYkNvbmZpZy5jb25maWcuaXNQcm9kdWN0aW9uKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbXNnID0gYCVjJHsgbWVzc2FnZSB9XFxuYDtcclxuICAgIGNvbnN0IGNvbG9yID0gW1xyXG4gICAgICAnY29sb3I6ICNmZmJlMDA7J1xyXG4gICAgXTtcclxuXHJcbiAgICBpZiAoIWlzRW1wdHkocGFyYW1zKSkge1xyXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwYXJhbXMpKSB7XHJcbiAgICAgICAgbXNnICs9IGAlYyR7IGNhcGl0YWxpemUoa2V5KSB9OiAlYyR7IHZhbHVlIH1cXG5gO1xyXG4gICAgICAgIGNvbG9yLnB1c2goJ2NvbG9yOiAjM0FBNkQwOycsICdjb2xvcjogIzAwMDsnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIENvbnNvbGVMb2dnZXIud2Fybihtc2csIC4uLmNvbG9yKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==