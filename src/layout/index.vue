<script setup lang="ts">
</script>

<template>
  <div class="app-layout">
    <header class="layout-header">
      <div class="header-container">
        <h1 class="header-title">取模助手</h1>
      </div>
    </header>
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: var(--bg-dark);
}

.layout-header {
  height: 57px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-panel);
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.header-container {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--accent-cyan);
  letter-spacing: 1px;
  margin: 0;
}

.layout-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>
