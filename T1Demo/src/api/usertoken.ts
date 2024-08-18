import type { TokenResult } from '@/api/model/tokenModel';
import { requestOther } from '@/utils/request'; // 引入自定义request请求

const Api = {
  BaseList: '/account',
};

export function getUserToken(user: string, passwd: string) {
  return requestOther.get<TokenResult>({
    url: `${Api.BaseList}/${user}/${passwd}`,
  });
}
