import React, { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  MoreVertical,
  Users,
  MessageSquare,
  Plus,
  X,
  UploadCloud,
  UserCircle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────
type UploadedFile = {
  name: string
  size: string
}

// ─── Component ────────────────────────────────────────────
export function AssignmentDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [isSubmitted, setIsSubmitted]       = useState(false)
  const [uploadedFiles, setUploadedFiles]   = useState<UploadedFile[]>([])
  const fileInputRef                        = useRef<HTMLInputElement>(null)

  // ── handlers ──
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const next = Array.from(files).map((f) => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
    }))
    setUploadedFiles((prev) => [...prev, ...next])
    e.target.value = ''
  }

  function removeFile(index: number) {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function turnIn() {
    if (uploadedFiles.length === 0) return
    setIsSubmitted(true)
  }

  function unsubmit() {
    setIsSubmitted(false)
  }

  // ── render ──
  return (
    <div className="max-w-6xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to assignments
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Assignment detail ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-4">

            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-1">
              <FileText className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title row */}
              <div className="flex justify-between items-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 leading-tight">
                  IELTS Writing Task 2 — Essay Practice
                </h1>
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-1">Ms. Sarah · Apr 15</p>

              {/* Points / Due */}
              <div className="flex justify-between items-center mt-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-900">
                <span>0 / 100 points</span>
                <span>Due Apr 19, 23:59</span>
              </div>

              {/* Body */}
              <div className="mt-6 text-sm sm:text-base text-gray-700 space-y-4 leading-relaxed">
                <p>Write a 250-word essay on the following topic:</p>
                <p className="font-medium italic">
                  "Some people believe that technology has made our lives more
                  complex. To what extent do you agree or disagree?"
                </p>
                <div>
                  <p className="mb-2">Requirements:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Submit your answer in a single file (PDF, DOC, or DOCX).</li>
                    <li>Maximum file size is 600MB.</li>
                    <li>
                      Use the naming convention:{' '}
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-700">
                        [YourName]_WritingTask2.pdf
                      </code>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Attached materials */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AttachmentCard
                  name="Writing_Task2_Rubric.pdf"
                  type="PDF"
                  iconColor="text-red-500"
                />
                <AttachmentCard
                  name="Sample_Band8_Essay.docx"
                  type="Word"
                  iconColor="text-blue-500"
                />
              </div>

              {/* Class comments */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Users className="w-4 h-4" />
                  Class comments
                </div>
                <button className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-2 rounded-md transition-colors -ml-3">
                  <MessageSquare className="w-4 h-4" />
                  Add class comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Your work + Feedback ── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Your work card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-normal text-gray-900">Your work</h2>
              <span className={`text-sm font-medium ${isSubmitted ? 'text-green-600' : 'text-green-600'}`}>
                {isSubmitted ? 'Turned in' : 'Assigned'}
              </span>
            </div>

            {/* Uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mb-4">
                {uploadedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-gray-400">{file.size}</p>
                      </div>
                    </div>
                    {!isSubmitted && (
                      <button
                        onClick={() => removeFile(i)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors ml-2 flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isSubmitted ? (
              <>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx"
                />

                {/* Upload zone */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 flex flex-col items-center gap-1.5 transition-colors mb-3"
                >
                  <UploadCloud className="w-5 h-5" />
                  Click to upload files
                </button>

                {/* Turn in */}
                <button
                  onClick={turnIn}
                  disabled={uploadedFiles.length === 0}
                  className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                    uploadedFiles.length > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Turn in
                </button>
              </>
            ) : (
              <>
                {/* Turned in state */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center mb-3">
                  <p className="text-sm font-semibold text-green-700">Turned in</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    Your assignment has been submitted.
                  </p>
                </div>
                <button
                  onClick={unsubmit}
                  className="w-full py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Unsubmit
                </button>
              </>
            )}

            <p className="text-[10px] text-gray-400 text-center mt-3">
              Accepted: PDF, DOC, DOCX · Max 600MB
            </p>
          </div>

          {/* Teacher feedback card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <UserCircle className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-medium text-gray-900">
                Teacher Feedback
              </h2>
            </div>

            {isSubmitted ? (
              <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-md px-3 py-2.5">
                <p className="text-xs text-gray-700 leading-relaxed">
                  Your essay is currently under review. Feedback will appear
                  here once graded.
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No feedback yet. Submit your assignment to receive feedback.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AttachmentCard ───────────────────────────────────────
function AttachmentCard({
  name,
  type,
  iconColor,
}: {
  name: string
  type: string
  iconColor: string
}) {
  return (
    <div className="border border-gray-200 rounded-lg flex overflow-hidden hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex-1 p-3 border-r border-gray-200 min-w-0">
        <p className="text-xs font-medium text-gray-900 truncate">{name}</p>
        <p className="text-[10px] text-gray-400 uppercase mt-0.5">{type}</p>
      </div>
      <div className="w-16 bg-gray-50 flex items-center justify-center">
        <FileText className={`w-7 h-7 ${iconColor}`} />
      </div>
    </div>
  )
}