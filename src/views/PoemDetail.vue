<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import poems from '../data/poems'

const route = useRoute()
const router = useRouter()

const poem = computed(() => poems.find(p => String(p.id) === String(route.params.id)))
const vertical = ref(false)
const openAnalysis = ref(true)
const openMedia = ref(true)

function toggleLayout() {
  vertical.value = !vertical.value
}

function back() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="container" v-if="poem">
    <div class="section">
      <button @click="back" style="border:none;background:transparent;color:var(--muted);cursor:pointer">← 返回</button>
      <div class="detail">
        <div class="detail-card">
          <h1 class="detail-title">{{ poem.title }}</h1>
          <p class="detail-meta">{{ poem.dynasty }} · {{ poem.author }}</p>

          <div class="detail-body">
            <div>
              <div class="block-title">原文
                <button @click="toggleLayout" style="float:right;border:1px solid var(--border);background:#fff;border-radius:8px;padding:4px 8px;color:var(--ink-soft);cursor:pointer">
                  切换为{{ vertical ? '横排' : '竖排' }}
                </button>
              </div>
              <div class="poem-text" :class="{ vertical }">
                <template v-for="(line, i) in poem.lines" :key="i">
                  <div v-if="vertical">{{ line }}</div>
                  <div v-else>{{ line }}</div>
                </template>
              </div>
            </div>

            <div class="fold">
              <header @click="openAnalysis = !openAnalysis">
                <strong>AI 赏析（示例占位）</strong>
                <span>{{ openAnalysis ? '－' : '＋' }}</span>
              </header>
              <div v-show="openAnalysis" class="content">
                <p>意象：{{ poem.imagery.join('、') }}</p>
                <p>情感脉络：从景入情，以“{{ poem.keyEmotion }}”贯穿全篇。</p>
                <p>文化关联：{{ poem.cultureHint }}</p>
                <p style="color:#9ca3af">说明：这里将对接后台 AI 接口返回结构化赏析。</p>
              </div>
            </div>
          </div>
        </div>

        <aside class="detail-card">
          <h3 class="block-title">多模态</h3>
          <div class="fold">
            <header @click="openMedia = !openMedia">
              <strong>朗诵 · 配图 · 场景</strong>
              <span>{{ openMedia ? '－' : '＋' }}</span>
            </header>
            <div v-show="openMedia" class="content">
              <ul style="margin:0;padding-left:18px">
                <li>名家朗诵音频（预留位）</li>
                <li>意境水墨插画（预留位）</li>
                <li>轻量 3D 场景（预留位）</li>
              </ul>
              <p style="color:#9ca3af;margin-top:8px">说明：点击后按需加载，避免首屏过重。</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <div v-else class="container">
    <div class="section detail-card">
      未找到该诗词，返回<a href="/" style="margin-left:6px">首页</a>
    </div>
  </div>
</template>

<style scoped>
</style>