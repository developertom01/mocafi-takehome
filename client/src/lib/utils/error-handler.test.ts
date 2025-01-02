import { handleHttpError } from "./error-handler";
import { HttpClientRequestError, HttpClientResponseError } from "./http-client";

describe('error-handler', () => {
    describe('handleHttpError', () => {
        it('should return a message for a HttpClientRequestError', () => {
            const error = new HttpClientRequestError('An error occurred while making the request');
            const result = handleHttpError(error);
            expect(result.message).toEqual('An error occurred while making the request');
        });

        it('should return a message and data for a HttpClientResponseError', () => {
            const error = new HttpClientResponseError('An error occurred while making the request',400, { message: 'An error occurred while making the request' });
            const result = handleHttpError(error);
            expect(result.message).toEqual('An error occurred while making the request');
            expect(result.data).toEqual({ message: 'An error occurred while making the request' });
        });

        it('should return a message for an unexpected error', () => {
            const error = new Error('An unexpected error occurred');
            const result = handleHttpError(error);
            expect(result.message).toEqual('An unexpected error occurred');
        });
    });
});