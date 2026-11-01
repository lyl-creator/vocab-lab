import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class Boundary extends Component<{ children: ReactNode }, { error: string }> {
  state = { error: '' }
  static getDerivedStateFromError(e: unknown) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#faf9f6', padding: 24 }}>
        <div style={{ maxWidth: 460, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#30392e' }}>
          <h1 style={{ fontSize: 22, marginBottom: 10 }}>页面遇到了一点问题</h1>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#788075' }}>
            可能是浏览器里保存的旧版学习记录与新版本不兼容。点击下面的按钮会清除本机记录并重新载入（学习数据在「偏好设置 → 导出」里可以备份）。
          </p>
          <p style={{ fontSize: 12, color: '#9aa392', margin: '12px 0' }}>{this.state.error}</p>
          <button
            onClick={() => { localStorage.removeItem('vocab-lab-v1'); location.reload() }}
            style={{ marginTop: 8, padding: '11px 22px', borderRadius: 8, border: '1px solid #8eab50', background: '#d9ed9d', color: '#33511f', fontSize: 14, cursor: 'pointer' }}
          >清除本机记录并重新载入</button>
        </div>
      </div>
    )
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Boundary>
      <App />
    </Boundary>
  </StrictMode>,
)
