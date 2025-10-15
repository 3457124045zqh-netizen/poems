<script setup>
import { ref, onMounted, watch } from 'vue'

const role = ref('student') // student | teacher | researcher
onMounted(() => {
  try {
    role.value = localStorage.getItem('role') || 'student'
  } catch {}
})
watch(role, (r) => {
  try { localStorage.setItem('role', r) } catch {}
})
</script>

<template>
  <header class="header">
    <div class="container header-inner">
      <div class="brand">
        <div class="logo"></div>
        <div class="title">诗韵灵犀</div>
      </div>
      <nav class="nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink v-if="role==='teacher'" to="/edu">教材同步</RouterLink>
        <RouterLink v-if="role==='researcher'" to="/research">研究台</RouterLink>
        <RouterLink to="/learning">我的学习</RouterLink>
        <RouterLink to="/assistant">AI 助手</RouterLink>
        <div style="display:flex;align-items:center;gap:6px;margin-left:8px;">
          <span style="color:var(--muted);font-size:12px;">角色</span>
          <select v-model="role" style="border:1px solid var(--border);border-radius:8px;padding:4px 8px;color:var(--ink-soft);background:#fff;">
            <option value="student">学生</option>
            <option value="teacher">教师</option>
            <option value="researcher">研究者</option>
          </select>
        </div>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="footer">
    以 AI 赋能诗词文化 · Copyright ©
  </footer>
</template>

<style scoped>
main { padding-top: 8px; }
</style>
