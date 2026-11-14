---
id: "online-builder"
title: "在线编译与网页烧录"
description: "不用安装 ESP-IDF，为自己的板型生成固件并通过浏览器写入。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已用嘉立创实战派 S3 完成生产 Console 在线烧录，记录真实进度及成功界面，并从启动日志确认 2.6.0、网络重连和 idle；其他板型及实体显示、音频、对话仍待验证。"
---

# 在线编译与网页烧录

在小智控制台选择硬件和功能，等待服务器生成固件，再下载或直接烧录。已有板型可以从这里开始，不需要先安装 ESP-IDF。

## 准备工作 {#scope}

先确定芯片、板型 ID、构建变体、屏幕和内存规格；不知道型号时先看[固件选择](./downloads#identify)。网页烧录另外需要支持 Web Serial 的桌面 Chrome/Edge、USB 数据线及相应串口驱动。大部分设备和面包板可用；部分土豆子（`tudouzi`）、KevinBox2 等修订没有引出 USB 下载引脚，请按[板卡下载接口](./flashing#prepare)处理。

只有当前编译目录里列出的板型可直接选择。自己改变引脚或尚未收录的新硬件，先走[自定义板型](../development/custom-board)流程。

## 1. 打开固件编译 {#open}

1. 登录[小智控制台](https://xiaozhi.me/console/)。
2. 进入 **固件编译**，也可直接打开[在线编译页面](https://xiaozhi.me/console/firmware-builder)，点击 **创建编译**。
3. 在弹窗顶部查看 **固件版本** 和 **源码 Commit**。创建任务时记录它们，后续反馈问题要用到。

普通已登录用户可以进入此功能。可创建次数、可用版本及硬件列表以当前页面为准，不把某次默认额度当作永久权益。

## 2. 选择硬件与功能 {#configure}

| 参数 | 怎么选择 |
| --- | --- |
| 目标芯片与开发板 | 与实物一致，名称相近不能代替核对 |
| 板型/构建变体 | 区分屏幕分辨率、通信方式及同系列硬件版本 |
| 固件语言 | 设备界面和提示音所用语言，不等于网站语言 |
| 唤醒词 | 从当前板型可用值中选，也可关闭；并非所有芯片都有同一组模型 |
| 显示、摄像头、音频 | 只调整该板支持的选项，缺少选项不意味着可以靠改型号开启 |
| 配网 | 选择硬件和固件支持的热点或 BluFi 路径 |

例如基础 OLED 面包板，选择 **Bread Compact Wi-Fi（面包板）**，再确认开发板 ID 和屏幕型号：128×32 使用 `bread-compact-wifi`，128×64 使用 `bread-compact-wifi-128x64`。不要为了看到摄像头选项而选成另一块板。

回声消除 AEC 需要音频电路及参考信号配合；只开启编译选项不能补齐硬件条件。

<span id="historical-video"></span>

<figure class="source-figure">

[![在线编译的基础配置：芯片、开发板、屏幕、语言和唤醒词。](/images/zh/console-builder-basic-2026-11-14.png)](/images/zh/console-builder-basic-2026-11-14.png)

<figcaption>面包板的基础配置示例。先核对开发板 ID 与屏幕型号，再选语言和唤醒词；版本、选项和当日额度以实际页面为准。</figcaption>
</figure>

切换到 **音频与配网** 检查当前板型提供的选项；未改动的项目沿用开发板默认值。某些板型的 **显示与摄像头** 标签会灰显，属于正常情况。

<figure class="source-figure">

[![音频与配网页签中的 Wi-Fi 配网方式。](/images/zh/console-builder-network-2026-11-14.png)](/images/zh/console-builder-network-2026-11-14.png)

<figcaption>这套面包板可选择配网方式。可用项目随板型变化，不照抄其他设备的开关。</figcaption>
</figure>

同样显示“2.6.0”的在线构建与 [v2.6.0 正式发布包](./releases/v2.6.0)可能来自不同源码 Commit。需要复现同一个构建时，除版本号外还应保留 Commit 和参数。

## 3. 提交并等待编译 {#build}

1. 检查配置，点击 **编译固件**。
2. 保持任务记录，观察排队、准备源码、解析依赖、编译和上传等阶段。
3. 需要放弃时使用取消操作。不要因界面暂时没有新日志就重复提交。
4. 成功后查看详情，保存版本、源码 Commit、板型变体和所选参数。

任务历史中没有通用“重试”按钮。失败后先看错误和日志，修正参数或等待维护者处理，再按需要创建新任务。相同参数的任务可能复用缓存，完成很快不代表没有编译依据。

<figure class="source-figure">

[![完成的编译任务右侧提供烧录和下载操作。](/images/zh/console-builder-history-2026-11-14.png)](/images/zh/console-builder-history-2026-11-14.png)

<figcaption>已完成的嘉立创实战派 S3 任务示例。确认是自己的板型与目标版本，再使用右侧的“烧录”或“下载”；不按图片中的耗时判断其他任务是否正常。</figcaption>
</figure>

## 4. 下载或烧录 {#flash}

**下载留存**：保存完整镜像及任务信息，交给离线工具时按[镜像类型](./flashing#image-types)操作；下载的应用/OTA 产物不能当作完整镜像写到 `0x0`。

**网页烧录**：

1. 找到目标任务，点击右侧 **烧录**。
2. 在 **连接设备并烧录** 弹窗里核对开发板类型、开发板 ID、芯片、Commit 和参数。
3. 用 USB 数据线连接匹配的设备，按需[进入下载模式](./flashing#download-mode)。关闭占用该串口的调试工具。
4. 点击 **连接并开始烧录**，在浏览器串口选择框中选中开发板端口并连接。授权后会继续执行烧录，不再把它当作单纯的端口预览。
5. 等待下载、校验与写入完成，再按界面提示重启设备。

<figure class="source-figure">

[![连接设备并烧录：核对嘉立创实战派 S3 的板型、Commit 和编译参数。](/images/zh/console-flash-confirm-2026-11-14.png)](/images/zh/console-flash-confirm-2026-11-14.png)

<figcaption>烧录前的最后核对。此图是嘉立创实战派 S3 的任务，面包板用户应看到自己的板型信息；确认后才连接串口并开始写入。</figcaption>
</figure>

::: info 设备配置会不会丢失？
当前网页烧录按分区写入并跳过 NVS，但不会保证新旧 NVS 布局相同。普通同布局更新通常可保留 Wi-Fi；跨布局、全片擦除或离线连续写整包时，仍需准备重新配网。
:::

烧录过程中不要拔线、关闭连接或让电脑休眠。界面拒绝芯片/镜像时先核对硬件，不跳过检查。

### 选择正确的串口 {#serial-port}

选择插入开发板后出现的 USB 串口，再点击系统弹窗中的 **连接 / Connect**。同一台电脑可能连接了多个 ESP32，也可能列出蓝牙串口；通过插拔变化或设备信息确认目标，不照抄截图中的端口编号。

<figure class="source-figure">

[![macOS Chrome 串口选择框，选中 USB JTAG/serial debug unit 对应的小智设备。](/images/zh/console-serial-picker-macos-2026-11-14.jpg)](/images/zh/console-serial-picker-macos-2026-11-14.jpg)

<figcaption>macOS Chrome 示例：已选中目标 USB 串口，再点 Connect。弹窗语言跟随浏览器；端口名称和编号因电脑而异。</figcaption>
</figure>

<details>
<summary>Windows 的串口选择示例</summary>

<figure class="source-figure">

[![浏览器串口授权弹窗：选择插入开发板后出现的端口，COM 编号因电脑而异。](/images/zh/doc-18-image-011.webp)](/images/zh/doc-18-image-011.webp)

<figcaption>浏览器串口授权弹窗：选择插入开发板后出现的端口，COM 编号因电脑而异。</figcaption>
</figure>

</details>

### 查看分区写入进度 {#flash-progress}

连接后，页面会显示当前写入的分区与总进度。等待最终完成提示，期间保持网页和 USB 连接；不要把编译历史中的“已完成”当作设备已经烧录成功。

<figure class="source-figure">

[![嘉立创实战派 S3 正在写入 ota_0 分区，进度为25%。](/images/zh/console-flash-progress-2026-11-14.jpg)](/images/zh/console-flash-progress-2026-11-14.jpg)

<figcaption>实际分区写入中的画面。分区名和百分比会继续变化，25% 只是这张截图记录的时刻。</figcaption>
</figure>

### 等待成功并检查重启 {#flash-success}

看到 **固件烧录完成，设备正在重新启动。** 才表示网页写入流程成功。等待设备重新启动；如果页面提示需要手动重启，按提示操作，再检查设备的显示、声音和联网状态。

<figure class="source-figure">

[![网页烧录完成，绿色对勾与设备正在重新启动的成功提示。](/images/zh/console-flash-success-2026-11-14.jpg)](/images/zh/console-flash-success-2026-11-14.jpg)

<figcaption>烧录成功界面。写入成功后，仍需检查设备启动和基本功能，不只看编译任务的完成状态。</figcaption>
</figure>

## 怎么确认完成 {#verify}

::: tip 完成标志
编译任务已完成，网页也出现烧录成功提示，固件信息可追溯；设备重启后，显示/音频符合硬件，能联网并完成一次对话。
:::

## 常见问题 {#troubleshooting}

| 现象 | 处理方式 |
| --- | --- |
| 列表中没有自己的板 | 确认准确板型；定制接线使用独立适配，不选近似型号 |
| 参数灰显或没有某个开关 | 查看所选板的支持范围，不能推断所有硬件都支持相同功能 |
| 已到每日限制 | 以页面提示为准；删除历史记录不代表返还次数 |
| 排队/失败/超时 | 保存任务 ID、版本和错误摘要；有完整日志时下载后遮盖敏感信息再反馈 |
| 网页提示浏览器不支持 | 使用桌面 Chrome/Edge 和 HTTPS；检查[烧录准备](./flashing#prepare) |
| 下载链接不可用 | 产物有保留期限；保留重要文件，需要时重新创建任务 |

## 下一步 {#next}

新设备继续[配网与绑定](../getting-started/wifi-and-binding)；需要修改源码则转到[本地构建](../development/build-firmware)。
