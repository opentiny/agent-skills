/// <reference types="vite/client" />

declare module '*.vue?raw' {
  const content: string
  export default content
}
