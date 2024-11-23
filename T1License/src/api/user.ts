import type { LoginParams, LoginResult } from '@/api/model/userModel';
import type { ApiResponse } from '@/types/api';
import { requestOther } from '@/utils/request'; // 引入自定义request请求

const Api = {
  url: '/Account',
};

export function T1login(body: LoginParams): Promise<ApiResponse<LoginResult>> {
  return requestOther.post<ApiResponse<LoginResult>>({
    url: `${Api.url}/login`,
    data: body,
  });
}

export function T1Register(body: LoginParams): Promise<ApiResponse<null>> {
  return requestOther.post<ApiResponse<null>>({
    url: `${Api.url}/register`,
    data: body,
  });
}

// 获取服务器临时盐值
export function T1GetSalt(account: string): Promise<ApiResponse<string>> {
  return requestOther.get<ApiResponse<string>>({
    url: `${Api.url}/getsalt/${account}`,
  });
}
