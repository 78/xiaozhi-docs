---
id: downloads
title: Download and choose firmware
description: 'Choose firmware by chip, board, and variant, and distinguish current installations from historical versions.'
status: review
reviewedAt: '2026-11-15'
reviewNote: >-
  The official v2.6.0 Release was checked. Not every board binary has been run; confirm your hardware before
  downloading.
translation:
  status: review
  sourceHash: 17bf4ebbf009c645e366f7a74b82152c2cfb19572d1770cbf37b349918fe5c7a
  reviewedAt: '2026-11-15'
---
# Download and choose firmware

Firmware must match the board and hardware variant. Two ESP32-S3 devices may still be incompatible because their displays, audio chips, and pins differ.

<a name="scope"></a>

## Prefer the online builder and flasher {#scope}

For most devices, including breadboard builds, use the [XiaoZhi firmware builder](https://xiaozhi.me/console/firmware-builder) to generate matching firmware and flash it online. Follow the [online guide](./online-builder.md).

Use the alternatives below when you need a fixed historical version, an offline installation, or source changes. Some revisions of Tudouzi, KevinBox2, and other devices do not expose USB download pins; first check the [download-interface guidance](./flashing.md#prepare).

| What you need | Where to get it |
| --- | --- |
| Initial installation or routine updates for most devices | [Online builder](./online-builder.md): select the board, language, wake word, and supported options |
| A released default build | [v2.6.0 release downloads](./releases/v2.6.0.md): match the board, display, and networking variant |
| Custom hardware or code changes | [Build locally](../development/build-firmware.md) with a separate board identity |

As of **2026-11-14**, the official release checked for this page is **[v2.6.0](https://github.com/78/xiaozhi-esp32/releases/tag/v2.6.0)**. Check official Release notes for later versions; a fixed version in this guide is not permanently “the latest.”

<a name="identify"></a>

## 1. Identify the board and variant {#identify}

Collect the following before downloading. For a finished product, use the seller's or board maker's documentation; for a wired build, check the source configuration.

| Item | Why it matters |
| --- | --- |
| Chip | Targets such as `esp32s3`, `esp32c3`, and `esp32` differ |
| Board ID and build variant | These determine pins, peripheral initialization, and firmware upgrade identity |
| Flash / PSRAM | Capacity and interface affect resources, partitions, and startup |
| Display and audio | Display driver/resolution, microphone, and codec must match |
| Networking and provisioning | Wi-Fi/4G and hotspot/BluFi depend on the board and build options |

For example, the [basic S3 breadboard build](../hardware/breadboard-esp32-s3.md) uses `bread-compact-wifi` for a 128×32 OLED and `bread-compact-wifi-128x64` for 128×64. LCD and camera files are not interchangeable with these builds.

<a name="release"></a>

## 2. Download from an official release {#release}

1. Find the matching product, chip, and series in the [v2.6.0 download list](./releases/v2.6.0.md), or open the [official Release](https://github.com/78/xiaozhi-esp32/releases/tag/v2.6.0). Read its changes, support scope, and upgrade notes first.
2. Find the exact board and variant in the table, confirm the chip, and download and extract the full ZIP filename shown. GitHub's automatically generated **Source code** archives are not compiled device firmware.
3. Identify whether the package contains a merged image, an OTA application image, or multiple files. Follow the [image-type instructions](./flashing.md#image-types) for the correct write method.
4. If you cannot find the exact variant, use the online builder or ask the board maintainer. Do not flash the closest-looking filename as a trial.

<a name="checksum"></a>

### Check file integrity {#checksum}

If the release or build artifact provides a SHA-256 checksum, compare it first. These commands only calculate the local file's hash:

::: code-group

```powershell [Windows PowerShell]
Get-FileHash .\merged-binary.bin -Algorithm SHA256
```

```sh [macOS]
shasum -a 256 merged-binary.bin
```

```sh [Linux]
sha256sum merged-binary.bin
```

:::

Calculating a hash locally does not prove a file is trustworthy; compare it with a value from a trusted release channel. If no reference value is available, retain the source, version, and filename for traceability.

<a name="upgrades"></a>

## 3. Historical versions and layout changes {#upgrades}

| Situation | Action |
| --- | --- |
| A minor update for the same board with a compatible layout | Follow that release's OTA or web-upgrade instructions |
| Migrating from the v1 layout to the v2 layout | Check the hardware and target merged image, install as required by the migration, and prepare to provision Wi-Fi again |
| Changing pins, display, or board | Establish the adaptation first; do not overwrite custom hardware with an unsuitable standard build |
| Maintaining compatibility with an older device | Retain the exact version and file hash, and document why it cannot be upgraded |

This site maintains two download entries: the current [v2.6.0 list](./releases/v2.6.0.md) and [v1.9.4 for v1 devices](./releases/v1.9.4.md). Check partition changes before upgrading or downgrading; direct OTA cannot be assumed to work.

<a name="verify"></a>

## Check that you are ready {#verify}

::: tip Success checks
You can identify the firmware's source, version, target chip, board variant, and image type, and they match the physical device. You are ready to flash it.
:::

<a name="next"></a>

## Next steps {#next}

For most devices, [build and flash online](https://xiaozhi.me/console/firmware-builder). For offline installation, see [flashing and upgrades](./flashing.md). If the board is missing, read [custom board support](../development/custom-board.md) and establish a traceable firmware identity first.
