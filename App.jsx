import React from 'react'
import CurryPlayground from './components/CurryPlayground.jsx'
import { curry, add3, log } from './utils/curry.js'

export default function App() {
  const add3Curried = curry(add3)
  const demoSum = add3Curried(1)(2)(3)

  const logCurried = curry(log)
  const infoLog = logCurried('APP')('info')('ready')

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={{margin:0}}>React + Currying</h1>
        <p style={{margin:0, opacity:.8}}>Interactive demo + reusable <code>curry</code> utility</p>
      </header>

      <section style={styles.section}>
        <h2>What is currying?</h2>
        <p>
          Currying transforms a function that takes multiple arguments into a sequence of functions that each take one (or some) argument(s).
          This lets you build partially-applied functions that are reusable and composable.
        </p>
        <pre style={styles.code}>
{String.raw`// From this:
const add3 = (a,b,c) => a + b + c

// To this:
const add3C = curry(add3)
add3C(1)(2)(3)            // 6
add3C(1,2)(3)             // 6
add3C(1)(2,3)             // 6`}
        </pre>
        <div style={styles.callout}>
          <strong>Example:</strong> <code>curry(log)('APP')('warn')('Low battery')</code> ➜ “⚠️ APP: Low battery”
        </div>
      </section>

      <CurryPlayground />

      <section style={styles.section}>
        <h2>Why use it?</h2>
        <ul>
          <li><strong>Partial application:</strong> pre-fill some args to create specialized functions.</li>
          <li><strong>Composition-friendly:</strong> great with functional patterns.</li>
          <li><strong>Declarative UI:</strong> easily inject dependencies (e.g., prefix or config) and return a renderer.</li>
        </ul>
      </section>

      <footer style={{textAlign:'center', opacity:.6, margin:'24px 0'}}>
        Built for learning — drop into <code>src/utils/curry.js</code> to see the implementation.
      </footer>
    </div>
  )
}

const styles = {
  page: { fontFamily: 'ui-sans-serif, system-ui', maxWidth: 960, margin: '0 auto', padding: 24 },
  header: { display: 'grid', gap: 6, margin: '12px 0 18px' },
  section: { margin: '18px 0' },
  code: { display:'block', background:'#0b1020', color:'white', padding:12, borderRadius:12, overflowX:'auto' },
  callout: { padding:12, background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:12, marginTop:12 }
}
