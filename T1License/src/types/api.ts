// API响应状态码枚举
export enum ApiStatusCode {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ValidationError = 422,
  InternalServerError = 500,
  ServiceUnavailable = 503,

  // 业务状态码
  TokenExpired = 1001,
  ActivationCodeExpired = 1002,
  DataNotExists = 1003,
  DataAlreadyExists = 1004,
  OperationFailed = 1005,
}

// 错误详情接口
export interface ErrorDetail {
  errorCode: string;
  errorMessage: string;
  stackTrace?: string;
  validationErrors?: Record<string, string[]>;
}

// API响应通用接口
export interface ApiResponse<T> {
  code: number;
  message: string;
  traceId: string;
  timestamp: number;
  data: T;
  error?: ErrorDetail;
  pagination: any;
  sort: any;
  filter: any;
}
