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
  id?: string;
  itemCode?: string; // 客户编码
  itemName: string; // 客户名称
  isSetup?: boolean; // 是否已启用
  category?: string; // 客户类型
  description?: string; // 描述
  registNumber?: string; // 营业执照注册号
  manager?: string; // 营业者
  idCardNumber?: string; // 营业者身份证号
  phoneNumber?: string; // 营业者手机号
  address?: string; // 联系地址
  createDate?: string; // 创建时间
  updateDate?: string; // 更新时间
  isPartner?: boolean; // 已经取消
}
