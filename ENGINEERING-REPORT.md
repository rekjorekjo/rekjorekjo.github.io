# Astro Notebook 工程修复报告

日期：2026-11-04。修改保存在本地 `fix/notebook-engineering` 分支。修改前已创建源码备份，并有本地基线提交 `2bbe347`；不含远程仓库，没有执行推送或部署。原 Hexo、现有文章正文和图片未修改。

## 实际问题、处理与验证

| 问题与根因 | 修复 | 状态 |
| --- | --- | --- |
| Base 对所有页面输出 noindex,nofollow | 开发和草稿禁止收录，生产公开页面 index,follow，404 仍 noindex | 生产 HTML 与开发草稿预览已验证 |
| 缺少 Canonical 和 site/base；内部链接始终从域名根开始 | SITE_URL / BASE_PATH 进程配置；统一 withBase/postUrl；配置域名后生成不带查询参数的 Canonical | 未配置域名、独立域名、GitHub 用户主页和项目子路径均经实际构建、浏览器检查 |
| Schema 没有草稿字段，路由与列表直接查询全集 | draft 默认 false；getPosts 统一生产过滤与排序；开发提示草稿 | 临时草稿不生成路由，dist 的 HTML/JS/JSON/XML 扫描无草稿哨兵；开发可预览且 noindex |
| 首页列出全部文章，同日顺序没有定义 | 首页最多 6 篇；日期降序，文章 ID 次级排序；归档完整保留 | 8 篇同日测试文章验证六篇上限与次级顺序 |
| tag 被写入搜索框并执行子串匹配 | tag、q、category 独立 AND 过滤，标签精确且区分大小写，查询 URL 保留 tag | Python 不误匹配 Python3；Pyth 不匹配 Python；标签与关键词叠加、空结果通过 |
| CSS 压缩、后续叠加覆盖，残留旧终端样式 | 格式化，按 base/layout/components/article/responsive 拆分；合并重复规则，删除已无 DOM 对应的旧样式及透明背景；提取共用间距和圆角变量 | 截图对比：首页桌面和手机、文章桌面均 0% 像素差异 |
| 手机目录全部展开，占用长文首屏 | 语义化按钮、aria-expanded / aria-controls，默认折叠；桌面 Sticky 保持 | 360/390px 默认折叠，键盘 Enter 展开/收起通过；桌面 sticky 通过 |
| 辅助文本过小 | 手机目录、文章说明、复制按钮最小 12px | 浏览器截图核对；手机文章截图高度变化符合预期 |
| 测试依赖演示数量、标题与代码内容 | 实际内容冒烟检查动态发现文章；隔离副本提供可控夹具，覆盖草稿、排序、路径、公式、别名、复制 | npm test 与 npm run verify 已通过 |
| 未声明 Node 要求 | engines.node 与所装 Astro 的 >=22.23.4 对齐 | 本机 Node 24.21.0，Astro 检查与构建通过 |

路径处理依据 Astro 的 site、base、BASE_URL 配置方式：[官方配置文档](https://docs.astro.build/en/reference/configuration-reference/)。未确定真实域名时不填占位域名，省略 Canonical；公开上线前需要设置真实 SITE_URL 并重新构建。

## 修改文件清单

- 配置：`astro.config.mjs`、新增 `deployment.mjs`、`package.json`、`package-lock.json`。
- 内容与公共逻辑：`src/content.config.ts`，新增 `src/lib/posts.ts`、`src/lib/paths.ts`、`src/lib/filter.ts`。
- 页面与组件：`src/layouts/Base.astro`、`src/components/PostList.astro`、`src/pages/index.astro`、`src/pages/archive.astro`、`src/pages/about.astro`、`src/pages/404.astro`、`src/pages/posts/[...id].astro`。
- 样式：`src/styles/global.css`，新增 `base.css`、`layout.css`、`components.css`、`article.css`、`responsive.css`。
- 测试：`scripts/verify.mjs`，新增 `scripts/regression.mjs`。
- 文档：`README.md`、`REVIEW-NOTES.md`、本报告。

## 验证范围

**已验证通过：**

- `npm run check`：0 errors / 0 warnings / 0 hints。
- 本地生产构建：7 个原有页面正常生成。
- `npm test`：隔离的四种生产配置构建与浏览器检查，开发环境草稿预览；测试 origin 仅用于断言，没有发布。
- `npm run verify`：实际内容上的终端、搜索分类、站内链接、目录、字号保存、复制与截图。
- Python、sage、sagemath 三种围栏的高亮；行内和块级 KaTeX；复制内容不带行号（Windows CRLF 在比较时规范化）。
- 360/390/768px 的页面溢出检查；额外长代码与宽表格夹具；现有数学块保持自身滚动。
- 桌面和手机截图比较。输出目录 `visual-comparison/` 保留 before/after：首页桌面 1440px 和手机 390px、文章桌面 1440px 像素无差异；手机文章页因折叠目录与文字调整从 5438px 变为 5262px 高。

**仅静态检查：** 目前没有 sitemap 生成器，没有草稿进入 sitemap 的现有通道；未来新增 sitemap 必须复用 getPosts 的生产发布策略。未额外加入 sitemap 功能。

**未验证：** GitHub Pages 实际托管、DNS、自定义域名、Safari/Firefox 和真实手机设备、真实屏幕阅读器、SageMath 运行时。SageMath 此次验证的是语法别名和展示，不是执行计算。

## 依赖、兼容性与剩余事项

- 没有新增或升级第三方依赖。锁文件只同步 Node engines 元数据。
- Node 18 不支持本项目当前 Astro；测试需要本机 Chrome，与现有浏览器检查保持一致。
- 标签精确匹配区分大小写，这与以前模糊标签行为不同，是此次要求的修复。
- BASE_PATH 限定英文、数字、连字符、下划线及斜杠，适用于常规 GitHub Pages 仓库名。SITE_URL 只接受 http(s) origin，项目路径由 BASE_PATH 提供。
- 生产输出与构建配置绑定，更改部署路径须重新构建。SITE_URL 未设时 Canonical 缺省，不能自动推断真实域名。
- 没有引入新的内容功能，示例文章和待确认的作者介绍保留；上线前仍需替换为真实内容。
- 当前没有 RSS、sitemap、评论或自动部署，此次没有扩展这些功能。
- 无已知阻塞此次验收的问题；线上托管与多浏览器兼容性仍需在实际发布阶段验证。

## 本地命令

在项目目录运行：

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd ci
npm.cmd run dev
```

检查与构建：

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd test
```

实际页面检查需要先启动 dev，再在另一个窗口执行 `npm.cmd run verify`；非默认地址可设置 `PREVIEW_URL`。

GitHub Pages 项目路径本地构建示例（先将 SITE_URL 设为自己真实的 GitHub Pages origin）：

```powershell
$env:BASE_PATH='/你的实际英文仓库名/'
npm.cmd run build
npm.cmd run preview
```

根路径部署使用 `BASE_PATH='/'`。README 提供了完整配置说明。没有执行 git push，没有部署，没有修改原 Hexo 博客。
