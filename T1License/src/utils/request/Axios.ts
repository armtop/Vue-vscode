import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';
import throttle from 'lodash/throttle';
import { stringify } from 'qs';

import { ContentTypeEnum } from '@/constants';
import { ApiStatusCode } from '@/types/api';
import { AxiosRequestConfigRetry, RequestOptions, Result } from '@/types/axios';

import { AxiosCanceler } from './AxiosCancel';
import { CreateAxiosOptions } from './AxiosTransform';

/**
 * Axios 模块
 */
export class VAxios {
  /**
   * Axios实例句柄
   * @private
   */
  private instance: AxiosInstance;

  /**
   * Axios配置
   * @private
   */
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.instance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * 创建Axios实例
   * @param config
   * @private
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.instance = axios.create(config);
  }

  /**
   * 获取数据处理类
   * @private
   */
  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  /**
   * 获取Axios实例
   */
  getAxios(): AxiosInstance {
    return this.instance;
  }

  /**
   * 配置Axios
   * @param config
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.instance) return;
    this.createAxios(config);
  }

  /**
   * 设置公共头部信息
   * @param headers
   */
  setHeader(headers: Record<string, string>): void {
    if (!this.instance) return;
    Object.assign(this.instance.defaults.headers, headers);
  }

  /**
   * 设置拦截器
   * @private
   */
  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) return;

    const { responseInterceptors, responseInterceptorsCatch } = transform;
    const axiosCanceler = new AxiosCanceler();

    // 请求拦截器配置处理
    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const { requestOptions } = config as any;
      const ignoreCancel = requestOptions?.ignoreCancelToken ?? this.options.requestOptions?.ignoreCancelToken;
      if (!ignoreCancel) axiosCanceler.addPending(config);

      if (transform.requestInterceptors && isFunction(transform.requestInterceptors)) {
        config = transform.requestInterceptors(config, this.options) as InternalAxiosRequestConfig;
      }
      return config;
    });

    // 响应结果拦截器处理
    this.instance.interceptors.response.use(
      (res: AxiosResponse<any>) => {
        if (res) axiosCanceler.removePending(res.config);

        // 处理 HTTP 状态码
        if (res.status === 401) {
          return Promise.reject(new AxiosError('登录已过期，请重新登录', '401', res.config, res.request, res));
        }

        if (responseInterceptors && isFunction(responseInterceptors)) {
          res = responseInterceptors(res);
        }
        return res;
      },
      (error: AxiosError) => {
        // 处理网络连接错误 ERR_NETWORK
        if (error.code === 'ERR_NETWORK') {
          return Promise.reject(
            new AxiosError(
              'setupInterceptors中检测网络错误，请检查网络连接',
              'ERR_NETWORK',
              error.config,
              error.request,
              error.response,
            ),
          );
        }

        if (error.code === 'ERR_CONNECTION_REFUSED') {
          return Promise.reject(
            new AxiosError(
              '服务器连接失败，请检查服务是否启动',
              'ERR_CONNECTION_REFUSED',
              error.config,
              error.request,
              error.response,
            ),
          );
        }

        // 处理 HTTP 错误
        if (error.response?.status === 401) {
          return Promise.reject(
            new AxiosError('登录已过期，请重新登录', '401', error.config, error.request, error.response),
          );
        }

        if (error.response?.status === 403) {
          return Promise.reject(new AxiosError('没有权限访问', '403', error.config, error.request, error.response));
        }

        if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
          return responseInterceptorsCatch(error, this.instance);
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * 支持 FormData 请求格式
   * @param config
   */
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || (this.options.headers as AxiosRequestHeaders);
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (
      contentType !== ContentTypeEnum.FormURLEncoded ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === 'GET'
    ) {
      return config;
    }

    return {
      ...config,
      data: stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }

  /**
   * 支持 params 序列化
   * @param config
   */
  supportParamsStringify(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (contentType === ContentTypeEnum.FormURLEncoded || !Reflect.has(config, 'params')) {
      return config;
    }

    return {
      ...config,
      paramsSerializer: (params: any) => stringify(params, { arrayFormat: 'brackets' }),
    };
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options);
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }

  patch<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PATCH' }, options);
  }

  /**
   * 上传文件封装
   * @param key 文件所属的key
   * @param file 文件
   * @param config 请求配置
   * @param options
   */
  upload<T = any>(key: string, file: File, config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    const params: FormData = config.params ?? new FormData();
    params.append(key, file);

    return this.request(
      {
        ...config,
        method: 'POST',
        headers: {
          'Content-Type': ContentTypeEnum.FormData,
        },
        params,
      },
      options,
    );
  }

  /**
   * 请求封装
   * @param config
   * @param options
   */
  request<T = any>(config: AxiosRequestConfigRetry, options?: RequestOptions): Promise<T> {
    const { requestOptions } = this.options;

    if (requestOptions.throttle !== undefined && requestOptions.debounce !== undefined) {
      throw new Error('throttle and debounce cannot be set at the same time');
    }

    if (requestOptions.throttle && requestOptions.throttle.delay !== 0) {
      return new Promise((resolve) => {
        throttle(() => resolve(this.synthesisRequest(config, options)), requestOptions.throttle.delay);
      });
    }

    if (requestOptions.debounce && requestOptions.debounce.delay !== 0) {
      return new Promise((resolve) => {
        debounce(() => resolve(this.synthesisRequest(config, options)), requestOptions.debounce.delay);
      });
    }

    return this.synthesisRequest(config, options);
  }

  /**
   * 请求方法
   * @private
   */
  private async synthesisRequest<T = any>(config: AxiosRequestConfigRetry, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);
    const transform = this.getTransform();
    const { requestOptions } = this.options;
    const opt: RequestOptions = { ...requestOptions, ...options };

    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;

    conf = this.supportFormData(conf);

    return new Promise((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<Result>>(!config.retryCount ? conf : config)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error('请求错误!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          // 处理网络连接错误
          const axiosError = e as AxiosError;
          if (axiosError.code === 'ERR_CONNECTION_REFUSED') {
            resolve({
              code: ApiStatusCode.NetworkError,
              message: '服务器连接失败，请检查服务是否启动',
              data: null,
              traceId: '',
              timestamp: Date.now(),
              pagination: null,
              sort: null,
              filter: null,
            } as unknown as T);
            return;
          }

          if (axiosError.code === 'ERR_NETWORK') {
            resolve({
              code: ApiStatusCode.NetworkError,
              message: '网络错误，请检查服务网络',
              data: null,
              traceId: '',
              timestamp: Date.now(),
              pagination: null,
              sort: null,
              filter: null,
            } as unknown as T);
            return;
          }

          if (axios.isCancel(e)) {
            resolve({
              code: ApiStatusCode.RequestCanceled,
              message: '请求已取消',
              data: null,
              traceId: '',
              timestamp: Date.now(),
              pagination: null,
              sort: null,
              filter: null,
            } as unknown as T);
            return;
          }

          // 处理 HTTP 错误
          if (axiosError?.response?.status === 401) {
            resolve({
              code: ApiStatusCode.TokenExpired,
              message: '登录已过期，请重新登录',
              data: null,
              traceId: '',
              timestamp: Date.now(),
              pagination: null,
              sort: null,
              filter: null,
            } as unknown as T);
            return;
          }

          if (requestCatchHook && isFunction(requestCatchHook)) {
            resolve(requestCatchHook(e, opt));
            return;
          }
          reject(e);
        });
    });
  }
}
