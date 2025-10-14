<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import poems from '../data/poems'

const router = useRouter()

const entries = [
  { label: '按主题找诗', to: '/', icon: '🌙' },
  { label: '教材同步', to: '/', icon: '📘' },
  { label: '我的学习', to: '/', icon: '📒' },
  { label: 'AI 赏析', to: '/', icon: '✨' },
]

const featured = ref(poems.slice(0, 6))

function goDetail(poem) {
  router.push({ name: 'poem-detail', params: { id: poem.id } })
}
</script>

<template>
  <div class="container">
    <section class="hero">
      <h1 class="hero-title">诗韵灵犀 · 懂诗意，有共鸣</h1>
      <p class="hero-sub">AI 驱动的古诗词沉浸式学习与赏析平台</p>

      <div class="quick-entries">
        <a v-for="e in entries" :key="e.label" class="quick-entry" :href="e.to" @click.prevent>
          <span style="font-size:18px">{{ e.icon }}</span>
          <span>{{ e.label }}</span>
        </a>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">今日主题 · 明月与乡思</h3>
      <div class="cards">
        <article class="card" v-for="p in featured" :key="p.id" @click="goDetail(p)" style="cursor:pointer">
          <div class="card-cover"></div>
          <div class="card-body">
            <h4 class="card-title">{{ p.title }}</h4>
            <div class="card-meta">{{ p.dynasty }} · {{ p.author }}</div>
            <p class="card-desc">{{ p.brief }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>