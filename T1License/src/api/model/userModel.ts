export interface UserInfo {
  Id: string;
  Itemcode: string;
  Itemname: string;
  Account: string;
  Createdate: string;
  Updatedate: string;
  Disable: boolean;
  IsEmailConfirmed: boolean;
  ActivationCode: string;
  IsAdmin: boolean;
  LastLoginAt: string;
}

export interface LoginParams {
  account: string;
  password: string;
}

export interface LoginResult {
  account: string;
  token: string;
  isAdmin: boolean;
  role: string[];
  itemCode: string;
  itemName: string;
  createDate: string;
  updateDate: string;
  disable: boolean;
  isEmailConfirmed: boolean;
  activationCode: string;
  lastLoginAt: string;
}

export interface ResetPasswdParams {
  account: string;
  newPassword: string;
}
