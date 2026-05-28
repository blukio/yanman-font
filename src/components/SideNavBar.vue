<script setup lang="ts">
import { useModStore } from '@/store/mod'
import { textToDotMatrix, imageToDotMatrix, dotMatrixToCArray } from '@/utils/mod'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import ModModeSelector from '@/components/ModModeSelector.vue'

const store = useModStore()

const imageInputRef = ref<HTMLInputElement>()

/** 选择图片 */
const handleSelectImage = () => {
  imageInputRef.value?.click()
}

const handleImageChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }
  store.imageConfig.file = file
  store.imageConfig.fileName = file.name
  input.value = ''
}

/** 清除图片 */
const handleClearImage = () => {
  store.imageConfig.file = null
  store.imageConfig.fileName = ''
}

/** 生成取模数据 */
const handleGenerate = async () => {
  if (store.modType === 'font') {
    if (!store.fontConfig.inputText.trim()) {
      ElMessage.warning('请输入要取模的文字')
      return
    }
  } else {
    if (!store.imageConfig.file) {
      ElMessage.warning('请选择目标图片')
      return
    }
    if (!store.imageConfig.fileName.trim()) {
      ElMessage.warning('请输入图片名')
      return
    }
  }

  store.isGenerating = true

  try {
    let matrix: number[][]
    let varName: string

    if (store.modType === 'font') {
      const cfg = store.fontConfig
      matrix = textToDotMatrix(cfg.inputText, cfg.width, cfg.height, cfg.polarity, cfg.displayWidth)
      varName = `font_${cfg.width}x${cfg.height}`
    } else {
      const cfg = store.imageConfig
      matrix = await imageToDotMatrix(
        cfg.file!,
        cfg.targetWidth,
        cfg.targetHeight,
        cfg.keepAspectRatio,
        cfg.threshold,
        cfg.polarity
      )
      varName = cfg.fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_') || 'image'
    }

    const totalWidth = store.modType === 'font'
      ? Math.min(store.fontConfig.displayWidth, store.fontConfig.width * store.fontConfig.inputText.length)
      : store.imageConfig.targetWidth
    const totalHeight = store.modType === 'font'
      ? Math.ceil(store.fontConfig.inputText.length / Math.max(1, Math.floor(store.fontConfig.displayWidth / store.fontConfig.width))) * store.fontConfig.height
      : store.imageConfig.targetHeight
    const modMode = store.modType === 'font' ? store.fontConfig.modMode : store.imageConfig.modMode

    const cArray = dotMatrixToCArray(matrix, totalWidth, totalHeight, modMode, varName)

    store.generateResult.previewData = matrix
    store.generateResult.cArray = cArray

    ElMessage.success('取模完成')
  } catch {
    ElMessage.error('生成失败')
  } finally {
    store.isGenerating = false
  }
}
</script>

<template>
  <aside class="side-nav">
    <!-- 模式切换 -->
    <div class="nav-tabs">
      <div
        class="nav-tab"
        :class="{ active: store.modType === 'font' }"
        @click="store.modType = 'font'"
      >
        字体取模
      </div>
      <div
        class="nav-tab"
        :class="{ active: store.modType === 'image' }"
        @click="store.modType = 'image'"
      >
        图片取模
      </div>
    </div>

    <div class="config-scroll">
      <!-- ========== 字体取模配置 ========== -->
      <template v-if="store.modType === 'font'">
        <div class="config-section">
          <div class="config-item">
            <div class="config-label">单个字体尺寸</div>
            <div class="size-inputs">
              <div class="size-field">
                <div class="field-inner">
                  <span class="field-hint">宽度</span>
                  <div class="field-input">
                    <input v-model.number="store.fontConfig.width" type="number" min="1" max="256" />
                    <span class="field-unit">px</span>
                  </div>
                </div>
              </div>
              <div class="size-field">
                <div class="field-inner">
                  <span class="field-hint">高度</span>
                  <div class="field-input">
                    <input v-model.number="store.fontConfig.height" type="number" min="1" max="256" />
                    <span class="field-unit">px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="config-item">
            <div class="config-label">显示宽度（自动换行）</div>
            <div class="size-inputs">
              <div class="size-field">
                <div class="field-inner">
                  <div class="field-input">
                    <input v-model.number="store.fontConfig.displayWidth" type="number" min="1" max="1024" />
                    <span class="field-unit">px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="config-item">
            <div class="config-label">取模方式</div>
            <ModModeSelector v-model="store.fontConfig.modMode" />
          </div>

          <div class="config-item">
            <div class="config-label">阴阳码</div>
            <div class="polarity-options">
              <label class="polarity-option">
                <input v-model="store.fontConfig.polarity" type="radio" value="positive" name="font-polarity" />
                <span class="radio-custom" />
                <span class="polarity-text">阳码 (1=亮)</span>
              </label>
              <label class="polarity-option">
                <input v-model="store.fontConfig.polarity" type="radio" value="negative" name="font-polarity" />
                <span class="radio-custom" />
                <span class="polarity-text">阴码 (0=亮)</span>
              </label>
            </div>
          </div>

          <div class="config-item">
            <div class="config-label">需求文字</div>
            <el-input
              v-model="store.fontConfig.inputText"
              type="textarea"
              :rows="4"
              placeholder="输入要取模的文字"
              resize="none"
            />
          </div>
        </div>
      </template>

      <!-- ========== 图片取模配置 ========== -->
      <template v-else>
        <div class="config-section">
          <div class="config-item">
            <div class="config-label">选择目标图片</div>
            <div class="image-picker">
              <input ref="imageInputRef" type="file" accept="image/*" hidden @change="handleImageChange" />
              <div v-if="store.imageConfig.fileName" class="image-selected">
                <span class="image-name" :title="store.imageConfig.fileName">{{ store.imageConfig.fileName }}</span>
                <button class="image-clear" @click="handleClearImage">
                  <svg viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
              </div>
              <button v-else class="image-select-btn" @click="handleSelectImage">
                <svg viewBox="0 0 16 16" fill="none"><path d="M2 10L6 6L9 9L14 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/></svg>
                选择图片
              </button>
            </div>
          </div>

          <div class="config-item">
            <div class="config-label">图片名</div>
            <el-input
              v-model="store.imageConfig.fileName"
              placeholder="输入图片名（用于变量名）"
              :disabled="!store.imageConfig.file"
            />
          </div>

          <div class="config-item">
            <div class="config-label">生成大小</div>
            <div class="size-inputs">
              <div class="size-field">
                <div class="field-inner">
                  <span class="field-hint">宽度</span>
                  <div class="field-input">
                    <input v-model.number="store.imageConfig.targetWidth" type="number" min="1" max="1024" />
                    <span class="field-unit">px</span>
                  </div>
                </div>
              </div>
              <div class="size-field">
                <div class="field-inner">
                  <span class="field-hint">高度</span>
                  <div class="field-input">
                    <input v-model.number="store.imageConfig.targetHeight" type="number" min="1" max="1024" />
                    <span class="field-unit">px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="config-item">
            <div class="config-label">等比缩放</div>
            <el-switch v-model="store.imageConfig.keepAspectRatio" class="dark-switch" />
          </div>

          <div class="config-item">
            <div class="config-label">二值化阈值</div>
            <div class="threshold-row">
              <el-slider
                v-model="store.imageConfig.threshold"
                :min="0"
                :max="255"
                class="dark-slider"
              />
              <span class="threshold-value">{{ store.imageConfig.threshold }}</span>
            </div>
          </div>

          <div class="config-item">
            <div class="config-label">取模方式</div>
            <ModModeSelector v-model="store.imageConfig.modMode" />
          </div>

          <div class="config-item">
            <div class="config-label">阴阳码</div>
            <div class="polarity-options">
              <label class="polarity-option">
                <input v-model="store.imageConfig.polarity" type="radio" value="positive" name="image-polarity" />
                <span class="radio-custom" />
                <span class="polarity-text">阳码 (1=亮)</span>
              </label>
              <label class="polarity-option">
                <input v-model="store.imageConfig.polarity" type="radio" value="negative" name="image-polarity" />
                <span class="radio-custom" />
                <span class="polarity-text">阴码 (0=亮)</span>
              </label>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 生成按钮 -->
    <div class="main-cta">
      <button class="generate-btn" :disabled="store.isGenerating" @click="handleGenerate">
        <svg class="btn-icon" viewBox="0 0 20 16" fill="none">
          <path d="M2 8L8 14L18 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ store.isGenerating ? '生成中...' : '生成取模' }}
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.side-nav {
  width: var(--sidebar-w);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
  border-right: 1px solid var(--border-color);
}

.nav-tabs {
  display: flex;
  padding: var(--sp-3xl) var(--sp-3xl) var(--sp-2xl);
}

.nav-tab {
  flex: 1;
  text-align: center;
  padding: var(--sp-md) 0;
  font-size: var(--fs-base);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  font-weight: 500;

  &.active {
    background: var(--accent-blue);
    color: #fff;
  }

  &:not(.active):hover {
    color: var(--text-primary);
    background: var(--bg-card);
  }
}

.config-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--sp-3xl);
}

.config-section {
  display: flex;
  flex-direction: column;
}

.config-item {
  padding: var(--sp-2xl) 0;
}

.config-label {
  font-size: var(--fs-sm);
  color: var(--text-label);
  margin-bottom: var(--sp-lg);
  font-weight: 500;
}

.size-inputs {
  display: flex;
  gap: var(--sp-xl);
}

.size-field {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;

  .field-inner {
    padding: var(--sp-md) var(--sp-xl);
    display: flex;
    flex-direction: column;
    gap: var(--sp-sm);
  }

  .field-hint {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }

  .field-input {
    display: flex;
    align-items: center;
    gap: var(--sp-xs);

    input {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: var(--fs-md);
      outline: none;
      width: 100%;
      font-family: inherit;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }
    }

    .field-unit {
      font-size: var(--fs-sm);
      color: var(--text-secondary);
    }
  }
}

.polarity-options {
  display: flex;
  gap: var(--sp-2xl);
}

.polarity-option {
  display: flex;
  align-items: center;
  gap: var(--sp-sm);
  cursor: pointer;
  font-size: var(--fs-base);
  color: var(--text-primary);

  input[type="radio"] {
    display: none;
  }

  .radio-custom {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;

    &::after {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-cyan);
      transform: scale(0);
      transition: transform 0.2s;
    }
  }

  input:checked + .radio-custom {
    border-color: var(--accent-cyan);

    &::after {
      transform: scale(1);
    }
  }

  .polarity-text {
    white-space: nowrap;
  }
}

/* 图片选择 */
.image-picker {
  display: flex;
  flex-direction: column;
}

.image-select-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-md);
  padding: var(--sp-xl);
  background: var(--bg-input);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--fs-base);
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    border-color: var(--accent-cyan);
    color: var(--accent-cyan);
  }
}

.image-selected {
  display: flex;
  align-items: center;
  gap: var(--sp-md);
  padding: var(--sp-lg) var(--sp-xl);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.image-name {
  flex: 1;
  font-size: var(--fs-base);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-clear {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 2px;
  display: flex;

  svg {
    width: 10px;
    height: 10px;
  }

  &:hover {
    color: #ff5555;
  }
}

/* 阈值滑块行 */
.threshold-row {
  display: flex;
  align-items: center;
  gap: var(--sp-xl);
}

.threshold-value {
  font-size: var(--fs-base);
  color: var(--text-primary);
  min-width: 28px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.main-cta {
  padding: var(--sp-3xl);
  border-top: 1px solid var(--border-color);
}

.generate-btn {
  width: 100%;
  height: var(--btn-h);
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
  border: none;
  border-radius: var(--radius-lg);
  color: #fff;
  font-size: var(--fs-lg);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-md);
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-icon {
    width: 16px;
    height: 13px;
  }
}

/* Element Plus 深色主题覆写 */
:deep(.el-textarea__inner) {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: var(--fs-base);

  &::placeholder {
    color: var(--text-secondary);
  }

  &:focus {
    border-color: var(--accent-cyan);
  }
}

:deep(.el-input__wrapper) {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  box-shadow: none;
  border-radius: var(--radius-md);

  .el-input__inner {
    color: var(--text-primary);
    font-size: var(--fs-base);

    &::placeholder {
      color: var(--text-secondary);
    }
  }

  &.is-disabled {
    .el-input__inner {
      color: var(--text-secondary);
      -webkit-text-fill-color: var(--text-secondary);
    }
  }
}

:deep(.dark-switch) {
  --el-switch-on-color: var(--accent-cyan);
  --el-switch-off-color: var(--border-color);
}

:deep(.dark-slider) {
  flex: 1;

  .el-slider__runway {
    background: var(--border-color);
  }

  .el-slider__bar {
    background: var(--accent-cyan);
  }

  .el-slider__button {
    border-color: var(--accent-cyan);
  }
}
</style>
