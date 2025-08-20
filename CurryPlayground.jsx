import React, { useMemo, useState } from 'react'
import { curry, add3, multiply3, log } from '../utils/curry'

const functions = {
  'add3 (a+b+c)': add3,
  'multiply3 (a*b*c)': multiply3,
  'log(prefix, level, message)': log
}

export default function CurryPlayground() {
  const [fnKey, setFnKey] = useState('add3 (a+b+c)')
  const [inputs, setInputs] = useState(['', '', ''])
  const [groups, setGroups] = useState([[''], [''], ['']]) // to visualize f(a)(b)(c)
  const [output, setOutput] = useState(null)
  const [error, setError] = useState(null)

  const selectedFn = functions[fnKey]
  const arity = selectedFn.length
  const curried = useMemo(() => curry(selectedFn, arity), [selectedFn, arity])

  const updateInput = (i, v) => {
    const next = [...inputs]
    next[i] = v
    setInputs(next)
  }

  const reset = () => {
    setInputs(['','',''])
    setGroups([[''],[''],['']])
    setOutput(null)
    setError(null)
  }

  const runStepwise = () => {
    try {
      setError(null)
      let fn = curried
      const applied = []
      for (let i = 0; i < arity; i++) {
        const arg = parseArg(fnKey, i, inputs[i])
        fn = fn(arg)
        applied.push(arg)
      }
      const res = fn
      setOutput(res)
      setGroups(applied.map(a => [String(a)]))
    } catch (e) {
      setError(String(e.message || e))
      setOutput(null)
    }
  }

  const runGrouped = () => {
    try {
      setError(null)
      // Allow grouped application e.g. f(a,b)(c)
      const group1 = inputs[0] !== '' && inputs[1] !== '' ? [parseArg(fnKey,0,inputs[0]), parseArg(fnKey,1,inputs[1])] : []
      const group2 = inputs[2] !== '' ? [parseArg(fnKey,2,inputs[2])] : []
      let res = curried
      if (group1.length) res = res(...group1)
      if (group2.length) res = res(...group2)
      if (typeof res === 'function') {
        setError('Not enough arguments supplied.')
        setOutput(null)
      } else {
        setOutput(res)
      }
      setGroups([group1.map(String), group2.map(String), []])
    } catch (e) {
      setError(String(e.message || e))
      setOutput(null)
    }
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.h2}>Currying Playground</h2>
      <label style={styles.label}>
        Choose function:
        <select value={fnKey} onChange={e => { setFnKey(e.target.value); reset() }} style={styles.select}>
          {Object.keys(functions).map(key => <option key={key} value={key}>{key}</option>)}
        </select>
      </label>

      <div style={styles.row}>
        {new Array(arity).fill(0).map((_,i) => (
          <div key={i} style={styles.field}>
            <div style={styles.small}>arg{i+1}</div>
            <input
              value={inputs[i]}
              onChange={(e)=>updateInput(i, e.target.value)}
              placeholder={placeholderFor(fnKey, i)}
              style={styles.input}
            />
          </div>
        ))}
      </div>

      <div style={styles.row}>
        <button onClick={runStepwise} style={styles.button}>Apply stepwise: f(a)(b)(c)</button>
        <button onClick={runGrouped} style={styles.buttonSecondary}>Apply grouped: f(a,b)(c)</button>
        <button onClick={reset} style={styles.linkButton}>Reset</button>
      </div>

      <div style={styles.grid}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>How it applies</div>
          <code style={styles.code}>
            f({groups[0].join(', ')}) ➜ ({groups[1].join(', ')}) ➜ ({groups[2].join(', ')})
          </code>
          <div style={styles.hint}>You can mix how many args you call with each step.</div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>Output</div>
          {error && <div style={styles.error}>{error}</div>}
          {output !== null && !error && <div style={styles.output}>{String(output)}</div>}
          {!error && output === null && <div style={styles.hint}>Provide all arguments and click a button.</div>}
        </div>
      </div>
    </div>
  )
}

function placeholderFor(fnKey, index) {
  if (fnKey.startsWith('log')) {
    return ['e.g. APP','info | warn | error','message'][index] || ''
  }
  return 'number'
}

function parseArg(fnKey, index, raw) {
  if (fnKey.startsWith('log')) {
    if (index === 1) return raw || 'info' // default level
    return raw || ''
  }
  const n = Number(raw)
  if (Number.isNaN(n)) throw new Error(`arg${index+1} must be a number`)
  return n
}

const styles = {
  card: { maxWidth: 900, margin: '24px auto', padding: 24, borderRadius: 16, boxShadow: '0 6px 24px rgba(0,0,0,.12)', fontFamily: 'ui-sans-serif, system-ui' },
  h2: { margin: 0, marginBottom: 16 },
  row: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', margin: '12px 0' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  small: { fontSize: 12, opacity: .7 },
  input: { padding: '10px 12px', borderRadius: 10, border: '1px solid #ddd', minWidth: 140 },
  button: { padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600 },
  buttonSecondary: { padding: '10px 14px', borderRadius: 12, border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 600 },
  linkButton: { background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' },
  label: { display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 },
  select: { padding: '8px 10px', borderRadius: 10 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 },
  panel: { border: '1px solid #eee', borderRadius: 12, padding: 12 },
  panelTitle: { fontWeight: 700, marginBottom: 8 },
  code: { display: 'block', padding: 12, background: '#0b1020', color: 'white', borderRadius: 10, fontFamily: 'ui-monospace, SFMono-Regular' },
  hint: { fontSize: 13, opacity: .75, marginTop: 8 },
  error: { padding: 12, background: '#fee2e2', borderRadius: 10, color: '#991b1b', fontWeight: 600 },
  output: { padding: 12, background: '#ecfeff', borderRadius: 10, fontWeight: 700 }
}
