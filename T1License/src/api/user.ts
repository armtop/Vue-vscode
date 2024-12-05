import type { LoginParams, LoginResult, ResetPasswdParams } from '@/api/model/userModel';
import type { ApiResponse } from '@/types/api';
import { requestOther } from '@/utils/request';

// 添加 UserInfo 接口
export interface UserInfo {
  itemname: string;
  itemcode: string;
  avatar?: string;
  isemailconfirmed: boolean;
  isAdmin: boolean;
  createdate: string;
  lastloginat: string;
  disable: boolean;
}

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

export function T1RestPasswd(body: ResetPasswdParams): Promise<ApiResponse<LoginResult>> {
  return requestOther.post<ApiResponse<LoginResult>>({
    url: `${Api.url}/resetpassword`,
    data: body,
  });
}

// 添加获取禁用用户列表的API
export function T1GetDisabledUsers(): Promise<ApiResponse<UserInfo[]>> {
  return requestOther.get<ApiResponse<UserInfo[]>>({
    url: `${Api.url}/getdisabledusers`,
  });
}
