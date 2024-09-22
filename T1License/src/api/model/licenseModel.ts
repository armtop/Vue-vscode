export interface LicenseListResult {
  code: number;
  message: string;
  data: Array<LicenseModel>;
  pagination: any;
  sort: any;
  filter: any;
  errors: any;
}
export interface LicenseModel {
  ID: string; // 索引
  customer: string; // 客户名称
  license: string; //
  licensetype: number; // license类型
  cap: boolean; // 开通应用开发
  offline: boolean; // 离线
  AuthorizationNumber: number; // 授权数量
  AuthorizedDays: number; // 使用期限
  startDate: string; // 启用日期
  machineCode: string; // 机器码
  ApplicationPackage: string; // 应用包授权
  descr: string; // 备注
}
