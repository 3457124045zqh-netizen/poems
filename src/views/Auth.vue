<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUp, signIn, signOut, getMyProfile } from '../api/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const mode = ref('login') // 'login' | 'signup'
const info = ref(null)
const err = ref('')

async function doSubmit() {
  err.value = ''
  try {
    if (mode.value === 'signup') {
      await signUp(email.value.trim(), password.value.trim())
      alert('注册成功，请登录（若开启邮件确认，请在邮箱确认后再登录）。')
      mode.value = 'login'
    } else {
      await signIn(email.value.trim(), password.value.trim())
      const profile = await getMyProfile().catch(() => null)
      info.value = profile
      if (profile?.role) {
        try { localStorage.setItem('role', profile.role) } catch {}
      }
      router.push('/')
    }
  } catch (e) {
    err.value = e.message || String(e)
  }
}
function doLogout() {
  signOut()
  info.value = null
  try { localStorage.removeItem('role') } catch {}
  alert('已退出登录')
}
</script>

<template>
  <div class="container section">
    <h2 class="section-title">账户 · 注册 / 登录</h2>

    <div class="detail-card" style="margin-bottom:12px;">
      <div style="display:flex;gap:8px;">
        <button @click="mode='login'" :style="{border:'1px solid var(--border)',background:mode==='login'?'#fff':'#fafafa',borderRadius:'8px',padding:'6px 10px',cursor:'pointer'}">登录</button>
        <button @click="mode='signup'" :style="{border:'1px solid var(--border)',background:mode==='signup'?'#fff':'#fafafa',borderRadius:'8px',padding:'6px 10px',cursor:'pointer'}">注册</button>
        <button @click="doLogout" style="margin-left:auto;border:1px solid var(--border);background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer">退出</button>
      </div>
    </div>

    <div class="detail-card" style="display:flex;flex-direction:column;gap:10px;max-width:520px;">
      <input v-model="email" type="email" placeholder="邮箱" style="border:1px solid var(--border);border-radius:10px;padding:10px 12px;outline:none;">
      <input v-model="password" type="password" placeholder="密码" style="border:1px solid var(--border);border-radius:10px;padding:10px 12px;outline:none;">
      <button @click="doSubmit" style="border:1px solid var(--border);background:#fff;border-radius:10px;padding:10px 16px;cursor:pointer;color:var(--ink-soft)">
        {{ mode==='login' ? '登录' : '注册' }}
      </button>
      <div v-if="err" style="color:#ef4444">{{ err }}</div>
      <div v-if="info" class="card-meta">当前角色：{{ info.role || 'student' }}</div>
      <div class="card-meta" style="color:#9ca3af;">提示：登录后，页面将使用你的身份令牌访问数据库，RLS 保障数据安全。</div>
    </div>
  </div>
</template>

<style scoped></style>