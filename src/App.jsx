import { useState, useEffect, useRef } from 'react'
import Editor from 'react-simple-code-editor'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'
import '@fontsource/fira-code'
import '@fontsource/jetbrains-mono'
import './style.css'
import 'lang-map'
import map from 'lang-map'

function App() {
  const [code, setCode] = useState('')
  const [tabSize, setTabSize] = useState(2)
  const [insertSpaces, setInsertSpaces] = useState(true)
  const [ignoreTabKey, setIgnoreTabKey] = useState(false)
  const [padding, setPadding] = useState(0)
  const [showFormat, setShowFormat] = useState(false)
  const [showFont, setShowFont] = useState(false)
  const [language, setLanguage] = useState('auto')
  const [fontFamily, setFontFamily] = useState('Fira Code')
  const [fontSize, setFontSize] = useState(14)

  const formatRef = useRef(null)
  const fontRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('code', code)
    localStorage.setItem('tabSize', tabSize)
    localStorage.setItem('insertSpaces', insertSpaces)
    localStorage.setItem('ignoreTabKey', ignoreTabKey)
    localStorage.setItem('padding', padding)
    localStorage.setItem('language', language)
    localStorage.setItem('fontFamily', fontFamily)
    localStorage.setItem('fontSize', fontSize)
  }, [code, tabSize, insertSpaces, ignoreTabKey, padding, language, fontFamily, fontSize])

  useEffect(() => {
    setCode(localStorage.getItem('code') || '')
    setTabSize(Number(localStorage.getItem('tabSize')) || 2)
    setInsertSpaces(localStorage.getItem('insertSpaces') === 'true')
    setIgnoreTabKey(localStorage.getItem('ignoreTabKey') === 'true')
    setPadding(Number(localStorage.getItem('padding')) || 0)
    setLanguage(localStorage.getItem('language') || 'auto')
    setFontFamily(localStorage.getItem('fontFamily') || 'Fira Code')
    setFontSize(Number(localStorage.getItem('fontSize')) || 14)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (formatRef.current && !formatRef.current.contains(event.target)) {
        setShowFormat(false)
      }
      if (fontRef.current && !fontRef.current.contains(event.target)) {
        setShowFont(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleSave = () => {
    const element = document.createElement('a')
    const file = new Blob([code], {type: 'text/plain'})
    const extension = language === 'auto' ? 'txt' : map.extensions(language)[0]
    element.href = URL.createObjectURL(file)
    element.download = `myCode.${extension}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleFormat = () => {
    setShowFormat(!showFormat)
  }

  const handleFont = () => {
    setShowFont(!showFont)
  }

  const handleReset = () => {
      setCode('')
      setTabSize(2)
      setInsertSpaces(true)
      setIgnoreTabKey(false)
      setPadding(0)
      setLanguage('auto')
  }

  return (
    <>
      <div className='toolbar'>
        <div onClick={handleSave}>Save</div>
        <div onClick={handleFormat} ref={formatRef}>
          <span>Format</span>
          {showFormat && (
            <div className='formatcontent' onClick={event => event.stopPropagation()}>
              <label>
                Tab Size
                <input
                  type='number'
                  value={tabSize}
                  onChange={() => setTabSize(event.target.value)}
                />
              </label>
              <label>
                Insert Spaces
                <input
                  type='checkbox'
                  checked={insertSpaces}
                  onChange={() => setInsertSpaces(!insertSpaces)}
                />
              </label>
              <label>
                Ignore Tab Key
                <input
                  type='checkbox'
                  checked={ignoreTabKey}
                  onChange={() => setIgnoreTabKey(!ignoreTabKey)}
                />
              </label>
              <label>
                Padding
                <input
                  type='number'
                  value={padding}
                  onChange={() => setPadding(event.target.value)}
                />
              </label>
              <label>
                Language
                <select value={language} onChange={() => setLanguage(event.target.value)}>
                  <option value='auto'>Auto</option>
                  <option value='javascript'>JavaScript</option>
                  <option value='python'>Python</option>
                  <option value='html'>HTML</option>
                  <option value='css'>CSS</option>
                  <option value='java'>Java</option>
                </select>
              </label>
            </div>
          )}
        </div>
        <div onClick={handleFont} ref={fontRef}>
          <span>Font</span>
          {showFont && (
            <div className='fontcontent' onClick={event => event.stopPropagation()}>
              <label>
                Font Family
                <select value={fontFamily} onChange={() => setFontFamily(event.target.value)}>
                  <option value='Fira Code'>Fira Code</option>
                  <option value='JetBrains Mono'>JetBrains Mono</option>
                  <option value='Consolas, monaco, monospace'>Consolas</option>
                </select>
              </label>
              <label>
                Font Size
                <input
                  type='number'
                  value={fontSize}
                  onChange={() => setFontSize(event.target.value)}
                />
              </label>
            </div>
          )}
        </div>
        <div onClick={handleReset}>Reset</div>
      </div>
      <Editor className='editor' value={code} onValueChange={code => setCode(code)} highlight={code => language === 'auto' ? hljs.highlightAuto(code).value : hljs.highlight(code, {language: language}).value} textareaClassName='editorinput' tabSize={tabSize} insertSpaces={insertSpaces} ignoreTabKey={ignoreTabKey} padding={padding} style={{fontFamily: fontFamily, fontSize: fontSize}}/>
    </>
  )
}

export default App
