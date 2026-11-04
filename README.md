# Jiawulin

个人主页与软件作品集。默认中文，提供英文页面；以横向作品浏览和独立项目详情介绍记个球与天幕看图。

## 本地预览

需要 Node.js 20 或更新版本，无需安装运行依赖。

```sh
npm run build
npm run dev
```

打开 `http://127.0.0.1:4178`。可用 `PORT=4179 npm run dev` 修改预览端口。
`site/` 是完整静态站点，也可交给任意静态文件服务器。

## 维护

- `content/projects.mjs`：双语项目内容、外链与发布前提。
- `site/styles.css`、`site/main.js`：样式和渐进增强交互。
- `scripts/build.mjs`：生成中文及英文首页、项目详情、sitemap 和 robots。
- `site/assets/`：获准展示的品牌素材、截图和 Lucide 图标。

```sh
npm run check
PLAYWRIGHT_MODULE=/absolute/path/to/playwright npm run test:browser
npm run publish:check
```

构建只覆盖生成的 HTML、sitemap 和 robots；图片、样式和脚本保持原位。
浏览器测试使用独立临时上下文，输出至忽略的 `test-results/`。
天幕在线演示地址为 `http://tmviewer.com/`。发布前必须确认截图公开许可，且完成主页预览验收。
只发布 `site/`，不发布源码目录中的测试或内部文档。

## GitHub Pages

稳定分支为 `master`，站点通过 `.github/workflows/pages.yml` 发布。
仓库的 Settings → Pages → Source 选择 **GitHub Actions**。

- Pull Request 只运行构建与测试，不触发部署。
- 推送 `master` 或在该分支手动运行工作流，检查与发布条件通过后部署。
- 部署产物仅包含 `site/`；无需添加个人 Token Secret。
- 项目资料与外链修改 `content/projects.mjs`，截图维护于 `site/assets/projects/`。
- 回退时还原对应提交并推送 `master`，由工作流重新发布，不强制推送。

## 许可

主页源码采用 MIT；品牌、截图和第三方素材的许可见 `ASSET_CREDITS.md`。
