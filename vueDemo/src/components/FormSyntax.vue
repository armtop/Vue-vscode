<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

const text = ref('')
const text2: Ref<number | undefined> = ref()
const text3 = ref('')
const message = ref('')
const checked = ref()
const checkedNames = ref([])
const picked = ref('')
const selected = ref([])
const options = ref([
    { text: 'One', value: 'A' },
    { text: 'Two', value: 'B' },
    { text: 'Three', value: 'C' }
])
const pick = ref('')
</script>
<template>
    <div>表单输入绑定</div>
    <p>
        文本：<input v-model.trim="text" placeholder="去除两端空格">{{ text }}
        文本2：<input v-model.number="text2" placeholder="自动转换为数字">{{ text2 }}
    </p>
    <p>
        文本3：<input v-model.lazy="text3" placeholder="在  change 事件后同步更新而不是 input">{{ text3 }}
    </p>
    <span>Multiline message is: </span>
    <p style="white-space: pre-line;">{{ message }}</p>
    <textarea v-model="message" placeholder="add multiple lines"></textarea>
    <p>
        复选框：<input type="checkbox" id="checkbox" v-model="checked" />
        <label for="checkbox">{{ checked }}</label> <!--for属性的值应与关联控件的id属性相同，进行关联-->
    </p>
    <p>
        复选框(值绑定)：<input type="checkbox" v-model="checked" true-value="yes" false-value="no" />
        <label for="checkbox">{{ checked }}</label>
    </p>
    <p>
    <div>Checked names: {{ checkedNames }}</div>

    <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
    <label for="jack">Jack</label>

    <input type="checkbox" id="john" value="John" v-model="checkedNames">
    <label for="john">John</label>

    <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
    <label for="mike">Mike</label>
    </p>
    <p>
    <div>Picked: {{ picked }}</div>

    <input type="radio" id="one" value="One" v-model="picked" />
    <label for="one">One</label>

    <input type="radio" id="two" value="Two" v-model="picked" />
    <label for="two">Two</label>
    </p>
    <p>
    <div>单选按钮Pick: {{ pick }}</div>
    <input type="radio" id="yi" v-model="pick" value="first" />
    <label for="yi">first</label>
    <!--浏览器在表单提交时，并不会包含未选择的复选框。为了保证这两个值 (例如：“first”和“second”) 的其中之一被表单提交，请使用单选按钮作为替代-->
    <input type="radio" id="er" v-model="pick" value="second" />
    <label for="er">second</label>
    </p>
    <p>
    <div>Selected: {{ selected }}</div>

    <select v-model="selected">
        <option disabled value="">Please select one</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
    </select>
    </p>
    <p>
    <div>Selected(按ctrl键多选): {{ selected }}</div>

    <select v-model="selected" multiple>
        <option disabled value="">Please select multiple</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
    </select>
    </p>
    <p>
    <div>Selected(v-for 动态渲染): {{ selected }}</div>
    <select v-model="selected">
        <option disabled value="">Please select one</option>
        <option v-for="option in options" :value="option.value">
            {{ option.text }}
        </option>
    </select>
    </p>
    <p>
    <div>Selected(内联对象字面量): {{ selected }}</div>
    <select v-model="selected" multiple>
        <option disabled value="">Please select multiple</option>
        <option :value="{ number: 123 }">123</option>
        <option :value="{ number: 456 }">456</option>
        <option :value="{ number: 789 }">789</option>
    </select>
    </p>

</template>
<style>
/* 代码定义了一个CSS样式，选择具有multiple属性的select元素，并设置其宽度为200px。 */
select[multiple] {
    width: 200px;
}
</style>