export declare class ValidationUtils {
    /**
     * Checks that passed object with params has all valid params.
     * Params should not has null, undefined, empty object, empty string values.
     *
     * @param params object with params to check
     * @throws error if any params are not defined
     */
    static validateInputParams(params: object): void;
}
