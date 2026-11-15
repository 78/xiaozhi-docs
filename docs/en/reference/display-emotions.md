---
id: display-emotions
title: Emotion fields and display resources
description: 'Check semantics, resource mappings, and fallback against the firmware version.'
status: review
reviewedAt: '2026-11-15'
reviewNote: Applies to firmware v2.6.0. The firmware repository owns the full specification and implementation.
sourceArticles:
  - DOC-39
translation:
  status: review
  sourceHash: 94b05422e41a79bfb41bc3564b24ee11f5ccff8ec23342f51d742cd1405fab8c
  reviewedAt: '2026-11-15'
---
# Emotion fields and display resources

Server emotion semantics, Unicode emoji, and screen graphics are different objects. The matching firmware repository defines message protocols and resource mappings.

<a name="scope"></a>

## Identify the layer {#scope}

| Layer | Check |
| --- | --- |
| Protocol | Message types and emotion fields in the [versioned WebSocket documentation](https://github.com/78/xiaozhi-esp32/blob/4de00aed740595a8713b01f8332b9b2cf30685bc/docs/websocket.md) |
| Display implementation | Actual SetEmotion paths in [main/display](https://github.com/78/xiaozhi-esp32/tree/4de00aed740595a8713b01f8332b9b2cf30685bc/main/display) |
| Fonts, animations, images | This build's resource package and name mappings |

<a name="verify"></a>

## Troubleshooting order {#verify}

1. Confirm firmware and theme/resource-package versions.
2. Observe the actual received emotion value, then check whether the display implementation can find its resource.
3. Test common and unknown values. Record whether it falls back, retains the previous image, or errors.
4. Check on the target screen. A screenshot from another OLED or LCD is not a substitute.

Tokenizers differ, so an emoji is not guaranteed to be one token in every model. Similar-looking graphics do not make resource names interchangeable.

<a name="next"></a>

## Updating resources {#next}

Add emotion values or mappings together with implementation, resources, and tests in the firmware/resource repository, then update this site's versioned links. For sound resources, see [Custom prompt sounds](../development/custom-prompts.md).
