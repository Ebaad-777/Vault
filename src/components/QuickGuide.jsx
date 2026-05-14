import './QuickGuide.css'

function QuickGuide({ onClose }) {
  return (
    <div className="quick-guide-overlay">
      <div className="quick-guide-modal">
        <button className="close-guide" onClick={onClose}>✕</button>
        
        <div className="guide-header">
          <h2>🤖 Welcome to AI Legal Assistant</h2>
          <p>Your voice, your language, your rights</p>
        </div>

        <div className="guide-content">
          <div className="guide-section">
            <div className="guide-icon">🎤</div>
            <h3>1. Speak Freely</h3>
            <p>Record your story in Urdu, Hindi, or English. Take your time. You're safe here.</p>
          </div>

          <div className="guide-section">
            <div className="guide-icon">🤖</div>
            <h3>2. AI Analysis</h3>
            <p>Our AI will transcribe your voice, analyze your situation, and identify applicable laws.</p>
          </div>

          <div className="guide-section">
            <div className="guide-icon">⚖️</div>
            <h3>3. Legal Guidance</h3>
            <p>Get a comprehensive report with your rights, legal options, and safety recommendations.</p>
          </div>

          <div className="guide-section">
            <div className="guide-icon">🔊</div>
            <h3>4. Listen Back</h3>
            <p>The report will be read to you in your chosen language (Urdu, Hindi, or English).</p>
          </div>

          <div className="guide-section">
            <div className="guide-icon">📤</div>
            <h3>5. Share or Save</h3>
            <p>Share anonymously with the community or save to your encrypted vault.</p>
          </div>
        </div>

        <div className="guide-footer">
          <div className="privacy-note">
            <span className="lock-icon">🔒</span>
            <p><strong>100% Private:</strong> Your voice is processed securely. We never store your identity.</p>
          </div>
          <button className="start-button" onClick={onClose}>
            Get Started →
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuickGuide
