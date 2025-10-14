# 诗韵灵犀 · 前端（Vue 3 + Vite）

本项目是“诗词赏析平台”的 Web 端，采用 Vue 3 + Vite。当前已实现：
- 基础导航与全局主题（新中式·水墨风）
- 首页：主题横幅、快捷入口、推荐诗词卡片流
- 详情页：原文竖/横排切换、AI 赏析与多模态占位
- 路由：/ 与 /poem/:id

## 快速开始
```bash
npm install
npm run dev
```

## 目录结构
- src/assets/theme.css 全局主题样式
- src/data/poems.js 示例诗词数据
- src/router/index.js 路由配置
- src/views/Home.vue 首页
- src/views/PoemDetail.vue 详情页
- src/App.vue 布局与导航
- src/main.js 入口

## 下一步规划（与 PRD 对齐）
- 引入 Pinia 管理用户画像/推荐/学习记录
- 接入后端 API：AI 赏析、多模态资源
- 教育管理台与研究台视图
- 路由守卫与角色权限"# poem-app" 
"# poem-app" 
