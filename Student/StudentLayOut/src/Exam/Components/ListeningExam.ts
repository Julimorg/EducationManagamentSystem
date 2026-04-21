import React, { useEffect, useState, useRef } from 'react'
import { ExamTimer } from './ExamTimer'
import {
  SaveIcon,
  SendIcon,
  AlertCircleIcon,
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
type ListeningExamProps = {
  duration: number
  onSubmit: () => void
}
export function ListeningExam({ duration, onSubmit }: ListeningExamProps) {
  const [activePart, setActivePart] = useState<1 | 2>(1)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(100)
    }
    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }
  const handleSave = () => {
    toast.success('Answers saved successfully')
  }
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <Toaster position="top-center" />

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        preload="auto"
      />

      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Listening Exam</h1>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActivePart(1)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activePart === 1 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Section 1
            </button>
            <button
              onClick={() => setActivePart(2)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activePart === 2 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Section 2
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ExamTimer durationMinutes={duration} onTimeUp={onSubmit} />
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            <SaveIcon className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 font-medium transition-colors"
          >
            <SendIcon className="w-4 h-4" />
            Submit
          </button>
        </div>
      </header>

      {/* Audio Player Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-6 shadow-sm z-10">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <PauseIcon className="w-6 h-6" />
          ) : (
            <PlayIcon className="w-6 h-6 ml-1" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
            <span>Audio Track</span>
            <span>Do not refresh the page</span>
          </div>
          {/* Non-clickable progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300 ease-linear"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 w-48">
          <button
            onClick={toggleMute}
            className="text-gray-500 hover:text-gray-700"
          >
            {isMuted || volume === 0 ? (
              <VolumeXIcon className="w-5 h-5" />
            ) : (
              <Volume2Icon className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
      </div>

      {/* Main Content Split */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Instructions */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto p-8 shadow-inner">
          <div className="max-w-2xl mx-auto">
            {activePart === 1 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Section 1</h2>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-900 text-sm">
                  Listen to the audio and answer questions 1-10. You will hear a
                  telephone conversation between a customer and an agent at a
                  car rental company.
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">
                    Example
                  </h3>
                  <div className="flex items-baseline gap-2 text-gray-600">
                    <span>Customer's name:</span>
                    <span className="font-bold text-gray-900 border-b border-gray-900 px-2">
                      John Smith
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Section 2</h2>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-900 text-sm">
                  Listen to the audio and answer questions 11-20. You will hear
                  a guide giving a tour of a local museum.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Questions */}
        <div className="w-1/2 bg-[#F9FAFB] overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {activePart === 1 ? (
              <>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">
                    Questions 1-5
                  </h3>
                  <p className="text-gray-600 mb-4 italic">
                    Complete the form below. Write NO MORE THAN TWO WORDS AND/OR
                    A NUMBER for each answer.
                  </p>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-center mb-6 uppercase tracking-wider text-gray-700">
                      Car Rental Booking Form
                    </h4>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700 w-32">
                          Pick-up date:
                        </span>
                        <div className="flex items-baseline gap-2 flex-1">
                          <span className="font-medium">1.</span>
                          <input
                            type="text"
                            value={answers['q1'] || ''}
                            onChange={(e) =>
                              handleAnswerChange('q1', e.target.value)
                            }
                            className="border-b-2 border-gray-300 focus:border-orange-500 outline-none px-2 py-1 flex-1 bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700 w-32">
                          Car type:
                        </span>
                        <div className="flex items-baseline gap-2 flex-1">
                          <span className="font-medium">2.</span>
                          <input
                            type="text"
                            value={answers['q2'] || ''}
                            onChange={(e) =>
                              handleAnswerChange('q2', e.target.value)
                            }
                            className="border-b-2 border-gray-300 focus:border-orange-500 outline-none px-2 py-1 flex-1 bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700 w-32">
                          Extra features:
                        </span>
                        <div className="flex items-baseline gap-2 flex-1">
                          <span className="font-medium">3.</span>
                          <span className="text-gray-600">GPS and</span>
                          <input
                            type="text"
                            value={answers['q3'] || ''}
                            onChange={(e) =>
                              handleAnswerChange('q3', e.target.value)
                            }
                            className="border-b-2 border-gray-300 focus:border-orange-500 outline-none px-2 py-1 flex-1 bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">
                    Questions 4-5
                  </h3>
                  <p className="text-gray-600 mb-4 italic">
                    Choose the correct letter, A, B, or C.
                  </p>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="font-medium text-gray-800">
                        4. The customer needs to pay a deposit of:
                      </p>
                      <div className="space-y-2 pl-4">
                        {['$50', '$100', '$150'].map((option, i) => (
                          <label
                            key={i}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="q4"
                              value={option}
                              checked={answers['q4'] === option}
                              onChange={(e) =>
                                handleAnswerChange('q4', e.target.value)
                              }
                              className="text-orange-500 focus:ring-orange-500"
                            />
                            <span className="text-gray-700 group-hover:text-gray-900">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-gray-900">
                  Questions 11-15
                </h3>
                <p className="text-gray-600 mb-4 italic">
                  Label the map below. Write the correct letter, A-G, next to
                  Questions 11-15.
                </p>

                <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mb-6">
                  <span className="text-gray-400 font-medium">
                    Museum Map Image Placeholder
                  </span>
                </div>

                <div className="space-y-4">
                  {[11, 12, 13, 14, 15].map((num) => (
                    <div key={num} className="flex items-center gap-4">
                      <span className="font-medium w-8">{num}.</span>
                      <span className="text-gray-700 w-40">
                        Exhibition Room {num - 10}
                      </span>
                      <select
                        value={answers[`q${num}`] || ''}
                        onChange={(e) =>
                          handleAnswerChange(`q${num}`, e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-3 py-1.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                      >
                        <option value="">Select...</option>
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter) => (
                          <option key={letter} value={letter}>
                            {letter}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-orange-600 mb-4">
              <AlertCircleIcon className="w-6 h-6" />
              <h3 className="text-lg font-bold text-gray-900">Submit Exam?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? You will not be able to
              change your answers after submission.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
