const getConfig = () => {
  const url = (typeof localStorage !== 'undefined' && (localStorage.getItem('SB_URL') || localStorage.getItem('SUPABASE_URL'))) || 'https://crnjpljxokbqkriasmxa.supabase.co'
  const key = (typeof localStorage !== 'undefined' && (localStorage.getItem('SB_KEY') || localStorage.getItem('SUPABASE_ANON_KEY'))) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybmpwbGp4b2ticWtyaWFzbXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njk3NzMsImV4cCI6MjA3NjA0NTc3M30.r_8EsMKEfPZpi-4AOwNEfJhX6KnK8lmtX2GeTv36NhI'
  return { url, key }
}

const headers = () => {
  const { key } = getConfig()
  return {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
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