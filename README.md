# React Currying Demo

A tiny React + Vite project that teaches **currying** with an interactive playground and a reusable `curry` utility.

## Quick start

```bash
# 1) Install deps
npm install

# 2) Start dev server
npm run dev

# 3) Build for production
npm run build && npm run preview
```

## What you'll learn

- How to implement a generic `curry(fn)` for fixed-arity functions
- Stepwise vs grouped application: `f(a)(b)(c)` vs `f(a,b)(c)`
- Practical uses with an example `log(prefix, level, message)` function

## Project layout

```
react-currying-demo/
  ├── index.html
  ├── package.json
  ├── vite.config.js
  └── src/
      ├── App.jsx
      ├── main.jsx
      ├── utils/curry.js
      └── components/CurryPlayground.jsx
```

---

Made for interview prep and learning.
