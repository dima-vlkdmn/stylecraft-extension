import { HttpMethod, RequestData, RequestConfig, InstanceConfig, RequestError, RequestHeaders, RequestResponse, ContentType } from './types';

class Apium {
  private baseUrl: string;
  private headers: RequestHeaders;
  private hooks: RequestConfig<any>['hooks'];
  private retryConfig: InstanceConfig['retry'];
  private customFetch?: (path: string, method: HttpMethod, data: RequestData, config: RequestConfig<any>) => Promise<Response>;

  constructor(config: InstanceConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.headers = config.headers || {};
    this.hooks = config.hooks || {};
    this.retryConfig = config.retry || {};
    this.customFetch = config.fetch;
  }

  public request<T extends any>(path: string, method: HttpMethod, data: RequestData = {}, config: RequestConfig<T> = {}): Promise<RequestResponse<T>> {
    return this.requestWithRetry(path, method, data, config, this.retryConfig?.count || 0);
  }

  public get<T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) {
    return this.request<T>(path, HttpMethod.GET, data, config);
  }

  public post<T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) {
    return this.request(path, HttpMethod.POST, data, config);
  }

  public put<T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) {
    return this.request(path, HttpMethod.PUT, data, config);
  }

  public delete<T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) {
    return this.request(path, HttpMethod.DELETE, data, config);
  }

  public patch<T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) {
    return this.request(path, HttpMethod.PATCH, data, config);
  }

  private async requestWithRetry<T>(path: string, method: HttpMethod, data: RequestData, config: RequestConfig<T>, retries: number): Promise<RequestResponse<T>> {
    const url = this.buildUrl(path, data.pathParams, data.queryParams);

    let combinedConfig: RequestConfig<T> = this.combineConfigs<T>(config);

    if (this.hooks?.onRequest) {
      combinedConfig = await this.applyHooks(this.hooks.onRequest, combinedConfig);
    }

    let response = this.customFetch
      ? await this.customFetch(path, method, data, config)
      : await fetch(url, {
        method,
        headers: combinedConfig.headers,
        body: this.processRequestBody(data.body, combinedConfig.headers),
      });

    if (!response.ok) {
      if (retries > 0 && combinedConfig.retry?.condition && combinedConfig.retry?.condition(response)) {
        if (combinedConfig.retry?.callback) {
          await combinedConfig.retry.callback(response);
        }

        return this.requestWithRetry(path, method, data, config, retries - 1);
      }

      let error: RequestError<T> = {
        status: response.status,
        statusText: response.statusText,
        requestData: data,
        requestConfig: combinedConfig,
        response,
      };

      if (this.hooks?.onError) {
        error = await this.applyHooks(this.hooks.onError, error);
      }

      throw error;
    }

    let requestResponse: RequestResponse<T> = {
      status: response.status,
      statusText: response.statusText,
      data: await this.processResponseData(response),
      headers: this.processResponseHeaders(response.headers)
    };

    if (this.hooks?.onResponse) {
      requestResponse = await this.applyHooks(this.hooks.onResponse, requestResponse);
    }

    return requestResponse;
  }

  private buildUrl(path: string, pathParams?: Record<string, any>, queryParams?: Record<string, any>): string {
    if (pathParams) {
      for (const [key, value] of Object.entries(pathParams)) {
        path = path.replace(`:${key}`, encodeURIComponent(value));
      }
    }

    if (queryParams) {
      const queryString = new URLSearchParams(queryParams).toString();

      path = `${path}?${queryString}`;
    }

    return this.baseUrl + path;
  }

  private combineConfigs<T>(requestConfig: RequestConfig<T>): RequestConfig<T> {
    return { 
      headers: { ...this.headers, ...requestConfig.headers },
      hooks: { 
        onRequest: [...(this.hooks?.onRequest || []), ...(requestConfig.hooks?.onRequest || [])],
        onResponse: [...(this.hooks?.onResponse || []), ...(requestConfig.hooks?.onResponse || [])],
        onError: [...(this.hooks?.onError || []), ...(requestConfig.hooks?.onError || [])]
      },
      retry: { ...(this.retryConfig || {}), ...(requestConfig.retry || {}) }
    };
  }

  private async applyHooks(hooks: Array<Function>, arg: any): Promise<any> {
    let result = arg;

    for (const hook of hooks) {
      result = await hook(result);
    }

    return result;
  }

  private processRequestBody(body: any, headers?: RequestHeaders): any {
    const contentType = headers?.['Content-Type'];

    if (!contentType) {
      return body;
    }

    if (contentType.includes(ContentType.JSON)) {
      return JSON.stringify(body);
    }

    return body;
  }

  private async processResponseData(response: Response): Promise<any> {
    const contentType = response.headers.get('Content-Type');

    if (!contentType) {
      return await response.text();
    }

    if (contentType.includes(ContentType.JSON)) {
      return await response.json();
    }

    if (contentType.includes(ContentType.TEXT) || contentType.includes(ContentType.XML)) {
      return await response.text();
    }

    if (contentType.includes(ContentType.APPLICATION) 
      || contentType.includes(ContentType.IMAGE) 
      || contentType.includes(ContentType.AUDIO) 
      || contentType.includes(ContentType.VIDEO)) {
      return await response.blob();
    }

    return await response.text();
  }

  private processResponseHeaders(headers: Headers): RequestHeaders {
    const result: RequestHeaders = {};

    headers.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }
}

const defaultInstance = new Apium({});

const createInstance = (config: InstanceConfig = {}) => new Apium(config);

const request = <T extends any>(path: string, method: HttpMethod, data: RequestData = {}, config: RequestConfig<T> = {}) => defaultInstance.request(path, method, data, config);

const get = <T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) => defaultInstance.get(path, data, config);

const post = <T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) => defaultInstance.post(path, data, config);

const put = <T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) => defaultInstance.put(path, data, config);

const del = <T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) => defaultInstance.delete(path, data, config);

const patch = <T extends any>(path: string, data: RequestData = {}, config: RequestConfig<T> = {}) => defaultInstance.patch(path, data, config);

const apium = {
  instance: createInstance,
  request,
  get,
  post,
  put,
  delete: del,
  patch
};

export { apium };

export * from './types';
