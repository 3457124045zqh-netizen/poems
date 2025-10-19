<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listPoems, listAssets } from '../api/supabase'

const router = useRouter()

const entries = [
  { label: '按主题找诗', to: '/', icon: '🌙' },
  { label: '教材同步', to: '/edu', icon: '📘' },
  { label: '我的学习', to: '/learning', icon: '📒' },
  { label: 'AI 赏析', to: '/assistant', icon: '✨' },
]

const all = ref([])
const featured = ref([])
const coverById = ref({})

/** 当没有封面资源时的兜底图片（按诗词 id 生成稳定占位图） */
function getFallback(poem) {
  const title = (poem && poem.title) ? String(poem.title) : '诗词';
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'>" +
      "<defs>" +
        "<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
          "<stop offset='0%' stop-color='#e5e7eb'/>" +
          "<stop offset='100%' stop-color='#d1d5db'/>" +
        "</linearGradient>" +
      "</defs>" +
      "<rect width='600' height='300' fill='url(#g)'/>" +
      "<text x='300' y='160' text-anchor='middle' font-size='28' fill='#6b7280' font-family='Segoe UI,Roboto,Helvetica,Arial,Noto Sans,sans-serif'>" +
        (title || '') +
      "</text>" +
    "</svg>";
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
const q = ref('')
const filtered = computed(() => {
  const kw = q.value.trim()
  const source = all.value || []
  if (!kw) return featured.value
  return source.filter(p => {
    const base = [p.title, p.author, p.dynasty, p.brief, (p.imagery||[]).join(' '), (p.tags||[]).join(' ')].join(' ')
    return base.includes(kw)
  })
})

onMounted(async () => {
  try {
    const remote = await listPoems(100)
    if (Array.isArray(remote) && remote.length) {
      all.value = remote
      featured.value = remote.slice(0, 6)
      // 加载每首诗的封面图
      for (const p of featured.value) {
        try {
          const assets = await listAssets(p.id)
          const cover = Array.isArray(assets) ? assets.find(a => a.kind === 'cover') : null
          if (cover && cover.url) coverById.value[p.id] = cover.url
        } catch {}
      }
    }
  } catch {
    // 忽略，回退到本地数据
  }
})

function goDetail(poem) {
  router.push({ name: 'poem-detail', params: { id: poem.id } })
}
function goEntry(e) {
  if (e.to && e.to !== '/') router.push(e.to)
}
</script>

<template>
  <div class="container">
    <section class="hero">
      <h1 class="hero-title">诗韵灵犀 · 懂诗意，有共鸣</h1>
      <p class="hero-sub">AI 驱动的古诗词沉浸式学习与赏析平台</p>

      <div class="quick-entries">
        <a v-for="e in entries" :key="e.label" class="quick-entry" :href="e.to" @click.prevent="goEntry(e)">
          <span style="font-size:18px">{{ e.icon }}</span>
          <span>{{ e.label }}</span>
        </a>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">诗词精选 · 支持搜索</h3>
      <div style="margin-bottom:12px;">
        <input v-model="q" placeholder="搜索：标题/作者/朝代/意象，例如 月 明" style="width:100%;border:1px solid var(--border);border-radius:10px;padding:10px 12px;outline:none;">
      </div>
      <div class="cards">
        <article class="card" v-for="p in filtered" :key="p.id" @click="goDetail(p)" style="cursor:pointer">
          <div
            class="card-cover"
            :style="{ backgroundImage: `url(${coverById[p.id] || getFallback(p)})` }"
          ></div>
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
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{background:#fff;border:1px solid var(--border);border-radius:12px;overflow:hidden}
.card-cover{height:96px;background:linear-gradient(#f4f4f4,#eee);background-size:cover;background-position:center}
.card-body{padding:12px}
.card-title{margin:0 0 6px 0}
.card-meta{color:#666;font-size:12px;margin-bottom:6px}
.card-desc{color:#444;margin:0}
@media (max-width:768px){.cards{grid-template-columns:1fr}}
</style>