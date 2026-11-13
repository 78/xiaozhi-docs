<script setup>
import materials from '../data/materials.json'
import { computed } from 'vue'
const props = defineProps({ article: { type: String, required: true }, kind: String, only: String })
const items = computed(() => (materials[props.article] || []).filter(item =>
  (!props.kind || item.kind === props.kind) && (!props.only || props.only.split(',').includes(item.id))))
const size = bytes => bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`
</script>

<template>
  <div class="source-materials">
    <details v-for="item in items" :key="item.id">
      <summary>{{ item.label }} <span class="material-size">{{ size(item.size) }}<template v-if="item.duration"> · {{ item.duration }} 秒</template></span></summary>
      <p class="material-note">{{ item.note }}</p>
      <video v-if="item.kind === 'video'" controls preload="none" playsinline :aria-label="item.label" :src="item.url">浏览器不支持此格式，请下载播放。</video>
      <audio v-if="item.kind === 'audio'" controls preload="none" :aria-label="item.label" :src="item.url">浏览器不支持此格式，请下载播放。</audio>
      <p><a :href="item.url">下载原文件：{{ item.name }}</a></p>
      <p class="material-note">来源 {{ item.sourceArticle }} · SHA-256：<code class="material-hash">{{ item.sha256 }}</code></p>
    </details>
  </div>
</template>

<style scoped>
.source-materials { margin: 1.5rem 0; }
details { border-bottom: 1px solid var(--vp-c-divider); padding: .8rem 0; }
summary { cursor: pointer; font-weight: 600; line-height: 1.7; overflow-wrap: anywhere; }
.material-size { display: inline-block; font-size: .8rem; font-weight: 400; color: var(--vp-c-text-2); }
.material-note { font-size: .85rem; color: var(--vp-c-text-2); }
.material-hash { overflow-wrap: anywhere; word-break: break-all; }
video { display: block; width: 100%; max-height: 450px; background: var(--vp-c-bg-soft); }
audio { display: block; width: 100%; }
</style>
