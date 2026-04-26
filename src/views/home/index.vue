<script setup lang="ts">
import SideNavBar from '@/components/SideNavBar.vue'
import DisplayPreview from '@/components/DisplayPreview.vue'
import CodeOutput from '@/components/CodeOutput.vue'
import Layout from '@/layout/index.vue'
</script>

<template>
  <Layout>
    <SideNavBar />
    <section class="main-content">
      <div class="content-top">
        <DisplayPreview />
      </div>
      <div class="content-bottom">
        <CodeOutput />
      </div>
    </section>
  </Layout>
</template>

<style scoped lang="scss">
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-dark);
  min-width: 0;
}

.content-top {
  flex: 1;
  overflow: hidden;
  display: flex;
  min-height: 0;
}

.content-bottom {
  flex-shrink: 0;
  border-top: 1px solid var(--border-color);
}
</style>
