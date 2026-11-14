---
id: "github-verification"
title: "GitHub 认证与权益"
description: "在已登录的小智账号中绑定 GitHub，理解认证与开发者平台的区别。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-01"]
---

# GitHub 认证与权益

GitHub 认证是给已登录的小智账号绑定 GitHub。它用于相应模型和配额权益，不是独立登录方式，也不是商家开发者平台的开户。

## 准备工作 {#scope}

准备自己的小智账号和 GitHub 账号，确认都能正常登录。账号、模型和权益以当前控制台显示为准。

## 1. 打开认证页面 {#open}

登录[小智控制台](https://xiaozhi.me/console/)，进入账号菜单中的 GitHub 认证；也可直接打开[GitHub 认证页](https://xiaozhi.me/console/github-auth)。

## 2. 绑定并核对结果 {#bind}

1. 点击绑定 GitHub，进入 GitHub 授权页面。
2. 确认当前 GitHub 账号及授权目标，完成页面要求的操作。
3. 返回小智后核对绑定用户名和认证状态；如果失败，先看页面错误，不重复使用过期回调地址。
4. 重新打开模型和知识库页面，查看当前账号实际可用的选项及配额。

<figure class="source-figure">

[![GitHub 认证的操作顺序](/images/zh/github-auth-flow.svg)](/images/zh/github-auth-flow.svg)

<figcaption>GitHub 认证的操作顺序。点击查看大图。</figcaption>
</figure>

## 3. 理解权益范围 {#benefits}

| 内容 | 如何核对 |
| --- | --- |
| 模型与音色 | 查看当前智能体配置列表，服务可能调整 |
| 知识库与文档数量 | 查看[知识库](./knowledge-base)页面提示，账号类型不同 |
| 设备数量 | 以添加设备时的限制提示为准 |
| 商家开发能力 | 与 GitHub 绑定分开，按商家平台要求办理 |

服务权益可能调整，购买或配置前再次核对账号页面。

## 取消绑定与验证 {#verify}

取消前阅读页面提示。当前取消 GitHub 认证会使会话退出，需要重新登录；不要以退出后仍显示的旧页面判断权益。重新登录后确认绑定状态、可选模型和已有业务是否符合预期。

## 下一步 {#next}

继续[知识库](./knowledge-base)或[声音复刻](./voice-cloning)。登录本身有问题时看[账号排查](../faq/account-and-binding)。
