import type { CustomerListResult } from '@/api/model/customerModel';
import { request } from '@/utils/request';

const Api = {
  url: '/customer-list',
};

export function getCustomerList() {
  return request.get<CustomerListResult>({
    url: Api.url,
  });
}

export function createCustomerl(body: string) {
  return request.post<CustomerListResult>({
    url: `${Api.url}`,
    data: body,
  });
}
