import type { ModMode, Polarity } from '@/types'

/**
 * 文字转点阵（通过 Canvas 渲染后二值化），支持按 displayWidth 自动换行
 */
export function textToDotMatrix(
  text: string,
  charWidth: number,
  charHeight: number,
  polarity: Polarity,
  displayWidth: number
): number[][] {
  const charsPerRow = Math.max(1, Math.floor(displayWidth / charWidth))
  const rows = Math.ceil(text.length / charsPerRow)
  const canvasWidth = charsPerRow * charWidth
  const canvasHeight = rows * charHeight

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${charHeight - 2}px sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  for (let i = 0; i < text.length; i++) {
    const row = Math.floor(i / charsPerRow)
    const col = i % charsPerRow
    ctx.fillText(text[i], col * charWidth, row * charHeight + 1)
  }

  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  return binarizeImageData(imageData, canvasWidth, canvasHeight, 128, polarity)
}

/**
 * 图片转点阵（缩放到目标尺寸后二值化）
 */
export async function imageToDotMatrix(
  file: File,
  targetWidth: number,
  targetHeight: number,
  keepAspectRatio: boolean,
  threshold: number,
  polarity: Polarity
): Promise<number[][]> {
  const bitmap = await createImageBitmap(file)

  let drawWidth = targetWidth
  let drawHeight = targetHeight

  if (keepAspectRatio) {
    const ratio = Math.min(targetWidth / bitmap.width, targetHeight / bitmap.height)
    drawWidth = Math.round(bitmap.width * ratio)
    drawHeight = Math.round(bitmap.height * ratio)
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, targetWidth, targetHeight)

  const offsetX = Math.round((targetWidth - drawWidth) / 2)
  const offsetY = Math.round((targetHeight - drawHeight) / 2)
  ctx.drawImage(bitmap, offsetX, offsetY, drawWidth, drawHeight)

  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
  return binarizeImageData(imageData, targetWidth, targetHeight, threshold, polarity)
}

/**
 * ImageData 二值化
 */
function binarizeImageData(
  imageData: ImageData,
  width: number,
  height: number,
  threshold: number,
  polarity: Polarity
): number[][] {
  const matrix: number[][] = []
  for (let y = 0; y < height; y++) {
    const row: number[] = []
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const gray = imageData.data[idx] * 0.299 + imageData.data[idx + 1] * 0.587 + imageData.data[idx + 2] * 0.114
      const isOn = gray >= threshold
      row.push(polarity === 'positive' ? (isOn ? 1 : 0) : (isOn ? 0 : 1))
    }
    matrix.push(row)
  }
  return matrix
}

/**
 * 点阵转 C 数组，支持四种取模方式
 */
export function dotMatrixToCArray(
  matrix: number[][],
  width: number,
  height: number,
  modMode: ModMode,
  varName: string
): string {
  const bytes: number[] = []

  switch (modMode) {
    case 'column-row':
      // 列行式：按列扫描，每列从上到下，列从左到右，每字节MSB在上
      bytes.push(...scanColumnRow(matrix, width, height))
      break
    case 'row-column':
      // 行列式：按行扫描，每行从左到右，行从上到下，每字节MSB在左
      bytes.push(...scanRowColumn(matrix, width, height))
      break
    case 'column-by-column':
      // 逐列式：每列从上到下填满一个字节后再换下一列
      bytes.push(...scanColumnByColumn(matrix, width, height))
      break
    case 'row-by-row':
      // 逐行式：每行从左到右填满一个字节后再换下一行
      bytes.push(...scanRowByRow(matrix, width, height))
      break
  }

  const modeLabel: Record<ModMode, string> = {
    'column-row': '列行式',
    'row-column': '行列式',
    'column-by-column': '逐列式',
    'row-by-row': '逐行式',
  }

  const lines: string[] = []
  lines.push(`// ${width}x${height} | ${modeLabel[modMode]}`)
  lines.push(`const unsigned char ${varName}[${bytes.length}] = {`)

  for (let i = 0; i < bytes.length; i++) {
    const isLast = i === bytes.length - 1
    const hex = `0x${bytes[i].toString(16).toUpperCase().padStart(2, '0')}`
    if (i % 16 === 0) {
      lines.push(`  ${hex}${isLast ? '' : ','}`)
    } else {
      lines[lines.length - 1] += ` ${hex}${isLast ? '' : ','}`
    }
  }

  lines.push('};')
  return lines.join('\n')
}

/** 列行式：按列优先，每8行为一组，每组内从上到下按位排列，MSB在上 */
function scanColumnRow(matrix: number[][], width: number, height: number): number[] {
  const bytes: number[] = []
  const pages = Math.ceil(height / 8)
  for (let page = 0; page < pages; page++) {
    for (let x = 0; x < width; x++) {
      let byteVal = 0
      for (let bit = 0; bit < 8; bit++) {
        const y = page * 8 + bit
        if (y < height && matrix[y][x]) {
          byteVal |= 1 << bit
        }
      }
      bytes.push(byteVal)
    }
  }
  return bytes
}

/** 行列式：按行优先，每8列为一个字节，MSB在左 */
function scanRowColumn(matrix: number[][], width: number, height: number): number[] {
  const bytes: number[] = []
  const bytesPerRow = Math.ceil(width / 8)
  for (let y = 0; y < height; y++) {
    for (let b = 0; b < bytesPerRow; b++) {
      let byteVal = 0
      for (let bit = 0; bit < 8; bit++) {
        const x = b * 8 + bit
        if (x < width && matrix[y][x]) {
          byteVal |= 1 << (7 - bit)
        }
      }
      bytes.push(byteVal)
    }
  }
  return bytes
}

/** 逐列式：每列从上到下，MSB在上，不满8位的高位补0 */
function scanColumnByColumn(matrix: number[][], width: number, height: number): number[] {
  const bytes: number[] = []
  for (let x = 0; x < width; x++) {
    let byteVal = 0
    for (let bit = 0; bit < 8 && bit < height; bit++) {
      if (matrix[bit][x]) {
        byteVal |= 1 << (7 - bit)
      }
    }
    bytes.push(byteVal)
  }
  return bytes
}

/** 逐行式：每行从左到右，MSB在左，不满8位的高位补0 */
function scanRowByRow(matrix: number[][], width: number, height: number): number[] {
  const bytes: number[] = []
  for (let y = 0; y < height; y++) {
    let byteVal = 0
    for (let bit = 0; bit < 8 && bit < width; bit++) {
      if (matrix[y][bit]) {
        byteVal |= 1 << (7 - bit)
      }
    }
    bytes.push(byteVal)
  }
  return bytes
}
