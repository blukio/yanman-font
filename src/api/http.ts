import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000,
})

http.interceptors.response.use(
  (res) => res.data,
  (err) => {
    ElMessage.error(err.message)
    return Promise.reject(err)
  }
)

export default http
