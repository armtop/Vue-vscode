export interface CustomerListResult {
  code: number;
  message: string;
  data: Array<CustomerModel>;
  pagination: any;
  sort: any;
  filter: any;
  errors: any;
}
export interface CustomerModel {
  ID: number; // 客户ID
  name: string; // 客户名称
  isSetup: boolean; // 是否已启用
  type: number; // 客户类型
  description: string; // 描述
  businessLicenseNumber: string; // 营业执照注册号
  businessPersonName: string; // 营业者
  businessPersonIdNumber: string; // 营业者身份证号
  businessPersonPhoneNumber: string; // 营业者手机号
  contactAddress: string; // 联系地址
}
