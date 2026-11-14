# 阅读顺序与图文素材复查 · 2026-11-14

复查其余 49 页，并回归 6 篇核心硬件教程，共 55 个中文页面、44 篇来源、749 个图片引用。英文仍待中文确认。

## 本轮结果

- 45 个中文页面有实际修正；其他页面记录保持当前组织的理由。
- 当前采用 106 个原图引用、100 个去重图片文件；本轮新采用 17 个引用，移出 16 个原有过期、误配或转交 SF32 维护者承接的引用，逐项去向仍保留。
- 新增 16 张流程、信号关系、电路或音频选区示意，保留 6 张核心硬件当前接线图。
- 首推官方 firmware-builder 在线烧录，明确部分 tudouzi/KevinBox2 硬件修订未引出 USB 下载接口。
- 控制台指南按新版实现重做；不使用旧布局截图引导点击。原生浏览器串口授权图仍适用。
- SF32 改为外链维护者的完整教程，中文导航直接跳转；原本地URL保留简短入口和一张识别图。
- Release 中 56 个原文件不删除、不重传；14 段视频仍留归档，其中4段在当前文章提供，SF32与旧编译界面的10段转历史归档。
- 右上角集中 QQ / Discord；采用固件主 README 的群号1095994019，中文 README 的1011329060差异留在审计，不在正文散落号码。

## 重要取舍

- 串口图归位端口识别；声音复刻分录音/上传，再进入共同编辑、复刻和智能体选用。
- 知识库按创建、上传、解析、切片、召回、启用能力、选库保存与设备验证组织。
- 纠正工具市场图误称架构图、芯片语音能力表误称制造约束表的问题。
- ASR的模块、下载器、词条程序、下载与样机接线分别对应；当前GPIO18指示灯补真实串联限流电路图。
- 电池与电源模块图片只放在定制电源识别中；USB移动电源有独立供电图。错误共地耳机转接图继续排除。
- SF32完整设计、焊接、外壳、视频与使用由嘉立创维护者教程承接；既有工程与二进制的校验/归档记录仍可追溯。

## 逐页清单

| 中文页面 | 结论 |
| --- | --- |
| [community/contributing.md](../docs/zh/community/contributing.md) | 问题反馈→提交修正→中文确认后翻译；无需教学截图，不混入源材料或迁移调试。 |
| [community/index.md](../docs/zh/community/index.md) | 案例与目录分开，保留维护者和平台边界；迁移检查内容不在阅读反馈段显示。 |
| [community/mcp-tools.md](../docs/zh/community/mcp-tools.md) | 先选维护方式，再按项目查看维护入口；纠正工具市场图误称架构图，设备效果视频仅说明搜索效果。 |
| [community/open-hardware.md](../docs/zh/community/open-hardware.md) | 目录→复刻条件→投稿→下一步；原作者与设计链接保留，群号不嵌入文章。 |
| [community/projects/astronaut-storyteller.md](../docs/zh/community/projects/astronaut-storyteller.md) | 目标→断电拆机→音频→BAT/VIN/OUT电源→按键两端→装壳→验证；补电源与按键照片，保留板修订和3V3功放支路边界。 |
| [community/projects/sf32lb52-plugin.md](../docs/zh/community/projects/sf32lb52-plugin.md) | 按用户要求改为简短外链入口：已核对嘉立创完整教程及固件/资料页面，中文导航直达维护者；保留稳定本地URL、识别图和SF32平台差异，不复制电路/制作/软件教程。旧素材与校验值保留归档。 |
| [community/projects/wake-on-lan.md](../docs/zh/community/projects/wake-on-lan.md) | 先本地WoL→模块平台→语音；关系图替代含UUID/MAC/令牌的旧UI，第三方ESP8266文件单独说明，未宣称远程关机。 |
| [community/resources.md](../docs/zh/community/resources.md) | 17组音频/LRC已成对保留，播放下载与授权说明对应；不把文件下载等同设备点歌能力。 |
| [console/github-verification.md](../docs/zh/console/github-verification.md) | 小智登录→GitHub 授权→返回核对→查看当前权益；旧菜单、账号与内测权益表不再作教程截图。 |
| [console/index.md](../docs/zh/console/index.md) | 三条功能指南对照新版实现；移除“本地实现核对”的读者说明。 |
| [console/knowledge-base.md](../docs/zh/console/knowledge-base.md) | 创建→上传→解析→切片→召回→扩展能力启用→选库保存→设备验证；改掉旧图顺序，旧布局不再用作点击指引。 |
| [console/voice-cloning.md](../docs/zh/console/voice-cloning.md) | 确认开通→录音/上传分支→共同编辑→确认训练→智能体配置→设备验证；按当前两阶段实现重做，旧 UI 换流程与选区示意。 |
| [development/archive/p3-prompts.md](../docs/zh/development/archive/p3-prompts.md) | P3 仅为历史概念/版本入口，当前流程跳 OGG；旧代码截图不能误导新安装。 |
| [development/audio-and-aec.md](../docs/zh/development/audio-and-aec.md) | 先基础音频，再参考信号与依赖，最后同条件比较；信号图不冒充新增麦克风电路。 |
| [development/build-firmware.md](../docs/zh/development/build-firmware.md) | SDK 与固件目录分开，先激活版本再选板型和构建；当前 IDF6 命令替代 IDF5 图片。 |
| [development/custom-board.md](../docs/zh/development/custom-board.md) | 硬件清单→目录/注册→独立身份→构建→OTA/分阶段验证；目录树与关系图解释文件职责，不复制旧删除 OTA 分区图。 |
| [development/custom-prompts.md](../docs/zh/development/custom-prompts.md) | 源音频→OGG 转换→具体 zh-CN/wificonfig.ogg 替换→语言构建→真实事件试听；补齐原来含糊的文件位置。 |
| [development/index.md](../docs/zh/development/index.md) | 环境→独立板型→音频/唤醒/设备工具→资源；P3 只在历史分支。 |
| [development/mcp-gpio.md](../docs/zh/development/mcp-gpio.md) | 当前 LampController GPIO18 与 LED 串联电阻图对应；代码目录视频移入实现段，不冒充灯的实测效果。 |
| [development/wake-words.md](../docs/zh/development/wake-words.md) | 按键基准→选硬件模型→查询/配置→安装验证；补 menuconfig 入口与选择流程，旧模型/报价不作当前步骤。 |
| [faq/account-and-binding.md](../docs/zh/faq/account-and-binding.md) | 登录→找回→自主解绑→归属处理；按新版登录/设备操作说明，不公开批量解绑模板或具体设备标识。 |
| [faq/index.md](../docs/zh/faq/index.md) | 症状先分阶段再进入专页；不堆旧控制台或原始日志截图，重要连线图由对应指南承接。 |
| [faq/serial-logs.md](../docs/zh/faq/serial-logs.md) | 端口→连接采集→读阶段→遮盖后反馈；设备管理器图归位端口识别，补无需 SDK 的官方 miniterm 路径。 |
| [firmware/downloads.md](../docs/zh/firmware/downloads.md) | 开篇直达官方在线烧录；固定版本/离线/改源码再用其他入口；USB 下载条件独立说明。 |
| [firmware/flashing.md](../docs/zh/firmware/flashing.md) | 主流程首推官方在线烧录；先确认 USB 下载接口，包含 tudouzi/KevinBox2 部分修订例外；离线命令与 Windows GUI 明确分支。 |
| [firmware/index.md](../docs/zh/firmware/index.md) | 在线编译排在下载之前；离线/历史固件作为独立选项，不让新用户先挑 ZIP。 |
| [firmware/online-builder.md](../docs/zh/firmware/online-builder.md) | 新版配置关系→任务→原生串口授权→设备验证；移出旧表单与旧界面视频，不将旧额度/版本作为现行值。 |
| [firmware/releases/v1.9.4.md](../docs/zh/firmware/releases/v1.9.4.md) | 历史索引折叠，明确版本、镜像和布局；无必要 UI 配图，不引导新用户默认安装 v1。 |
| [firmware/releases/v2.2.4.md](../docs/zh/firmware/releases/v2.2.4.md) | 历史版本独立入口，IDF5.5.2 与当前 IDF6 分开；无图片遗漏。 |
| [firmware/releases/v2.5.2.md](../docs/zh/firmware/releases/v2.5.2.md) | 供旧设备维护的入口；去掉迁移交代，当前安装回到统一在线路径。 |
| [getting-started/index.md](../docs/zh/getting-started/index.md) | 先识别设备状态，再接线/在线烧录/配网/绑定；首推官方 firmware-builder，并说明 USB 未引出例外。 |
| [getting-started/wifi-and-binding.md](../docs/zh/getting-started/wifi-and-binding.md) | 热点与 BluFi 分支分开，联网成功图对应热点末尾；新版绑定采用设备码流程图，移出旧弹窗与个人 SSID。 |
| [hardware/audio-output.md](../docs/zh/hardware/audio-output.md) | 先选输出类型→扬声器→耳机/有源音箱→验证；保留插座识别，不复制 BTL 输出接共地耳机的错误线图。 |
| [hardware/battery-power.md](../docs/zh/hardware/battery-power.md) | USB移动电源为主路径并有配套图；裸电池与电源模块照片只在定制电源识别段，不冒充 USB步骤或充电验证。 |
| [hardware/boards/xmini-c3.md](../docs/zh/hardware/boards/xmini-c3.md) | 先识别原版/V3/4G，再安装与联网；BOOT/USB照片放版本识别段，不复制旧控制台、IDF与MAC。 |
| [hardware/breadboard-4g.md](../docs/zh/hardware/breadboard-4g.md) | 复核两类模块与电源前提、44/42针总图和完成实物；旧 LDO/3V3 分支不能直接复制，信号按 v2.6.0。 |
| [hardware/breadboard-camera.md](../docs/zh/hardware/breadboard-camera.md) | 样机效果先于材料，摄像头/LCD识别图归准备段，当前信号图单独章节；不与普通S3 GPIO混用。 |
| [hardware/breadboard-esp32-c3.md](../docs/zh/hardware/breadboard-esp32-c3.md) | 主控/Codec/OLED照片归配件章；总图保留输入输出方向和 Codec 双电源语义，OLED/彩屏效果各自对应。 |
| [hardware/breadboard-esp32-s3.md](../docs/zh/hardware/breadboard-esp32-s3.md) | 复核上轮修复：效果→模块→当前总图/44-42针/反装→音频直连→专用 OLED→检查；OLED 段只允许 OLED 四线图。 |
| [hardware/breadboard-esp32.md](../docs/zh/hardware/breadboard-esp32.md) | 样机效果先展示，OLED丝印图归接线核对；当前SDA4/SCL15修正图保留，未验证的其他PCB不冒充固定方案。 |
| [hardware/choosing-hardware.md](../docs/zh/hardware/choosing-hardware.md) | 比较整套方案→进入对应教程→采购检查→收货检查；模块识别与线路图留在各搭建页。 |
| [hardware/design-guidelines.md](../docs/zh/hardware/design-guidelines.md) | 纠正把芯片/语音能力选型表误读为制造约束表的问题；选型→供电→声学→测试，具体电气参数不泛化。 |
| [hardware/displays/st7789.md](../docs/zh/hardware/displays/st7789.md) | 复核模块正反面→信号→44/42针总图→构建→完成；240×240 原图与默认240×320配置差异保留。 |
| [hardware/external-wake-module.md](../docs/zh/hardware/external-wake-module.md) | 模块/下载器/开发板/核心板先区分；再配置词条、下载与连接，安装和总接线照片对应各步骤，电平与启动前提明确。 |
| [hardware/index.md](../docs/zh/hardware/index.md) | 整套选型→具体板型→扩展/电源/音频；修正设计指南名称，反馈段不显示迁移核对信息。 |
| [hardware/supported-boards.md](../docs/zh/hardware/supported-boards.md) | 识别实物→当前目录查支持→对应指南→优先在线烧录；成品照片不作为芯片/修订的唯一依据。 |
| [index.md](../docs/zh/index.md) | 首页按用户任务分区；空白板优先在线编译，英文仍待中文确认。 |
| [mcp/connect-existing-servers.md](../docs/zh/mcp/connect-existing-servers.md) | 先识别传输并独立验证，再配置、桥接和实际调用；图形工具另列维护入口，不混入固件唤醒补丁。 |
| [mcp/examples/web-search.md](../docs/zh/mcp/examples/web-search.md) | 先最小 MCP 依赖，再供应商密钥与搜索；图示区分 MCP_ENDPOINT 和搜索 API Key，历史 GUI ZIP 明确归档用途。 |
| [mcp/index.md](../docs/zh/mcp/index.md) | 先最小例子，再现有服务，再搜索；不把设备工具和服务器工具混同。 |
| [mcp/quickstart.md](../docs/zh/mcp/quickstart.md) | 准备环境→固定桥接→安全整数工具→端点→真实调用；新增调用链，替代含令牌的旧截图。 |
| [reference/display-emotions.md](../docs/zh/reference/display-emotions.md) | 先分语义、显示实现与资源，再测常用/未知值；无原图遗漏，映射仍归 owning repo。 |
| [reference/index.md](../docs/zh/reference/index.md) | 按协议任务进入固件同版本规范；不在文档站维护分叉协议表。 |
| [reference/ota.md](../docs/zh/reference/ota.md) | 同版本契约→四种操作→配置/激活/更新排查→验证；具体头部/字段以固件仓库为准。 |
| [reference/websocket.md](../docs/zh/reference/websocket.md) | 基线→权威入口→报文分层→互通验证；旧状态图不复制，指向固件 v2.6.0 实现与文档。 |

## 验证范围

元数据、语言路径、44篇覆盖、1094个素材去向、图片SHA、图所在章节、构建和站内路径/锚点检查均执行；浏览器抽查见 [界面验证](reader-browser-verification-2026-11-14.json)。

本轮是编辑与页面验证，不是全硬件、电气、制造、生产 Console 或第三方服务验收。DOC-08 一张历史映射表及 DOC-28 三个不可读附件缺口继续保留；视频只抽样帧，不宣称全片或完整许可验收。
