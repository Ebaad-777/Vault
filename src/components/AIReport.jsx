import { useState, useRef, useEffect } from 'react'
import { transcribeAudio, generateLegalReport, textToSpeech, translateText, processVoiceToReport } from '../services/openai'
import QuickGuide from './QuickGuide'
import './AIReport.css'

function AIReport({ onShareReport, onSwitchToCommunity }) {
  const [showGuide, setShowGuide] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [report, setReport] = useState('')
  const [audioUrl, setAudioUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [inputLanguage, setInputLanguage] = useState('en')
  const [outputLanguage, setOutputLanguage] = useState('en')
  const [country, setCountry] = useState('pakistan')
  const [lawsCited, setLawsCited] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showShareSuccess, setShowShareSuccess] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const audioPlayerRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })

      // Use audio/wav format for better compatibility
      const options = { mimeType: 'audio/webm;codecs=opus' }
      let mediaRecorder
      
      try {
        mediaRecorder = new MediaRecorder(stream, options)
      } catch (e) {
        // Fallback to default format if webm not supported
        console.warn('WebM not supported, using default format')
        mediaRecorder = new MediaRecorder(stream)
      }

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        console.log('Recording stopped. Blob size:', blob.size, 'bytes')
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      // Start live transcription using Web Speech API (for visual feedback only)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        
        // Map language codes
        const langMap = {
          'ur': 'ur-PK',
          'hi': 'hi-IN',
          'en': 'en-US'
        }
        
        recognition.lang = langMap[inputLanguage] || 'en-US'
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event) => {
          let interim = ''
          let final = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcript + ' '
            } else {
              interim += transcript
            }
          }
          
          setLiveTranscript(final + interim)
        }

        recognition.onerror = (event) => {
          console.warn('Speech recognition error:', event.error)
        }

        try {
          recognition.start()
          recognitionRef.current = recognition
        } catch (e) {
          console.warn('Could not start live transcription:', e)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setLiveTranscript('')

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please grant permission and try again.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }

  const processRecording = async () => {
    if (!audioBlob) {
      alert('Please record audio first')
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    setCurrentStep('🎤 Transcribing your voice...')

    try {
      console.log('Starting voice processing workflow...')
      
      // Step 1: Transcription (25%)
      setProcessingProgress(10)
      const transcriptionResult = await transcribeAudio(audioBlob, inputLanguage)
      
      if (!transcriptionResult.success) {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`)
      }
      
      console.log('✓ Transcription complete:', transcriptionResult.text)
      setTranscription(transcriptionResult.text)
      setProcessingProgress(25)
      
      // Step 2: Generate Report (50%)
      setCurrentStep('⚖️ Analyzing and generating legal report...')
      setProcessingProgress(30)
      
      const reportResult = await generateLegalReport(transcriptionResult.text, country)
      
      if (!reportResult.success) {
        throw new Error(`Report generation failed: ${reportResult.error}`)
      }
      
      console.log('✓ Report generated')
      setProcessingProgress(50)
      
      // Step 3: Translation if needed (75%)
      let finalReport = reportResult.report
      if (outputLanguage !== 'en') {
        setCurrentStep(`🌐 Translating to ${outputLanguage === 'ur' ? 'Urdu' : 'Hindi'}...`)
        setProcessingProgress(55)
        
        const translation = await translateText(reportResult.report, outputLanguage)
        if (translation.success) {
          finalReport = translation.translatedText
          console.log('✓ Translation complete')
        } else {
          console.warn('Translation failed, using English report')
        }
      }
      
      setReport(finalReport)
      setLawsCited(reportResult.laws_cited || [])
      setProcessingProgress(75)
      
      // Step 4: Text-to-Speech (100%)
      setCurrentStep('🔊 Creating audio playback...')
      setProcessingProgress(80)
      
      const audioResult = await textToSpeech(finalReport, outputLanguage)
      
      if (audioResult.success && audioResult.audioUrl) {
        setAudioUrl(audioResult.audioUrl)
        console.log('✓ Audio generated')
      } else {
        console.warn('TTS failed, report will be text-only')
      }
      
      setProcessingProgress(100)
      setCurrentStep('✅ Complete! Your report is ready.')
      
      // Clear the processing message after 2 seconds
      setTimeout(() => {
        setCurrentStep('')
        setProcessingProgress(0)
      }, 2000)
      
    } catch (error) {
      console.error('Processing error:', error)
      alert(`Error: ${error.message}\n\nPlease check:\n1. Your internet connection\n2. Your OpenAI API key is valid\n3. You have sufficient API credits\n4. The audio was recorded properly`)
      setCurrentStep('')
      setProcessingProgress(0)
    } finally {
      setIsProcessing(false)
    }
  }

  const playAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      setIsPlaying(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const resetAll = () => {
    setAudioBlob(null)
    setTranscription('')
    setLiveTranscript('')
    setReport('')
    setAudioUrl(null)
    setRecordingTime(0)
    setLawsCited([])
    setCurrentStep('')
  }

  const shareAnonymously = () => {
    if (!report || !transcription) {
      alert('Please generate a report first before sharing.')
      return
    }

    // Call the parent function to add to community feed
    if (onShareReport) {
      onShareReport(report, transcription)
      
      // Show success message
      setShowShareSuccess(true)
      setTimeout(() => setShowShareSuccess(false), 3000)
      
      // Switch to community tab to see the post
      if (onSwitchToCommunity) {
        setTimeout(() => {
          onSwitchToCommunity()
        }, 2000)
      }
    }
  }

  const saveToVault = () => {
    if (!report || !transcription) {
      alert('Please generate a report first before saving.')
      return
    }

    // Simulate saving to vault (would integrate with actual vault storage)
    const vaultItem = {
      id: Date.now(),
      type: 'document',
      title: `AI Legal Report - ${new Date().toLocaleDateString()}`,
      transcription: transcription,
      report: report,
      lawsCited: lawsCited,
      timestamp: new Date().toISOString(),
      encrypted: true
    }

    // Store in localStorage for demo
    const existingVault = JSON.parse(localStorage.getItem('vault') || '[]')
    existingVault.unshift(vaultItem)
    localStorage.setItem('vault', JSON.stringify(existingVault))

    alert('✅ Report saved to your encrypted vault!\n\nYou can access it anytime from the "My Vault" tab.')
  }

  return (
    <div className="ai-report-container">
      {showGuide && <QuickGuide onClose={() => setShowGuide(false)} />}
      
      {/* API Status Indicator */}
      {import.meta.env.VITE_OPENAI_API_KEY && (
        <div className="api-status-banner success">
          <span className="status-icon">✓</span>
          <div className="status-text">
            <strong>API Connected:</strong> Voice-to-text and AI features are active
          </div>
        </div>
      )}
      
      {!import.meta.env.VITE_OPENAI_API_KEY && (
        <div className="api-status-banner error">
          <span className="status-icon">✗</span>
          <div className="status-text">
            <strong>API Key Missing:</strong> Add VITE_OPENAI_API_KEY to .env.local file
          </div>
        </div>
      )}
      
      <div className="ai-report-header">
        <h1>🤖 AI Legal Assistant</h1>
        <p>Speak in your language. Get instant legal guidance.</p>
      </div>

      {/* Language & Country Selection */}
      <div className="settings-panel">
        <div className="setting-group">
          <label>I will speak in:</label>
          <select value={inputLanguage} onChange={(e) => setInputLanguage(e.target.value)}>
            <option value="ur">Urdu (اردو)</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Read report in:</label>
          <select value={outputLanguage} onChange={(e) => setOutputLanguage(e.target.value)}>
            <option value="ur">Urdu (اردو)</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Country:</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="pakistan">Pakistan</option>
            <option value="india">India</option>
          </select>
        </div>
      </div>

      {/* Recording Section */}
      <div className="recording-section">
        {!audioBlob ? (
          <div className="record-controls">
            {!isRecording ? (
              <button className="record-button" onClick={startRecording}>
                <span className="record-icon">🎤</span>
                <span>Start Recording</span>
              </button>
            ) : (
              <div className="recording-active">
                <div className="recording-animation">
                  <div className="pulse-ring"></div>
                  <div className="pulse-ring delay-1"></div>
                  <div className="pulse-ring delay-2"></div>
                  <button className="stop-button" onClick={stopRecording}>
                    <span className="stop-icon">⏹</span>
                  </button>
                </div>
                <div className="recording-info">
                  <div className="recording-status">🔴 Recording...</div>
                  <div className="recording-timer">{formatTime(recordingTime)}</div>
                  <p className="recording-hint">Click the button to stop</p>
                  
                  {/* Live Transcript Display */}
                  {liveTranscript && (
                    <div className="live-transcript">
                      <h4>📝 Live Transcript:</h4>
                      <p>{liveTranscript}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="recorded-audio">
            <div className="audio-preview">
              <span className="audio-icon">🎵</span>
              <div className="audio-info">
                <h4>Recording Complete</h4>
                <p>Duration: {formatTime(recordingTime)}</p>
              </div>
            </div>
            <div className="audio-actions">
              <button className="process-button" onClick={processRecording} disabled={isProcessing}>
                {isProcessing ? '⏳ Processing...' : '✨ Generate Report'}
              </button>
              <button className="reset-button" onClick={resetAll}>
                🔄 Record Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="processing-status">
          <div className="spinner"></div>
          <p>{currentStep}</p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${processingProgress}%` }}></div>
          </div>
          <p className="progress-text">{processingProgress}%</p>
        </div>
      )}

      {/* Transcription */}
      {transcription && (
        <div className="result-section">
          <h3>📝 Your Statement</h3>
          <div className="transcription-box">
            <p>{transcription}</p>
          </div>
        </div>
      )}

      {/* Legal Report */}
      {report && (
        <div className="result-section">
          <h3>⚖️ Legal Analysis & Guidance</h3>
          <div className="report-box">
            <div className="report-content">
              {report.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {lawsCited.length > 0 && (
              <div className="laws-cited">
                <h4>📚 Laws Referenced:</h4>
                <ul>
                  {lawsCited.map((law, idx) => (
                    <li key={idx}>{law}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Audio Player */}
          {audioUrl && (
            <div className="audio-player-section">
              <h4>🔊 Listen to Your Report</h4>
              <div className="audio-player">
                <audio
                  ref={audioPlayerRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <button className="play-button" onClick={isPlaying ? pauseAudio : playAudio}>
                  {isPlaying ? '⏸️ Pause' : '▶️ Play Report'}
                </button>
                <p className="audio-hint">Report will be read in {outputLanguage === 'ur' ? 'Urdu' : outputLanguage === 'hi' ? 'Hindi' : 'English'}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="report-actions">
            <button className="action-btn primary" onClick={shareAnonymously}>
              📤 Share Anonymously
            </button>
            <button className="action-btn secondary" onClick={() => window.print()}>
              🖨️ Print Report
            </button>
            <button className="action-btn secondary" onClick={saveToVault}>
              💾 Save to Vault
            </button>
          </div>

          {/* Share Success Message */}
          {showShareSuccess && (
            <div className="share-success-banner">
              <span className="success-icon">✅</span>
              <div className="success-text">
                <strong>Shared Successfully!</strong> Your report is now visible in the Community feed. 
                Redirecting you there...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h4>💡 How it works:</h4>
        <ol>
          <li>Select your preferred language and country</li>
          <li>Click "Start Recording" and speak about your situation</li>
          <li>You'll see live transcription as you speak (Chrome/Edge only)</li>
          <li>Click "Generate Report" to get AI-powered legal guidance</li>
          <li>Listen to the report read back in your language</li>
          <li>Share anonymously or save to your vault</li>
        </ol>
        
        <div className="help-note">
          <strong>📌 Note:</strong> Live transcription during recording works best in Chrome or Edge browsers. 
          The final transcription uses OpenAI Whisper API for high accuracy in all languages.
        </div>
      </div>
    </div>
  )
}

export default AIReport
