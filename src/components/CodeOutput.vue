<script setup lang="ts">
import { useModStore } from '@/store/mod'
import { ElMessage } from 'element-plus'

const store = useModStore()

/** 复制C数组到剪贴板 */
const handleCopy = async () => {
  if (!store.generateResult.cArray) {
    ElMessage.warning('请先生成取模数据')
    return
  }
  try {
    await navigator.clipboard.writeText(store.generateResult.cArray)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

/** 下载C数组文件 */
const handleDownload = () => {
  if (!store.generateResult.cArray) {
    ElMessage.warning('请先生成取模数据')
    return
  }
  const blob = new Blob([store.generateResult.cArray], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const name = store.modType === 'font'
    ? `font_${store.fontConfig.width}x${store.fontConfig.height}`
    : (store.imageConfig.fileName.replace(/\.[^.]+$/, '') || 'image')
  a.download = `${name}.c`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="code-output">
    <div class="output-toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn active">
          <svg viewBox="0 0 16 10" fill="none">
            <path d="M1 5H15M15 5L11 1M15 5L11 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>C 数组</span>
        </button>
      </div>
      <div class="toolbar-right">
        <button class="toolbar-btn copy-btn" @click="handleCopy">
          <svg viewBox="0 0 10 12" fill="none">
            <rect x="0.5" y="3" width="6" height="8" rx="1" stroke="currentColor"/>
            <path d="M3 3V1.5C3 0.947715 3.44772 0.5 4 0.5H8.5C9.05228 0.5 9.5 0.947715 9.5 1.5V7C9.5 7.55228 9.05228 8 8.5 8H7" stroke="currentColor"/>
          </svg>
          <span>复制</span>
        </button>
        <button class="toolbar-btn" @click="handleDownload">
          <svg viewBox="0 0 12 14" fill="none">
            <path d="M6 1V10M6 10L2 6M6 10L10 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 13H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>下载</span>
        </button>
      </div>
    </div>
    <div class="output-content">
      <div class="corner-decor top-left" />
      <div class="corner-decor top-right" />
      <div class="corner-decor bottom-left" />
      <div class="corner-decor bottom-right" />
      <pre v-if="store.generateResult.cArray" class="code-block"><code>{{ store.generateResult.cArray }}</code></pre>
      <div v-else class="empty-state">
        <span class="empty-hint">// 生成的C数组将在这里显示</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-output {
  padding: 0 16px 16px;
}

.output-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 14px;
    height: 10px;
  }

  &:hover {
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  &.active {
    color: var(--accent-cyan);
    border-color: var(--accent-cyan);
  }

  &.copy-btn svg {
    width: 10px;
    height: 12px;
  }

  &:last-child svg {
    width: 12px;
    height: 14px;
  }
}

.output-content {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  position: relative;
  min-height: 120px;
  max-height: 220px;
  overflow: auto;
}

.corner-decor {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid var(--accent-cyan);
  opacity: 0.3;

  &.top-left {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
    border-radius: 4px 0 0 0;
  }

  &.top-right {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
    border-radius: 0 4px 0 0;
  }

  &.bottom-left {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
    border-radius: 0 0 0 4px;
  }

  &.bottom-right {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
    border-radius: 0 0 4px 0;
  }
}

.code-block {
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: var(--accent-green);
  white-space: pre;
  margin: 0;

  code {
    font-family: inherit;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.empty-hint {
  color: var(--text-secondary);
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', monospace;
}
</style>
