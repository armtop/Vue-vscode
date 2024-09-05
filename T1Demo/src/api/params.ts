import type { t1Model } from '@/api/model/t1Model';
import { requestOther } from '@/utils/request'; // 引入自定义request请求

const Api = {
  BaseList: '/Tickets',
};

export function getTickets(pagesize: number) {
  return requestOther.get<t1Model>({
    url: `${Api.BaseList}`,
    params: {
      Pagesize: pagesize,
    },
  });
}
