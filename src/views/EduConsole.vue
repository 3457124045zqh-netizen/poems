<script setup>
import { ref } from 'vue'

const grades = ['小学', '初中', '高中']
const selected = ref('小学')

const syllabus = [
  { title: '春晓', grade: '小学', focus: '体会春光之美', tasks: ['朗读节奏', '情境想象'] },
  { title: '登鹳雀楼', grade: '小学', focus: '立志与视野', tasks: ['关键句理解', '扩写联想'] },
  { title: '锦瑟', grade: '高中', focus: '象征意蕴', tasks: ['意象卡片', '主旨讨论'] }
]

const plan = ref(null)
function genPlan(item) {
  plan.value = {
    title: item.title + ' 教案（占位）',
    goal: '达成情感理解与关键意象识别',
    keypoints: ['重点字词', '情感目标', '修辞手法', '文化背景'],
    steps: [
      '导入：相关情境图片或音频（2分钟）',
      '朗读：把握节奏与重音（5分钟）',
      '解析：逐句注释与意象说明（10分钟）',
      '互动：讨论提问与小练习（8分钟）',
      '总结：情感回扣与拓展阅读（5分钟）'
    ],
    tasks: item.tasks
  }
}
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
          <div style="margin-top:8px;">
            <button @click="genPlan(s)" style="border:1px solid var(--border);background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer;color:var(--ink-soft)">一键生成教案（占位）</button>
          </div>
        </div>
      </article>
    </div>

    <div v-if="plan" class="detail-card" style="margin-top:16px;">
      <h3 class="block-title" style="margin:0 0 6px;">{{ plan.title }}</h3>
      <div class="card-meta">教学目标：{{ plan.goal }}</div>
      <div class="section">
        <strong>关键要点：</strong>
        <ul style="margin:6px 0 0;padding-left:18px;">
          <li v-for="k in plan.keypoints" :key="k">{{ k }}</li>
        </ul>
      </div>
      <div class="section" style="margin-top:10px;">
        <strong>课堂流程：</strong>
        <ol style="margin:6px 0 0;padding-left:18px;">
          <li v-for="(st, i) in plan.steps" :key="i">{{ st }}</li>
        </ol>
      </div>
      <div class="section" style="margin-top:10px;">
        <strong>互动任务：</strong> {{ plan.tasks.join('、') }}
      </div>
      <div class="card-meta" style="margin-top:10px;color:#9ca3af;">说明：后续将接入后端模板与分层生成。</div>
    </div>
  </div>
</template>

<style scoped></style>