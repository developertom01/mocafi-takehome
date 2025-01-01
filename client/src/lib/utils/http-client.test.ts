import {
    HttpClient,
    HttpClientRequestError,
    HttpClientResponseError,
} from './http-client';

describe('HttpClient', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should send a POST request', async () => {
        const httpClient = new HttpClient();

        //@ts-expect-error - Mocking fetch
        const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({
                id: 101,
            }),
            ok: true,
            status: 201,
            statusText: 'Created',
        } );

        const response = await httpClient.post(
            'https://jsonplaceholder.typicode.com/posts',
            {
                title: 'foo',
                body: 'bar',
                userId: 1,
            }
        );

        expect(response).toEqual({
            data: {
                id: 101,
            },
            status: 201,
            statusText: 'Created',
        });

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts',
            {
                body: '{"title":"foo","body":"bar","userId":1}',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                method: 'POST',
            }
        );
    });

    test('should send a GET request', async () => {
        const httpClient = new HttpClient();

        //@ts-expect-error - Mocking fetch
        const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({
                id: 101,
            }),
            ok: true,
            status: 200,
            statusText: 'OK',
        });

        const response = await httpClient.get(
            'https://jsonplaceholder.typicode.com/posts'
        );

        expect(response).toEqual({
            data: {
                id: 101,
            },
            status: 200,
            statusText: 'OK',
        });

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                method: 'GET',
            }
        );
    });

    test('should send a DELETE request', async () => {
        const httpClient = new HttpClient();

        //@ts-expect-error - Mocking fetch
        const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({}),
            ok: true,
            status: 204,
            statusText: 'OK',
        } );

        const response = await httpClient.delete(
            'https://jsonplaceholder.typicode.com/posts'
        );

        expect(response).toEqual({
            data: {},
            status: 204,
            statusText: 'OK',
        });

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                method: 'DELETE',
            }
        );
    });

    test('should send a PUT request', async () => {
        const httpClient = new HttpClient();

        //@ts-expect-error - Mocking fetch
        const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({
                id: 101,
            }),
            ok: true,
            status: 200,
            statusText: 'OK',
        });

        const response = await httpClient.put(
            'https://jsonplaceholder.typicode.com/posts',
            {
                title: 'foo',
                body: 'bar',
                userId: 1,
            }
        );

        expect(response).toEqual({
            data: {
                id: 101,
            },
            status: 200,
            statusText: 'OK',
        });

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts',
            {
                body: '{"title":"foo","body":"bar","userId":1}',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                method: 'PUT',
            }
        );
    });

    test('Should overwrite config when passed in constructor', async () => {
        const httpClient = new HttpClient({
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/urlencoded',
                Accept: 'text/html',
            },
        });

        //@ts-expect-error - Mocking fetch
        const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({
                id: 101,
            }),
            ok: true,
            status: 200,
            statusText: 'OK',
        });

        const response = await httpClient.get(
            'https://jsonplaceholder.typicode.com/posts'
        );

        expect(response).toEqual({
            data: {
                id: 101,
            },
            status: 200,
            statusText: 'OK',
        });

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts',
            {
                headers: {
                    'Content-Type': 'application/urlencoded',
                    Accept: 'text/html',
                },
                credentials: 'omit',
                method: 'GET',
            }
        );
    });

    test('Should overwrite config when passed in method function ', async () => {
        const httpClient = new HttpClient({
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/urlencoded',
                Accept: 'text/html',
            },
        });

        //@ts-expect-error - Mocking fetch
        const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({
                id: 101,
            }),
            ok: true,
            status: 200,
            statusText: 'OK',
        });

        const response = await httpClient.get(
            'https://jsonplaceholder.typicode.com/posts',
            {
                headers: {
                    'Content-Type': 'application/urlencoded+html',
                    Accept: 'text/html+json',
                },
                credentials: 'include',
            }
        );

        expect(response).toEqual({
            data: {
                id: 101,
            },
            status: 200,
            statusText: 'OK',
        });

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts',
            {
                headers: {
                    'Content-Type': 'application/urlencoded+html',
                    Accept: 'text/html+json',
                },
                credentials: 'include',
                method: 'GET',
            }
        );
    });

    test('Should throw `HttpClientResponseError` when `ok` is false and status is 4xx  ', async () => {
        const httpClient = new HttpClient();

        // @ts-expect-error - Mocking fetch
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({
                id: 101,
            }),
            ok: false,
            status: 400,
            statusText: 'Bad Request',
        });

        await expect(
            httpClient.get('https://jsonplaceholder.typicode.com/posts')
        ).rejects.toThrow(
            new HttpClientResponseError('Bad Request', 400, { id: 101 })
        );
    });

    test('Should throw `HttpClientRequestError` when random error occurs', async () => {
        const httpClient = new HttpClient();

        //Mock fetch
        jest.spyOn(global, 'fetch').mockRejectedValue(
            new Error('Network Error')
        );

        await expect(
            httpClient.get('https://jsonplaceholder.typicode.com/posts')
        ).rejects.toThrow(new HttpClientRequestError('Network Error'));
    });

    test('Should retry when 500 response is returned', async () => {
        const httpClient = new HttpClient();

        // @ts-expect-error - Mocking fetch
        const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({
                id: 101,
            }),
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        });

        await expect(
            httpClient.get('https://jsonplaceholder.typicode.com/posts', {
                retry: {
                    retries: 3,
                    retryDelay: 50,
                    statusCodes: [500, 502, 503, 504],
                    startingDelay: 100,
                },
            })
        ).rejects.toThrow(
            new HttpClientResponseError('Internal Server Error', 500, {
                id: 101,
            })
        );

        expect(mockedFetch).toHaveBeenCalledTimes(3);
    });
});