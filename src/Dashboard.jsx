import { useState } from 'react'
import './Dashboard.css'
import AIReport from './components/AIReport'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('home')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      author: 'Anonymous Sister',
      time: '3 hours ago',
      content: 'I finally left today. To anyone reading this - you are stronger than you think. The NGO helped me find a safe place.',
      likes: 45,
      comments: 12,
      isAIGenerated: false
    },
    {
      id: 2,
      author: 'Anonymous Survivor',
      time: '6 hours ago',
      content: 'Does anyone know about restraining orders? I need advice on the process.',
      likes: 23,
      comments: 8,
      isAIGenerated: false
    },
    {
      id: 3,
      author: 'Anonymous Friend',
      time: '1 day ago',
      content: 'Remember: You deserve safety, respect, and love. Never doubt that.',
      likes: 89,
      comments: 15,
      isAIGenerated: false
    }
  ])

  const addCommunityPost = (report, transcription) => {
    const newPost = {
      id: Date.now(),
      author: 'Anonymous User',
      time: 'Just now',
      content: report,
      transcription: transcription,
      likes: 0,
      comments: 0,
      isAIGenerated: true,
      lawsIncluded: true
    }
    setCommunityPosts([newPost, ...communityPosts])
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'ai-assistant', icon: '🤖', label: 'AI Assistant' },
    { id: 'vault', icon: '🔐', label: 'My Vault' },
    { id: 'messages', icon: '💬', label: 'Messages', badge: 3 },
    { id: 'community', icon: '👥', label: 'Community' },
    { id: 'resources', icon: '🛡️', label: 'Resources' },
    { id: 'profile', icon: '⚙️', label: 'Settings' }
  ]

  const messages = [
    { id: 1, ngo: 'Women Support Network', lastMessage: 'We have reviewed your case and would like to help...', time: '2 hours ago', unread: true, verified: true },
    { id: 2, ngo: 'Legal Aid Foundation', lastMessage: 'Here are the legal steps you can take...', time: '5 hours ago', unread: true, verified: true },
    { id: 3, ngo: 'Safe Haven Shelter', lastMessage: 'We have availability starting next week...', time: '1 day ago', unread: false, verified: true }
  ]

  const vaultItems = [
    { id: 1, type: 'audio', title: 'Voice Note - May 14', date: '2 hours ago', encrypted: true },
    { id: 2, type: 'photo', title: 'Evidence Photo', date: '1 day ago', encrypted: true },
    { id: 3, type: 'audio', title: 'Voice Note - May 13', date: '2 days ago', encrypted: true },
    { id: 4, type: 'document', title: 'Legal Rights Summary', date: '3 days ago', encrypted: true }
  ]

  const vaultItems = [
    { id: 1, type: 'audio', title: 'Voice Note - May 14', date: '2 hours ago', encrypted: true },
    { id: 2, type: 'photo', title: 'Evidence Photo', date: '1 day ago', encrypted: true },
    { id: 3, type: 'audio', title: 'Voice Note - May 13', date: '2 days ago', encrypted: true },
    { id: 4, type: 'document', title: 'Legal Rights Summary', date: '3 days ago', encrypted: true }
  ]

  const resources = [
    { category: 'Self-Defense', items: [
      { title: 'Basic Self-Defense Techniques', duration: '8 min', views: '2.3K' },
      { title: 'How to Escape Common Holds', duration: '12 min', views: '5.1K' }
    ]},
    { category: 'Legal Rights', items: [
      { title: 'Understanding Restraining Orders', duration: '10 min', views: '4.2K' },
      { title: 'Your Rights During Separation', duration: '15 min', views: '6.7K' }
    ]}
  ]

  const handleQuickExit = () => {
    window.location.href = 'https://www.google.com'
  }

  const startRecording = () => {
    setIsRecording(true)
    const interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000)
    setTimeout(() => {
      clearInterval(interval)
      setIsRecording(false)
      setRecordingTime(0)
    }, 5000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="dashboard">
      <button className="quick-exit" onClick={handleQuickExit}>⚠️ Quick Exit</button>

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🔐</span>
            <span className="sidebar-logo-text">Vault</span>
          </div>
          <div className="user-status">
            <div className="status-indicator"></div>
            <span>Anonymous Mode</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
              {tab.badge && <span className="nav-badge">{tab.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="emergency-contact">
            <div className="emergency-icon">🚨</div>
            <div className="emergency-text">
              <div className="emergency-title">Emergency?</div>
              <div className="emergency-number">Call 911</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'home' && (
          <div className="content-section">
            <div className="welcome-header">
              <h1>Welcome Back</h1>
              <p>You're safe here. Take your time.</p>
            </div>

            <div className="quick-actions">
              <div className="action-card primary-action">
                <div className="action-icon">🎤</div>
                <h3>Record Your Story</h3>
                <p>Speak freely. Your voice is encrypted and protected.</p>
                {!isRecording ? (
                  <button className="action-button" onClick={startRecording}>Start Recording</button>
                ) : (
                  <div className="recording-indicator">
                    <div className="recording-pulse"></div>
                    <span>Recording... {formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>

              <div className="action-card">
                <div className="action-icon">🤖</div>
                <h3>Get AI Guidance</h3>
                <p>Instant legal information and action plans.</p>
                <button className="action-button secondary" onClick={() => setActiveTab('ai-assistant')}>Ask AI</button>
              </div>

              <div className="action-card">
                <div className="action-icon">🔒</div>
                <h3>Connect with NGO</h3>
                <p>Anonymous connection to verified organizations.</p>
                <button className="action-button secondary">Browse NGOs</button>
              </div>
            </div>

            <div className="section-header">
              <h2>Recent Activity</h2>
              <button className="view-all">View All →</button>
            </div>

            <div className="activity-grid">
              <div className="activity-card">
                <div className="activity-icon">💬</div>
                <div className="activity-content">
                  <h4>New Message</h4>
                  <p>Women Support Network responded to your case</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>

              <div className="activity-card">
                <div className="activity-icon">🔐</div>
                <div className="activity-content">
                  <h4>Vault Updated</h4>
                  <p>New voice note added and encrypted</p>
                  <span className="activity-time">5 hours ago</span>
                </div>
              </div>

              <div className="activity-card">
                <div className="activity-icon">📚</div>
                <div className="activity-content">
                  <h4>Resource Viewed</h4>
                  <p>You watched "Creating a Safe Exit Plan"</p>
                  <span className="activity-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Tab */}
        {activeTab === 'ai-assistant' && (
          <AIReport onShareReport={addCommunityPost} onSwitchToCommunity={() => setActiveTab('community')} />
        )}

        {activeTab === 'vault' && (
          <div className="content-section">
            <div className="section-header">
              <h1>My Vault</h1>
              <button className="primary-button">+ Add Evidence</button>
            </div>

            <div className="vault-stats">
              <div className="stat-box">
                <div className="stat-number">12</div>
                <div className="stat-label">Total Items</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">8</div>
                <div className="stat-label">Voice Notes</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">4</div>
                <div className="stat-label">Photos</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">100%</div>
                <div className="stat-label">Encrypted</div>
              </div>
            </div>

            <div className="vault-list">
              {vaultItems.map(item => (
                <div key={item.id} className="vault-item">
                  <div className="vault-item-icon">
                    {item.type === 'audio' && '🎤'}
                    {item.type === 'photo' && '📷'}
                    {item.type === 'document' && '📄'}
                  </div>
                  <div className="vault-item-content">
                    <h4>{item.title}</h4>
                    <p>{item.date}</p>
                  </div>
                  <div className="vault-item-status">
                    {item.encrypted && <span className="encrypted-badge">🔒 Encrypted</span>}
                  </div>
                  <div className="vault-item-actions">
                    <button className="icon-button">👁️</button>
                    <button className="icon-button">⬇️</button>
                    <button className="icon-button">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="content-section">
            <div className="section-header">
              <h1>Messages</h1>
              <button className="primary-button">+ New Conversation</button>
            </div>

            <div className="messages-list">
              {messages.map(msg => (
                <div key={msg.id} className={`message-item ${msg.unread ? 'unread' : ''}`}>
                  <div className="message-avatar">
                    <div className="avatar-icon">🏢</div>
                    {msg.verified && <div className="verified-badge">✓</div>}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <h4>{msg.ngo}</h4>
                      <span className="message-time">{msg.time}</span>
                    </div>
                    <p className="message-preview">{msg.lastMessage}</p>
                  </div>
                  {msg.unread && <div className="unread-indicator"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="content-section">
            <div className="section-header">
              <h1>Anonymous Sisterhood</h1>
              <button className="primary-button">+ Share Your Story</button>
            </div>

            <div className="community-feed">
              {communityPosts.map(post => (
                <div key={post.id} className={`community-post ${post.isAIGenerated ? 'ai-generated' : ''}`}>
                  <div className="post-header">
                    <div className="post-author">
                      <div className="author-avatar">👤</div>
                      <div className="author-info">
                        <h4>{post.author}</h4>
                        <span className="post-time">{post.time}</span>
                        {post.isAIGenerated && (
                          <span className="ai-badge">🤖 AI Legal Report</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="post-content">
                    {post.transcription && (
                      <div className="post-transcription">
                        <strong>📝 Original Statement:</strong>
                        <p>{post.transcription}</p>
                      </div>
                    )}
                    <div className="post-report">
                      {post.lawsIncluded && <strong>⚖️ Legal Analysis:</strong>}
                      <p>{post.content}</p>
                    </div>
                  </div>
                  <div className="post-actions">
                    <button className="post-action">
                      <span>❤️</span>
                      <span>{post.likes}</span>
                    </button>
                    <button className="post-action">
                      <span>💬</span>
                      <span>{post.comments}</span>
                    </button>
                    <button className="post-action">
                      <span>🤝</span>
                      <span>Support</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="content-section">
            <div className="section-header">
              <h1>Safety Resources</h1>
              <div className="search-box">
                <input type="text" placeholder="Search resources..." />
                <button>🔍</button>
              </div>
            </div>

            {resources.map((category, idx) => (
              <div key={idx} className="resource-category">
                <h2>{category.category}</h2>
                <div className="resource-grid">
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="resource-card">
                      <div className="resource-thumbnail">
                        <div className="play-button">▶</div>
                      </div>
                      <div className="resource-info">
                        <h4>{item.title}</h4>
                        <div className="resource-meta">
                          <span>⏱️ {item.duration}</span>
                          <span>👁️ {item.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="content-section">
            <div className="section-header">
              <h1>Settings</h1>
            </div>

            <div className="settings-grid">
              <div className="settings-card">
                <h3>🔒 Privacy & Security</h3>
                <div className="settings-options">
                  <div className="setting-item">
                    <div>
                      <h4>Stealth Mode</h4>
                      <p>Disguise app as calculator</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Quick Exit</h4>
                      <p>Show emergency exit button</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h3>🔔 Notifications</h3>
                <div className="settings-options">
                  <div className="setting-item">
                    <div>
                      <h4>New Messages</h4>
                      <p>Get notified of NGO responses</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-card danger">
                <h3>⚠️ Danger Zone</h3>
                <div className="settings-options">
                  <button className="danger-button">Clear All Vault Data</button>
                  <button className="danger-button">Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
