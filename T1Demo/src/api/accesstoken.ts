import type { TokenListResult } from '@/api/model/accesstokenModel';
import { requestOther } from '@/utils/request'; // 引入自定义request请求

const Api = {
  BaseList: '/accessToken',
};

export function getToken(appid: string, secret: string) {
  return requestOther.get<TokenListResult>({
    url: `${Api.BaseList}/${appid}/${secret}`,
  });
}
