import type { ApiResponse } from '@/types/api';
import { ApiStatusCode } from '@/types/api';

export function handleApiResponse<T>(
  response: ApiResponse<T>,
  {
    onSuccess,
    onError,
    onSpecificError,
  }: {
    onSuccess?: (data: T) => void;
    onError?: (error: ApiResponse<T>['error']) => void;
    onSpecificError?: Partial<Record<ApiStatusCode, () => void>>;
  },
) {
  if (response.code === ApiStatusCode.Success) {
    onSuccess?.(response.data);
    return true;
  }

  // 处理特定错误码
  if (onSpecificError && response.code in onSpecificError) {
    onSpecificError[response.code as ApiStatusCode]?.();
  }

  // 处理通用错误
  onError?.(response.error);
  return false;
}
