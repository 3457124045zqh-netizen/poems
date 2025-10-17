const getConfig = () => {
  const url = (typeof localStorage !== 'undefined' && (localStorage.getItem('SB_URL') || localStorage.getItem('SUPABASE_URL'))) || 'https://crnjpljxokbqkriasmxa.supabase.co'
  const key = (typeof localStorage !== 'undefined' && (localStorage.getItem('SB_KEY') || localStorage.getItem('SUPABASE_ANON_KEY'))) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybmpwbGp4b2ticWtyaWFzbXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njk3NzMsImV4cCI6MjA3NjA0NTc3M30.r_8EsMKEfPZpi-4AOwNEfJhX6KnK8lmtX2GeTv36NhI'
  return { url, key }
}

const headers = () => {
  const { key } = getConfig()
  // 优先使用登录获取的 JWT；未登录则使用 anon key
  let token = null
  try { token = localStorage.getItem('SB_TOKEN') || null } catch {}
  return {
    'apikey': key,
    'Authorization': `Bearer ${token || key}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

const rest = (path, q = '') => {
  const { url } = getConfig()
  const u = new URL(`/rest/v1/${path}`, url)
  if (q) u.search = q
  return u.toString()
}

export async function listPoems(limit = 100) {
  const url = rest('poems', new URLSearchParams({
    select: 'id,title,author,dynasty,brief,imagery,tags,key_emotion',
    order: 'id.asc',
    limit: String(limit)
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listPoems failed ${r.status}`)
  return r.json()
}

export async function getPoem(id) {
  const url = rest('poems', new URLSearchParams({
    select: 'id,title,author,dynasty,brief,lines,imagery,tags,key_emotion,culture_hint,pinyin,translation,notes',
    id: `eq.${id}`
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`getPoem failed ${r.status}`)
  const arr = await r.json()
  return arr[0] || null
}

export async function listAnnotations(poemId) {
  const url = rest('annotations', new URLSearchParams({
    select: 'poem_id,line_index,kinds,content',
    poem_id: `eq.${poemId}`,
    order: 'line_index.asc'
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listAnnotations failed ${r.status}`)
  return r.json()
}

/** 追加：其它表的最小读取封装 **/
export async function listAssets(poemId) {
  const url = rest('multimodal_assets', new URLSearchParams({
    select: 'poem_id,kind,url,meta',
    poem_id: `eq.${poemId}`,
    order: 'id.asc'
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listAssets failed ${r.status}`)
  return r.json()
}

export async function listAIResponses(limit = 10) {
  const url = rest('ai_responses', new URLSearchParams({
    select: 'user_id,poem_id,model_code,confidence,created_at,context,response',
    order: 'created_at.desc',
    limit: String(limit)
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listAIResponses failed ${r.status}`)
  return r.json()
}

export async function listEducationResources(limit = 20) {
  const url = rest('education_resources', new URLSearchParams({
    select: 'poem_id,grade,syllabus_edition,lesson_plan,created_at',
    order: 'created_at.desc',
    limit: String(limit)
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listEducationResources failed ${r.status}`)
  return r.json()
}

export async function listLearningRecords(limit = 50) {
  const url = rest('learning_records', new URLSearchParams({
    select: 'user_id,poem_id,duration_secs,note,created_at',
    order: 'created_at.desc',
    limit: String(limit)
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listLearningRecords failed ${r.status}`)
  return r.json()
}

export async function listCulturalKnowledge(limit = 20) {
  const url = rest('cultural_knowledge', new URLSearchParams({
    select: 'kind,title,summary,links,related_imagery,created_at',
    order: 'created_at.desc',
    limit: String(limit)
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listCulturalKnowledge failed ${r.status}`)
  return r.json()
}

export async function listImageryStats(limit = 100) {
  const url = rest('imagery_stats', new URLSearchParams({
    select: 'name,value,created_at',
    order: 'created_at.desc',
    limit: String(limit)
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listImageryStats failed ${r.status}`)
  return r.json()
}

export async function listResearchTopics() {
  const url = rest('research_topics', new URLSearchParams({
    select: 'name,created_at',
    order: 'created_at.desc'
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listResearchTopics failed ${r.status}`)
  return r.json()
}

export async function listResearchSamples() {
  const url = rest('research_samples', new URLSearchParams({
    select: 'label,desc,created_at',
    order: 'created_at.desc'
  }).toString())
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error(`listResearchSamples failed ${r.status}`)
  return r.json()
}

/** 认证相关 **/
const authUrl = () => {
  const { url } = getConfig()
  return new URL('/auth/v1', url).toString()
}

// 注册（邮箱+密码）
export async function signUp(email, password) {
  const u = authUrl() + '/signup'
  const { key } = getConfig()
  const r = await fetch(u, {
    method: 'POST',
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  if (!r.ok) throw new Error('signUp failed ' + r.status)
  const data = await r.json()
  // Supabase 可能需要邮件确认；此处返回用户信息
  return data
}

// 登录（邮箱+密码）获取 access_token
export async function signIn(email, password) {
  const u = authUrl() + '/token?grant_type=password'
  const { key } = getConfig()
  const r = await fetch(u, {
    method: 'POST',
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  if (!r.ok) throw new Error('signIn failed ' + r.status)
  const data = await r.json()
  const token = data.access_token
  if (token) {
    try { localStorage.setItem('SB_TOKEN', token) } catch {}
  }
  return data
}

export function signOut() {
  try { localStorage.removeItem('SB_TOKEN') } catch {}
}

export async function getMyProfile() {
  // 读取 public.users 中与当前 auth.uid() 对应的资料
  // --hint: filter 在服务端根据 JWT 的 uid 做 RLS；此处可不加 eq
  const url = rest('users', new URLSearchParams({
    select: 'auth_user_id,role,grade,region,nickname,preferences',
    order: 'created_at.desc',
    limit: '1'
  })).toString()
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error('getMyProfile failed ' + r.status)
  const arr = await r.json()
  return arr[0] || null
}