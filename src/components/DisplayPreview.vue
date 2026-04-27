<script setup lang="ts">
import { useModStore } from '@/store/mod'
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const store = useModStore()

const SCREEN_W = 128
const SCREEN_H = 64

const containerRef = ref<HTMLDivElement>()
const containerSize = ref({ width: 0, height: 0 })

const pixelSize = computed(() => {
  const cw = containerSize.value.width
  const ch = containerSize.value.height
  if (!cw || !ch) return 3
  const scaleW = Math.floor(cw / SCREEN_W)
  const scaleH = Math.floor(ch / SCREEN_H)
  return Math.max(1, Math.min(scaleW, scaleH))
})

const canvasWidth = computed(() => SCREEN_W * pixelSize.value)
const canvasHeight = computed(() => SCREEN_H * pixelSize.value)

const hasData = computed(() => store.generateResult.previewData.length > 0)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (containerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        containerSize.value = {
          width: entry.contentRect.width - 32,
          height: entry.contentRect.height - 32,
        }
      }
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

/** Canvas 绘制 */
watch(
  () => [store.generateResult.previewData, pixelSize.value],
  async () => {
    await nextTick()
    const canvas = containerRef.value?.querySelector('.pixel-canvas') as HTMLCanvasElement | null
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const ps = pixelSize.value
    ctx.fillStyle = '#050510'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const data = store.generateResult.previewData
    for (let y = 0; y < Math.min(data.length, SCREEN_H); y++) {
      for (let x = 0; x < Math.min(data[y].length, SCREEN_W); x++) {
        if (data[y][x]) {
          ctx.fillStyle = '#00d4ff'
          ctx.fillRect(x * ps, y * ps, ps - (ps > 2 ? 1 : 0), ps - (ps > 2 ? 1 : 0))
        }
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div ref="containerRef" class="display-preview">
    <div class="preview-frame">
      <div class="frame-header">
        <div class="frame-dots">
          <span class="dot red" />
          <span class="dot yellow" />
          <span class="dot green" />
        </div>
        <span class="frame-title">OLED Preview 128×64</span>
        <span class="frame-origin">Origin (0,0)</span>
      </div>
      <div class="preview-screen">
        <canvas
          v-if="hasData"
          :width="canvasWidth"
          :height="canvasHeight"
          class="pixel-canvas"
        />
        <div v-else class="preview-placeholder">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>配置参数并点击生成取模</span>
        </div>
        <div class="scanline-overlay" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.display-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-2xl);
  overflow: hidden;
}

.preview-frame {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 100%;
}

.frame-header {
  display: flex;
  align-items: center;
  gap: var(--sp-lg);
  padding: var(--sp-lg) var(--sp-2xl);
  border-bottom: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.2);
}

.frame-dots {
  display: flex;
  gap: 5px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.red { background: #ff5f57; }
    &.yellow { background: #febc2e; }
    &.green { background: #28c840; }
  }
}

.frame-title {
  font-size: var(--fs-sm);
  color: var(--text-secondary);
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.frame-origin {
  margin-left: auto;
  font-size: var(--fs-xs);
  color: var(--text-secondary);
  opacity: 0.6;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.preview-screen {
  background: #050510;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--output-min-h);
  overflow: hidden;
}

.pixel-canvas {
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-xl);
  color: var(--text-secondary);
  font-size: var(--fs-base);
  padding: 40px 20px;

  svg {
    width: 32px;
    height: 32px;
    opacity: 0.5;
  }
}

.scanline-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.06) 2px,
    rgba(0, 0, 0, 0.06) 4px
  );
  pointer-events: none;
}
</style>
