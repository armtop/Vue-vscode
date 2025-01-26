import type { CustomerModel } from '@/api/model/customerModel';
import type { ApiResponse } from '@/types/api';
import { requestOther } from '@/utils/request';

const Api = {
  // url: '/customer-list',
  url: '/Customer',
};

/* export function getCustomerList() {
  return request.get<CustomerListResult>({
    url: Api.url,
  });
} */

export function T1GetCustomerList(pageNumber: number, pageSize: number): Promise<ApiResponse<CustomerModel[]>> {
  return requestOther.get<ApiResponse<CustomerModel[]>>({
    url: `${Api.url}/getall`,
    params: {
      pageNumber,
      pageSize,
    },
  });
}

export function T1SearchCustomerList(
  content: string,
  pageNumber: number,
  pageSize: number,
): Promise<ApiResponse<CustomerModel[]>> {
  return requestOther.get<ApiResponse<CustomerModel[]>>({
    url: `${Api.url}/search`,
    params: {
      content,
      pageNumber,
      pageSize,
    },
  });
}

export function T1AddCustomer(body: CustomerModel): Promise<ApiResponse<CustomerModel>> {
  return requestOther.post<ApiResponse<CustomerModel>>({
    url: `${Api.url}/add`,
    data: body,
  });
}

/* export function createCustomerl(body: string) {
  return request.post<CustomerListResult>({
    url: `${Api.url}`,
    data: body,
  });
} */
