<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter, lang, page } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const original = computed(() => withBase(`/zh/${page.value.relativePath.slice(3).replace(/index\.md$/, '').replace(/\.md$/, '.html')}`))
</script>

<template>
  <aside v-if="!frontmatter.redirectTo && frontmatter.status === 'draft'" class="page-notice" role="note">
    <strong>{{ frontmatter.translation?.status === 'pending' ? 'English translation pending' : zh ? '内容重构中' : 'Guide in preparation' }}</strong>
    <p v-if="frontmatter.translation?.status === 'pending'">This guide has not been translated yet. <a :href="original" lang="zh-Hans">Read the Chinese guide ↗</a></p>
    <p v-else>{{ zh
      ? '此页目前说明整理范围，完整操作步骤将在核验后发布。'
      : 'This page describes the planned scope. Verified instructions will be published after review.' }}</p>
  </aside>
  <aside v-else-if="frontmatter.status === 'review'" class="page-notice page-notice-review" role="note">
    <div class="page-notice-heading"><strong>{{ zh ? '社区校对中' : 'Community review' }}</strong><span v-if="frontmatter.reviewedAt">{{ frontmatter.reviewedAt }}</span></div>
    <p>{{ zh ? '欢迎反馈操作步骤、配图、硬件差异和翻译问题。具体适用版本与验证范围见正文。' : 'Help check instructions, illustrations, hardware differences, and wording. See the guide for applicable versions and verification limits.' }}</p>
    <a class="review-feedback-link" href="#page-feedback">{{ zh ? '反馈此页问题 ↓' : 'Suggest a correction ↓' }}</a>
  </aside>
  <aside v-if="frontmatter.translationStale && !frontmatter.redirectTo" class="page-notice" role="note">
    <strong>Translation needs review</strong>
    <p>The Chinese source has changed since this translation was reviewed. <a :href="original">Read the Chinese version</a>.</p>
  </aside>
</template>
