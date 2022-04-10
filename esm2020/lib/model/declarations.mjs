export var Include;
(function (Include) {
    Include["NULL_VALUES"] = "NULL_VALUES";
})(Include || (Include = {}));
/**
 * Supported http methods for custom query.
 */
export var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
})(HttpMethod || (HttpMethod = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjbGFyYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWhhdGVvYXMtY2xpZW50L3NyYy9saWIvbW9kZWwvZGVjbGFyYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWdLQSxNQUFNLENBQU4sSUFBWSxPQUVYO0FBRkQsV0FBWSxPQUFPO0lBQ2pCLHNDQUEyQixDQUFBO0FBQzdCLENBQUMsRUFGVyxPQUFPLEtBQVAsT0FBTyxRQUVsQjtBQXdCRDs7R0FFRztBQUNILE1BQU0sQ0FBTixJQUFZLFVBRVg7QUFGRCxXQUFZLFVBQVU7SUFDcEIseUJBQVcsQ0FBQTtJQUFFLDJCQUFhLENBQUE7SUFBRSx5QkFBVyxDQUFBO0lBQUUsNkJBQWUsQ0FBQTtBQUMxRCxDQUFDLEVBRlcsVUFBVSxLQUFWLFVBQVUsUUFFckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2UvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBCYXNlUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlL2Jhc2UtcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBFbWJlZGRlZFJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZS9lbWJlZGRlZC1yZXNvdXJjZSc7XHJcbmltcG9ydCB7IEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuLyoqXHJcbiAqIFJlc291cmNlIGxpbmsgb2JqZWN0LlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBMaW5rIHtcclxuICAvKipcclxuICAgKiBMaW5rIG5hbWUuXHJcbiAgICovXHJcbiAgW2tleTogc3RyaW5nXTogTGlua0RhdGE7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGlua0RhdGEge1xyXG4gIC8qKlxyXG4gICAqIExpbmsgdXJsLlxyXG4gICAqL1xyXG4gIGhyZWY6IHN0cmluZztcclxuICAvKipcclxuICAgKiB7QGNvZGUgdHJ1ZX0gaWYgPGI+aHJlZjwvYj4gaGFzIHRlbXBsYXRlLCB7QGNvZGUgZmFsc2V9IG90aGVyd2lzZS5cclxuICAgKi9cclxuICB0ZW1wbGF0ZWQ/OiBib29sZWFuO1xyXG59XHJcblxyXG4vKipcclxuICogSW50ZXJmYWNlIHRoYXQgYWxsb3dzIHRvIGlkZW50aWZ5IHRoYXQgb2JqZWN0IGlzIHJlc291cmNlIHdoZW4gaXQgaXMgaGFzIGEgbGlua3Mgb2JqZWN0LlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZUlkZW50aWZpYWJsZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3Qgb2YgbGlua3MgcmVsYXRlZCB3aXRoIHRoZSByZXNvdXJjZS5cclxuICAgKi9cclxuICBfbGlua3M6IExpbms7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIdHRwIG9wdGlvbnMgdGhhdCB1c2VkIGJ5IEFuZ3VsYXIgSHR0cENsaWVudC5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSHR0cENsaWVudE9wdGlvbnMge1xyXG4gIGhlYWRlcnM/OiBIdHRwSGVhZGVycyB8IHtcclxuICAgIFtoZWFkZXI6IHN0cmluZ106IHN0cmluZyB8IHN0cmluZ1tdO1xyXG4gIH07XHJcbiAgb2JzZXJ2ZT86ICdib2R5JyB8ICdyZXNwb25zZSc7XHJcbiAgcGFyYW1zPzogSHR0cFBhcmFtcztcclxuICByZXBvcnRQcm9ncmVzcz86IGJvb2xlYW47XHJcbiAgcmVzcG9uc2VUeXBlPzogJ2pzb24nO1xyXG4gIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHRlbmQge0BsaW5rIEdldE9wdGlvbn0gd2l0aCBwYWdlIHBhcmFtLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBQYWdlZEdldE9wdGlvbiBleHRlbmRzIEdldE9wdGlvbiB7XHJcbiAgcGFnZVBhcmFtcz86IFBhZ2VQYXJhbTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnRhaW5zIG9wdGlvbnMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBQT1NUL1BVVC9QQVRDSC9ERUxFVEUgcmVxdWVzdC5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdE9wdGlvbiB7XHJcbiAgcGFyYW1zPzogUmVxdWVzdFBhcmFtO1xyXG4gIGhlYWRlcnM/OiBIdHRwSGVhZGVycyB8IHtcclxuICAgIFtoZWFkZXI6IHN0cmluZ106IHN0cmluZyB8IHN0cmluZ1tdO1xyXG4gIH07XHJcbiAgb2JzZXJ2ZT86ICdib2R5JyB8ICdyZXNwb25zZSc7XHJcbiAgcmVwb3J0UHJvZ3Jlc3M/OiBib29sZWFuO1xyXG4gIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb250YWlucyBhZGRpdGlvbmFsIG9wdGlvbnMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byB0aGUgR0VUIHJlcXVlc3QuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEdldE9wdGlvbiBleHRlbmRzIFJlcXVlc3RPcHRpb24ge1xyXG4gIC8qKlxyXG4gICAqIFNvcnRpbmcgb3B0aW9ucy5cclxuICAgKi9cclxuICBzb3J0PzogU29ydDtcclxuICB1c2VDYWNoZT86IGJvb2xlYW47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXF1ZXN0IHBhcmFtcyB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVzdWx0IHVybCBhcyBodHRwIHJlcXVlc3QgcGFyYW1zLlxyXG4gKlxyXG4gKiBTaG91bGQgbm90IGNvbnRhaW5zIHBhcmFtcyBhczogJ3Byb2plY3Rpb24nIGFuZCB7QGxpbmsgUGFnZVBhcmFtfSBwcm9wZXJ0aWVzLlxyXG4gKiBJZiB3YW50IHBhc3MgdGhpcyBwYXJhbXMgdGhlbiB1c2Ugc3VpdGFibGUgcHJvcGVydGllcyBmcm9tIHtAbGluayBHZXRPcHRpb259IG9yIHtAbGluayBQYWdlZEdldE9wdGlvbn0sXHJcbiAqIG90aGVyd2lzZSBleGNlcHRpb24gd2lsbCBiZSB0aHJvd24uXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RQYXJhbSB7XHJcbiAgW3BhcmFtTmFtZTogc3RyaW5nXTogUmVzb3VyY2UgfCBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgQXJyYXk8c3RyaW5nPiB8IEFycmF5PG51bWJlcj47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQYWdlIGNvbnRlbnQgcGFyYW1zLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBQYWdlUGFyYW0ge1xyXG4gIC8qKlxyXG4gICAqIE51bWJlciBvZiBwYWdlLlxyXG4gICAqL1xyXG4gIHBhZ2U/OiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhZ2Ugc2l6ZS5cclxuICAgKi9cclxuICBzaXplPzogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogUGFnZSBwYXJhbXMgd2l0aCBzb3J0IG9wdGlvbi5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgU29ydGVkUGFnZVBhcmFtIHtcclxuICAvKipcclxuICAgKiBQYWdlIGNvbnRlbnQgcGFyYW1zLlxyXG4gICAqL1xyXG4gIHBhZ2VQYXJhbXM/OiBQYWdlUGFyYW07XHJcbiAgLyoqXHJcbiAgICogU29ydGluZyBvcHRpb25zLlxyXG4gICAqL1xyXG4gIHNvcnQ/OiBTb3J0O1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBTb3J0T3JkZXIgPSAnREVTQycgfCAnQVNDJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU29ydCB7XHJcbiAgLyoqXHJcbiAgICogTmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gc29ydC5cclxuICAgKi9cclxuICBbcHJvcGVydHlUb1NvcnQ6IHN0cmluZ106IFNvcnRPcmRlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFBhZ2UgcmVzb3VyY2UgcmVzcG9uc2UgZnJvbSBTcHJpbmcgYXBwbGljYXRpb24uXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2VEYXRhIHtcclxuICBwYWdlOiB7XHJcbiAgICBzaXplOiBudW1iZXI7XHJcbiAgICB0b3RhbEVsZW1lbnRzOiBudW1iZXI7XHJcbiAgICB0b3RhbFBhZ2VzOiBudW1iZXI7XHJcbiAgICBudW1iZXI6IG51bWJlcjtcclxuICB9O1xyXG4gIF9saW5rcz86IHtcclxuICAgIGZpcnN0OiB7XHJcbiAgICAgIGhyZWY6IHN0cmluZ1xyXG4gICAgfTtcclxuICAgIHByZXY/OiB7XHJcbiAgICAgIGhyZWY6IHN0cmluZ1xyXG4gICAgfTtcclxuICAgIHNlbGY6IHtcclxuICAgICAgaHJlZjogc3RyaW5nXHJcbiAgICB9O1xyXG4gICAgbmV4dD86IHtcclxuICAgICAgaHJlZjogc3RyaW5nXHJcbiAgICB9O1xyXG4gICAgbGFzdDoge1xyXG4gICAgICBocmVmOiBzdHJpbmdcclxuICAgIH07XHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gSW5jbHVkZSB7XHJcbiAgTlVMTF9WQUxVRVMgPSAnTlVMTF9WQUxVRVMnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbmNsdWRlIG9wdGlvbnMgdGhhdCBhbGxvdyBjb25maWd1cmUgc2hvdWxkIGluY2x1ZGUgb3Igbm90IHNvbWUgc3BlY2lmaWMgdmFsdWVzXHJcbiAqIChlLnEuIG51bGwgdmFsdWVzKS5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVzT3B0aW9uIHtcclxuICBpbmNsdWRlOiBJbmNsdWRlO1xyXG59XHJcblxyXG4vKipcclxuICogUmVxdWVzdCBib2R5IG9iamVjdC5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdEJvZHk8VD4ge1xyXG4gIC8qKlxyXG4gICAqIEFueSBvYmplY3QgdGhhdCB3aWxsIGJlIHBhc3NlZCBhcyByZXF1ZXN0IGJvZHkuXHJcbiAgICovXHJcbiAgYm9keTogVDtcclxuICAvKipcclxuICAgKiBVc2UgdGhpcyBwYXJhbSB0byBpbmZsdWVuY2Ugb24gYm9keSB2YWx1ZXMgdGhhdCB5b3Ugd2FudCBpbmNsdWRlIG9yIG5vdC5cclxuICAgKi9cclxuICB2YWx1ZXNPcHRpb24/OiBWYWx1ZXNPcHRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTdXBwb3J0ZWQgaHR0cCBtZXRob2RzIGZvciBjdXN0b20gcXVlcnkuXHJcbiAqL1xyXG5leHBvcnQgZW51bSBIdHRwTWV0aG9kIHtcclxuICBHRVQgPSAnR0VUJywgUE9TVCA9ICdQT1NUJywgUFVUID0gJ1BVVCcsIFBBVENIID0gJ1BBVENIJ1xyXG59XHJcblxyXG50eXBlIE5vblJlc291cmNlUHJvcGVydHlUeXBlPFQ+ID0ge1xyXG4gIFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgQmFzZVJlc291cmNlID8gbmV2ZXIgOiBLO1xyXG59W2tleW9mIFRdO1xyXG5cclxuLyoqXHJcbiAqIFR5cGUgdGhhdCBhbGxvd2VkIHJlcHJlc2VudCByZXNvdXJjZSByZWxhdGlvbnMgYXMgcmVzb3VyY2UgcHJvamVjdGlvbiBleGNsdWRpbmcge0BsaW5rIFJlc291cmNlfSxcclxuICoge0BsaW5rIEVtYmVkZGVkUmVzb3VyY2V9IHByb3BzIGFuZCBtZXRob2RzIGZyb20gY3VycmVudCB0eXBlLlxyXG4gKi9cclxuZXhwb3J0IHR5cGUgUHJvamVjdGlvblJlbFR5cGU8VCBleHRlbmRzIEJhc2VSZXNvdXJjZT4gPVxyXG4gIFBpY2s8VCwgRXhjbHVkZTxrZXlvZiBULCBrZXlvZiBSZXNvdXJjZSB8IGtleW9mIEVtYmVkZGVkUmVzb3VyY2U+ICYgTm9uUmVzb3VyY2VQcm9wZXJ0eVR5cGU8VD4+O1xyXG4iXX0=