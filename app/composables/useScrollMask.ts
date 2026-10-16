/**
 * 滚动边缘遮罩：给 overflow 容器加 24px 渐变（`:style` 拿到 `mask-image: linear-gradient(...)`），
 * 按方向自动决定上下哪边淡出、不溢出时不出现。
 *
 * 为什么包一层：Nuxt UI 的 `useScrollShadow` 内部是 vueuse `useScroll`，`arrivedState` 只在挂载、
 * 滚动事件与 `scrollend` 时更新，**没有 ResizeObserver / MutationObserver**。内容由接口异步填充时，
 * 容器从「不溢出」变「溢出」不产生任何滚动事件，下边缘遮罩要等用户第一次滚动才出现——而它唯一的作用
 * 就是在滚动之前提示「下面还有内容」。这里在元素挂上后同时观察 `childList/subtree` 与自身尺寸，变化时
 * 合成一次 `scroll` 事件让它重新测量（`useScrollShadow` 只返回 `style / isOverflowing / arrivedState`、
 * 没透出 `measure()`，合成事件是唯一的公开入口）。
 */
export function useScrollMask(element: Ref<HTMLElement | null>) {
  const { style } = useScrollShadow(element)

  function measure() {
    element.value?.dispatchEvent(new Event('scroll'))
  }

  // 清理走 watch 回调的第三个参数 onCleanup，不能写成 onScopeDispose：watcher 回调不在任何 effect
  // scope 里执行，onScopeDispose 会报「no active effect scope」且注册不上，卸载时 observer 永不
  // disconnect、闭包还继续钉着已卸载的 DOM；onCleanup 绑在 watcher 自己的 effect 上，卸载与每次重跑前
  // 都会执行。immediate 第一次同步跑在 setup 里、那时模板 ref 还是 null，直接 return 即可。
  watch(element, (node, _previous, onCleanup) => {
    if (!node)
      return
    const mutations = new MutationObserver(measure)
    const resizes = new ResizeObserver(measure)
    mutations.observe(node, { childList: true, subtree: true })
    resizes.observe(node)
    onCleanup(() => {
      mutations.disconnect()
      resizes.disconnect()
    })
  }, { immediate: true })

  return style
}
