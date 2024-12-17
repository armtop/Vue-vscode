import { MessagePlugin } from 'tdesign-vue-next';
import type { Router } from 'vue-router';

import type { ApiResponse } from '@/types/api';
import { ApiStatusCode } from '@/types/api';

export function handleApiResponse<T>(
  response: ApiResponse<T>,
  {
    onSuccess,
    onError,
    onSpecificError,
    router,
  }: {
    onSuccess?: (data: T) => void;
    onError?: (error: ApiResponse<T>['error']) => void;
    onSpecificError?: Partial<Record<ApiStatusCode, () => void>>;
    router?: Router;
  },
) {
  if (response.code === ApiStatusCode.Success) {
    onSuccess?.(response.data);
    return true;
  }

  // 处理特定错误码
  switch (response.code) {
    case ApiStatusCode.TokenExpired:
      MessagePlugin.error('登录已过期，请重新登录');
      router?.push('/login');
      break;
    case ApiStatusCode.Unauthorized:
      MessagePlugin.error('没有权限访问');
      break;
    case ApiStatusCode.NetworkError:
      MessagePlugin.error('网络连接失败，请检查网络');
      break;
    case ApiStatusCode.RequestCanceled:
      MessagePlugin.warning('请求已取消');
      break;
    case ApiStatusCode.DataNotExists:
      console.log('数据不存在');
      break;
    default:
      if (response.message) {
        MessagePlugin.error(response.message);
      }
  }

  // 执行特定错误码的回调
  if (onSpecificError && response.code in onSpecificError) {
    onSpecificError[response.code as ApiStatusCode]?.();
  }

  // 处理通用错误
  onError?.(response.error);
  return false;
}
