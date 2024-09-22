import type { LicenseListResult } from '@/api/model/licenseModel';
import { request } from '@/utils/request';

const Api = {
  url: '/license-list',
};

export function getLicenseList() {
  return request.get<LicenseListResult>({
    url: Api.url,
  });
}

export function createLicense(body: string) {
  return request.post<LicenseListResult>({
    url: `${Api.url}`,
    data: body,
  });
}
