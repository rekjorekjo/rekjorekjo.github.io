# 首页终端化改造

## 实现范围

- 首页只保留顶部图形导航和居中的 900px 终端，移除双栏 Hero、CTA、静态分类、文章列表、侧栏与装饰结语。
- 终端初始仅两行欢迎信息。历史输出独立滚动，输入区固定在底部；没有桌面模拟、多窗口、霓虹效果或新增动画。
- 保留首页、归档、关于及搜索链接。图标仅在首页启用，手机也保留搜索入口；其他页面的导航视觉不变。
- help、whoami、ls、ls posts、ls 分类、open id、clear、pwd、date 均已实现；支持 `/help` 等前导斜杠写法。
- 分类与文章由统一 getPosts 查询生成。ls posts 展示最近六篇，分类命令展示该分类全部文章，标题可点击，open 使用真实文章 id。生产过滤草稿的逻辑不变。
- 作者资料来自 src/config.ts。邮箱和 GitHub 未配置时显示“未配置”，不会编造联系方式。填写有效邮箱和 HTTPS GitHub 地址后生成链接。
- 支持 Enter、上下方向键、恢复未提交输入、输入法组合输入、可见焦点、可聚焦滚动日志区及 aria 标签。
- 只使用文本节点和安全 DOM API，未使用 innerHTML、eval、真实 Shell 或系统命令。open 只接受内容集合中已知文章 id，不能执行任意地址。
- 当前页面内存保留最近 100 条命令和输出；刷新清空，不上传或持久化。date 使用浏览器当前时间和时区。

## 修改文件

- `src/pages/index.astro`：新首页结构、内容集合元数据传递。
- `src/scripts/terminal.ts`：命令解释、历史、输出和导航。
- `src/config.ts`：统一作者简介、兴趣与可选联系信息。
- `src/components/NavIcon.astro`、`src/layouts/Base.astro`：首页图形导航，其他页面保持原界面。
- `src/styles/terminal.css`：首页专用样式；仅由首页导入。
- `src/styles/layout.css`、`components.css`、`responsive.css`：清理已无对应 DOM 的旧首页专用样式，保留 PostList 和其他页面使用的共享样式。
- `scripts/check-terminal.mjs`：新增可复用终端浏览器检查。
- `scripts/regression.mjs`：将旧首页列表断言改为终端的真实数据与命令断言，保留原有工程回归。
- `scripts/verify.mjs`：实际内容和手机端终端、搜索及截图检查。
- `README.md`、本报告：更新配置与使用说明。

文章正文、归档页源码、文章页源码、内容模式、发布过滤和部署路径工具没有修改。没有新增或升级依赖。

## 实际验证

- Astro 类型检查：0 errors / 0 warnings / 0 hints。
- Production Build：8 个页面和现有图片正常生成。
- npm test：九种隔离场景全部通过，包含根路径、普通与含点子路径、无示例、空内容、开发草稿预览；生产草稿扫描、Canonical、标签、公式、Python/sage/sagemath 高亮、目录与复制继续验证。
- 各生产配置中执行全部终端命令及异常参数、前导斜杠、未知命令、HTML 注入字符串、历史上下键、未提交输入恢复、输出滚动和输入区可见性；open qa-0 在根路径与项目子路径均正确导航。
- 测试副本配置专用示例邮箱与 GitHub 地址，确认 whoami 链接生成；实际项目联系方式为空，验证不生成假地址。
- 实际桌面与手机 Chrome 检查通过，页面脚本错误为 0；360/390/768px 无整页横向溢出。手机搜索图标可以进入搜索并聚焦输入框。
- 截图已保存：homepage-desktop.png、homepage-mobile.png。文章桌面与手机截图与此前基线像素一致，未因首页样式清理改变文章页视觉。
- 本地长期运行的开发预览首次出现模块加载失败；重启当前 Astro 预览后复验正常。生产隔离测试未出现该错误。

## 限制与后续

邮箱和 GitHub 仍待作者提供真实值，可直接填写 src/config.ts。没有其他已知阻塞问题。

未验证 Safari、Firefox、真实手机软键盘或读屏软件；没有线上部署。短视口可能需要页面自身纵向滚动，但终端内部始终只有输出区滚动，输入区不会跟随历史输出滚动。

本地打开 npm.cmd run dev；验证命令为 npm.cmd run check、npm.cmd run build、npm.cmd test；预览启动后执行 npm.cmd run verify。没有推送，没有操作旧 Hexo。
