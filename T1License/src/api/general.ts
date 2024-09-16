import type { generalResult } from '@/api/model/generalModel';
import { request } from '@/utils/request';

const Api = {
  url: '/general-list',
};

export function getGeneralList(datatype: string) {
  return request.get<generalResult>({
    url: `${Api.url}/${datatype}`,
  });
}
