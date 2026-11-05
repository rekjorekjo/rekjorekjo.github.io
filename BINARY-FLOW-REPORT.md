# Diagonal Binary Flow 首页

## 页面与数据

首页保留原图形导航、最新文章标题、归档入口、最近六篇和全站页脚。删除交互终端、命令解释器、终端专用样式和专用测试。没有 Hero、宣传文案、CTA 或重复分类导航。

继续使用 getPosts 与 PostList，因此草稿生产过滤、时间和 ID 排序、分类、摘要、标签和文章 URL 均沿用既有实现。没有改已迁移文章、归档和文章页源码，也没有升级或新增依赖。

## 数据流机制

- 独立组件 `src/components/BinaryFlow.astro`，行为位于 `src/scripts/binary-flow.ts`。
- 使用 CSS 合成层上的字符轨迹，字符只包含 0/1。每条轨迹固定 32 位，三份完全相同的序列连续排列。
- 每个周期长度为 768px，64 秒平移一个周期，速度 12px/s；轨迹倾角 -20°。重置时下一份副本占据相同位置，不更换字符、不重新生成 DOM。
- 三份序列中对应字符共享亮度目标、时长与调度批次，保证运动接缝处亮度也相同。
- 一个 200ms 调度器管理所有逻辑字符，分别选择目标透明度与 1.5～3 秒过渡。常规目标约 0.025～0.145，少量峰值 0.25～0.30；运动由独立的线性 CSS animation 控制。
- 桌面四条轨迹、11px 字号；手机两条、10px 字号，并重新分配轨迹位置。没有将桌面画面整体缩小。
- 底纹绝对定位，在文章区域外留有小幅延伸并渐隐；没有独立 Banner 或为动画增加空白高度。

原型使用 SVG 实验后，发现逐字符亮度会增加重绘成本，最终使用 HTML 字符 + CSS transform/opacity 合成；没有引入动画引擎或其他依赖。

## 遮挡与无障碍

背景数据层 z-index:0、pointer-events:none、aria-hidden:true；文章层 z-index:1，条目背景使用边缘 92%、中部 88% 不透明度的近黑色柔性遮挡。数据流经过文章块时明显变暗，边缘、间隙和外侧更明显；文字自身 opacity 始终为 1，链接可点击。边框保持 1px，颜色为 rgb(65 99 81 / 76%)，hover/focus 为 rgb(101 164 132 / 84%)；使用 2.5% 的内侧高光与 10% 的轻微黑色阴影。

页面隐藏或底纹离开视口时，暂停运动并停止亮度调度。prefers-reduced-motion 下取消动画和调度，以 opacity:0.05 的静态纹理显示。背景的 transform/opacity 不参与文章布局，不会通过字符亮度更新改变卡片尺寸。

## 修改文件

- `src/pages/index.astro`：恢复真实最新文章列表。
- `src/components/BinaryFlow.astro`、`src/scripts/binary-flow.ts`、`src/styles/home.css`：底纹和首页样式。
- `src/layouts/Base.astro`、`src/components/NavIcon.astro`：保留原图形导航，将终端命名改为通用图形导航命名。
- `src/styles/components.css`：删除无用的终端表单样式，保留共享文章样式。
- 删除 `src/scripts/terminal.ts`、`src/styles/terminal.css`、`scripts/check-terminal.mjs`。
- `scripts/check-home.mjs`、`scripts/verify-binary-flow.mjs`：首页及动画专项检查。
- `scripts/regression.mjs`、`scripts/verify.mjs`：恢复列表断言，继续原有工程与文章回归。
- `README.md`、本报告：更新使用说明。

## 实际验证结果

- Astro check：0 errors / 0 warnings / 0 hints。
- Production Build：8 个页面与原有图片处理成功。
- npm test：九种既有场景全部通过，覆盖根路径、普通/含点子路径、无示例、空内容及开发草稿；Canonical、精确标签、KaTeX、Python/sage/sagemath、目录和代码复制继续通过。
- npm run verify：实际页面与链接检查通过，0 页面脚本错误；手机搜索入口与文章链接可用。
- node scripts/verify-binary-flow.mjs：运动、固定序列、独立过渡时长、循环周期、遮挡、暂停和减少动态偏好通过。
- 循环检查将动画置于周期首尾，比较相邻副本屏幕坐标，接缝差为 0；周期 768px / 64000ms。
- 后续柔性遮挡测试：暂时隐藏首张卡片文字并排除圆角边缘，对比底纹显示/隐藏的像素；要求差异非零且最大通道变化不超过 12/255，验证有微弱透出而非完全透明。这样也排除了 Chromium 合成时的字体抗锯齿模式差异。
- 页面隐藏检查使用模拟 visibilitychange 生命周期，验证 CSS 暂停和亮度样式不再变化；减少动态偏好使用浏览器媒体模拟。
- 截图视口为 1440×900、768×1024、390×844，均无整页横向溢出。截图使用 fullPage 保存完整文章列表，没有增加动画专用高度。
- 文章页桌面、手机截图与既有基线像素一致。
- 最后一次 3 秒采样中 Chrome 主线程 TaskDuration 增量为 183ms。它是该浏览器运行的观察值，不是整机 CPU 或 GPU 使用率，也不是所有设备的性能保证。

截图及 JSON 结果位于项目外层：binary-flow-desktop.png、binary-flow-tablet.png、binary-flow-mobile.png、binary-flow-verification.json。

## 运行与限制

本地：npm.cmd run dev。工程检查：npm.cmd run check、npm.cmd run build、npm.cmd test。启动预览后：npm.cmd run verify、node scripts/verify-binary-flow.mjs。

未验证 Safari/Firefox、真实低端手机及长期能耗。没有已知阻塞问题，没有修改旧 Hexo，没有推送或线上部署。


## 后续小范围文章层视觉优化

仅改变首页 home.css 的边框、背景与阴影，BinaryFlow 组件和动画脚本没有修改。背景颜色不变，只让不透明度从边缘 92% 缓慢过渡到中部 88%，没有对整张卡片设置 opacity，因此标题、摘要、日期不会跟着变淡。底层字符的峰值约 30%，透过卡片后贡献的亮度最多约 3.6%，优先保留文字对比度。

本次实际执行 npm run verify、node scripts/verify-binary-flow.mjs 和 npm run build，均通过。测试更新为柔性遮挡，不再要求完全遮光。未重跑九种隔离回归与类型检查；它们在上一次版本通过，本次没有修改文章查询、路径或 TypeScript 实现。

本次桌面及手机截图为项目外层 soft-layers-desktop.png、soft-layers-mobile.png。未修改文章页或已迁移内容，没有新增依赖或线上部署。
