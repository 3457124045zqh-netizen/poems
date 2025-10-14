<script setup>
import { ref } from 'vue'

const topics = ['意象分析', '诗人专题', '时代风格']
const active = ref('意象分析')

const samples = [
  { label: '李白 · 月亮意象', desc: '统计“月”相关诗句的出现频率与情感倾向。' },
  { label: '边塞诗 · 孤城', desc: '边塞意象中的“孤城”所指向的群体情感。' },
  { label: '唐宋对比 · 送别诗', desc: '唐宋时期送别主题的表达差异。' }
]
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>