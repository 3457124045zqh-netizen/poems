<script setup>
import { ref, onMounted } from 'vue'
import { listAIResponses } from '../api/supabase'

const messages = ref([
  { role: 'ai', text: '你好，我是你的诗词学习伙伴。想聊哪首诗？' }
])
const input = ref('')
const aiLogs = ref([])
onMounted(async () => {
  try { aiLogs.value = await listAIResponses(5) } catch {}
})
const API_URL = (typeof localStorage !== 'undefined' && localStorage.getItem('AI_API')) || ''
const apiInput = ref(API_URL)
function saveApi() {
  try { localStorage.setItem('AI_API', apiInput.value || '') } catch {}
}

function send() {
  const text = input.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', text })
  input.value = ''
  // 优先尝试后端接口，失败则使用本地 Mock
  if (API_URL) {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: text })
    }).then(r => r.json()).then(data => {
      const reply = data?.reply || '（占位）我将从意象与情感脉络开始分析。'
      messages.value.push({ role: 'ai', text: reply })
    }).catch(() => {
      setTimeout(() => {
        messages.value.push({ role: 'ai', text: '好的，我会从意象与情感脉络开始分析。' })
      }, 400)
    })
  } else {
    setTimeout(() => {
      messages.value.push({ role: 'ai', text: '好的，我会从意象与情感脉络开始分析。' })
    }, 400)
  }
}
</script>

<template>
  <div class="container section">
    <h2 class="section-title">AI 助手 · 对话式赏析</h2>
    <div class="detail-card" style="display:flex;flex-direction:column;gap:10px;min-height:360px;">
      <div style="display:flex;gap:8px;align-items:center;">
        <span class="block-title" style="margin:0;">AI 接口：</span>
        <input v-model="apiInput" placeholder="http(s)://your-endpoint" style="flex:1;border:1px solid var(--border);border-radius:8px;padding:6px 10px;outline:none;">
        <button @click="saveApi" style="border:1px solid var(--border);background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer;color:var(--ink-soft)">保存</button>
        <span style="color:#9ca3af;font-size:12px;">未配置将自动使用本地 Mock</span>
      </div>
      <div style="flex:1; overflow:auto; display:flex; flex-direction:column; gap:10px;">
        <div
          v-for="(m, i) in messages"
          :key="i"
          :style="{
            alignSelf: m.role==='user' ? 'flex-end' : 'flex-start',
            maxWidth:'70%',
            background: m.role==='user' ? '#fff' : '#fafafa',
            border:'1px solid var(--border)',
            borderRadius:'12px',
            padding:'10px 12px',
            color:'var(--ink-soft)'
          }"
        >
          {{ m.text }}
        </div>
      </div>

      <div class="detail-card" style="margin-top:10px;">
        <div class="card-meta" style="margin-bottom:6px;">最近 AI 记录（来自表 ai_responses）</div>
        <ul style="margin:0;padding-left:18px;">
          <li v-for="(r,i) in aiLogs" :key="i">
            <span style="color:var(--muted);font-size:12px;">{{ new Date(r.created_at).toLocaleString() }}</span>
            ：{{ (r.context?.ask) || '[提问]' }} → {{ (r.response?.analysis || r.response?.board || JSON.stringify(r.response)) }}
          </li>
          <li v-if="!aiLogs.length" style="color:#9ca3af">暂无记录</li>
        </ul>
      </div>

      <div style="display:flex;gap:8px;margin-top:10px;">
        <input
          v-model="input"
          placeholder="输入你的问题，例如：‘登鹳雀楼的志向如何体现在意象中？’"
          style="flex:1;border:1px solid var(--border);border-radius:10px;padding:10px 12px;outline:none;"
          @keyup.enter="send"
        />
        <button
          @click="send"
          style="border:1px solid var(--border);background:#fff;border-radius:10px;padding:10px 16px;cursor:pointer;color:var(--ink-soft)"
        >发送</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>