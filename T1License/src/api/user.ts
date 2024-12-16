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

export function T1GetUserInfo(): Promise<ApiResponse<UserInfo[]>> {
  return requestOther.get<ApiResponse<UserInfo[]>>({
    url: `${Api.url}/getuserinfo`,
  });
}

// 添加用户管理相关的API
export function T1DisableUser(userId: string): Promise<ApiResponse<null>> {
  return requestOther.put<ApiResponse<null>>({
    url: `${Api.url}/changedisable/${userId}/true`,
  });
}

export function T1EnableUser(userId: string): Promise<ApiResponse<null>> {
  return requestOther.put<ApiResponse<null>>({
    url: `${Api.url}/changedisable/${userId}/false`,
  });
}

export function T1SetAdmin(userId: string): Promise<ApiResponse<null>> {
  return requestOther.post<ApiResponse<null>>({
    url: `${Api.url}/setadmin`,
    data: { userId },
  });
}

export function T1RemoveAdmin(userId: string): Promise<ApiResponse<null>> {
  return requestOther.post<ApiResponse<null>>({
    url: `${Api.url}/removeadmin`,
    data: { userId },
  });
}
