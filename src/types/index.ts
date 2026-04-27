/** 取模方式 */
export type ModMode = 'column-row' | 'row-column' | 'column-by-column' | 'row-by-row'

/** 阴阳码 */
export type Polarity = 'positive' | 'negative'

/** 取模类型 */
export type ModType = 'font' | 'image'

/** 字体取模配置 */
export interface FontConfig {
  width: number
  height: number
  displayWidth: number
  modMode: ModMode
  polarity: Polarity
  inputText: string
}

/** 图片取模配置 */
export interface ImageConfig {
  file: File | null
  fileName: string
  targetWidth: number
  targetHeight: number
  keepAspectRatio: boolean
  threshold: number
  modMode: ModMode
  polarity: Polarity
}

/** 生成结果 */
export interface GenerateResult {
  cArray: string
  previewData: number[][]
}
