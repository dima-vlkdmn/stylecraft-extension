enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

enum HttpStatus {
  CONTINUE_100 = 100,
  SWITCHING_PROTOCOLS_101 = 101,

  OK_200 = 200,
  CREATED_201 = 201,
  ACCEPTED_202 = 202,
  NO_CONTENT_204 = 204,

  MOVED_PERMANENTLY_301 = 301,
  FOUND_302 = 302,
  NOT_MODIFIED_304 = 304,
  TEMPORARY_REDIRECT_307 = 307,
  PERMANENT_REDIRECT_308 = 308,

  BAD_REQUEST_400 = 400,
  UNAUTHORIZED_401 = 401,
  FORBIDDEN_403 = 403,
  NOT_FOUND_404 = 404,
  METHOD_NOT_ALLOWED_405 = 405,
  CONFLICT_409 = 409,
  GONE_410 = 410,
  PRECONDITION_FAILED_412 = 412,
  PAYLOAD_TOO_LARGE_413 = 413,
  UNSUPPORTED_MEDIA_TYPE_415 = 415,
  TOO_MANY_REQUESTS_429 = 429,

  INTERNAL_SERVER_ERROR_500 = 500,
  NOT_IMPLEMENTED_501 = 501,
  BAD_GATEWAY_502 = 502,
  SERVICE_UNAVAILABLE_503 = 503,
  GATEWAY_TIMEOUT_504 = 504,
}

enum ContentType {
  JSON = 'application/json',
  XML = 'application/xml',
  MULTIPART_FORM_DATA = 'multipart/form-data',
  TEXT = 'text/',
  APPLICATION = 'application/',
  IMAGE = 'image/',
  AUDIO = 'audio/',
  VIDEO = 'video/',
}

interface RequestData {
  pathParams?: Record<string, any>;
  queryParams?: Record<string, any>;
  body?: any;
}

type Hook<T> = (info: T) => Promise<T> | T;

type Hooks<T> = Array<Hook<T>>;

type RequestHeaders = Record<string, string>;

interface RequestConfig<T> {
  headers?: RequestHeaders;
  hooks?: {
    onRequest?: Hooks<RequestConfig<T>>;
    onResponse?: Hooks<RequestResponse<T>>;
    onError?: Hooks<RequestError<T>>;
  };
  retry?: {
    count?: number;
    condition?: (response: Response) => boolean;
    callback?: (response: Response) => Promise<void>;
  };
}

interface RequestResponse<T> {
  status: HttpStatus | number;
  statusText: string;
  data: T;
  headers: RequestHeaders;
}

interface RequestError<T> {
  status: HttpStatus | number;
  statusText: string;
  requestData: RequestData;
  requestConfig: RequestConfig<T>;
  response: Response;
}

interface InstanceConfig extends RequestConfig<any> {
  baseUrl?: string;
  fetch?: (path: string, method: HttpMethod, data: RequestData, config: RequestConfig<any>) => Promise<Response>;
}

export { 
  HttpMethod, 
  HttpStatus, 
  ContentType,
  RequestHeaders, 
  RequestData, 
  RequestConfig, 
  RequestResponse, 
  RequestError, 
  InstanceConfig,
};
