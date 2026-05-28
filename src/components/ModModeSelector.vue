<script setup lang="ts">
import type { ModMode } from '@/types'

defineProps<{ modelValue: ModMode }>()
defineEmits<{ 'update:modelValue': [value: ModMode] }>()
</script>

<template>
  <div class="mod-mode-grid">
    <!-- 列行式：8行分页，列优先扫描 -->
    <div
      class="mod-mode-card"
      :class="{ active: modelValue === 'column-row' }"
      @click="$emit('update:modelValue', 'column-row')"
    >
      <svg class="mod-mode-svg" viewBox="0 0 56 48" fill="none">
        <!-- 显示区域 -->
        <rect x="14" y="2" width="28" height="44" rx="2" stroke="var(--border-color)" stroke-width="1.2" fill="none"/>
        <!-- 页0：列高亮 -->
        <rect x="18" y="5" width="5" height="17" rx="1" fill="var(--accent-cyan)" opacity="0.75"/>
        <rect x="26" y="5" width="5" height="17" rx="1" fill="var(--accent-cyan)" opacity="0.4"/>
        <rect x="34" y="5" width="5" height="17" rx="1" fill="var(--accent-cyan)" opacity="0.2"/>
        <!-- 页分隔线 -->
        <line x1="14" y1="24" x2="42" y2="24" stroke="var(--accent-cyan)" stroke-width="1" stroke-dasharray="3 2"/>
        <!-- 页1：暗色列 -->
        <rect x="18" y="27" width="5" height="16" rx="1" fill="var(--border-color)" opacity="0.3"/>
        <rect x="26" y="27" width="5" height="16" rx="1" fill="var(--border-color)" opacity="0.2"/>
        <rect x="34" y="27" width="5" height="16" rx="1" fill="var(--border-color)" opacity="0.15"/>
        <!-- 扫描箭头：列内向下 -->
        <path d="M20.5 7 L20.5 19" stroke="var(--accent-cyan)" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M19 17.5 L20.5 21 L22 17.5" fill="none" stroke="var(--accent-cyan)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- 页标签 -->
        <text x="8" y="16" fill="var(--accent-cyan)" font-size="7" text-anchor="middle" font-weight="600">P0</text>
        <text x="8" y="37" fill="var(--text-secondary)" font-size="7" text-anchor="middle">P1</text>
      </svg>
      <div class="mod-mode-name">列行式</div>
      <div class="mod-mode-desc">8行分页·列优先</div>
    </div>

    <!-- 行列式：8列分组，行优先扫描 -->
    <div
      class="mod-mode-card"
      :class="{ active: modelValue === 'row-column' }"
      @click="$emit('update:modelValue', 'row-column')"
    >
      <svg class="mod-mode-svg" viewBox="0 0 56 48" fill="none">
        <!-- 显示区域 -->
        <rect x="2" y="8" width="52" height="28" rx="2" stroke="var(--border-color)" stroke-width="1.2" fill="none"/>
        <!-- 行0：字节高亮 -->
        <rect x="5" y="11" width="21" height="5" rx="1" fill="var(--accent-cyan)" opacity="0.75"/>
        <rect x="30" y="11" width="21" height="5" rx="1" fill="var(--accent-cyan)" opacity="0.4"/>
        <!-- 字节分隔线 -->
        <line x1="28" y1="8" x2="28" y2="36" stroke="var(--accent-cyan)" stroke-width="1" stroke-dasharray="3 2"/>
        <!-- 行1：暗色 -->
        <rect x="5" y="19" width="21" height="5" rx="1" fill="var(--accent-cyan)" opacity="0.25"/>
        <rect x="30" y="19" width="21" height="5" rx="1" fill="var(--accent-cyan)" opacity="0.15"/>
        <!-- 行2：更暗 -->
        <rect x="5" y="27" width="21" height="5" rx="1" fill="var(--border-color)" opacity="0.2"/>
        <rect x="30" y="27" width="21" height="5" rx="1" fill="var(--border-color)" opacity="0.15"/>
        <!-- 扫描箭头：行内向右 -->
        <path d="M7 13.5 L23 13.5" stroke="var(--accent-cyan)" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M21 12 L24.5 13.5 L21 15" fill="none" stroke="var(--accent-cyan)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- 字节标签 -->
        <text x="16" y="44" fill="var(--accent-cyan)" font-size="7" text-anchor="middle" font-weight="600">B0</text>
        <text x="40" y="44" fill="var(--text-secondary)" font-size="7" text-anchor="middle">B1</text>
      </svg>
      <div class="mod-mode-name">行列式</div>
      <div class="mod-mode-desc">8列分组·行优先</div>
    </div>

    <!-- 逐列式：每列一字节，从上到下 -->
    <div
      class="mod-mode-card"
      :class="{ active: modelValue === 'column-by-column' }"
      @click="$emit('update:modelValue', 'column-by-column')"
    >
      <svg class="mod-mode-svg" viewBox="0 0 56 48" fill="none">
        <!-- 显示区域 -->
        <rect x="14" y="2" width="28" height="44" rx="2" stroke="var(--border-color)" stroke-width="1.2" fill="none"/>
        <!-- 全高列高亮 -->
        <rect x="18" y="5" width="5" height="38" rx="1" fill="var(--accent-cyan)" opacity="0.6"/>
        <rect x="26" y="5" width="5" height="38" rx="1" fill="var(--accent-cyan)" opacity="0.3"/>
        <rect x="34" y="5" width="5" height="38" rx="1" fill="var(--accent-cyan)" opacity="0.15"/>
        <!-- 扫描箭头：列内向下 -->
        <path d="M20.5 7 L20.5 39" stroke="var(--accent-cyan)" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M19 37 L20.5 41 L22 37" fill="none" stroke="var(--accent-cyan)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- 列间箭头 -->
        <path d="M25 24 L31 24" stroke="var(--accent-cyan)" stroke-width="0.8" stroke-linecap="round" opacity="0.6"/>
        <path d="M29.5 22.5 L31.5 24 L29.5 25.5" fill="none" stroke="var(--accent-cyan)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      </svg>
      <div class="mod-mode-name">逐列式</div>
      <div class="mod-mode-desc">每列一字节</div>
    </div>

    <!-- 逐行式：每行一字节，从左到右 -->
    <div
      class="mod-mode-card"
      :class="{ active: modelValue === 'row-by-row' }"
      @click="$emit('update:modelValue', 'row-by-row')"
    >
      <svg class="mod-mode-svg" viewBox="0 0 56 48" fill="none">
        <!-- 显示区域 -->
        <rect x="2" y="8" width="52" height="28" rx="2" stroke="var(--border-color)" stroke-width="1.2" fill="none"/>
        <!-- 全宽行高亮 -->
        <rect x="5" y="11" width="46" height="5" rx="1" fill="var(--accent-cyan)" opacity="0.6"/>
        <rect x="5" y="19" width="46" height="5" rx="1" fill="var(--accent-cyan)" opacity="0.3"/>
        <rect x="5" y="27" width="46" height="5" rx="1" fill="var(--accent-cyan)" opacity="0.15"/>
        <!-- 扫描箭头：行内向右 -->
        <path d="M7 13.5 L47 13.5" stroke="var(--accent-cyan)" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M45 12 L48.5 13.5 L45 15" fill="none" stroke="var(--accent-cyan)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- 行间箭头 -->
        <path d="M28 18 L28 22" stroke="var(--accent-cyan)" stroke-width="0.8" stroke-linecap="round" opacity="0.6"/>
        <path d="M26.5 20.5 L28 22.5 L29.5 20.5" fill="none" stroke="var(--accent-cyan)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      </svg>
      <div class="mod-mode-name">逐行式</div>
      <div class="mod-mode-desc">每行一字节</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mod-mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-md);
}

.mod-mode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--sp-lg) var(--sp-sm);
  background: var(--bg-input);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--text-secondary);
  }

  &.active {
    border-color: var(--accent-cyan);
    background: rgba(0, 212, 255, 0.06);
  }
}

.mod-mode-svg {
  width: 56px;
  height: 48px;
  flex-shrink: 0;
}

.mod-mode-name {
  font-size: var(--fs-base);
  color: var(--text-primary);
  font-weight: 600;
  margin-top: var(--sp-sm);
}

.mod-mode-desc {
  font-size: var(--fs-xs);
  color: var(--text-secondary);
  margin-top: 2px;
}
</style>
