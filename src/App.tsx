import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { TiptapEditor, type TiptapEditorRef } from './components/tiptap-editor'

type ThemeType = 'default' | 'dark'

const sampleMarkdown = `
# 欢迎使用 Markdown 导入编辑器

> 在左侧输入或导入 Markdown，点击“导入到编辑器”即可在右侧进行所见即所得编辑。

## 支持的特性
- 段落、标题、列表、引用
- 代码块与高亮
- 链接与图片、表格、任务列表

## 段落

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 示例表格
| 姓名 | 年龄 |
| --- | --- |
| 张三 | 24 |
| 李四 | 28 |

## 任务列表
- [ ] 学习 Tiptap
- [x] 初始化项目

## 代码块
\`\`\`ts
console.log('Hello')
\`\`\`

---
更多样式请继续尝试！

`

function App() {
  const [theme, setTheme] = useState<ThemeType>('default')
  const [editable, setEditable] = useState(true)
  const [inputMd, setInputMd] = useState<string>(sampleMarkdown)
  const [editorMd, setEditorMd] = useState<string>(sampleMarkdown)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const editorRef = useRef<TiptapEditorRef>(null)

  const canImport = useMemo(() => inputMd.trim().length > 0, [inputMd])

  const handleFilePick = async (file: File) => {
    const text = await file.text()
    setInputMd(text)
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleFilePick(file)
  }

  const handleImport = () => {
    if (!canImport) return
    setEditorMd(inputMd)
    editorRef.current?.setContent(inputMd)
  }

  const handleClear = () => {
    setInputMd('')
  }

  const handleCopyMd = async () => {
    try {
      await navigator.clipboard.writeText(editorMd)
    } catch (e) {
      // ignore
    }
  }

  const handleDownloadMd = () => {
    const blob = new Blob([editorMd], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    // 初次渲染时同步输入区与编辑器内容
    setEditorMd(inputMd)
  }, [])

  return (
    <div className="md-import-page fullscreen">
      <div className="content two-cols">
        <section className="source-pane">
          <div className="source-toolbar">
            <div className="left-actions">
              <button
                className="btn"
                onClick={() => fileInputRef.current?.click()}
              >导入文件</button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="right-actions">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'default')}
                />
                <span>{theme === 'dark' ? '暗色主题' : '浅色主题'}</span>
              </label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={editable}
                  onChange={(e) => setEditable(e.target.checked)}
                />
                <span>{editable ? '可编辑' : '只读'}</span>
              </label>
            </div>
          </div>

          <textarea
            className="markdown-input fill"
            placeholder="在此粘贴或输入 Markdown 内容..."
            value={inputMd}
            onChange={(e) => {
              setInputMd(e.target.value)
              editorRef.current?.setContent(e.target.value)
            }
            }
          />

          <div className="source-actions">
            <button className="btn primary" disabled={!canImport} onClick={handleImport}>导入到编辑器</button>
            <button className="btn" onClick={handleClear}>清空</button>
            <button className="btn" onClick={handleCopyMd}>复制 Markdown</button>
            <button className="btn" onClick={handleDownloadMd}>下载 Markdown</button>
          </div>
        </section>

        <section className="editor-pane">
          <TiptapEditor
            ref={editorRef}
            initialContent={editorMd}
            editable={editable}
            theme={theme}
            placeholder="开始编辑..."
            // onChange={(md) => setEditorMd(md)}
          />
        </section>
      </div>
    </div>
  )
}

export default App
