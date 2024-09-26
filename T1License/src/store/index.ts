import { createPinia, defineStore } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

import type { CardCustomerType } from '@/components/customer-card/index.vue';

const store = createPinia();
store.use(createPersistedState());

export { store };

export * from './modules/notification';
export * from './modules/permission';
export * from './modules/setting';
export * from './modules/tabs-router';
export * from './modules/user';

export default store;

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customer: {} as CardCustomerType,
  }),
  actions: {
    setCustomer(customer: CardCustomerType) {
      this.customer = customer;
    },
    clearCustomer() {
      this.customer = {} as CardCustomerType;
    },
  },
});
