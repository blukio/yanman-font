import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { FontConfig, ImageConfig, ModType, GenerateResult } from '@/types'

export const useModStore = defineStore('mod', () => {
  const modType = ref<ModType>('font')

  const fontConfig = reactive<FontConfig>({
    width: 16,
    height: 16,
    modMode: 'column-row',
    polarity: 'positive',
    inputText: '',
  })

  const imageConfig = reactive<ImageConfig>({
    file: null,
    fileName: '',
    targetWidth: 128,
    targetHeight: 64,
    keepAspectRatio: false,
    threshold: 128,
    modMode: 'column-row',
    polarity: 'positive',
  })

  const generateResult = reactive<GenerateResult>({
    cArray: '',
    previewData: [],
  })

  const isGenerating = ref(false)

  return {
    modType,
    fontConfig,
    imageConfig,
    generateResult,
    isGenerating,
  }
})
