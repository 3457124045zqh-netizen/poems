<script setup>
import { ref } from 'vue'

const records = ref([
  { title: '静夜思', ts: '今天 09:30', note: '明月意象强化乡思。' },
  { title: '登鹳雀楼', ts: '昨天 20:11', note: '更上一层楼→志向与视野。' },
  { title: '江雪', ts: '本周一', note: '孤寂与禅意的画面感。' }
])
</script>

<template>
  <div class="container section">
    <h2 class="section-title">我的学习</h2>
    <div class="detail-card">
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