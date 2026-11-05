> 工程修复后的最新状态与验证结果见 ENGINEERING-REPORT.md。下文保留最初审阅时的背景，部分未完成事项已在此次修复中处理。

# 项目交接与审阅背景

## 目标与当前阶段

这是一个从零手写界面的 Astro 个人博客项目，没有修改 Fuwari 或其他主题。用户原有 Hexo + Butterfly 博客在 WSL 中，本项目独立开发，尚未迁移历史文章，也没有部署。

目标内容是 CTF Writeups、密码学、Python / SageMath 和长篇学习笔记。用户已否定最初的深海军蓝配色，更喜欢近黑底色、薄荷绿点缀、清晰的灰白正文。当前黑绿版获得了“看起来还不错”的反馈，最新一项改动是代码块行号。

## 审阅重点

希望获得具体的修改建议，尤其关注：

- 是否有影响使用的错误，或难维护的结构。
- 首页是否有完整个人博客的观感，如何减少模板演示感。
- 长文的字号、行宽、对比度、目录和手机阅读体验。
- Python / SageMath 高亮、公式、行号、代码复制是否可靠。
- 键盘操作、读屏体验、搜索以及其他交互的边界情况。
- 将来迁移真实文章前，还应补齐哪些必要功能。

请按优先级区分实际缺陷与可选的审美建议，引用相关文件并说明原因。保持 Astro、自定义界面和黑绿方向；大幅换框架或替换主题的建议应说明具体收益。当前任务是审阅并提建议，无需部署或操作原 Hexo 博客。

## 结构与启动

- `src/layouts/Base.astro`：共享页面外壳与导航。
- `src/pages/index.astro`：首页、话题入口与演示终端。
- `src/pages/archive.astro`：归档搜索与分类。
- `src/pages/posts/[...id].astro`：文章、目录、字号、复制与阅读进度。
- `src/styles/global.css`：全部自定义样式，行号通过 CSS 计数器生成。
- `src/content.config.ts`、`src/content/posts/`：内容模式与三篇示例 Markdown。
- `astro.config.mjs`：Unified / remark-math / rehype-katex，Shiki Vesper 配色，SageMath 围栏映射到 Python。
- `scripts/verify.mjs`：本地 Chrome 浏览器功能检查。

使用符合 Astro engines 的 Node.js；本机使用 Node.js 24.21.0。在解压后的项目根目录执行 `npm ci`，再执行 `npm run dev`。Windows 也可以双击 `start-local.cmd`。详细使用方法见 README.md。

基础检查为 `npm run check` 和 `npm run build`。浏览器检查需要先启动站点，并安装本机 Chrome，再执行 `node scripts/verify.mjs`；地址不是默认的 http://127.0.0.1:4321 时通过 PREVIEW_URL 指定。截图与报告会写到项目目录外层。

## 已做的验证与范围

- 黑绿改版后的静态检查与构建通过，7 个静态页面正常生成。
- 浏览器检查通过：首页终端、归档搜索与分类、公式、Python/SageMath 高亮、目录锚点、复制、字号保存和站内链接；没有发现页面脚本错误。
- 在 360、390、768 像素宽度检查了整页横向溢出。
- 增加行号后另做了构建、行号样式、剪贴板代码内容与 360/390 像素宽度检查。Windows 剪贴板的 CRLF 与页面 LF 换行在比较时进行了规范化。行号为伪元素，不写入代码文本。
- RSA 示例的 Python 代码及整数根边界已运行；SageMath 本次只验证展示与高亮，没有运行 SageMath 计算。
- 依赖在本次安装检查时为零已知漏洞；这只是当时的检查结果。

## 尚未完成的事项

- 当前文章、作者介绍和阅读时间均为示例或暂定内容。尚未迁移真实文章，不能据此评价大规模内容下的表现。
- 搜索在浏览器内过滤预生成的标题、摘要与标签，不检索文章全文。
- 终端仅响应预设命令，不执行系统命令。
- 尚未配置真实域名、canonical、RSS、站点地图、评论或部署流程。
- 页面保留 `noindex,nofollow`。正式上线前应重新处理 SEO 与示例内容。
- 当前是单个博客项目，没有整理为可发布的通用主题包。

源码包保留依赖锁文件和示例内容，不包含 node_modules、dist、.astro 或原博客文件。
