import { useState } from 'react'
import './App.css'
import Dashboard from './Dashboard'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  if (showDashboard) {
    return <Dashboard />
  }

  const features = [
    {
      icon: '🎤',
      title: 'Speak Your Truth',
      description: 'Record your story safely with voice notes. Your words are encrypted and protected.'
    },
    {
      icon: '🤖',
      title: 'Instant AI Guidance',
      description: 'Get immediate legal rights information and personalized action plans tailored to your situation.'
    },
    {
      icon: '🔒',
      title: 'Anonymous NGO Connection',
      description: 'Connect with verified organizations through AI-altered voice. Stay completely anonymous until you choose otherwise.'
    },
    {
      icon: '💬',
      title: 'Secure Messaging',
      description: 'Communicate with support organizations privately. Get escape plans and safety advice in real-time.'
    },
    {
      icon: '🛡️',
      title: 'Self-Defense Resources',
      description: 'Access curated safety videos and protection strategies designed for your specific situation.'
    },
    {
      icon: '👥',
      title: 'Anonymous Sisterhood',
      description: 'Share experiences and find support in a community of survivors. You are never alone.'
    }
  ]

  const stats = [
    { number: '100%', label: 'Anonymous' },
    { number: 'E2E', label: 'Encrypted' },
    { number: '24/7', label: 'Available' },
    { number: 'Free', label: 'Always' }
  ]

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🔐</span>
            <span className="logo-text">Vault</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#safety">Safety First</a>
            <button className="cta-button-nav" onClick={() => setShowDashboard(true)}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Your Safety. Your Voice. Your Choice.
          </div>
          <h1 className="hero-title">
            A Safe Space to
            <span className="gradient-text"> Speak Up</span>
          </h1>
          <p className="hero-subtitle">
            Anonymous, secure, and empowering. Connect with verified support organizations, 
            access legal guidance, and join a community of survivors—all without revealing your identity.
          </p>
          <div className="hero-buttons">
            <button className="primary-button" onClick={() => setShowDashboard(true)}>
              Start Safely
              <span className="button-arrow">→</span>
            </button>
            <button className="secondary-button">
              <span className="play-icon">▶</span>
              Watch How It Works
            </button>
          </div>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2 className="section-title">Everything You Need to Stay Safe</h2>
          <p className="section-subtitle">
            Built with your security and anonymity as the top priority
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-header">
          <span className="section-badge">Simple & Secure</span>
          <h2 className="section-title">How Vault Works</h2>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">01</div>
            <div className="step-content">
              <h3>Record Your Story</h3>
              <p>Open the app and speak freely. Your voice note is instantly encrypted and stored securely.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">02</div>
            <div className="step-content">
              <h3>Get AI Guidance</h3>
              <p>Receive immediate legal information and a personalized action plan based on your situation.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">03</div>
            <div className="step-content">
              <h3>Connect Anonymously</h3>
              <p>Your voice is altered by AI and sent to verified NGOs. They can message you back securely.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">04</div>
            <div className="step-content">
              <h3>Take Action</h3>
              <p>Access resources, join the community, and decide when or if you want to reveal your identity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section id="safety" className="safety-section">
        <div className="safety-content">
          <div className="safety-text">
            <span className="section-badge">Security by Design</span>
            <h2 className="section-title">Your Safety is Our Priority</h2>
            <div className="safety-features">
              <div className="safety-item">
                <span className="check-icon">✓</span>
                <div>
                  <h4>Stealth Mode</h4>
                  <p>App disguised as a calculator. Hidden access via secret gesture.</p>
                </div>
              </div>
              <div className="safety-item">
                <span className="check-icon">✓</span>
                <div>
                  <h4>Quick Exit</h4>
                  <p>Instant escape button redirects to a neutral website immediately.</p>
                </div>
              </div>
              <div className="safety-item">
                <span className="check-icon">✓</span>
                <div>
                  <h4>End-to-End Encryption</h4>
                  <p>Your data is encrypted. Not even we can access your vault without your key.</p>
                </div>
              </div>
              <div className="safety-item">
                <span className="check-icon">✓</span>
                <div>
                  <h4>Cryptographic Timestamping</h4>
                  <p>Evidence is timestamped and hashed to ensure admissibility in court.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="safety-visual">
            <div className="security-badge">
              <div className="shield-icon">🛡️</div>
              <div className="security-text">
                <div className="security-title">Bank-Level Security</div>
                <div className="security-subtitle">Military-grade encryption</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section">
        <div className="community-content">
          <h2 className="section-title">You Are Not Alone</h2>
          <p className="section-subtitle">
            Join a supportive community of survivors who understand your journey. 
            Share experiences, find hope, and help others—all completely anonymously.
          </p>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">
                This app gave me the courage to finally speak up. The anonymous community 
                showed me I wasn't alone, and the NGO connection saved my life.
              </p>
              <div className="testimonial-author">— Anonymous Survivor</div>
            </div>
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">
                The AI guidance helped me understand my legal rights immediately. 
                I felt empowered for the first time in years.
              </p>
              <div className="testimonial-author">— Anonymous Survivor</div>
            </div>
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">
                The stealth mode feature is genius. I could safely document everything 
                without fear of being discovered.
              </p>
              <div className="testimonial-author">— Anonymous Survivor</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Take the First Step?</h2>
          <p className="cta-subtitle">
            Your journey to safety starts here. Download Vault and speak your truth in complete anonymity.
          </p>
          <button className="primary-button large" onClick={() => setShowDashboard(true)}>
            Get Started Now
            <span className="button-arrow">→</span>
          </button>
          <p className="cta-note">
            🔒 100% Free • 100% Anonymous • 100% Secure
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🔐</span>
              <span className="logo-text">Vault</span>
            </div>
            <p className="footer-description">
              Empowering survivors with secure, anonymous support.
            </p>
          </div>
          <div className="footer-section">
            <h4>Emergency Resources</h4>
            <ul className="footer-links">
              <li><a href="#">National Hotline</a></li>
              <li><a href="#">Local Shelters</a></li>
              <li><a href="#">Legal Aid</a></li>
              <li><a href="#">Crisis Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>About</h4>
            <ul className="footer-links">
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">For NGOs</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Get Help Now</h4>
            <p className="emergency-text">
              If you're in immediate danger, call emergency services.
            </p>
            <button className="emergency-button">Emergency Exit</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Vault. Built with care for survivors everywhere.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
