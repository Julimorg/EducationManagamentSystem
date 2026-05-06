import React from 'react'
import { AlertCircle, AlertTriangle } from 'lucide-react'

// ─── SubmitModal ──────────────────────────────────────────
type SubmitModalProps = {
  open:     boolean
  onCancel: () => void
  onSubmit: () => void
}

export function SubmitModal({ open, onCancel, onSubmit }: SubmitModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <h3 className="text-base font-bold text-gray-900">Submit Exam?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Are you sure you want to submit your exam? You will not be able to change your answers after submission.
        </p>
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── FullscreenModal ──────────────────────────────────────
type FullscreenModalProps = {
  open:             boolean
  onReturnFullscreen: () => void
  onSubmit:         () => void
}

export function FullscreenModal({ open, onReturnFullscreen, onSubmit }: FullscreenModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Warning banner */}
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700 font-medium">
            Fullscreen mode was exited! You must submit or return to fullscreen.
          </p>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-2">
          Fullscreen Required
        </h3>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          To maintain exam integrity, you must stay in fullscreen mode. Please return to fullscreen or submit your exam now.
        </p>

        <div className="flex justify-end gap-2.5">
          <button
            onClick={onReturnFullscreen}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Return to Fullscreen
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  )
}