---
id: account-and-binding
title: 'Sign in, recover an account, and unbind devices'
description: 'Distinguish SMS, Google, passwords, and device ownership before making changes.'
status: review
reviewedAt: '2026-11-15'
reviewNote: >-
  English translation checked against the current source. Technical and hardware verification limits are stated in the
  guide.
sourceArticles:
  - DOC-16
translation:
  status: review
  sourceHash: 564aced7d21fcf9ee58f5fa50f15654a6a77012bcc277bc641418b9f9d0baba1
  reviewedAt: '2026-11-15'
---
# Sign in, recover an account, and unbind devices

Identify the account you originally used before changing the device. Signing in with another phone number, reflashing, or clearing Wi-Fi does not move data from the original account.

<a name="scope"></a>

## Choose a path {#scope}

| Problem | Start here |
| --- | --- |
| SMS codes never arrive | [SMS sign-in](#sms) |
| Forgotten username or password | [Recover the original account](#recovery) |
| Change phone number or link Google | Sign in first, then use account settings |
| Transfer your device to someone else | [Unbind your device](#unbind) |
| Used device is bound to another account | [Ownership](#ownership) |

<a name="sms"></a>

## 1. SMS and Google sign-in {#sms}

In the [official Console](https://xiaozhi.me/console/), check the country/region code and follow current CAPTCHA/SMS steps. Check the number, signal, blocked messages, and send interval rather than repeatedly pressing send.

The current implementation directs **unregistered numbers outside +86** to Google sign-in. Existing international-number accounts may have different conditions. Follow explicit page notices; waiting ten minutes is not a universal solution.

Google sign-in, phone sign-in, and GitHub verification are different features. GitHub provides [linking and benefit verification](../console/github-verification.md) after sign-in. A GitHub username does not recover a XiaoZhi account.

<a name="recovery"></a>

## 2. Recover the original account {#recovery}

1. Identify the original phone number, Google account, or username. An empty new account does not mean old data disappeared.
2. If SMS/Google still signs in to the original account, sign in first, then change the password or linked methods in account settings.
3. If self-service recovery fails, use the official support channel and describe the original sign-in method and failing step. Never give strangers SMS codes or passwords.

Recovery entry points and progress depend on the current account page and support response.

<a name="unbind"></a>

## 3. Unbind a device you own {#unbind}

In the original account, open the agent's device management, identify the device, and use the current unbind/delete-device action. Read its effects before transferring the device.

Unbinding a device differs from deleting an agent. Check the selected object and consequences; do not delete an entire role to transfer one device. After transfer, the recipient follows [Provisioning and binding](../getting-started/wifi-and-binding.md).

<a name="ownership"></a>

## 4. A device bound to another account {#ownership}

Ask the previous owner to unbind first. If they cannot be reached, submit necessary purchase/ownership evidence and device details through official support for review. Ownership checks are not bypassed by reflashing.

Follow support's current evidence requirements. Do not post device identifiers or personal documents in public discussions.

<a name="verify"></a>

## Verify the result {#verify}

You can sign in to the original account and see the expected agents/devices. A transferred device is no longer owned by the original account and the recipient can bind it. Public reports contain only redacted logs, without full device identifiers or personal evidence.

<a name="next"></a>

## Next steps {#next}

Return to [Provisioning and binding](../getting-started/wifi-and-binding.md). For invalid device codes or a connected but inactive device, check [Troubleshooting](./index.md).
