import { ref,watchEffect, toValue } from 'vue'
/**
 * 使用fetch函数封装一个自定义的钩子，用于数据的获取、加载状态的管理及错误处理。
 * 
 * @param {string} url - 请求的数据源URL。
 * @returns {Object} 返回一个对象，包含数据(data)、加载状态(loading)和错误信息(error)。
 */
export function useFetch(url) {
    // 初始化数据状态，默认为null。
    const data = ref(null)
    // 初始化加载状态，默认为true。
    const loading = ref(true)
    // 初始化错误状态，默认为null。
    const error = ref(null)

    const fetchData = () => {
        data.value = null
        error.value = null
        loading.value = true

        // 发起fetch请求，获取数据。
        fetch(toValue(url)) //toValue 将 ref 或 getter 规范化为值。如果参数是 ref，它会返回 ref 的值；如果参数是函数，它会调用函数并返回其返回值。否则，它会原样返回参数
            .then(res => res.json())
            .then(json => {
                // 请求成功，更新数据状态，并设置加载状态为false。
                data.value = json
                loading.value = false
            })
            .catch(err => {
                // 请求失败，更新错误状态，并设置加载状态为false。
                error.value = err
                loading.value = false
            })
    }

    watchEffect(async() => {
        // 注意 toValue(url) 是在 watchEffect 回调函数的内部调用的。这确保了在 toValue() 规范化期间访问的任何响应式依赖项都会被侦听器跟踪。
        await fetchData()
    })    

    // 返回数据、加载状态和错误状态，供外部使用。
    return { data, loading, error }
}
