<template>
  <t-card theme="poster2" :bordered="false">
    <!-- 定义卡片头 -->
    <template #avatar>
      <t-avatar size="56px">
        <template #icon>
          <shop-icon v-if="customer.category === '1'" />
          <calendar-icon v-if="customer.category === '2'" />
          <service-icon v-if="customer.category === '3'" />
          <user-avatar-icon v-if="customer.category === '4'" />
          <laptop-icon v-if="customer.category === '5'" />
        </template>
      </t-avatar>
    </template>
    <!-- 定义卡片状态 -->
    <template #status>
      <t-tag :theme="customer.isSetup ? 'success' : 'default'" :disabled="!customer.isSetup">
        {{ customer.isSetup ? $t('components.isSetup.on') : $t('components.isSetup.off') }}
      </t-tag>
    </template>
    <!-- 定义卡片内容 -->
    <template #content>
      <p class="list-card-item_detail--name">{{ customer.itemName }}</p>
      <p class="list-card-item_detail--desc">{{ customer.manager }}</p>
      <p class="list-card-item_detail--desc">{{ customer.phoneNumber }}</p>
      <p class="list-card-item_detail--desc">{{ customer.address }}</p>
    </template>
    <!-- 定义卡片底部 -->
    <template #footer>
      <t-avatar-group cascading="left-up" :max="5">
        <t-avatar>{{ typeMap[Number(customer.category) - 1] }}</t-avatar>
        <t-avatar>
          <template #icon>
            <add-icon />
          </template>
        </t-avatar>
      </t-avatar-group>
    </template>
    <!-- 定义卡片菜单 -->
    <template #actions>
      <t-dropdown
        :disabled="false"
        trigger="click"
        :options="[
          {
            content: $t('components.license'),
            value: 'license',
            onClick: () => handleClickLicense(customer),
          },
          {
            content: $t('components.manage'),
            value: 'manage',
            onClick: () => handleClickManage(customer),
          },
          {
            content: $t('components.delete'),
            value: 'delete',
            onClick: () => handleClickDelete(customer),
          },
        ]"
      >
        <t-button theme="default" :disabled="false" shape="square" variant="text">
          <more-icon />
        </t-button>
      </t-dropdown>
    </template>
  </t-card>
</template>

<script setup lang="ts">
import {
  AddIcon,
  CalendarIcon,
  LaptopIcon,
  MoreIcon,
  ServiceIcon,
  ShopIcon,
  UserAvatarIcon,
} from 'tdesign-icons-vue-next';
import type { PropType } from 'vue';

import type { CustomerModel } from '@/api/model/customerModel';

// 使用一个常量来定义组件的属性
defineProps({
  customer: {
    type: Object as PropType<CustomerModel>,
    required: true,
  },
});

// 定义组件的自定义事件
// 将 defineEmits 函数赋值给一个名为 emit 的常量，这样就可以在组件内部使用 emit 函数来触发自定义事件
const emit = defineEmits(['license-customer', 'manage-customer', 'delete-item']);

const typeMap = ['A', 'B', 'C', 'D', 'E']; // 定义客户类型，如普通客户、重要客户

const handleClickLicense = (customer: CustomerModel) => {
  emit('license-customer', customer);
};

/**
 * 管理客户点击事件处理函数
 *
 * 当用户点击管理客户操作时，此函数将被触发它通过emit方法来触发自定义事件，
 * 并将客户信息作为事件的参数传递出去这使得父组件或其他监听该事件的组件能够收到
 * 并处理被点击客户的后续管理操作
 *
 * @param {CardCustomerType} customer - 被点击的客户信息对象
 */
const handleClickManage = (customer: CustomerModel) => {
  emit('manage-customer', customer);
};

/**
 * 处理删除按钮点击事件
 *
 * 当用户点击删除按钮时，这个函数会触发。它会生成一个事件，
 * 该事件携带着被删除的客户信息，以便通知上级组件某项删除操作已经发生。
 *
 * @param {CardCustomerType} customer - 被删除的客户信息对象
 *        这个参数包含了有关客户的所有必要信息，如姓名、ID等。
 *        当删除操作触发时，将这个对象传递给上级组件，以便于上级组件
 *        能够识别出具体是哪一位客户的信息被删除。
 */
const handleClickDelete = (customer: CustomerModel) => {
  emit('delete-item', customer);
};
</script>

<style lang="less" scoped>
.list-card-item {
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &_detail {
    min-height: 140px;

    &--name {
      margin-bottom: var(--td-comp-margin-s);
      font: var(--td-font-title-medium);
      color: var(--td-text-color-primary);
    }

    &--desc {
      color: var(--td-text-color-secondary);
      font: var(--td-font-body-small);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
