# 图片体积优化 · 2026-11-14

图片优化阶段只在本地处理；随后按维护者授权完成历史清理和推送，见 [最终历史清理记录](git-history-cleanup-2026-11-14.md)。未合并PR。覆盖目前全部100张位图源文件；106个正文来源引用保留。

| 项目 | 处理前 | 处理后 |
| --- | ---: | ---: |
| 位图总量 | 95.62 MiB | 22.19 MiB |
| 文件数 | 100 | 98（2组重复图合并） |
| 最大单张 | 17.90 MiB | 1.14 MiB（需放大核对的接线图） |

整体减少76.79%。产品照最多1600px；装配照优先2200px，个别噪声较大照片按实测预算调整。42张接线、细字和关键标注图无损保留原尺寸，逐像素检查通过；并非所有照片使用同一质量参数。SVG保持矢量格式。

## 原件、方向与清晰度

- 原件按SHA-256保存在仓库外缓存；素材清单原有source sha不变，发布衍生文件另记SHA。
- 58组照片在相同显示尺寸下逐张对照，关键图保持像素。两张EXIF方向为6的照片先转成正确显示方向，再移除元数据，避免转换格式后侧转。
- 小而已压缩的文件没有为了统一扩展名而强制增大；大部分选择WebP，部分JPEG继续使用，具体候选大小均留在JSON。
- 一张约57KiB的小照片因色彩配置规范化而重编码，发布约77KiB；这个例外比总量小，不以破坏颜色换取形式上的每张都变小。

## 验证结果

`npm run check` 通过，包括内容、素材、图文放置、图片预算与生产构建。构建后112个HTML中的7975个站内引用、131次中文图片引用无缺失；98个发布图片的构建副本均匹配摘要。临时放入超出2200px的新图片时，检查能正确拒绝，测试文件已移除。25个SVG保持原字节。

浏览器抽查经典ESP32的页面与放大图、S3接线图、两张曾带EXIF旋转信息的故事机装配照，显示和方向正常。英文文件及翻译哈希未改。本轮完整目测覆盖58张照片的同尺寸对照，42张关键图另做逐像素检查；不把浏览器抽查描述成全页全设备验证。

## Git历史的区别

当前仓库旧历史已有约109.5MiB图像blob，origin/main的图片树也有约73.7MiB；不只是PR分支含有原始大图。替换当前文件、普通追加提交，甚至只squash本PR，都不会清除main已有历史中的大图。

本轮没有执行远端强推、删仓库、删Release或历史清理。现有原文件与Release仍在，后续若选择干净历史，应先保留原件归档并核对快照内容。

## 逐图结果

| 原文件 | 类别 | 原大小 KiB | 发布大小 KiB | 发布尺寸 | 处理 |
| --- | --- | ---: | ---: | --- | --- |
| `doc-05-image-001.png` | labeled | 364.3 | 214.7 | 340×490 | webp / lossless |
| `doc-05-image-002.png` | product | 347.9 | 25.6 | 755×689 | webp / lossy |
| `doc-05-image-003.jpg` | product | 451.5 | 143.8 | 718×1600 | webp / lossy |
| `doc-05-image-004.png` | product | 232.8 | 17.5 | 800×800 | webp / lossy |
| `doc-05-image-005.png` | product | 318.6 | 18.1 | 545×449 | webp / lossy |
| `doc-05-image-006.png` | product | 299.6 | 11.1 | 649×569 | webp / lossy |
| `doc-05-image-007.png` | product | 93.4 | 12.1 | 400×400 | webp / lossy |
| `doc-05-image-008.png` | product | 124.8 | 10.7 | 380×263 | webp / lossy |
| `doc-05-image-009.png` | product | 504.5 | 54.8 | 800×800 | webp / lossy |
| `doc-05-image-010.jpg` | product | 74.4 | 15.8 | 543×464 | webp / lossy |
| `doc-05-image-011.png` | product | 719.5 | 67.7 | 800×800 | webp / lossy |
| `doc-05-image-012.jpg` | product | 256.5 | 17.0 | 1240×732 | webp / lossy |
| `doc-05-image-013.jpg` | product | 193.8 | 193.8 | 1280×960 | jpeg / unchanged |
| `doc-05-image-014.jpg` | product | 364.9 | 42.4 | 602×1072 | webp / lossy |
| `doc-05-image-015.png` | product | 110.8 | 6.9 | 751×516 | webp / lossy |
| `doc-05-image-016.png` | product | 344.1 | 29.8 | 499×525 | webp / lossy |
| `doc-05-image-017.png` | labeled | 694.0 | 391.5 | 1581×1112 | webp / lossless |
| `doc-05-image-018.png` | labeled | 265.2 | 162.9 | 800×800 | webp / lossless |
| `doc-05-image-019.png` | wiring | 466.6 | 315.7 | 1125×835 | webp / lossless |
| `doc-05-image-020.png` | product | 38.9 | 1.9 | 244×179 | webp / lossy |
| `doc-05-image-021.jpg` | wiring | 1121.7 | 1121.7 | 1549×1146 | jpeg / unchanged |
| `doc-05-image-022.jpg` | wiring | 908.0 | 908.0 | 1387×1092 | jpeg / unchanged |
| `doc-05-image-023.png` | assembly | 3058.9 | 369.4 | 1280×960 | jpeg / lossy |
| `doc-05-image-024.jpg` | assembly | 57.4 | 77.7 | 640×480 | jpeg / lossy |
| `doc-05-image-025.png` | assembly | 787.2 | 73.6 | 640×696 | webp / lossy |
| `doc-05-image-026.jpg` | wiring | 1110.9 | 1110.9 | 1552×1145 | jpeg / unchanged |
| `doc-05-image-027.jpg` | wiring | 867.3 | 867.3 | 1327×1095 | jpeg / unchanged |
| `doc-05-image-028.jpg` | wiring | 194.4 | 194.4 | 1370×870 | jpeg / unchanged |
| `doc-05-image-029.jpg` | assembly | 341.0 | 272.5 | 1016×2200 | webp / lossy |
| `doc-05-image-030.jpg` | assembly | 272.3 | 216.0 | 1016×2200 | webp / lossy |
| `doc-05-image-031.png` | wiring | 1632.6 | 1167.9 | 1675×1139 | webp / lossless |
| `doc-05-image-032.png` | assembly | 1086.2 | 132.5 | 920×820 | webp / lossy |
| `doc-05-image-033.png` | wiring | 1503.4 | 1076.5 | 1614×1134 | webp / lossless |
| `doc-05-image-034.jpg` | assembly | 2771.8 | 495.3 | 1800×1581 | webp / lossy |
| `doc-05-image-035.jpg` | assembly | 282.8 | 282.8 | 1280×960 | jpeg / unchanged |
| `doc-05-image-036.jpg` | assembly | 297.9 | 297.9 | 1280×960 | jpeg / unchanged |
| `doc-05-image-037.jpg` | assembly | 250.3 | 250.3 | 1280×960 | jpeg / unchanged |
| `doc-05-image-038.jpg` | assembly | 155.2 | 155.2 | 1280×960 | jpeg / unchanged |
| `doc-05-image-039.jpg` | assembly | 160.4 | 160.4 | 1280×960 | jpeg / unchanged |
| `doc-06-image-001.png` | product | 219.1 | 14.9 | 439×350 | webp / lossy |
| `doc-06-image-002.png` | labeled | 209.8 | 99.0 | 403×344 | webp / lossless |
| `doc-06-image-003.jpg` | wiring | 782.7 | 782.7 | 1388×858 | jpeg / unchanged |
| `doc-06-image-004.png` | assembly | 4018.7 | 276.6 | 1716×1262 | webp / lossy |
| `doc-06-image-005.jpg` | wiring | 1104.6 | 1104.6 | 1739×1131 | jpeg / unchanged |
| `doc-07-image-001.png` | labeled | 1071.8 | 575.6 | 815×1045 | webp / lossless |
| `doc-07-image-002.png` | product | 219.1 | 14.9 | 439×350 | webp / lossy |
| `doc-07-image-003.png` | labeled | 209.8 | 99.0 | 403×344 | webp / lossless |
| `doc-07-image-004.jpg` | assembly | 5971.3 | 190.3 | 2200×1650 | webp / lossy |
| `doc-07-image-005.jpg` | assembly | 5192.2 | 193.4 | 2200×1650 | webp / lossy |
| `doc-08-image-003.png` | text | 21.6 | 6.4 | 987×514 | webp / lossless |
| `doc-08-image-005.png` | text | 18.4 | 8.0 | 521×371 | webp / lossless |
| `doc-08-image-009.png` | text | 114.9 | 72.3 | 532×847 | webp / lossless |
| `doc-09-image-006.png` | text | 64.1 | 30.6 | 417×821 | webp / lossless |
| `doc-11-image-001.png` | text | 34.7 | 18.8 | 549×319 | webp / lossless |
| `doc-12-image-001.png` | labeled | 87.0 | 65.5 | 1545×1150 | webp / lossless |
| `doc-12-image-002.png` | labeled | 271.2 | 143.4 | 865×641 | webp / lossless |
| `doc-12-image-003.png` | product | 175.1 | 9.8 | 727×692 | webp / lossy |
| `doc-12-image-009.png` | product | 273.5 | 17.7 | 421×457 | webp / lossy |
| `doc-12-image-011.jpg` | wiring | 922.1 | 910.4 | 1440×1214 | webp / lossless |
| `doc-12-image-012.jpg` | assembly | 434.7 | 434.7 | 1280×1707 | jpeg / unchanged |
| `doc-12-image-013.png` | assembly | 2723.1 | 294.3 | 980×1115 | webp / lossy |
| `doc-12-image-014.png` | assembly | 977.1 | 63.5 | 730×824 | webp / lossy |
| `doc-12-image-015.png` | assembly | 542.5 | 49.8 | 502×456 | webp / lossy |
| `doc-13-image-002.png` | labeled | 883.0 | 325.5 | 941×788 | webp / lossless |
| `doc-13-image-016.png` | assembly | 18329.7 | 434.7 | 2200×1821 | webp / lossy |
| `doc-13-image-017.jpg` | assembly | 1756.6 | 431.0 | 2200×1617 | webp / lossy |
| `doc-18-image-011.png` | text | 28.4 | 15.0 | 585×344 | webp / lossless |
| `doc-23-image-001.png` | text | 53.2 | 38.2 | 711×322 | webp / lossless |
| `doc-27-image-006.png` | text | 605.2 | 176.9 | 3840×1916 | webp / lossless |
| `doc-29-image-001.png` | product | 220.4 | 17.6 | 480×333 | webp / lossy |
| `doc-29-image-019.png` | labeled | 789.7 | 278.0 | 802×764 | webp / lossless |
| `doc-30-image-001.jpg` | product | 4398.7 | 69.2 | 1600×1213 | webp / lossy |
| `doc-31-image-003.png` | product | 410.6 | 11.8 | 566×615 | webp / lossy |
| `doc-31-image-004.png` | product | 89.9 | 8.5 | 298×315 | webp / lossy |
| `doc-31-image-012.png` | product | 266.3 | 26.8 | 648×603 | webp / lossy |
| `doc-32-image-006.jpg` | labeled | 86.9 | 86.9 | 898×732 | jpeg / unchanged |
| `doc-32-image-007.jpg` | labeled | 87.2 | 87.2 | 1068×936 | jpeg / unchanged |
| `doc-32-image-008.jpg` | product | 203.4 | 102.4 | 1079×1078 | webp / lossy |
| `doc-32-image-023.png` | text | 236.0 | 74.0 | 631×1405 | webp / lossless |
| `doc-32-image-029.png` | text | 6.7 | 2.1 | 497×147 | webp / lossless |
| `doc-32-image-033.png` | product | 724.6 | 34.9 | 725×672 | webp / lossy |
| `doc-32-image-034.png` | labeled | 1273.3 | 698.3 | 1079×703 | webp / lossless |
| `doc-32-image-051.png` | product | 619.9 | 64.8 | 1010×1004 | webp / lossy |
| `doc-32-image-052.png` | product | 471.3 | 28.0 | 947×726 | webp / lossy |
| `doc-34-image-002.png` | product | 535.4 | 22.7 | 914×638 | webp / lossy |
| `doc-34-image-003.png` | labeled | 220.7 | 93.3 | 676×521 | webp / lossless |
| `doc-35-image-002.png` | product | 420.0 | 14.0 | 858×638 | webp / lossy |
| `doc-44-image-001.png` | product | 206.8 | 10.0 | 325×296 | webp / lossy |
| `doc-44-image-003.jpg` | assembly | 162.7 | 162.7 | 1280×1707 | jpeg / unchanged |
| `doc-44-image-004.png` | labeled | 1192.5 | 487.6 | 756×755 | webp / lossless |
| `doc-44-image-005.png` | assembly | 322.8 | 17.6 | 596×425 | webp / lossy |
| `doc-44-image-006.png` | labeled | 599.6 | 255.3 | 779×580 | webp / lossless |
| `doc-44-image-007.png` | labeled | 623.1 | 254.5 | 754×577 | webp / lossless |
| `doc-44-image-008.png` | labeled | 486.9 | 227.0 | 362×656 | webp / lossless |
| `doc-44-image-009.jpg` | assembly | 4926.5 | 315.8 | 1650×2200 | webp / lossy |
| `doc-44-image-012.png` | labeled | 417.1 | 178.7 | 649×515 | webp / lossless |
| `doc-44-image-013.png` | labeled | 486.3 | 196.4 | 456×546 | webp / lossless |
| `doc-44-image-014.png` | labeled | 1309.0 | 610.0 | 687×961 | webp / lossless |
| `doc-44-image-015.jpg` | assembly | 5551.8 | 413.7 | 1650×2200 | webp / lossy |
| `doc-44-image-016.jpg` | assembly | 125.0 | 105.4 | 1707×1280 | webp / lossy |
