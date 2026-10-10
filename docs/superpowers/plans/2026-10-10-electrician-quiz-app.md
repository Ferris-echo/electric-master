# 高级电工考试跨平台刷题系统实施规划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 提取并精准对应文件夹中5套高级电工理论考试试卷与答案（共1000题及99张高清电气原理图/梯形图），构建一套全端响应式、支持iOS/Android/平板/电脑、国内网络100%直连、支持离线运行的现代化刷题Web App。

**Architecture:** 采用“数据提取清洗管线（Python Word COM/HTML解析器） + 纯前端零外部依赖响应式单页系统（Vanilla ES6+ / 现代化 CSS Grid & Flex） + 本地离线持久化存储（LocalStorage）”架构。前端资产同时生成“静态托管包（支持腾讯云EdgeOne等国内CDN极速部署）”与“纯单文件内嵌离线版（Single-file HTML，双击即用）”。

**Tech Stack:** Python 3 (Win32COM / BeautifulSoup / Regex / Base64), HTML5, Modern CSS3 (CSS Variables, Flexbox, Grid), Vanilla JavaScript (ES6+), LocalStorage API.

---

## Global Constraints

- **题量与答案完整性**：必须精准提取并校验全部 5 套试卷共 1000 道题目（800道单选题 + 200道判断题），答案匹配率必须达到 100%，无缺失答案。
- **图像资产保真**：必须完整保留电气原理图、PLC梯形图、波形图及公式符号（过滤印章与装订密封线等冗余背景），题干图片支持点击全屏高清缩放。
- **网络与兼容性**：前端代码严格禁止引入任何海外 CDN、Google Fonts 等受限资源；保证国内网络环境直连秒开。
- **设备体验适配**：
  - 手机端（iOS Safari / Android Chrome / 微信浏览器）：大触摸靶区、单手滑动切题、底部快捷答题栏。
  - 平板 / 电脑端：大屏自适应，双栏分栏（左侧试题与高清图，右侧答题卡矩阵导航）。

---

## Review Focus

1. **题干图片与文字排版对应**：Word转出的公式小图（如 $\beta$, $\tau$, $\omega$）与大原理图必须正确定位在题干或选项对应行内，不能错位或脱节。
2. **iOS Safari 安全与全屏体验**：配置完整的 Web App Manifest、Apple Touch Icon 及 `apple-mobile-web-app-capable` 标签，确保“添加到主屏幕”后无地址栏原生体验。
3. **模拟考试交卷评分逻辑**：考试时间 120 分钟倒计时、满分 100 分制（单选 0.5分/题，判断 0.5分/题），交卷前二次确认，交卷后完整显示错题比对。
4. **错题本持久化与防数据丢失**：本地存储键名需规范隔离，错题重做成功后提供“标记掌握并移出”机制，支持清空重置。
5. **离线单文件体积控制**：Base64 编码后的单个 HTML 文件需进行文本精简与图片压缩优化，控制在 1.5MB~2.5MB 内，保证在低配手机中加载不卡顿。

---

## Proposed Changes

```
d:\LEGION Y9000X\Desktop\高级电工考试\
├── build_question_bank.py           # [NEW] 题库解析提取、图文清洗与答案比对脚本
├── test_question_bank.py            # [NEW] 题库数据完整性与正确率自动化校验脚本
├── data/
│   ├── questions_db.json            # [NEW] 清洗后的全量1000题数据库 (JSON)
│   ├── questions_db.js              # [NEW] 前端直引版数据文件
│   └── images/                      # [NEW] 提取的全部电气原理图与公式图
├── web/                             # [NEW] 现代响应式 Web App 前端工程
│   ├── index.html                   # 刷题系统主页面
│   ├── app.css                      # 响应式样式与暗黑/明亮主题引擎
│   ├── app.js                       # 刷题引擎、模拟考倒计时、错题本逻辑
│   ├── manifest.json                # PWA 桌面配置
│   └── icons/                       # 应用图标
├── dist/                            # [NEW] 发布产物
│   ├── 高级电工刷题系统_单文件离线版.html # [NEW] 100%内嵌Base64的单文件胶囊版
│   └── 一键启动本地服务.bat           # [NEW] 双击启动并生成手机局域网扫码二维码
└── docs/
    └── 国内直连上线教程_EdgeOne.md    # [NEW] 1分钟免费部署国内永久直连网址指南
```

---

## Implementation Tasks

### Task 1: 数据解析与题目答案清洗管线

**Files:**
- Create: `build_question_bank.py`
- Create: `test_question_bank.py`
- Produces: `data/questions_db.json`, `data/questions_db.js`, `data/images/*`

**Interfaces:**
- Input: 9个源文件（`试卷正文*.doc`, `答案*.doc`, `2024年11月8日...doc`）
- Output: `questions_db.json` 包含 5 套试卷结构

- [ ] **Step 1: 编写数据完整性自动化测试 `test_question_bank.py`**
- [ ] **Step 2: 运行测试验证失败**
- [ ] **Step 3: 编写数据处理主脚本 `build_question_bank.py`**
- [ ] **Step 4: 运行构建与校验测试**

---

### Task 2: 响应式前端 UI 界面与交互设计

**Files:**
- Create: `web/index.html`
- Create: `web/app.css`
- Create: `web/manifest.json`

- [ ] **Step 1: 编写 `web/index.html` 骨架**
- [ ] **Step 2: 编写 `web/app.css` 现代化自适应样式**

---

### Task 3: 刷题逻辑与模拟考试引擎实现

**Files:**
- Create: `web/app.js`

- [ ] **Step 1: 编写练习与背题模式核心逻辑**
- [ ] **Step 2: 编写全真模拟考模块（120分钟倒计时、交卷判分）**
- [ ] **Step 3: 编写智能错题本与收藏夹模块**

---

### Task 4: 单文件离线胶囊版封装与国内部署打包

**Files:**
- Create: `pack_single_file.py`
- Produces: `dist/高级电工刷题系统_单文件离线版.html`
- Create: `start_server.py`
- Create: `dist/一键启动本地服务.bat`
- Create: `docs/国内直连上线教程_EdgeOne.md`

- [ ] **Step 1: 编写 `pack_single_file.py` 自动化内嵌打包脚本**
- [ ] **Step 2: 编写 `start_server.py` 本地局域网快速共享服务**
- [ ] **Step 3: 撰写腾讯云 EdgeOne 国内免费直连部署指南**

---

### Task 5: 全面验证与质量审核

- [ ] **Step 1: 运行自动化测试**
- [ ] **Step 2: 跨设备模拟测试（手机/平板/电脑）**
