import { render } from '@testing-library/vue'
import MyComponent from '../components/Test.vue'

test('it should work', () => {
    const { increment } = render(MyComponent, {
        props: {
            /* ... */
        }
    })

    // 断言输出
    increment('...')
})