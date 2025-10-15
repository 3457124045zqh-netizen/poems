<script setup>
import { ref } from 'vue'

const topics = ['意象分析', '诗人专题', '时代风格']
const active = ref('意象分析')

const samples = [
  { label: '李白 · 月亮意象', desc: '统计“月”相关诗句的出现频率与情感倾向。' },
  { label: '边塞诗 · 孤城', desc: '边塞意象中的“孤城”所指向的群体情感。' },
  { label: '唐宋对比 · 送别诗', desc: '唐宋时期送别主题的表达差异。' }
]

const chart = ref([
  { name: '月亮', value: 68 },
  { name: '江河', value: 52 },
  { name: '杨柳', value: 43 },
  { name: '边塞', value: 31 },
  { name: '孤城', value: 22 }
])

function exportCSV() {
  const rows = [['意象', '频次'], ...chart.value.map(x => [x.name, x.value])]
  const QUOTE = '"'
  const COMMA = ','
  const NEWLINE = '
'
  const escapeCSV = (v) => QUOTE + String(v).replace(/"/g, '""') + QUOTE
  const csv = rows.map(r => r.map(escapeCSV).join(COMMA)).join(NEWLINE)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'imagery_stats.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="container section">
    <h2 class="section-title">研究台 · 文化分析</h2>
    <div class="detail-card">
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <span class="block-title" style="margin:0;">研究主题：</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button
            v-for="t in topics"
            :key="t"
            @click="active = t"
            :style="{
              border:'1px solid var(--border)', background: active===t ? '#fff' : '#fafafa',
              borderRadius:'10px', padding:'6px 10px', cursor:'pointer', color:'var(--ink-soft)'
            }"
          >{{ t }}</button>
        </div>
      </div>

      <div class="section" style="margin-top:16px;">
        <div class="cards">
          <article v-for="s in samples" :key="s.label" class="card">
            <div class="card-cover"></div>
            <div class="card-body">
              <h4 class="card-title">{{ s.label }}</h4>
              <p class="card-desc">{{ s.desc }}</p>
              <div class="card-meta">可视化面板（占位）</div>
            </div>
          </article>
        </div>

        <div class="detail-card" style="margin-top:16px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <h3 class="block-title" style="margin:0;">示例可视化 · 意象频次</h3>
            <button @click="exportCSV" style="border:1px solid var(--border);background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer;color:var(--ink-soft)">导出 CSV</button>
          </div>
          <div style="margin-top:10px;display:grid;gap:8px;">
            <div v-for="(row,i) in chart" :key="i" style="display:flex;align-items:center;gap:10px;">
              <div style="width:60px;color:var(--ink-soft);">{{ row.name }}</div>
              <div style="flex:1;background:#fafafa;border:1px solid var(--border);border-radius:8px;height:14px;overflow:hidden;">
                <div :style="{width: (row.value)+'%', height:'100%', background:'linear-gradient(90deg, rgba(124,106,71,0.5), rgba(124,106,71,0.2))'}"></div>
              </div>
              <div style="width:40px;text-align:right;color:var(--muted);font-size:12px;">{{ row.value }}</div>
            </div>
          </div>
          <div class="card-meta" style="margin-top:8px;color:#9ca3af;">说明：后续对接真实统计与图表库。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>