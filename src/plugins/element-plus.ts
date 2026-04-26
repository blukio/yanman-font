import type { App } from 'vue'
import { ElMessage } from 'element-plus'

export function setupPlugins(app: App) {
  app.config.globalProperties.$message = ElMessage
}
