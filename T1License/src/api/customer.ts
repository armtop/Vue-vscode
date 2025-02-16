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
  // 移除可能为 undefined 的字段
  const requestData = {
    itemCode: body.itemCode || '',
    itemName: body.itemName,
    isSetup: body.isSetup || false,
    category: body.category || '1',
    description: body.description || '',
    registNumber: body.registNumber || '',
    manager: body.manager || '',
    idCardNumber: body.idCardNumber || '',
    phoneNumber: body.phoneNumber || '',
    address: body.address || '',
    isPartner: body.isPartner || false,
  };

  return requestOther.post<ApiResponse<CustomerModel>>({
    url: `${Api.url}/add`,
    data: requestData,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function T1UpdateCustomer(body: CustomerModel): Promise<ApiResponse<null>> {
  // 移除可能为 undefined 的字段
  const requestData = {
    id: body.id,
    itemCode: body.itemCode,
    itemName: body.itemName,
    isSetup: body.isSetup || false,
    category: body.category || '1',
    description: body.description || '',
    registNumber: body.registNumber || '',
    manager: body.manager || '',
    idCardNumber: body.idCardNumber || '',
    phoneNumber: body.phoneNumber || '',
    address: body.address || '',
    createDate: body.createDate || '',
    updateDate: body.updateDate || '',
    isPartner: body.isPartner || false,
  };
  return requestOther.put<ApiResponse<null>>({
    url: `${Api.url}/update`,
    data: requestData,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function T1DeleteCustomer(id: string): Promise<ApiResponse<object>> {
  return requestOther.delete<ApiResponse<object>>({
    url: `${Api.url}/delete/${id}`,
  });
}
