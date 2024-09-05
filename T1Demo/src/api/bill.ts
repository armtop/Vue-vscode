import type { T1Bill } from '@/api/model/t1Bill';
import { requestOther } from '@/utils/request'; // 引入自定义request请求

const Api = {
  BaseList: '',
};

export function getBill(Itemtype: string, Number: string) {
  return requestOther.get<T1Bill>({
    url: `${Api.BaseList}/${Itemtype}/${Number}`,
  });
}

export function createBill(Itemtype: string, billbody: string) {
  return requestOther.post<T1Bill>({
    url: `${Api.BaseList}/${Itemtype}`,
    data: billbody,
  });
}
