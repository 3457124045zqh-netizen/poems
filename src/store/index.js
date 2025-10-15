import { defineStore } from 'pinia'

const safeParse = (k, def) => {
  try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v ?? def } catch { return def }
}
const safeSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export const useUserStore = defineStore('user', {
  state: () => ({
    role: (typeof localStorage !== 'undefined' && localStorage.getItem('role')) || 'student', // student | teacher | researcher
    profile: safeParse('profile', { grade: '小学', nickname: '' })
  }),
  actions: {
    setRole(r) {
      this.role = r
      try { localStorage.setItem('role', r) } catch {}
    },
    updateProfile(p) {
      this.profile = { ...this.profile, ...p }
      safeSet('profile', this.profile)
    }
  }
})

export const useLearningStore = defineStore('learning', {
  state: () => ({
    records: safeParse('learning_records', [])
  }),
  actions: {
    addRecord(r) {
      this.records.unshift(r)
      safeSet('learning_records', this.records)
    },
    load() {
      this.records = safeParse('learning_records', this.records)
    }
  }
})

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    aiApi: (typeof localStorage !== 'undefined' && localStorage.getItem('AI_API')) || ''
  }),
  actions: {
    setAiApi(url) {
      this.aiApi = url
      try { localStorage.setItem('AI_API', url) } catch {}
    }
  }
})