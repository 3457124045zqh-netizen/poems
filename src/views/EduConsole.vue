<script setup>
import { ref } from 'vue'

const grades = ['小学', '初中', '高中']
const selected = ref('小学')

const syllabus = [
  { title: '春晓', grade: '小学', focus: '体会春光之美', tasks: ['朗读节奏', '情境想象'] },
  { title: '登鹳雀楼', grade: '小学', focus: '立志与视野', tasks: ['关键句理解', '扩写联想'] },
  { title: '锦瑟', grade: '高中', focus: '象征意蕴', tasks: ['意象卡片', '主旨讨论'] }
]
</script>

<template>
  <div class="container section">
    <h2 class="section-title">教材同步 · 智能教学助手</h2>
    <div class="detail-card" style="margin-bottom:14px;">
      <div style="display:flex;gap:10px;align-items:center;">
        <span class="block-title" style="margin:0;">选择学段：</span>
        <div style="display:flex;gap:8px;">
          <button
            v-for="g in grades"
            :key="g"
            @click="selected = g"
            :style="{
              border:'1px solid var(--border)', background: selected===g ? '#fff' : '#fafafa',
              borderRadius:'10px', padding:'6px 10px', cursor:'pointer', color:'var(--ink-soft)'
            }"
          >
            {{ g }}
          </button>
        </div>
      </div>
    </div>

    <div class="cards">
      <article v-for="s in syllabus.filter(x=>x.grade===selected)" :key="s.title" class="card">
        <div class="card-cover"></div>
        <div class="card-body">
          <h4 class="card-title">{{ s.title }} · {{ s.grade }}</h4>
          <div class="card-meta">课堂目标：{{ s.focus }}</div>
          <p class="card-desc">互动任务：{{ s.tasks.join('、') }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped></style>