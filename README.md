# Rekjo / Field Notes

独立 Astro 个人博客预览副站。基线为本地提交 `1c30b1e68c0c1560dc5763bfc2030185784915c7`（包含 `de849b8` 的 TOC 修复及后续图片放大、About 页面补丁）。

唯一部署仓库为 `rekjorekjo/astro-preview`，目标地址为 https://rekjorekjo.github.io/astro-preview/ 。`.github/workflows/pages.yml` 仅在该仓库运行，不部署或修改主站及 Hexo 仓库。

GitHub Pages 的发布源需选 GitHub Actions。推送 `main` 后，工作流依次安装锁定依赖、类型检查、运行浏览器回归、构建并审计真实文章的链接与资源，全部通过后才发布。环境变量固定为 `SITE_URL=https://rekjorekjo.github.io`、`BASE_PATH=/astro-preview/`。无需 Token 或其他应用密钥；发布仅使用副站仓库的临时 `GITHUB_TOKEN` 和 Pages OIDC。

本地构建副站：

```powershell
$env:SITE_URL='https://rekjorekjo.github.io'
$env:BASE_PATH='/astro-preview/'
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd ci
npm.cmd run check
npm.cmd test
npm.cmd run build
node scripts/audit-preview.mjs
npm.cmd run preview
```

预览时访问终端地址下的 `/astro-preview/`。本地浏览器回归使用 Chrome，CI 会安装对应浏览器。没有添加 CNAME，没有导入凭据、私钥或原项目 Git 历史。当前内容为一篇真实 Writeup 与三篇明确标记的示例文章；About 联系字段保持原基线的空值。

## 本地打开

双击本目录下的 `start-local.cmd`，保持窗口打开，然后访问终端显示的地址（通常是 http://127.0.0.1:4321）。端口被占用时以实际显示的地址为准。关闭窗口或按 Ctrl+C 可停止。

也可以在项目目录执行：

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd ci
npm.cmd run dev
```

Node.js 要求以 `node_modules/astro/package.json` 中的 engines 为准；当前本机 Node.js 24.21.0 满足要求。

本次只读检查还发现 WSL 发行版为 Kali Linux，里面的 Node.js 为 18.3.0、npm 为 8.11.0，低于本项目当前 Astro 的要求。因此先在 Windows 的 Node.js 24 环境开发，不调整 WSL 或现有博客。

## 已提供

- 自定义中性近黑 / 薄荷绿界面，灰白正文与增大的阅读字号，无现成主题。
- 首页展示真实内容集合中的最近六篇文章，背后为低亮度的斜向 0/1 底纹；文章层以 88%～92% 的深色背景形成柔性遮挡。
- 归档：静态年月目录；分类目录支持 Hexo 风格父子分类，标签有独立的静态列表页。全站不提供搜索框或 `/` 搜索快捷键。
- Markdown 内容集合、静态文章路由、Python 语法高亮，以及映射到 Python 的 `sage` / `sagemath` 围栏。
- 本地打包的 KaTeX 样式和字体、行内与块级公式、表格。
- 自动生成目录、当前章节提示、代码行号与复制、阅读进度、字号调整与本地保存；复制和选择代码时不带行号。
- 移动端布局、键盘焦点、跳至内容、减少动画偏好。

内容集合包含实际迁移的 0xGame Writeup 和明确标注 demo 的排版示例文章；示例文章不代表真实比赛成绩。`src/config.ts` 的 Rekjo 为暂定名称，可直接修改。阅读时间暂为文章元数据中的演示值。

## 写新文章

在 `src/content/posts/` 下增加 `.md` 文件。文件名形成 `/posts/文件名/` 路径。参考现有文章的 frontmatter：

```yaml
---
title: '文章标题'
description: '摘要'
date: 2026-11-04
categories: [CTF, Crypto] # 先父分类、后子分类；旧文章的 category: CTF 继续支持
tags: [Python, Notes]
minutes: 5
demo: false
---
```

`categories: [CTF, Crypto]` 会创建 `CTF → Crypto` 分类路径；无须改动原有 `category: Notes` 文章。也支持 `categories: [[CTF, Crypto], [Notes, Security]]` 将同一篇文章归到多个分支。标签始终保持扁平，例如 `tags: [RSA, SageMath]`。

`/archive/` 按年月浏览；`/categories/` 展示分类树，父分类包含子分类中的文章；`/tags/t-稳定标识/` 展示相应标签的文章（实际链接由统一映射自动生成）。三者均由构建时静态生成，无需客户端过滤脚本。

使用二、三级标题生成目录。公式用 `$...$` 与独立行 `$$...$$`；代码用 `python`、`sage` 或 `sagemath` 围栏。SageMath 示例必须在真正的 SageMath 环境执行，高亮不会执行代码。

## 验证

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run check
npm.cmd run build
```

构建结果位于 `dist/`，可用 `npm.cmd run preview` 预览。不要直接双击 `dist/index.html`，站点内部使用根路径链接。

本机已装 Chrome 时，在启动预览后执行 `node scripts/verify.mjs` 可复验静态归档、分类、标签、公式、高亮、复制、目录与窄屏布局，并在项目外层更新截图与 `verification.json`。端口不是 4321 时可设置 `PREVIEW_URL`。

历史版本曾通过 Astro 构建及浏览器验证；本轮归档与分类改造后需要重新执行上述检查，旧的页面数和检查结果不可直接沿用。RSA 示例中的 Python 代码已在本机 Python 执行，并验证了整数根的精确值与边界。SageMath 仅验证了展示与高亮，本次没有执行 SageMath 计算。

开发环境和草稿预览禁止收录；生产文章允许收录。域名配置前省略 Canonical，上线前请配置真实 SITE_URL。404 页面保持 noindex。

配色与按钮参考用户随后提供的 CYBERSEC 黑绿截图；首页缩小展示区，以文章列表与作者侧栏为主体。文章保持灰白正文，绿色用于链接和导航。


## 部署路径与收录配置

不需要改源码或填写占位域名。通过进程环境变量设置：

```powershell
# SITE_URL 填写你自己的真实 origin，不含项目路径；未确定时可以不设置。
$env:SITE_URL='https://你的真实域名'
$env:BASE_PATH='/'
npm.cmd run build
```

独立域名和 GitHub Pages 用户主页仓库均使用 `/`。GitHub Pages 项目仓库使用真实 GitHub Pages origin 作为 SITE_URL，`BASE_PATH='/仓库名/'`（仓库名使用实际英文名）。BASE_PATH 允许单个仓库名及可选的首尾单斜杠；仓库名支持字母、数字、点、下划线、连字符，拒绝空字符串、点段、内部或重复路径分隔符和穿越输入。未设置或设为 `/` 时使用根路径。不要把项目路径重复写入 SITE_URL。这两个变量由进程环境读取，不会自动读取 `.env`。构建好的输出与配置绑定，不能仅移动 dist 改变 base；配置改变后需要重新构建。

## 草稿与查询

Front Matter 可选 `draft: true`，默认为 false，不影响已有文章。生产构建在统一的 `src/lib/posts.ts` 中排除草稿；开发环境可预览，列表和文章页有草稿提示。所有内容集合的展示与路由查询都应通过这个入口，避免自行绕过发布规则。

首页最多列出最近六篇；日期相同时按文章 ID 的英文排序确定顺序。归档保留全部公开文章。分类与标签路径由公开文章生成，标签区分大小写；父分类会汇总其子分类的文章。

## 工程回归检查

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run check
npm.cmd run build
npm.cmd test
# 另一个窗口先运行 npm.cmd run dev，然后：
npm.cmd run verify
```

`npm test` 需要已安装的 Chrome，在工作区的 work/ 临时副本中创建测试文章、构建和验证，最后只清理该临时副本。测试使用 `.invalid` 与 GitHub 示例 origin 断言 URL，绝不会发布。它验证未配置域名、独立域名、用户主页、项目子路径、草稿不泄露、六篇上限、同日排序、二级分类与静态标签路由、Canonical、公式、三个代码围栏、复制、窄屏与移动目录键盘操作，以及开发环境草稿预览。

详细修改、已验证范围与限制见 ENGINEERING-REPORT.md。目前没有 sitemap，不会产生草稿 sitemap 条目；未来若加入 sitemap，必须使用相同的发布过滤规则。现阶段没有新增 sitemap、RSS 或部署功能。


## 第二轮修复补充

`demo` 默认 false，`draft` 仍默认 false，二者相互独立。现有演示文章均显式为 demo:true，不会因此被排除于生产环境。正式文章无需声明 demo。

首页展示 recentPosts（最多六篇），数量标记与展示一致，归档入口明确标注全部文章。示例提示依据实际展示内容条件输出。关于页面动态引用最近文章，无文章时不输出文章链接；首页与归档有无文章提示。

`npm test` 额外检查省略 demo、显式 demo、移除全部示例、空内容、含点仓库名和非法路径。移除内容只发生在临时测试副本，不修改本项目文章。详见 ROUND-TWO-REPORT.md。



## Diagonal Binary Flow 首页

首页由顶部导航、最新文章、归档入口和页脚组成。终端、命令解释器和宣传区域已移除。最新六篇继续复用 getPosts 的生产草稿过滤、日期和文章 ID 排序。

背景由独立的 BinaryFlow.astro、binary-flow.ts 维护。固定的 0/1 序列重复三份，沿 -20° 轨迹以 12px/s 移动。每个逻辑字符的三份副本共同更新透明度，使循环边界处的图案和亮度相同。单个 200ms 调度器安排各字符独立的 1.5～3 秒平滑过渡，不重建 DOM，不修改字符内容。桌面四条，手机两条。

页面隐藏、背景离开视口时暂停；减少动态偏好下停止移动和亮度更新，显示低亮度静态底纹。详细验证及限制见 BINARY-FLOW-REPORT.md。

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd test
# 先启动本地预览，再运行：
npm.cmd run verify
node scripts/verify-binary-flow.mjs
```

截图：项目外层 binary-flow-desktop.png、binary-flow-tablet.png、binary-flow-mobile.png；动画专项结果为 binary-flow-verification.json。PREVIEW_URL 可以指定其他预览地址。历史工程报告描述的是各自提交时的状态。


## 分类与标签路径安全

分类的每一层只允许 Unicode 文字、数字、内部空格及 `._-`。不能使用路径分隔符、点段 `.` / `..`、首尾空白、尾随点、控制字符、百分号或系统保留名称（如 CON）。仍支持旧 `category`、任意深度的 `categories: [父, 子, 孙]` 和多个分类分支。分类按 NFC 规范化及大小写不敏感规则检查最终路径；不同名称若会共用页面，构建明确报错，不静默覆盖。

标签保留原始展示名称和精确匹配语义，包括斜杠、百分号、中文、空格及大小写差异。`src/lib/taxonomy-core.ts` 为名称计算稳定、固定长度的小写 ASCII 标识（FNV-1a 128，作为 URL 标识而非安全散列）；静态路由和所有标签链接统一使用它。全量生成时检查标识冲突，冲突即终止构建。标签重命名会改变 URL；尚未上线的旧原名标签 URL 不提供别名。

回归测试完全使用临时副本中的独立文章和 `tests/fixtures/`，不依赖项目中的示例文章或真实文章。`npm test` 覆盖 15 个场景，包括根路径和 `/ctf.notes/`、全部分类/标签文章集合、特殊标签、非法名称及路径冲突的预期构建失败、删除演示文章、空集合和开发草稿预览。浏览器验证也会在无演示和空集合场景独立运行。
