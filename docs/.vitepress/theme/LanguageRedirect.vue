<script setup lang="ts">
import { onMounted } from 'vue'
import { withBase } from 'vitepress'
import { redirectToPreferredLanguage } from './language-preference.mjs'

onMounted(() => {
  redirectToPreferredLanguage(window, withBase('/'))
})
</script>

<template><span aria-hidden="true" /></template>
