<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import poems from '../data/poems'
import { getPoem, listAnnotations } from '../api/supabase'

const route = useRoute()
const router = useRouter()

const localPoem = computed(() => poems.find(p => String(p.id) === String(route.params.id)))
const remotePoem = ref(null)
const remoteAnns = ref([])

const poem = computed(() => remotePoem.value || localPoem.value)
const vertical = ref(false)
const openAnalysis = ref(true)
const openMedia = ref(true)
const openPinyin = ref(false)
const openTranslation = ref(true)
const openNotes = ref(false)
const selectedLine = ref(-1)

function toggleLayout() {
  vertical.value = !vertical.value
}
function selectLine(i) {
  selectedLine.value = i === selectedLine.value ? -1 : i
}
const lineAnnotation = computed(() => {
  if (!poem.value) return ''
  // 远端优先，其次本地 annotations
  if (remoteAnns.value && remoteAnns.value.length && selectedLine.value >= 0) {
    const hit = remoteAnns.value.find(a => a.line_index === selectedLine.value)
    return hit ? hit.content : '（暂无该句解析）'
  }
  const anns = poem.value.annotations || []
  return selectedLine.value >=0 ? (anns[selectedLine.value] || '（暂无该句解析）') : ''
})

onMounted(async () => {
  const id = route.params.id
  try {
    const p = await getPoem(id)
    if (p) {
      remotePoem.value = p
      try {
        const arr = await listAnnotations(p.id)
        remoteAnns.value = Array.isArray(arr) ? arr : []
      } catch { /* 忽略注释失败 */ }
    }
  } catch {
    // 回退到本地
  }
})

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
                  <div
                    :style="{background: i===selectedLine ? '#fffbe6' : 'transparent', cursor:'pointer', borderRadius:'6px', padding:'2px 4px'}"
                    @click="selectLine(i)"
                  >
                    {{ line }}
                  </div>
                </template>
              </div>
            </div>

            <div class="fold">
              <header @click="openAnalysis = !openAnalysis">
                <strong>AI 赏析（示例占位）</strong>
                <span>{{ openAnalysis ? '－' : '＋' }}</span>
              </header>
              <div v-show="openAnalysis" class="content">
                <p v-if="selectedLine>=0"><strong>逐句解析：</strong>{{ lineAnnotation }}</p>
                <p>意象：{{ poem.imagery.join('、') }}</p>
                <p>情感脉络：从景入情，以“{{ poem.keyEmotion }}”贯穿全篇。</p>
                <p>文化关联：{{ poem.cultureHint }}</p>
                <p style="color:#9ca3af">说明：这里将对接后台 AI 接口返回结构化赏析。</p>
              </div>
            </div>

        <div class="detail-card">
          <h3 class="block-title">辅助信息</h3>
          <div class="fold" style="margin-bottom:10px;">
            <header @click="openPinyin = !openPinyin">
              <strong>拼音</strong>
              <span>{{ openPinyin ? '－' : '＋' }}</span>
            </header>
            <div v-show="openPinyin" class="content">
              <div v-if="poem.pinyin?.length">
                <div v-for="(py, i) in poem.pinyin" :key="i">{{ py }}</div>
              </div>
              <div v-else style="color:#9ca3af">暂无拼音数据</div>
            </div>
          </div>

          <div class="fold" style="margin-bottom:10px;">
            <header @click="openTranslation = !openTranslation">
              <strong>译文</strong>
              <span>{{ openTranslation ? '－' : '＋' }}</span>
            </header>
            <div v-show="openTranslation" class="content">
              <div v-if="poem.translation">{{ poem.translation }}</div>
              <div v-else style="color:#9ca3af">暂无译文</div>
            </div>
          </div>

          <div class="fold">
            <header @click="openNotes = !openNotes">
              <strong>注释</strong>
              <span>{{ openNotes ? '－' : '＋' }}</span>
            </header>
            <div v-show="openNotes" class="content">
              <ul v-if="poem.notes?.length" style="margin:0;padding-left:18px;">
                <li v-for="(n,i) in poem.notes" :key="i">{{ n }}</li>
              </ul>
              <div v-else style="color:#9ca3af">暂无注释</div>
            </div>
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