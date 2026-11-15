---
id: breadboard-esp32-c3
title: C3 breadboard with ES8311 audio
description: Identify the Codec module and pins before building a C3 audio setup.
status: review
reviewedAt: '2026-11-15'
reviewNote: >-
  English translation checked against the current source. Technical and hardware verification limits are stated in the
  guide.
sourceArticles:
  - DOC-12
translation:
  status: review
  sourceHash: be5b4c1f7863f74ef2cf56dc1d07da2d6161ecf7c898e8a19d860f608af1f31e
  reviewedAt: '2026-11-15'
---
# C3 breadboard with ES8311 audio

This build uses a C3-N16-SF with an ES8311/NS4150 audio module, based on Xmini-C3. It is not a general wiring guide for any C3 with an INMP441 and MAX98357A.

<a name="scope"></a>

## Preparation {#scope}

Check the target chip, Flash capacity, Codec module schematic, PA enable pin, and display. The ES8311 module must include the required analog microphone and amplifier circuitry. Check whose perspective the DI/DO labels describe.

<a name="parts"></a>

## Identify the parts {#parts}

<figure class="source-figure">

[![C3 controller module.](../../public/images/zh/doc-12-image-001.webp)](../../public/images/zh/doc-12-image-001.webp)

<figcaption>C3 controller module.</figcaption>
</figure>

<figure class="source-figure">

[![ES8311 and NS4150 audio module; check the exact revision and silkscreen.](../../public/images/zh/doc-12-image-002.webp)](../../public/images/zh/doc-12-image-002.webp)

<figcaption>ES8311 and NS4150 audio module; check the exact revision and silkscreen.</figcaption>
</figure>

<figure class="source-figure">

[![OLED module.](../../public/images/zh/doc-12-image-009.webp)](../../public/images/zh/doc-12-image-009.webp)

<figcaption>OLED module.</figcaption>
</figure>

The audio module combines ES8311 and NS4150B. Do not apply the separate INMP441/MAX98357A wiring from the S3 build. The board, Codec, and OLED are shown above; the remaining parts follow.

<div class="module-grid">

<figure class="source-figure">

[![Enclosed speaker for the C3 build.](../../public/images/zh/doc-12-image-003.webp)](../../public/images/zh/doc-12-image-003.webp)

<figcaption>Enclosed speaker for the C3 build. Click to view full size.</figcaption>
</figure>

<figure class="source-figure">

[![Alternative speaker; match its impedance and connector to the amplifier.](../../public/images/zh/doc-05-image-010.webp)](../../public/images/zh/doc-05-image-010.webp)

<figcaption>Alternative speaker; match its impedance and connector to the amplifier. Click to view full size.</figcaption>
</figure>

</div>

<div class="module-grid">

<figure class="source-figure">

[![Short jumper wires for the C3 breadboard.](../../public/images/zh/doc-05-image-011.webp)](../../public/images/zh/doc-05-image-011.webp)

<figcaption>Short jumper wires for the C3 breadboard. Click to view full size.</figcaption>
</figure>

<figure class="source-figure">

[![Dupont wires between C3 modules.](../../public/images/zh/doc-05-image-012.webp)](../../public/images/zh/doc-05-image-012.webp)

<figcaption>Dupont wires between C3 modules. Click to view full size.</figcaption>
</figure>

</div>

<div class="module-grid">

<figure class="source-figure">

[![Interlocking breadboards for the C3 build.](../../public/images/zh/doc-05-image-013.jpg)](../../public/images/zh/doc-05-image-013.jpg)

<figcaption>Interlocking breadboards for the C3 build. Click to view full size.</figcaption>
</figure>

<figure class="source-figure">

[![Internal breadboard connections.](../../public/images/zh/doc-05-image-014.webp)](../../public/images/zh/doc-05-image-014.webp)

<figcaption>Internal breadboard connections. Click to view full size.</figcaption>
</figure>

</div>

<figure class="source-figure">

[![Optional tactile button; check which pins on each side are internally connected.](../../public/images/zh/doc-05-image-020.webp)](../../public/images/zh/doc-05-image-020.webp)

<figcaption>Optional tactile button; check which pins on each side are internally connected. Click to view full size.</figcaption>
</figure>

<a name="wiring"></a>

## 1. Check the firmware pins {#wiring}

The v2.6.0 `xmini/c3` configuration uses these pins. New hardware must actually match it; otherwise, create a [custom board](../development/custom-board.md).

| Function | GPIO |
| --- | --- |
| ES8311 I2C SDA / SCL | 3 / 4 |
| I2S MCLK / BCLK / WS | 10 / 8 / 6 |
| Codec ADC data into the MCU's DIN | 7 |
| MCU DOUT to the Codec DAC | 5 |
| PA enable | 11 |
| BOOT | 9 |

The display and Codec may share I2C. Check the bus, voltage, and device addresses separately. Use short wires and a reliable common GND. Matching GPIO names does not remove the need to check module power requirements.

<a name="wiring-diagram"></a>

### Overall wiring and module orientation {#wiring-diagram}

<figure class="source-figure wiring-figure">

[![C3 Codec, PA enable, and OLED signal connections.](../../public/images/en/breadboard-c3-signals-v2.6.0.svg)](../../public/images/en/breadboard-c3-signals-v2.6.0.svg)

<figcaption>Signal connections for firmware v2.6.0; this is not a physical header layout.</figcaption>
</figure>

The physical layout below labels both **3V3 and VCC/5VIN on the audio module. These are separate power pins**. Use the specific module's schematic to distinguish Codec power from amplifier power; do not short them together or interchange them. Interpret DI/DO according to this module's convention: Codec ADC output goes into ESP32 GPIO7, and ESP32 GPIO5 goes into the Codec DAC.

<figure class="source-figure wiring-figure">

[![C3-N16-SF, ES8311/NS4150B, and OLED physical layout. Read the signal-direction and separate-power-pin notes above.](../../public/images/zh/doc-12-image-011.webp)](../../public/images/zh/doc-12-image-011.webp)

<figcaption>C3-N16-SF, ES8311/NS4150B, and OLED physical layout. Read the signal-direction and separate-power-pin notes above. Click to view full size.</figcaption>
</figure>

<a name="build"></a>

## 2. Install and use the firmware {#build}

1. If reproducing the existing hardware exactly, choose the matching `xmini/c3` build. V3 and 4G use different configurations.
2. Obtain the matching version from the [online builder](../firmware/online-builder.md) or [official releases](../firmware/downloads.md), then follow [Flashing firmware](../firmware/flashing.md).
3. Check startup audio, the display, and buttons before [connecting and binding](../getting-started/wifi-and-binding.md).
4. Test recording and playback before enabling a wake model compatible with this chip.

C3 supports compatible lightweight WakeNet configurations, and the project also includes C3 4G boards. Models still depend on available resources, including the absence of PSRAM. See [Wake words](../development/wake-words.md).

<a name="assembly-results"></a>

## Finished builds and display variants {#assembly-results}

<a name="oled-result"></a>

### Basic OLED build {#oled-result}

<div class="module-grid">

<figure class="source-figure">

[![Completed C3 and OLED build.](../../public/images/zh/doc-12-image-012.jpg)](../../public/images/zh/doc-12-image-012.jpg)

<figcaption>Completed C3 and OLED build. Click to view full size.</figcaption>
</figure>

<figure class="source-figure">

[![Wiring on the other side of the C3 and OLED build.](../../public/images/zh/doc-12-image-013.webp)](../../public/images/zh/doc-12-image-013.webp)

<figcaption>Wiring on the other side of the C3 and OLED build. Click to view full size.</figcaption>
</figure>

</div>

<a name="lcd-example"></a>

### Color-display prototype {#lcd-example}

<div class="module-grid">

<figure class="source-figure">

[![C3 color-display prototype.](../../public/images/zh/doc-12-image-014.webp)](../../public/images/zh/doc-12-image-014.webp)

<figcaption>C3 color-display prototype. Click to view full size.</figcaption>
</figure>

<figure class="source-figure">

[![Close-up of the C3 color display pins and wiring.](../../public/images/zh/doc-12-image-015.webp)](../../public/images/zh/doc-12-image-015.webp)

<figcaption>Close-up of the C3 color display pins and wiring. Click to view full size.</figcaption>
</figure>

</div>

The color-display photos show an extension of this prototype. The `xmini/c3` configuration used here follows an I2C OLED path; these photos do not establish support for that SPI display in the same build. Before recreating the color-display variant, identify its display driver, SPI GPIOs, board code, and separate build configuration.

<a name="verify"></a>

## Verify the result {#verify}

The specified Codec and PA should record and play audio, the display should work, and a button should start a successful conversation. There should be no I2C failures, persistent crackling, or resets. For I2C problems, check SDA/SCL, pull-ups, power, and addresses before assuming firmware corruption.

<a name="materials"></a>

## Firmware and next steps {#materials}

Use a matching official build rather than an unidentified debug `.bin`. The [firmware's xmini/c3 directory](https://github.com/78/xiaozhi-esp32/tree/4de00aed740595a8713b01f8332b9b2cf30685bc/main/boards/xmini/c3) owns the board configuration. For an assembled board, see the [Xmini family](./boards/xmini-c3.md).
