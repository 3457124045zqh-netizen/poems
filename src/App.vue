<script setup>
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
        <RouterLink to="/edu">教材同步</RouterLink>
        <RouterLink to="/research">研究台</RouterLink>
        <RouterLink to="/learning">我的学习</RouterLink>
        <RouterLink to="/assistant">AI 助手</RouterLink>
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
