---
id: "open-hardware"
title: "社区开源硬件目录"
description: "按作者与原项目追溯电路、外壳和固件支持，保留社区贡献。"
status: "review"
reviewedAt: "2026-11-14"
reviewNote: "已对照固件 v2.6.0 或当前 Console 实现；图片与附件按用途保留，实物和线上流程仍需社区复现。"
sourceArticles: ["DOC-37"]
---

# 社区开源硬件目录

这里汇总硬件设计来源，方便寻找原作者、电路和结构文件。进入目录不代表本站已经复测全部硬件，支持固件还要核对[当前板型](../hardware/supported-boards)。

## 项目与作者 {#projects}

| 项目 | 原作者/维护者 | 原始入口 |
| --- | --- | --- |
| Xmini-C3 开发板 | 虾哥 / tenclass01 | [立创项目](https://oshwhub.com/tenclass01/xmini_c3) |
| ESP32-S3 AI 语音板 | netero | [设计资料](https://oshwhub.com/netero/esp32-s3-ai) |
| xiaozhi_c3_hardware | Kevincoooool | [GitHub](https://github.com/Kevincoooool/xiaozhi_c3_hardware) |
| S3 44/42 针扩展板 | surfer | [设计资料](https://oshwhub.com/surferlong/esp32s3-xiaozhi-ai-chat-robot-de) |
| Wi-Fi/ML307 电源扩展 | 凡诚 / banana8 | [设计资料](https://oshwhub.com/banana8/xia-ge-zhuan-yong) |
| Moji 小智衍生版 | 阿慕希 / movecall | [设计资料](https://oshwhub.com/movecall/moji-xiaozhi-ai-derivative-editi) |
| ESP-SparkBot | 乐鑫小铁匠 / esp-college | [项目页](https://oshwhub.com/esp-college/esp-sparkbot) |
| C3 外壳 | Anbin | [结构设计](https://oshwhub.com/anbin/xiao-zhi-ai-yu-yin-dui-hua-kai-fa-ban-c3) |

## 怎样判断是否适合复刻 {#scope}

先看实际公开的文件与版本，而不是只看“开源”标签：

1. 是否有可获取的原理图、PCB/制造资料和外壳文件。
2. 文件对应哪一版硬件，哪些器件和接口与自己手头一致。
3. 原声明允许怎样使用/再分发，作者和第三方素材如何署名。
4. 能否找到匹配的固件、构建命令、已知问题和恢复方法。

只有群文件或过期网盘时，先请原维护者补公开入口，不把不完整的来源标成完整可复现。旧价格、库存和群号不再作为选型依据。

## 贡献新项目 {#contribute}

提交项目地址、作者、硬件版本、许可、资料清单、对应固件和一份实测说明。实物照片可以帮助识别；电路和尺寸仍以设计文件为准。

## 下一步 {#next}

查看[嘉立创 SF32 插件版教程](https://openkits-wiki.easyeda.com/zh-hans/hspi-sf32lb52/training/xiaozhi-ai/)与[故事机改造](./projects/astronaut-storyteller)。准备采购时结合[硬件选型](../hardware/choosing-hardware)，不要把目录顺序理解为商业推荐排序。
