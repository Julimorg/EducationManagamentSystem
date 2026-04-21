import React, { useEffect, useState } from 'react'
import { ExamTimer } from './ExamTimer'
import { SaveIcon, SendIcon, AlertCircleIcon, MaximizeIcon } from 'lucide-react'
import { Toaster, toast } from 'sonner'
type ReadingExamProps = {
  duration: number
  onSubmit: () => void
}
export function ReadingExam({ duration, onSubmit }: ReadingExamProps) {
  const [activePart, setActivePart] = useState<1 | 2>(1)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false)
  // Mock answers state
  const [answers, setAnswers] = useState<Record<string, string>>({})
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement !== null
      setIsFullscreen(isCurrentlyFullscreen)
      if (!isCurrentlyFullscreen) {
        setShowFullscreenWarning(true)
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    // Request fullscreen on mount
    const requestFS = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err)
      }
    }
    requestFS()
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])
  const handleSave = () => {
    toast.success('Answers saved successfully')
  }
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }
  const requestFullscreenAgain = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
        setShowFullscreenWarning(false)
      }
    } catch (err) {
      console.error('Error attempting to enable fullscreen:', err)
    }
  }
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Reading Exam</h1>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActivePart(1)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activePart === 1 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Passage 1
            </button>
            <button
              onClick={() => setActivePart(2)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activePart === 2 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Passage 2
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

      {/* Main Content Split */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Reading Passage */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto p-8 shadow-inner">
          <div className="max-w-3xl mx-auto">
            {activePart === 1 ? (
              <div className="prose prose-lg max-w-none text-gray-800">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  The Future of Urban Agriculture
                </h2>

                <p className="mb-4">
                  <strong>A.</strong> As the world's population continues to
                  urbanize, the challenge of feeding cities has become
                  increasingly pressing. Traditional agriculture, which relies
                  on vast tracts of rural land, is facing unprecedented
                  pressures from climate change, soil degradation, and water
                  scarcity. In response, a new paradigm is emerging: urban
                  agriculture. This approach brings food production directly
                  into the heart of our cities, utilizing rooftops, abandoned
                  buildings, and even underground bunkers.
                </p>

                <p className="mb-4">
                  <strong>B.</strong> One of the most promising developments in
                  this field is vertical farming. By stacking crops in
                  vertically inclined surfaces or integrating them into other
                  structures, vertical farms can produce significantly more food
                  per square meter than traditional farming methods. These
                  facilities often employ hydroponic or aeroponic systems, which
                  use nutrient-rich water solutions instead of soil. This not
                  only conserves water—using up to 95% less than conventional
                  agriculture—but also eliminates the need for harmful
                  pesticides.
                </p>

                <p className="mb-4">
                  <strong>C.</strong> However, the transition to urban
                  agriculture is not without its hurdles. The initial capital
                  required to set up a high-tech vertical farm can be
                  prohibitive. Specialized LED lighting, climate control
                  systems, and automated nutrient delivery mechanisms demand
                  significant investment. Furthermore, the energy consumption of
                  these facilities, particularly for lighting, remains a major
                  concern, potentially offsetting the environmental benefits if
                  the energy is not sourced renewably.
                </p>

                <p className="mb-4">
                  <strong>D.</strong> Despite these challenges, proponents argue
                  that the long-term benefits outweigh the costs. By reducing
                  the distance food travels from farm to plate—often referred to
                  as 'food miles'—urban agriculture significantly cuts down on
                  transportation emissions. It also enhances urban food
                  security, making cities more resilient to supply chain
                  disruptions caused by extreme weather events or global crises.
                </p>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none text-gray-800">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  The Psychology of Decision Making
                </h2>
                <p className="mb-4">
                  <strong>A.</strong> Every day, humans make thousands of
                  decisions, ranging from the trivial (what to eat for
                  breakfast) to the life-altering (whether to change careers).
                  For decades, economists modeled human decision-making on the
                  assumption of 'rational choice theory'—the idea that
                  individuals always make logical decisions that maximize their
                  utility. However, modern psychology has revealed a much more
                  complex, and often irrational, picture of how we choose.
                </p>
                <p className="mb-4">
                  <strong>B.</strong> The pioneering work of Daniel Kahneman and
                  Amos Tversky introduced the concept of cognitive
                  biases—systematic errors in thinking that affect our
                  judgments. One of the most pervasive is the 'confirmation
                  bias,' our tendency to search for, interpret, and remember
                  information in a way that confirms our preexisting beliefs.
                  This bias explains why people often remain entrenched in their
                  views even when presented with contradictory evidence.
                </p>
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
                    Questions 1-3
                  </h3>
                  <p className="text-gray-600 mb-4 italic">
                    Choose the correct letter, A, B, C or D.
                  </p>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="font-medium text-gray-800">
                        1. According to paragraph B, vertical farming uses less
                        water because:
                      </p>
                      <div className="space-y-2 pl-4">
                        {[
                          'It relies on rainfall',
                          'It uses nutrient-rich water solutions instead of soil',
                          'It only grows drought-resistant crops',
                          'It recycles water from urban waste',
                        ].map((option, i) => (
                          <label
                            key={i}
                            className="flex items-start gap-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="q1"
                              value={option}
                              checked={answers['q1'] === option}
                              onChange={(e) =>
                                handleAnswerChange('q1', e.target.value)
                              }
                              className="mt-1 text-orange-500 focus:ring-orange-500"
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

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">
                    Questions 4-6
                  </h3>
                  <p className="text-gray-600 mb-4 italic">
                    Complete the sentences below. Choose NO MORE THAN TWO WORDS
                    from the passage for each answer.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">4.</span>
                      <span className="text-gray-800">
                        The high cost of setting up vertical farms is partly due
                        to the need for specialized
                      </span>
                      <input
                        type="text"
                        value={answers['q4'] || ''}
                        onChange={(e) =>
                          handleAnswerChange('q4', e.target.value)
                        }
                        className="border-b-2 border-gray-300 focus:border-orange-500 outline-none px-2 py-1 w-40 text-center bg-transparent"
                      />
                      <span className="text-gray-800">
                        and climate control.
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">5.</span>
                      <span className="text-gray-800">
                        A major concern regarding vertical farms is their high
                      </span>
                      <input
                        type="text"
                        value={answers['q5'] || ''}
                        onChange={(e) =>
                          handleAnswerChange('q5', e.target.value)
                        }
                        className="border-b-2 border-gray-300 focus:border-orange-500 outline-none px-2 py-1 w-40 text-center bg-transparent"
                      />
                      <span className="text-gray-800">.</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-gray-900">
                  Questions 7-10
                </h3>
                <p className="text-gray-600 mb-4 italic">
                  Do the following statements agree with the information given
                  in Reading Passage 2?
                </p>
                <div className="mb-4 text-sm bg-gray-50 p-3 rounded border border-gray-100">
                  <p>
                    <strong>TRUE</strong> if the statement agrees with the
                    information
                  </p>
                  <p>
                    <strong>FALSE</strong> if the statement contradicts the
                    information
                  </p>
                  <p>
                    <strong>NOT GIVEN</strong> if there is no information on
                    this
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="font-medium text-gray-800">
                      7. Rational choice theory assumes humans always make
                      logical decisions.
                    </p>
                    <div className="flex gap-4 pl-4">
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="q7"
                            value={option}
                            checked={answers['q7'] === option}
                            onChange={(e) =>
                              handleAnswerChange('q7', e.target.value)
                            }
                            className="text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fullscreen Warning Modal */}
      {showFullscreenWarning && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Fullscreen Required
            </h2>
            <p className="text-gray-600 mb-8">
              You have exited fullscreen mode. To ensure exam integrity, you
              must remain in fullscreen mode while taking the exam. If you wish
              to leave, you must submit your exam first.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={requestFullscreenAgain}
                className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MaximizeIcon className="w-5 h-5" />
                Return to Fullscreen
              </button>
              <button
                onClick={onSubmit}
                className="w-full py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold transition-colors"
              >
                Submit Exam Now
              </button>
            </div>
          </div>
        </div>
      )}

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
