<script setup>
import { ref } from 'vue'

const messages = ref([
  { role: 'ai', text: '你好，我是你的诗词学习伙伴。想聊哪首诗？' }
])
const input = ref('')

function send() {
  const text = input.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', text })
  input.value = ''
  // 模拟 AI 回复（后续接入接口）
  setTimeout(() => {
    messages.value.push({ role: 'ai', text: '好的，我会从意象与情感脉络开始分析。' })
  }, 500)
}
</script>

<template>
  <div class="container section">
    <h2 class="section-title">AI 助手 · 对话式赏析</h2>
    <div class="detail-card" style="display:flex;flex-direction:column;gap:10px;min-height:360px;">
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

      <div style="display:flex;gap:8px;">
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