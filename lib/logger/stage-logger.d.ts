import { Stage } from './stage.enum';
/**
 * Simplify logger calls.
 */
export declare class StageLogger {
    static resourceBeginLog(resource: object | string, method: string, params?: object): void;
    static resourceEndLog(resource: object | string, method: string, params: object): void;
    static stageLog(stage: Stage, params: object): void;
    static stageErrorLog(stage: Stage, params: object): void;
    static stageWarnLog(stage: Stage, params: object): void;
    private static prepareParams;
}
