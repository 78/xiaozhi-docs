<script setup lang="ts">
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

onMounted(() => {
  let saved: string | null = null
  try { saved = localStorage.getItem('xiaozhi-docs-locale') } catch { /* Use browser language. */ }
  const preferred = navigator.languages?.[0] || navigator.language || 'en'
  const locale = saved === 'zh' || saved === 'en' ? saved : /^zh\b/i.test(preferred) ? 'zh' : 'en'
  window.location.replace(`${withBase(`/${locale}/`)}${window.location.search}${window.location.hash}`)
})
</script>

<template><span aria-hidden="true" /></template>
