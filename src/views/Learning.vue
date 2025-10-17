<script setup>
import { ref, onMounted, watch } from 'vue'
import { listLearningRecords } from '../api/supabase'

const now = () => new Date().toLocaleString()
const records = ref([
  { title: '静夜思', ts: now(), note: '明月意象强化乡思。' }
])

const title = ref('')
const note = ref('')

const cloudRecords = ref([])
onMounted(async () => {
  try {
    cloudRecords.value = await listLearningRecords(10)
  } catch {}

  try {
    const saved = JSON.parse(localStorage.getItem('learning_records') || '[]')
    if (Array.isArray(saved) && saved.length) records.value = saved
  } catch {}
})
  
watch(records, (v) => {
  try { localStorage.setItem('learning_records', JSON.stringify(v)) } catch {}
}, { deep: true })

function addRecord() {
  const t = title.value.trim()
  const n = note.value.trim()
  if (!t || !n) return
  records.value.unshift({ title: t, ts: now(), note: n })
  title.value = ''
  note.value = ''
}
</script>

<template>
  <div class="container section">
    <h2 class="section-title">我的学习</h2>
    <div class="detail-card" style="margin-bottom:12px;">
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <input v-model="title" placeholder="诗词标题，如 登鹳雀楼" style="flex:1;min-width:220px;border:1px solid var(--border);border-radius:10px;padding:8px 10px;outline:none;">
        <input v-model="note" placeholder="学习笔记，如 更上一层楼→志向" style="flex:2;min-width:260px;border:1px solid var(--border);border-radius:10px;padding:8px 10px;outline:none;">
        <button @click="addRecord" style="border:1px solid var(--border);background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer;color:var(--ink-soft)">添加</button>
      </div>
    </div>
    <div class="detail-card">
      <h3 class="block-title" style="margin:0 0 8px;">云端学习记录（learning_records）</h3>
      <ul style="margin:0 0 12px;padding-left:0;list-style:none;display:grid;gap:10px;">
        <li v-for="(r,i) in cloudRecords" :key="i" class="card" style="padding:12px;">
          <div class="card-body">
            <div class="card-meta">{{ new Date(r.created_at).toLocaleString() }} · 用时 {{ r.duration_secs }}s</div>
            <p class="card-desc" style="margin-top:6px;">{{ r.note || '（无备注）' }}</p>
          </div>
        </li>
        <li v-if="!cloudRecords.length" style="color:#9ca3af">暂无云端记录（RLS 可能限制写入）</li>
      </ul>
      <ul style="margin:0;padding-left:0;list-style:none;display:grid;gap:10px;">
        <li v-for="r in records" :key="r.title" class="card" style="padding:12px;">
          <div class="card-body">
            <h4 class="card-title" style="margin:0 0 4px;">{{ r.title }}</h4>
            <div class="card-meta">{{ r.ts }}</div>
            <p class="card-desc" style="margin-top:6px;">{{ r.note }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>