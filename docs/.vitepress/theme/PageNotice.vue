<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter, lang, page } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const original = computed(() => withBase(`/zh/${page.value.relativePath.slice(3).replace(/index\.md$/, '').replace(/\.md$/, '.html')}`))
</script>

<template>
  <aside v-if="frontmatter.status === 'draft'" class="page-notice" role="note">
    <strong>{{ frontmatter.translation?.status === 'pending' ? 'English translation pending' : zh ? '内容重构中' : 'Guide in preparation' }}</strong>
    <p v-if="frontmatter.translation?.status === 'pending'">The Chinese guide is open for community review. English translation will follow after that review. <a :href="original" lang="zh-Hans">Read the Chinese guide ↗</a></p>
    <p v-else>{{ zh
      ? '此页目前说明整理范围，完整操作步骤将在核验后发布。'
      : 'This page describes the planned scope. Verified instructions will be published after review.' }}</p>
  </aside>
  <aside v-else-if="frontmatter.status === 'review'" class="page-notice page-notice-review" role="note">
    <div class="page-notice-heading"><strong>中文初稿 · 社区校对中</strong><span v-if="frontmatter.reviewedAt">{{ frontmatter.reviewedAt }}</span></div>
    <p>欢迎反馈步骤、配图和硬件差异。英文将在中文校对后编写。</p>
    <a class="review-feedback-link" href="#page-feedback">反馈此页问题 ↓</a>
  </aside>
  <aside v-else-if="frontmatter.translationStale" class="page-notice" role="note">
    <strong>Translation needs review</strong>
    <p>The Chinese source has changed since this translation was reviewed. <a :href="original">Read the Chinese version</a>.</p>
  </aside>
</template>
