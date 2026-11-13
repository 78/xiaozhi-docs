<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, lang, site, frontmatter } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const url = computed(() => {
  const repository = site.value.themeConfig.socialLinks?.find(link => link.icon === 'github')?.link
  const params = new URLSearchParams({
    template: 'documentation.yml',
    title: `[Docs] ${page.value.title}`,
    page: `https://docs.xiaozhi.me/${page.value.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')}`
  })
  return `${repository}/issues/new?${params}`
})
</script>

<template>
  <div id="page-feedback" class="page-feedback">
    <strong>{{ zh && frontmatter.status === 'review' ? '帮助校对这篇中文教程' : zh ? '让文档更好用' : 'Help improve this guide' }}</strong>
    <p>{{ zh ? '请带上硬件型号、固件版本、卡住的步骤和实际结果。接线问题可附能看清丝印的照片。' : 'Include your hardware, firmware version, the step you tried, and what happened.' }}</p>
    <a :href="url" target="_blank" rel="noopener noreferrer">{{ zh ? '反馈文档问题 ↗' : 'Report a documentation issue ↗' }}</a>
  </div>
</template>
