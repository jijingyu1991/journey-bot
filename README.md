<!--
 * @Date: 2025-04-10 13:31:58
 * @LastEditors: guantingting
 * @LastEditTime: 2025-05-06 17:02:39
-->

# Journey Bot 旅行机器人

<div align="center">
  <img src="./public/image/journey-map1.png" alt="Journey Map" width="800" />
</div>

## 快速开始 | Getting Started

### 数据库启动 | Start Database

首先，启动 MongoDB 数据库：| First, start the MongoDB database:

```bash
# 确保已安装Docker和Docker Compose | Make sure Docker and Docker Compose are installed
./start-db.sh
```

### 开发服务器 | Development Server

然后，运行开发服务器：| Then, run the development server:

```bash
npm run dev
# 或 | or
yarn dev
# 或 | or
pnpm dev
# 或 | or
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

您可以通过修改 `app/page.tsx` 开始编辑页面。当您编辑文件时，页面会自动更新。

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

本项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化并加载 [Geist](https://vercel.com/font)，这是 Vercel 的一个新字体系列。

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 数据库配置 | Database Configuration

项目使用 MongoDB 作为数据库：

The project uses MongoDB as the database:

- 数据存储在 `database/data` 目录下 | Data is stored in the `database/data` directory
- 通过 Docker 启动，配置在 `docker-compose.yml` 文件中 | Started via Docker, configuration in the `docker-compose.yml` file
- 连接字符串 | Connection string: `mongodb://admin:admin123@localhost:27018/journey-bot?authSource=admin`

## 了解更多 | Learn More

要了解有关 Next.js 的更多信息，请查看以下资源：

To learn more about Next.js, take a look at the following resources:

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 功能和 API。
- [学习 Next.js](https://nextjs.org/learn) - 一个交互式 Next.js 教程。

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

您可以查看 [Next.js GitHub 仓库](https://github.com/vercel/next.js) - 欢迎您的反馈和贡献！

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 部署 | Deploy

最简单的部署 Next.js 应用的方式是使用 Next.js 创建者提供的 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

查看我们的 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
