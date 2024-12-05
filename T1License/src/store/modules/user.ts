import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

// import { ref } from 'vue';
import { T1login } from '@/api/user';
import { usePermissionStore } from '@/store';
// import type { ApiResponse } from '@/types/api';
import { ApiStatusCode } from '@/types/api';
import type { UserInfo } from '@/types/interface';
import { handleApiResponse } from '@/utils/apiHelper';

const router = useRouter();
// const apiResponse = ref<ApiResponse<UserInfo>>();
const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  itemcode: '',
  itemname: '',
  createdate: '',
  updatedate: '',
  disable: false,
  isemailconfirmed: false,
  activationcode: '',
  isadmin: false,
  lastloginat: '',
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
  isAdmin: false,
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: 'main_token', // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const handleLogin = async (userInfo: Record<string, unknown>) => {
        const response = await T1login({
          account: userInfo.account as string,
          password: userInfo.password as string,
        });

        return response;
      };

      const res = await handleLogin(userInfo);

      handleApiResponse(res, {
        onSuccess: (data) => {
          console.log('请求成功', data);
          this.token = res.data.token;
          this.userInfo.isAdmin = res.data.isAdmin;
          this.userInfo.name = res.data.account;
          this.userInfo.itemcode = res.data.itemCode;
          this.userInfo.itemname = res.data.itemName;
          this.userInfo.createdate = res.data.createDate;
          this.userInfo.updatedate = res.data.updateDate;
          this.userInfo.disable = res.data.disable;
          this.userInfo.isemailconfirmed = res.data.isEmailConfirmed;
          this.userInfo.activationcode = res.data.activationCode;
          this.userInfo.lastloginat = res.data.lastLoginAt;
          this.getUserInfo();
        },
        onError: (error) => {
          console.error('请求失败', error?.errorMessage);
          throw res;
        },
        onSpecificError: {
          [ApiStatusCode.TokenExpired]: () => {
            // 处理token过期
            router.push('/login');
          },
          [ApiStatusCode.Unauthorized]: () => {
            // 处理未授权
          },
        },
      });
    },
    async getUserInfo() {
      // 获取用户名、角色等
      /*
      const mockRemoteUserInfo = async (token: string) => {
        if (token === 'main_token') {
          return {
            name: 'Tencent',
            roles: ['all'], // 前端权限模型使用 如果使用请配置store/modules/permission-fe.ts使用
          };
        }
        return {
          name: 'td_dev',
          roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配store/modules/permission-fe.ts使用
        };
      };
      const res = await mockRemoteUserInfo(this.token);
      */
      const remoteUserInfo = async () => {
        if (this.userInfo.isAdmin) {
          return {
            name: this.userInfo.name,
            roles: ['all'],
          };
        }
        return {
          name: this.userInfo.name,
          roles: ['DashboardBase'],
        };
      };

      const res = await remoteUserInfo();
    },
    async logout() {
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: ['token', 'userInfo'], // 同时持久化token和userInfo
  },
});
