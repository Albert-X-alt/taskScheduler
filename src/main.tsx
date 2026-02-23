import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // 引入我们刚才写的核心代码

// 将 App 渲染到 index.html 的 root 节点中
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)