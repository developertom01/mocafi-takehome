import { backOff } from 'exponential-backoff';
import { merge } from 'lodash';
import { API_URL } from '../config';

// Type definitions
type HttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'OPTIONS'
    | 'HEAD';

export interface RetryConfig {
    /**
     * Maximum number of retries
     *  @required
     */
    retries: number;
    /**
     * Maximum delay between retries in milliseconds
     * @required
     */
    retryDelay: number;
    /**
     * Status codes to retry on
     * @required
     */
    statusCodes: number[];
    /**
     * Starting delay between retries in milliseconds
     * @optional
     */
    startingDelay?: number;
    /**
     * Add jitter to the retry delay
     * @optional
     */
    jitter?: boolean;
    /**
     * Delay the first attempt
     * @optional
     */
    delayFirstAttempt?: boolean;
    /**
     * Multiply the delay by a factor
     * @optional
     */
    timeMultiple?: number;
}

export interface RequestConfig {
    headers?: Record<string, string>;
    /**
     * The request credentials you want to use for the request
     * @default 'same-origin'
     * @optional
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     */
    credentials?: RequestCredentials;
    signal?: AbortSignal;
    /**
     * Retry configuration
     * @optional
     * @see RetryConfig
     */
    retry?: RetryConfig;
}

// HttpClient interface
export interface IHttpClient {
    request<Payload, Response extends object>(
        method: HttpMethod,
        url: string,
        body?: Payload
    ): Promise<HttpClientResponse<Response>>;

    get<Response extends object>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpClientResponse<Response>>;

    post<Payload, Response extends object>(
        url: string,
        body: Payload,
        config?: RequestConfig
    ): Promise<HttpClientResponse<Response>>;

    put<Payload, Response extends object>(
        url: string,
        body: Payload,
        config?: RequestConfig
    ): Promise<HttpClientResponse<Response>>;

    patch<Payload, Response extends object>(
        url: string,
        body: Payload,
        config?: RequestConfig
    ): Promise<HttpClientResponse<Response>>;

    delete<Response extends object>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpClientResponse<Response>>;

    options<Response extends object>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpClientResponse<Response>>;

    head<Response extends object>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpClientResponse<Response>>;
}

// HttpClientException classes
export interface HttpClientResponse<
    Data extends object = Record<string, unknown>,
> {
    status: number;
    statusText: string;
    data: Data;
}

export class HttpClientBaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HttpClientError';
    }
}

/**
 * HttpClientResponseError is thrown when the response status code is not ok
 * @param Data
 */

export class HttpClientResponseError<
    Data extends object = Record<string, unknown>,
> extends HttpClientBaseError {
    public readonly data?: Data;
    public readonly status: number;

    constructor(message: string, status: number, data?: Data) {
        super(message);
        this.name = 'HttpClientError';
        this.status = status;
        this.data = data;
    }
}

/**
 * HttpClientRequestError is thrown when there is an error in the request
 * @param message
 */
export class HttpClientRequestError extends HttpClientBaseError {
    constructor(message: string) {
        super(message);
        this.name = 'HttpClientError';
    }
}

/**
 *  HttpClient is a wrapper around fetch API that provides a simple interface to make HTTP requests.
 *  It also provides a retry mechanism to retry requests based on the status code.
 *  Heavy typescript usage is used to provide a type-safe interface.
 */
export class HttpClient implements IHttpClient {
    private readonly _baseUrl: string;

    constructor(requestConfig?: RequestConfig, baseUrl?: string) {
        merge(this._requestConfig, requestConfig);
        this._baseUrl = baseUrl ?? API_URL;
    }

    private readonly _requestConfig: RequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'same-origin',
    };

    /**
     * Set Config for HttpClient
     * This will merge the provided config with the existing config and override the existing values
     * @param requestConfig
     */
    public setRequestConfig(requestConfig: RequestConfig) {
        merge(this._requestConfig, requestConfig);
    }

    private getBaseUrl(pathOrFullUrl: string): string {
        if (pathOrFullUrl.startsWith('http')) {
            return pathOrFullUrl;
        }

        return `${this._baseUrl}${pathOrFullUrl}`;
    }

    private jsonSerialize<T>(data: T): string {
        try {
            return JSON.stringify(data);
        } catch (error) {
            throw new HttpClientRequestError(
                'Failed to serialize data to JSON'
            );
        }
    }

    private async _applyRetryPolicy<Response>(
        request: () => Promise<Response>
    ): Promise<Response> {
        const response = await backOff(() => request(), {
            maxDelay: this._requestConfig.retry!.retryDelay,
            numOfAttempts: this._requestConfig.retry!.retries,
            startingDelay: this._requestConfig.retry!.startingDelay,
            jitter: this._requestConfig.retry!.jitter ? 'full' : 'none',
            delayFirstAttempt: this._requestConfig.retry!.delayFirstAttempt,
            timeMultiple: this._requestConfig.retry!.timeMultiple,
            retry: e => {
                if (
                    e instanceof HttpClientResponseError &&
                    this._requestConfig.retry?.statusCodes.includes(e.status)
                ) {
                    return true;
                }

                return false;
            },
        });

        return response;
    }

    private async _request<Payload, Response extends object>(
        method: HttpMethod,
        url: string,
        body?: Payload,
        config?: RequestConfig
    ): Promise<HttpClientResponse<Response>> {
        url = this.getBaseUrl(url);

        if (config) {
            merge(this._requestConfig, config);
        }

        // Request function
        const req = async () => {
            try {
                const response = await fetch(url, {
                    method,
                    body: this.jsonSerialize(body),
                    headers: this._requestConfig.headers,
                    credentials: this._requestConfig.credentials,
                    signal: this._requestConfig.signal,
                });
                const data = (await response.json()) as Response;
                if (response.ok) {
                    return {
                        status: response.status,
                        statusText: response.statusText,
                        data,
                    };
                } else {
                    throw new HttpClientResponseError(
                        response.statusText,
                        response.status,
                        data
                    );
                }
            } catch (error) {
                if (error instanceof HttpClientBaseError) {
                    throw error;
                }
                throw new HttpClientRequestError((error as Error).message);
            }
        };

        let response: HttpClientResponse<Response>;
        // Apply retry policy if retry config is provided
        if (this._requestConfig.retry) {
            response = await this._applyRetryPolicy(req);
        } else {
            response = await req();
        }

        return response;
    }

    /**
     * Generic request method
     * @param method
     * @param url
     * @param body
     * @example
     * const response = await httpClient.request<AppleTokenRequest, AppleTokenResponse>('POST', 'https://example.com', {
     *   headers: {
     *    Authorization: 'Bearer token ',
     *  },
     * body: {
     *  client_id: 'client_id',
     *  client_secret: 'client_secret',
     *  grant_type: 'client_credentials',
     *  },
     * });
     */
    public request<Payload, Response extends object>(
        method: HttpMethod,
        url: string,
        body?: Payload
    ) {
        return this._request<Payload, Response>(method, url, body);
    }

    /**
     *  * GET request
     *
     * @param url
     * @param config
     * @returns
     *
     * @example
     * const abortController = new AbortController();
     * const signal = abortController.signal;
     * const response = await httpClient.get<AppleTokenResponse>('https://example.com', {
     *    headers: {
     *      Authorization: 'Bearer token',
     *   },
     *  signal,
     *  credentials: 'same-origin',
     * });
     */
    public get<Response extends object>(url: string, config?: RequestConfig) {
        return this._request<undefined, Response>(
            'GET',
            url,
            undefined,
            config
        );
    }

    /**
     * POST request
     *
     * @param url
     * @param body
     * @param config
     * @returns
     *
     * @example
     * const response = await httpClient.post<AppleTokenRequest, AppleTokenResponse>('https://example.com', {
     *   headers: {
     *    Authorization: 'Bearer token ',
     *  },
     * body: {
     *  client_id: 'client_id',
     *  client_secret: 'client_secret',
     *  grant_type: 'client_credentials',
     *  },
     * });
     */
    public post<Payload, Response extends object>(
        url: string,
        body: Payload,
        config?: RequestConfig
    ) {
        return this._request<Payload, Response>('POST', url, body, config);
    }

    /**
     * PUT request
     * @param url
     * @param body
     * @param config
     * @returns
     * @example
     * const response = await httpClient.put<AppleTokenRequest, AppleTokenResponse>('https://example.com', {
     *  headers: {
     *   Authorization: 'Bearer token',
     * },
     * body: {
     *  client_id: 'client_id',
     *  client_secret: 'client_secret',
     *  grant_type: 'client_credentials',
     * },
     * });
     * */
    public put<Payload, Response extends object>(
        url: string,
        body: Payload,
        config?: RequestConfig
    ) {
        return this._request<Payload, Response>('PUT', url, body, config);
    }

    /**
     * PATCH request
     * @param url
     * @param body
     * @param config
     * @returns
     * @example
     * const response = await httpClient.patch<AppleTokenRequest, AppleTokenResponse>('https://example.com', {
     *  headers: {
     *   Authorization: 'Bearer token',
     * },
     * body: {
     *  client_id: 'client_id',
     *  client_secret: 'client_secret',
     *  grant_type: 'client_credentials',
     * },
     * });
     * */
    public patch<Payload, Response extends object>(
        url: string,
        body: Payload,
        config?: RequestConfig
    ) {
        return this._request<Payload, Response>('PATCH', url, body, config);
    }

    /**
     * DELETE request
     * @param url
     * @param config
     * @returns
     * @example
     * const response = await httpClient.delete<AppleTokenResponse>('https://example.com', {
     *  headers: {
     *   Authorization: 'Bearer token',
     * },
     * });
     * */
    public delete<Response extends object>(
        url: string,
        config?: RequestConfig
    ) {
        return this._request<undefined, Response>(
            'DELETE',
            url,
            undefined,
            config
        );
    }

    /**
     * OPTIONS request
     * @param url
     * @param config
     * @returns
     * @example
     * const response = await httpClient.options<AppleTokenResponse>('https://example.com', {
     *  headers: {
     *   Authorization: 'Bearer token',
     * },
     * });
     * */
    public options<Response extends object>(
        url: string,
        config?: RequestConfig
    ) {
        return this._request<undefined, Response>(
            'OPTIONS',
            url,
            undefined,
            config
        );
    }

    /**
     * HEAD request
     * @param url
     * @param config
     * @returns
     * @example
     * const response = await httpClient.head<AppleTokenResponse>('https://example.com', {
     *  headers: {
     *   Authorization: 'Bearer token',
     * },
     * });
     * */
    public head<Response extends object>(url: string, config?: RequestConfig) {
        return this._request<undefined, Response>(
            'HEAD',
            url,
            undefined,
            config
        );
    }
}

// Export default instance of HttpClient
const instance = new HttpClient();
export default instance;