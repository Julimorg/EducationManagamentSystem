// import { useEffect, useCallback, useRef } from 'react'

// type Options = {
//   /** Called when user exits fullscreen (F11, Esc, etc.) */
//   onExit: () => void
// }

// /**
//  * useFullscreenGuard
//  * ──────────────────
//  * 1. Requests fullscreen on mount.
//  * 2. Listens for fullscreenchange — if the document leaves
//  *    fullscreen unexpectedly, calls onExit().
//  * 3. Intercepts F11 keydown to prevent default and trigger onExit.
//  * 4. Exposes `enterFullscreen()` so the modal can send the student back.
//  */
// export function useFullscreenGuard({ onExit }: Options) {
//   const isIntentional = useRef(false)   // set true when WE trigger exit (submit)

//   // ── Enter fullscreen ──────────────────────────────────
//   const enterFullscreen = useCallback(() => {
//     const el = document.documentElement
//     if (el.requestFullscreen) {
//       el.requestFullscreen().catch(() => {})
//     } else if ((el as any).webkitRequestFullscreen) {
//       ;(el as any).webkitRequestFullscreen()
//     }
//   }, [])

//   // ── Exit fullscreen (called on intentional submit) ────
//   const exitFullscreen = useCallback(() => {
//     isIntentional.current = true
//     if (document.exitFullscreen) {
//       document.exitFullscreen().catch(() => {})
//     } else if ((document as any).webkitExitFullscreen) {
//       ;(document as any).webkitExitFullscreen()
//     }
//   }, [])

//   // ── Mount: request fullscreen ─────────────────────────
//   useEffect(() => {
//     enterFullscreen()

//     // fullscreenchange fires whenever fullscreen state changes
//     function handleChange() {
//       const isFullscreen =
//         !!document.fullscreenElement || !!(document as any).webkitFullscreenElement

//       if (!isFullscreen && !isIntentional.current) {
//         onExit()
//       }
//     }

//     // F11 interception
//     function handleKeyDown(e: KeyboardEvent) {
//       if (e.key === 'F11') {
//         e.preventDefault()
//         // If currently fullscreen, this is an exit attempt
//         if (document.fullscreenElement) {
//           onExit()
//         } else {
//           enterFullscreen()
//         }
//       }
//     }

//     document.addEventListener('fullscreenchange', handleChange)
//     document.addEventListener('webkitfullscreenchange', handleChange)
//     document.addEventListener('keydown', handleKeyDown)

//     return () => {
//       document.removeEventListener('fullscreenchange', handleChange)
//       document.removeEventListener('webkitfullscreenchange', handleChange)
//       document.removeEventListener('keydown', handleKeyDown)
//       // Clean up fullscreen on unmount
//       isIntentional.current = true
//       if (document.fullscreenElement && document.exitFullscreen) {
//         document.exitFullscreen().catch(() => {})
//       }
//     }
//   }, [enterFullscreen, onExit])

//   return { enterFullscreen, exitFullscreen }
// }