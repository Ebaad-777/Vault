// OpenAI API Service for Voice-to-Text, AI Report Generation, and Text-to-Speech

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

console.log('API Key Status:', OPENAI_API_KEY ? '✓ Loaded' : '✗ Missing')

// Demo response for testing without API key
const DEMO_REPORT = `**Summary of Incident**
Based on your statement, you have experienced domestic violence including physical abuse and threats. This is a serious matter and you have legal protections available.

**Applicable Laws and Legal Rights**

1. **Protection of Women (Criminal Laws Amendment) Act 2006 - Section 498-A**
   - This law protects you from cruelty by your husband or his relatives
   - Punishment includes imprisonment up to 3 years and fines

2. **Domestic Violence (Prevention and Protection) Act 2012 - Section 3**
   - Covers all forms of gender-based violence
   - Includes physical, sexual, and psychological harm

**Recommended Legal Actions**

1. **File an FIR (First Information Report)** at your nearest police station
2. **Apply for a Protection Order** to prevent further abuse
3. **Seek Medical Documentation** of any injuries
4. **Contact a Women's Shelter** for immediate safety

**Safety Recommendations**

- Keep important documents in a safe place
- Inform trusted friends or family about your situation
- Have an emergency exit plan ready
- Keep emergency numbers saved

**Support Resources**

- National Domestic Violence Helpline: 1099
- Women's Crisis Center
- Legal Aid Services
- Local NGOs and shelters

Remember: You deserve safety, respect, and dignity. These laws exist to protect you.`

// Hardcoded Legal Database (simulating RAG)
const LEGAL_DATABASE = {
  pakistan: [
    {
      law: "Protection of Women (Criminal Laws Amendment) Act 2006",
      section: "Section 498-A",
      description: "Punishment for cruelty by husband or relatives of husband. Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
      applicability: "Domestic violence, physical abuse, mental torture"
    },
    {
      law: "Domestic Violence (Prevention and Protection) Act 2012",
      section: "Section 3",
      description: "Any act of gender-based violence that results in physical, sexual or psychological harm or suffering to women, including threats, coercion or arbitrary deprivation of liberty, whether occurring in public or private life.",
      applicability: "All forms of domestic violence"
    },
    {
      law: "Pakistan Penal Code 1860",
      section: "Section 336-B",
      description: "Whoever causes hurt by means of a corrosive substance or any other poisonous or deleterious substance shall be punished with imprisonment for life or imprisonment of either description which may extend to fourteen years and shall also be liable to fine.",
      applicability: "Acid attacks, poisoning"
    },
    {
      law: "Pakistan Penal Code 1860",
      section: "Section 354",
      description: "Assault or use of criminal force to woman with intent to outrage her modesty. Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
      applicability: "Sexual harassment, molestation"
    },
    {
      law: "Protection Against Harassment of Women at Workplace Act 2010",
      section: "Section 2(h)",
      description: "Harassment means any unwelcome sexual advance, request for sexual favours or other verbal or written communication or physical conduct of a sexual nature or sexually demeaning attitudes causing interference with work performance or creating an intimidating, hostile or offensive work environment.",
      applicability: "Workplace harassment"
    },
    {
      law: "The Dissolution of Muslim Marriages Act 1939",
      section: "Section 2",
      description: "A woman married under Muslim law shall be entitled to obtain a decree for the dissolution of her marriage on grounds including: cruelty, failure to provide maintenance, impotence, insanity, or any other ground recognized under Muslim law.",
      applicability: "Divorce rights, separation"
    }
  ],
  india: [
    {
      law: "Protection of Women from Domestic Violence Act 2005",
      section: "Section 3",
      description: "Any act, omission or commission or conduct of the respondent shall constitute domestic violence in case it harms or injures or endangers the health, safety, life, limb or well-being, whether mental or physical, of the aggrieved person.",
      applicability: "All forms of domestic violence"
    },
    {
      law: "Indian Penal Code 1860",
      section: "Section 498-A",
      description: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
      applicability: "Cruelty by husband or relatives"
    }
  ]
}

// Voice to Text using OpenAI Whisper API
export async function transcribeAudio(audioBlob, language = 'ur') {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env.local file.')
    }

    console.log('Starting transcription...', { 
      language, 
      blobSize: audioBlob.size,
      blobType: audioBlob.type 
    })

    // Convert blob to proper format if needed
    const formData = new FormData()
    
    // Determine file extension based on blob type
    let filename = 'audio.webm'
    if (audioBlob.type.includes('mp4')) {
      filename = 'audio.mp4'
    } else if (audioBlob.type.includes('mpeg')) {
      filename = 'audio.mp3'
    } else if (audioBlob.type.includes('wav')) {
      filename = 'audio.wav'
    }
    
    formData.append('file', audioBlob, filename)
    formData.append('model', 'whisper-1')
    
    // Only add language if not auto-detect
    if (language && language !== 'auto') {
      formData.append('language', language)
    }
    
    formData.append('response_format', 'verbose_json')

    console.log('Sending request to Whisper API...')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Transcription API error:', errorData)
      throw new Error(`Transcription failed: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    console.log('Transcription successful:', {
      textLength: data.text?.length,
      language: data.language,
      duration: data.duration
    })
    
    return {
      success: true,
      text: data.text,
      language: data.language || language,
      duration: data.duration
    }
  } catch (error) {
    console.error('Transcription error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Generate Legal Report using GPT-4
export async function generateLegalReport(transcription, country = 'pakistan') {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env.local file.')
    }

    console.log('Generating legal report...', { country, transcriptionLength: transcription.length })

    const relevantLaws = LEGAL_DATABASE[country] || LEGAL_DATABASE.pakistan

    const systemPrompt = `You are a compassionate legal advisor specializing in domestic violence cases in ${country}. 
Your role is to:
1. Analyze the victim's statement with empathy and understanding
2. Identify applicable laws and legal protections
3. Provide clear, actionable legal guidance
4. Offer emotional support and validation
5. Suggest immediate safety measures

Use the following legal database for your analysis:
${JSON.stringify(relevantLaws, null, 2)}

Format your response as a structured report with these sections:
- Summary of Incident
- Applicable Laws and Legal Rights
- Recommended Legal Actions
- Safety Recommendations
- Support Resources

Be compassionate, clear, and empowering in your language.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please analyze this statement and provide a comprehensive legal report:\n\n"${transcription}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Report generation API error:', errorData)
      throw new Error(`Report generation failed: ${response.statusText}`)
    }

    const data = await response.json()
    const report = data.choices[0].message.content

    console.log('Report generated successfully')

    return {
      success: true,
      report: report,
      timestamp: new Date().toISOString(),
      laws_cited: relevantLaws.map(law => `${law.law} - ${law.section}`)
    }
  } catch (error) {
    console.error('Report generation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Text to Speech using OpenAI TTS API
export async function textToSpeech(text, language = 'en', voice = 'nova') {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env.local file.')
    }

    console.log('Generating speech...', { language, textLength: text.length })

    // Map languages to appropriate voices
    const voiceMap = {
      'en': 'nova',    // English - female voice
      'ur': 'nova',    // Urdu - using nova (supports multiple languages)
      'hi': 'nova'     // Hindi - using nova
    }

    const selectedVoice = voiceMap[language] || 'nova'

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: selectedVoice,
        response_format: 'mp3'
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('TTS API error:', errorData)
      throw new Error(`TTS failed: ${response.statusText}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    console.log('Speech generated successfully')

    return {
      success: true,
      audioUrl: audioUrl,
      audioBlob: audioBlob
    }
  } catch (error) {
    console.error('TTS error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Translate text to target language using GPT
export async function translateText(text, targetLanguage) {
  try {
    const languageNames = {
      'en': 'English',
      'ur': 'Urdu',
      'hi': 'Hindi'
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text to ${languageNames[targetLanguage]}. Maintain the tone, structure, and formatting. Only provide the translation, no explanations.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      translatedText: data.choices[0].message.content
    }
  } catch (error) {
    console.error('Translation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Complete workflow: Voice -> Text -> Report -> Speech
export async function processVoiceToReport(audioBlob, inputLanguage = 'ur', outputLanguage = 'ur', country = 'pakistan') {
  try {
    // Step 1: Transcribe audio
    console.log('📝 Step 1/4: Transcribing audio...')
    const transcription = await transcribeAudio(audioBlob, inputLanguage)
    if (!transcription.success) {
      throw new Error(`Transcription failed: ${transcription.error}`)
    }
    console.log('✓ Transcription complete:', transcription.text.substring(0, 100) + '...')

    // Step 2: Generate legal report
    console.log('⚖️ Step 2/4: Generating legal report...')
    const report = await generateLegalReport(transcription.text, country)
    if (!report.success) {
      throw new Error(`Report generation failed: ${report.error}`)
    }
    console.log('✓ Report generated')

    // Step 3: Translate report if needed
    let finalReport = report.report
    if (outputLanguage !== 'en') {
      console.log(`🌐 Step 3/4: Translating report to ${outputLanguage}...`)
      const translation = await translateText(report.report, outputLanguage)
      if (translation.success) {
        finalReport = translation.translatedText
        console.log('✓ Translation complete')
      } else {
        console.warn('Translation failed, using English report')
      }
    } else {
      console.log('⏭️ Step 3/4: Skipping translation (already in English)')
    }

    // Step 4: Convert report to speech
    console.log('🔊 Step 4/4: Converting report to speech...')
    const audio = await textToSpeech(finalReport, outputLanguage)
    if (!audio.success) {
      console.warn('TTS failed, report will be text-only:', audio.error)
    } else {
      console.log('✓ Audio generated')
    }

    console.log('🎉 All steps complete!')

    return {
      success: true,
      transcription: transcription.text,
      report: finalReport,
      originalReport: report.report,
      audioUrl: audio.audioUrl,
      audioBlob: audio.audioBlob,
      lawsCited: report.laws_cited,
      timestamp: report.timestamp
    }
  } catch (error) {
    console.error('❌ Complete workflow error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
