<script setup>
import { ref, onMounted } from 'vue'
import { listAIResponses } from '../api/supabase'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const messages = ref([
  { role: 'ai', text: '你好，我是你的诗词学习伙伴。想聊哪首诗？' }
])
const input = ref('')
const aiLogs = ref([])
onMounted(async () => {
  try { aiLogs.value = await listAIResponses(5) } catch {}
})
const DEFAULT_N8N_URL = 'https://zhangqinghua.app.n8n.cloud/webhook-test/989bb19c-fa2d-4550-889d-fe9f393c2c18'
const apiInput = ref((typeof localStorage !== 'undefined' && localStorage.getItem('AI_API')) || DEFAULT_N8N_URL)
function saveApi() {
  try { localStorage.setItem('AI_API', apiInput.value || '') } catch {}
}

function formatReply(data) {
  try {
    // 如果是纯字符串，尝试解析为 JSON
    if (typeof data === 'string') {
      const textTrim = data.trim();
      if ((textTrim.startsWith('{') && textTrim.endsWith('}')) || (textTrim.startsWith('[') && textTrim.endsWith(']'))) {
        const parsed = JSON.parse(textTrim);
        return formatReply(parsed);
      }
      // 去除常见转义换行/制表符
      return textTrim.replace(/\\n/g, '\n').replace(/\\t/g, '  ').replace(/\\"/g, '"');
    }
    // 兼容数组返回：如 [ { output: "..." } ]
    if (Array.isArray(data)) {
      const first = data[0]
      if (first && (first.output || first.reply || first.answer)) {
        return String(first.output || first.reply || first.answer)
          replace(/\\\\n/g, '\n')
         .replace(/\\\\t/g, '  ')
         .replace(/\\\\"/g, '"');
      }
      // 若为字符串数组，拼接
      const merged = data.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).join('');
      return merged
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '  ')
        .replace(/\\"/g, '"');

    }

    // 常见字段提取
    const candidates = [
      data?.output, data?.reply, data?.answer,
      data?.data?.output, data?.data?.reply, data?.data?.answer,
      data?.choices?.[0]?.message?.content,
      data?.response?.analysis, data?.response?.text, data?.response
    ].filter(Boolean);

    let text = candidates.length ? candidates[0] : '';
    if (typeof text !== 'string') text = JSON.stringify(text);

    return (text || '')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '  ')
      .replace(/\\"/g, '"');
  } catch {
    return (typeof data === 'string' ? data : JSON.stringify(data))
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '  ')
      .replace(/\\"/g, '"');
  }
}

function renderMd(text) {
  try {
    const html = marked.parse(typeof text === 'string' ? text : JSON.stringify(text), {
      gfm: true,
      breaks: true
    })
    const safe = DOMPurify.sanitize(html)
    return safe && safe.trim() ? safe : String(text || '')
  } catch {
    return String(text || '')
  }
}

function send() {
  const text = input.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', text })
  input.value = ''
  // 优先尝试后端接口（n8n Webhook），失败则使用本地 Mock
  const endpoint = (apiInput.value || '').trim()
  if (endpoint) {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain;q=0.9'
      },
      body: JSON.stringify({
        question: text
      })
    })
    .then(async r => {
      const raw = await r.text()
      console.log('[AI raw]', raw)
      let data
      try { data = JSON.parse(raw) } catch { data = raw }
      return data
    })
    .then((data) => {
      const reply = formatReply(data)
      messages.value.push({ role: 'ai', text: reply || '（占位）我将从意象与情感脉络开始分析。' })
    })
    .catch((err) => {
      console.error('[AI error]', err)
      messages.value.push({ role: 'ai', text: '【接口异常】已改用占位回复。错误：' + (err?.message || String(err)) })
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
            color:'var(--ink-soft)', whiteSpace: m.role==='user' ? 'pre-wrap' : 'normal'
          }"
        >
          <span v-if="m.role==='user'">{{ m.text }}</span>
          <div v-else class="md" v-html="renderMd(m.text)"></div>
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

<style scoped>
/* 压缩 AI 消息的 Markdown 段间距 */
.md {
  line-height: 1.6;
  color: var(--ink-soft);
}
.md p { margin: 0.4em 0; }
.md h1, .md h2, .md h3, .md h4, .md h5, .md h6 { margin: 0.5em 0 0.3em; font-weight: 600; }
.md ul, .md ol { margin: 0.4em 0; padding-left: 1.2em; }
.md li { margin: 0.2em 0; }
.md blockquote { margin: 0.5em 0; padding: 0.4em 0.8em; border-left: 3px solid #e5e7eb; color: #6b7280; background: #fafafa; }
.md code { background: #f5f5f5; padding: 0.1em 0.3em; border-radius: 4px; }
.md pre { background: #f5f5f5; padding: 0.6em 0.8em; border-radius: 8px; overflow: auto; margin: 0.5em 0; }
</style>