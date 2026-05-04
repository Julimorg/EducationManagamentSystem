import React, { useState, useRef } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
import {
  FileText,
  MoreVertical,
  Users,
  MessageSquare,
  Plus,
  X,
  UploadCloud,
  UserCircle,
} from 'lucide-react'
type AssignmentDetailProps = {
  onBack: () => void
}
export function AssignmentDetail({ onBack }: AssignmentDetailProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      name: string
      size: string
    }[]
  >([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      }))
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }
  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }
  const toggleSubmit = () => {
    setIsSubmitted(!isSubmitted)
  }
  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          title="IELTS Writing Task 2 — Essay Practice"
          onBack={onBack}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Assignment Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 leading-tight">
                      IELTS Writing Task 2 — Essay Practice
                    </h1>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Ms. Sarah • Apr 15
                  </p>

                  <div className="flex justify-between items-center mt-4 pb-4 border-b border-gray-200">
                    <span className="font-medium text-gray-900">
                      0/100 points
                    </span>
                    <span className="font-medium text-gray-900">
                      Due Apr 19, 23:59
                    </span>
                  </div>

                  <div className="mt-6 text-gray-800 space-y-4 text-sm sm:text-base">
                    <p>Write a 250-word essay on the following topic:</p>
                    <p className="font-medium italic">
                      "Some people believe that technology has made our lives
                      more complex. To what extent do you agree or disagree?"
                    </p>
                    <p>Requirements:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Submit your answer in a single file (PDF, DOC, or DOCX).
                      </li>
                      <li>Maximum file size is 600MB.</li>
                      <li>
                        Use the naming convention:{' '}
                        <code>[YourName]_WritingTask2.pdf</code>
                      </li>
                    </ul>
                  </div>

                  {/* Attached Materials */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg flex overflow-hidden hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex-1 p-3 border-r border-gray-200 flex flex-col justify-center">
                        <span className="font-medium text-sm text-gray-900 truncate">
                          Writing_Task2_Rubric.pdf
                        </span>
                        <span className="text-xs text-gray-500 uppercase mt-1">
                          PDF
                        </span>
                      </div>
                      <div className="w-20 bg-gray-100 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-red-500" />
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg flex overflow-hidden hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex-1 p-3 border-r border-gray-200 flex flex-col justify-center">
                        <span className="font-medium text-sm text-gray-900 truncate">
                          Sample_Band8_Essay.docx
                        </span>
                        <span className="text-xs text-gray-500 uppercase mt-1">
                          Word
                        </span>
                      </div>
                      <div className="w-20 bg-gray-100 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Class Comments */}
                  <div className="mt-12 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700 mb-4">
                      <Users className="w-5 h-5" />
                      <h3 className="font-medium">Class comments</h3>
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 font-medium hover:bg-blue-50 px-3 py-2 rounded-md transition-colors -ml-3">
                      <MessageSquare className="w-4 h-4" />
                      Add class comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Your Work & Feedback */}
            <div className="lg:col-span-1 space-y-6">
              {/* Your Work Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-normal text-gray-900">
                    Your work
                  </h2>
                  <span
                    className={`text-sm font-medium ${isSubmitted ? 'text-green-700' : 'text-green-700'}`}
                  >
                    {isSubmitted ? 'Turned in' : 'Assigned'}
                  </span>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-md p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="truncate">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        {!isSubmitted && (
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!isSubmitted ? (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors mb-3"
                    >
                      <Plus className="w-4 h-4" />
                      Add or create
                    </button>
                    <button
                      onClick={toggleSubmit}
                      disabled={uploadedFiles.length === 0}
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${uploadedFiles.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      Turn in
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleSubmit}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Unsubmit
                  </button>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  Accepted formats: PDF, DOC, DOCX. Max size: 600MB.
                </p>
              </div>

              {/* Teacher Feedback Card (Read-only) */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <UserCircle className="w-5 h-5 text-gray-600" />
                  <h2 className="text-sm font-medium text-gray-900">
                    Teacher Feedback
                  </h2>
                </div>

                {isSubmitted ? (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md">
                    <p className="text-sm text-gray-700">
                      Your essay is currently under review. Feedback will appear
                      here once graded.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No feedback yet. Submit your assignment to receive feedback.
                  </p>
                )}
              </div>    
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
