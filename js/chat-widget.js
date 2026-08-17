/**
 * HARSH BAJPAI — AI CHAT ASSISTANT CONTROLLER (POWERED BY GEMINI API)
 *
 * Key Architecture:
 * 1. Configurable Gemini API configuration at top of file for easy rotation
 * 2. Permanent scroll-independent fixed compact icon with neon cyan/violet glow
 * 3. Fast typewriter welcome animation on first session open (<2s) via sessionStorage
 * 4. Feature-detected mobile haptic feedback (Vibration API)
 * 5. Multi-tier resilience: Gemini 3.6 Flash -> Gemini 3.5 Flash-Lite -> Local Knowledge Base -> WhatsApp/Contact Fallback
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. GEMINI API CONFIGURATION (Config Variable for Easy Rotation)
  // =========================================================================
  const GEMINI_CONFIG = {
    // API key stored as decoded configuration for ease of rotation
    API_KEY: atob('QVEuQWI4Uk42TFUtZks3clRkQ2VTZHBuX0k2cGN0UXpYdjFTMl9QUk13UWtIam5TTWsxQXc='),
    PRIMARY_MODEL: 'gemini-3.6-flash',
    FALLBACK_MODEL: 'gemini-3.5-flash-lite',
    TEMPERATURE: 0.7,
    MAX_TOKENS: 600,
    API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models'
  };

  const SESSION_KEY = 'hb_portfolio_chat_welcomed';
  const WELCOME_TEXT = 'Welcome to my portfolio! 👋';

  // System Prompt providing rich context on Harsh's portfolio, skills, and projects
  const SYSTEM_INSTRUCTION = `You are the AI Concierge assistant for Harsh Bajpai's personal portfolio website. Harsh is an AI & Automation Developer based in India, available worldwide for remote roles, client projects, and consultations.

Harsh's Featured Projects:
1. "Pill — AI Clinic Assistant": Healthcare triage and patient coordination platform. Features 24/7 AI-driven symptom intake, automated appointment triage, real-time doctor availability checks, instant WhatsApp patient reminders, and multi-clinician coordination. Built with n8n Automation Workflows, OpenAI/Gemini APIs, Webhooks, and WhatsApp Cloud API.
2. "Spatial 3D Interactive Web Experience": Real-time WebGL spatial physics canvas featuring interactive geometry, dynamic reactive lighting tracking cursor movement, particle starfield, and glassmorphism interface. Built with Three.js, WebGL shaders, Vanilla JavaScript, and CSS Glassmorphism.
3. "Gym / Fitness Landing Page": Commercial high-converting fitness center landing page featuring dynamic class schedules, trainer rosters, tiered membership pricing, and lead capture. Built with HTML5, CSS3, Modern ES6+ JavaScript.

Harsh's Technical Toolkit:
- AI & Automation: n8n Workflow Automation, LLM Integration (OpenAI & Gemini APIs), Custom AI Agents & Tool Calling, Webhooks, CRM Integrations, WhatsApp Cloud API.
- Frontend & 3D: Three.js, WebGL, Modern JavaScript (ES6+), Vanilla CSS3 / Glassmorphism, React.
- Backend & Cloud: Node.js, REST APIs, Supabase, EmailJS, Cloudflare, Git/GitHub.

Contact Channels:
- Email: theharshbajpaii@gmail.com
- WhatsApp: Direct instant messaging
- Location: India (Available Worldwide for Remote Collaboration)

Guidelines:
- Keep your tone friendly, professional, and enthusiastic.
- Structure responses clearly with bullet points and bold highlights.
- Keep responses concise (around 100-150 words).
- If the user asks about hiring, collaboration, or quotes, invite them to message Harsh on WhatsApp or via the contact form.`;

  // Fallback Local Knowledge Base if API call fails
  const LOCAL_KNOWLEDGE_BASE = [
    {
      keywords: ['pill', 'clinic', 'healthcare', 'medical', 'hospital', 'doctor', 'triage'],
      response: `<strong>Pill — AI Clinic Assistant</strong> is an intelligent healthcare triage platform built by Harsh.<br><br>
      • <strong>Core Features:</strong> 24/7 AI symptom intake, automated triage, real-time appointment booking, WhatsApp reminders, and clinician schedule coordination.<br>
      • <strong>Tech Stack:</strong> n8n Automation, OpenAI/Gemini API, Webhooks, WhatsApp Cloud API.<br><br>
      <a href="#projects" class="chat-action-btn" data-action="close-and-scroll" data-target="#projects">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> View Pill Project
      </a>`
    },
    {
      keywords: ['spatial', '3d', 'three.js', 'threejs', 'webgl', 'scene', 'canvas', 'interactive'],
      response: `<strong>Spatial 3D Interactive Web Experience</strong> is this portfolio's real-time WebGL engine!<br><br>
      • <strong>Highlights:</strong> Interactive floating geometry, reactive lighting, particle starfield, and smooth 60fps rendering.<br>
      • <strong>Tech:</strong> Three.js, WebGL shaders, Vanilla JavaScript, CSS Glassmorphism.<br><br>
      <a href="#hero" class="chat-action-btn" data-action="close-and-scroll" data-target="#hero">
        <i class="fa-solid fa-cube"></i> Explore 3D Hero
      </a>`
    },
    {
      keywords: ['gym', 'fitness', 'landing', 'athletics', 'velocity'],
      response: `<strong>Gym / Fitness Landing Page</strong> is a high-converting commercial client template.<br><br>
      • <strong>Features:</strong> Dynamic timetables, membership tiers, trainer rosters, and lead capture.<br>
      • <strong>Tech:</strong> HTML5, CSS3, JavaScript ES6+, Responsive Layout.<br><br>
      <a href="#projects" class="chat-action-btn" data-action="close-and-scroll" data-target="#projects">
        <i class="fa-solid fa-dumbbell"></i> View Gym Project
      </a>`
    },
    {
      keywords: ['project', 'work', 'portfolio', 'built', 'build', 'case study'],
      response: `Harsh specializes in AI-powered tools, automations, and modern web applications. Key projects include:<br><br>
      1. 💊 <strong>Pill — AI Clinic Assistant:</strong> Healthcare triage & WhatsApp automation.<br>
      2. 🌌 <strong>Spatial 3D Web Experience:</strong> Real-time WebGL canvas with dynamic lighting.<br>
      3. 🏋️ <strong>Gym / Fitness Landing Page:</strong> Conversion-optimized commercial page.<br><br>
      <a href="#projects" class="chat-action-btn" data-action="close-and-scroll" data-target="#projects">
        <i class="fa-solid fa-layer-group"></i> Explore Projects Section
      </a>`
    },
    {
      keywords: ['skill', 'stack', 'tech', 'technologies', 'n8n', 'javascript', 'react', 'node'],
      response: `Harsh's technical toolkit includes:<br><br>
      • <strong>AI & Automation:</strong> n8n Workflow Automation, LLM Integration (OpenAI & Gemini), Custom AI Agents, Webhooks, CRM Integrations.<br>
      • <strong>Frontend & 3D:</strong> Three.js, WebGL, Modern JS (ES6+), Vanilla CSS3 / Glassmorphism, React.<br>
      • <strong>Backend & Cloud:</strong> Node.js, REST APIs, Supabase, EmailJS, Cloudflare, Git/GitHub.<br><br>
      <a href="#skills" class="chat-action-btn" data-action="close-and-scroll" data-target="#skills">
        <i class="fa-solid fa-code"></i> View Skills Section
      </a>`
    },
    {
      keywords: ['contact', 'email', 'whatsapp', 'hire', 'reach', 'message', 'call', 'freelance', 'job', 'collaborate'],
      response: `You can reach Harsh directly through several channels:<br><br>
      • 📧 <strong>Email:</strong> <a href="mailto:theharshbajpaii@gmail.com" class="chat-link">theharshbajpaii@gmail.com</a><br>
      • 💬 <strong>WhatsApp:</strong> <a href="https://wa.me/?text=Hi%20Harsh,%20I'm%20reaching%20out%20from%20your%20portfolio%20AI%20chat!" target="_blank" rel="noopener noreferrer" class="chat-link">Direct Instant Message</a><br>
      • 📍 <strong>Location:</strong> India (Available Worldwide for Remote Roles)<br><br>
      <div class="chat-btn-group">
        <a href="https://wa.me/?text=Hi%20Harsh,%20I'd%20like%20to%20discuss%20a%20project!" target="_blank" rel="noopener noreferrer" class="chat-action-btn chat-action-wa">
          <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
        </a>
        <a href="#contact" class="chat-action-btn" data-action="close-and-scroll" data-target="#contact">
          <i class="fa-solid fa-envelope"></i> Open Contact Form
        </a>
      </div>`
    }
  ];

  const ULTIMATE_FALLBACK_RESPONSE = `I'm currently unable to reach the cloud AI service, but you can connect with Harsh directly!<br><br>
  • 📧 <strong>Email:</strong> <a href="mailto:theharshbajpaii@gmail.com" class="chat-link">theharshbajpaii@gmail.com</a><br>
  • 💬 <strong>WhatsApp:</strong> <a href="https://wa.me/?text=Hi%20Harsh,%20I'm%20reaching%20out%20from%20your%20portfolio%20AI%20chat!" target="_blank" rel="noopener noreferrer" class="chat-link">Instant Chat</a><br><br>
  <div class="chat-btn-group">
    <a href="https://wa.me/?text=Hi%20Harsh,%20I'd%20like%20to%20discuss%20a%20project!" target="_blank" rel="noopener noreferrer" class="chat-action-btn chat-action-wa">
      <i class="fa-brands fa-whatsapp"></i> Message on WhatsApp
    </a>
    <a href="#contact" class="chat-action-btn" data-action="close-and-scroll" data-target="#contact">
      <i class="fa-solid fa-envelope"></i> Open Contact Form
    </a>
  </div>`;

  // --- Haptic Feedback Helper (Feature-detected & silent on unsupported devices) ---
  function triggerHaptic(duration = 15) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate(duration);
      }
    } catch (e) {
      // Silently fail on iOS Safari / unsupported platforms
    }
  }

  // --- Markdown to HTML Formatter ---
  function formatMarkdown(text) {
    if (!text) return '';

    // Replace Markdown Links: [text](url)
    let formatted = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

    // Replace Bold: **text** or __text__
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Replace Italic: *text* or _text_
    formatted = formatted.replace(/\*([^\*\n]+)\*/g, '<em>$1</em>');

    // Replace Inline Code: `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');

    // Parse list items and paragraphs
    const lines = formatted.split('\n');
    let inList = false;
    const output = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ')) {
        if (!inList) {
          output.push('<ul class="chat-bullet-list">');
          inList = true;
        }
        output.push(`<li>${line.substring(2)}</li>`);
      } else {
        if (inList) {
          output.push('</ul>');
          inList = false;
        }
        if (line.length > 0) {
          output.push(`<p>${line}</p>`);
        }
      }
    }
    if (inList) {
      output.push('</ul>');
    }

    let finalHtml = output.join('');

    // Append context-aware quick action buttons if relevant keywords are present
    const lower = text.toLowerCase();
    const actions = [];

    if (lower.includes('pill') || lower.includes('clinic')) {
      actions.push(`<a href="#projects" class="chat-action-btn" data-action="close-and-scroll" data-target="#projects"><i class="fa-solid fa-pills"></i> View Pill Project</a>`);
    }
    if (lower.includes('spatial') || lower.includes('3d') || lower.includes('three.js')) {
      actions.push(`<a href="#hero" class="chat-action-btn" data-action="close-and-scroll" data-target="#hero"><i class="fa-solid fa-cube"></i> Explore 3D Hero</a>`);
    }
    if (lower.includes('gym') || lower.includes('fitness')) {
      actions.push(`<a href="#projects" class="chat-action-btn" data-action="close-and-scroll" data-target="#projects"><i class="fa-solid fa-dumbbell"></i> View Gym Project</a>`);
    }
    if (lower.includes('contact') || lower.includes('reach') || lower.includes('hire') || lower.includes('email') || lower.includes('whatsapp') || lower.includes('collaborat')) {
      actions.push(`<a href="https://wa.me/?text=Hi%20Harsh,%20I'd%20like%20to%20discuss%20a%20project!" target="_blank" rel="noopener noreferrer" class="chat-action-btn chat-action-wa"><i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp</a>`);
      actions.push(`<a href="#contact" class="chat-action-btn" data-action="close-and-scroll" data-target="#contact"><i class="fa-solid fa-envelope"></i> Open Contact Form</a>`);
    }

    if (actions.length > 0) {
      finalHtml += `<div class="chat-btn-group">${actions.join(' ')}</div>`;
    }

    return finalHtml;
  }

  // --- Main Chat Widget Class ---
  class PortfolioChatWidget {
    constructor() {
      this.isOpen = false;
      this.isTyping = false;
      this.hasWelcomed = this.checkIfWelcomed();
      this.conversationHistory = [];

      this.initElements();
      this.bindEvents();
      this.renderInitialGreetingIfAlreadyWelcomed();
    }

    checkIfWelcomed() {
      try {
        return sessionStorage.getItem(SESSION_KEY) === 'true';
      } catch (e) {
        return false;
      }
    }

    setWelcomed() {
      this.hasWelcomed = true;
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch (e) {
        // In-memory fallback
      }
    }

    initElements() {
      this.triggerBtn = document.getElementById('ai-chat-trigger');
      this.chatPanel = document.getElementById('ai-chat-panel');
      this.closeBtn = document.getElementById('ai-chat-close-btn');
      this.minimizeBtn = document.getElementById('ai-chat-minimize-btn');
      this.welcomeScreen = document.getElementById('ai-chat-welcome-screen');
      this.welcomeTextElem = document.getElementById('ai-chat-welcome-text');
      this.chatBody = document.getElementById('ai-chat-body');
      this.messagesContainer = document.getElementById('ai-chat-messages');
      this.suggestionsContainer = document.getElementById('ai-chat-suggestions');
      this.chatForm = document.getElementById('ai-chat-form');
      this.chatInput = document.getElementById('ai-chat-input');
      this.sendBtn = document.getElementById('ai-chat-send-btn');
      this.badgeDot = document.getElementById('ai-chat-badge');
    }

    bindEvents() {
      if (!this.triggerBtn || !this.chatPanel) return;

      // Permanent Fixed Trigger Toggle
      this.triggerBtn.addEventListener('click', () => {
        this.toggleChat();
      });

      // Close / Minimize
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.closeChat());
      }
      if (this.minimizeBtn) {
        this.minimizeBtn.addEventListener('click', () => this.closeChat());
      }

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeChat();
        }
      });

      // Form submit
      if (this.chatForm) {
        this.chatForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleUserSubmit();
        });
      }

      // Quick Suggestion Chips Click
      if (this.suggestionsContainer) {
        this.suggestionsContainer.addEventListener('click', (e) => {
          const chip = e.target.closest('.chat-suggestion-chip');
          if (chip && !this.isTyping) {
            triggerHaptic(10);
            const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
            this.sendUserMessage(prompt);
          }
        });
      }

      // Action links inside chat (e.g. scroll to section)
      if (this.messagesContainer) {
        this.messagesContainer.addEventListener('click', (e) => {
          const actionBtn = e.target.closest('[data-action="close-and-scroll"]');
          if (actionBtn) {
            const targetId = actionBtn.getAttribute('data-target');
            if (targetId) {
              const targetElem = document.querySelector(targetId);
              if (targetElem) {
                this.closeChat();
                targetElem.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        });
      }
    }

    renderInitialGreetingIfAlreadyWelcomed() {
      if (this.hasWelcomed && this.messagesContainer && this.messagesContainer.children.length === 0) {
        this.addAssistantMessage(
          `👋 <strong>Hi there!</strong> I'm Harsh's AI Concierge powered by Gemini. Ask me anything about Harsh's projects (Pill AI, 3D Spatial Web, Gym page), technical stack, or how to collaborate!`,
          false
        );
      }
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      if (this.isOpen) return;
      this.isOpen = true;

      // Haptic Feedback on Open (15ms duration)
      triggerHaptic(15);

      this.chatPanel.classList.add('active');
      this.chatPanel.setAttribute('aria-hidden', 'false');
      this.triggerBtn.classList.add('active');
      this.triggerBtn.setAttribute('aria-expanded', 'true');

      if (this.badgeDot) {
        this.badgeDot.style.display = 'none';
      }

      // Check if this is the first open in this session
      if (!this.hasWelcomed) {
        this.playWelcomeAnimation();
      } else {
        if (this.welcomeScreen) {
          this.welcomeScreen.style.display = 'none';
        }
        if (this.chatBody) {
          this.chatBody.style.display = 'flex';
          this.chatBody.style.opacity = '1';
        }
        this.renderInitialGreetingIfAlreadyWelcomed();
        this.focusInput();
        this.scrollToBottom();
      }
    }

    closeChat() {
      if (!this.isOpen) return;
      this.isOpen = false;

      triggerHaptic(10);

      this.chatPanel.classList.remove('active');
      this.chatPanel.setAttribute('aria-hidden', 'true');
      this.triggerBtn.classList.remove('active');
      this.triggerBtn.setAttribute('aria-expanded', 'false');
    }

    focusInput() {
      setTimeout(() => {
        if (this.chatInput && window.innerWidth > 640) {
          this.chatInput.focus();
        }
      }, 100);
    }

    /**
     * REFINEMENT 2: WELCOME TYPEWRITER INTRO ANIMATION (<2s)
     */
    playWelcomeAnimation() {
      if (!this.welcomeScreen || !this.welcomeTextElem) {
        this.setWelcomed();
        return;
      }

      this.welcomeScreen.style.display = 'flex';
      this.welcomeScreen.style.opacity = '1';
      if (this.chatBody) {
        this.chatBody.style.display = 'none';
        this.chatBody.style.opacity = '0';
      }

      this.welcomeTextElem.textContent = '';
      let charIndex = 0;
      const typeSpeed = 32;

      const typeInterval = setInterval(() => {
        if (charIndex < WELCOME_TEXT.length) {
          this.welcomeTextElem.textContent += WELCOME_TEXT.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            this.transitionFromWelcomeToChat();
          }, 380);
        }
      }, typeSpeed);
    }

    transitionFromWelcomeToChat() {
      if (!this.welcomeScreen || !this.chatBody) return;

      this.setWelcomed();

      this.welcomeScreen.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      this.welcomeScreen.style.opacity = '0';
      this.welcomeScreen.style.transform = 'scale(0.95)';

      setTimeout(() => {
        this.welcomeScreen.style.display = 'none';
        this.welcomeScreen.style.transform = '';
        
        this.chatBody.style.display = 'flex';
        this.chatBody.style.transition = 'opacity 0.3s ease';
        
        if (this.messagesContainer && this.messagesContainer.children.length === 0) {
          this.addAssistantMessage(
            `👋 <strong>Hi there!</strong> I'm Harsh's AI Concierge powered by Gemini. Ask me anything about Harsh's projects (Pill AI, 3D Spatial Web, Gym page), technical stack, or how to collaborate!`,
            false
          );
        }

        requestAnimationFrame(() => {
          this.chatBody.style.opacity = '1';
          this.scrollToBottom();
          this.focusInput();
        });
      }, 350);
    }

    handleUserSubmit() {
      if (!this.chatInput) return;
      const text = this.chatInput.value.trim();
      if (!text || this.isTyping) return;

      this.chatInput.value = '';
      this.sendUserMessage(text);
    }

    async sendUserMessage(text) {
      triggerHaptic(12);

      this.appendMessage(text, 'user');
      this.scrollToBottom();

      // Record in conversation history for multi-turn Gemini context
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: text }]
      });

      this.isTyping = true;
      this.showTypingIndicator();

      try {
        // 1. Call Gemini API
        const aiResponse = await this.callGeminiAPI(text);
        this.hideTypingIndicator();
        this.addAssistantMessage(aiResponse, true);

        // Record AI response in conversation history
        this.conversationHistory.push({
          role: 'model',
          parts: [{ text: aiResponse }]
        });
      } catch (err) {
        console.warn('Gemini API call failed, activating graceful fallback:', err);
        this.hideTypingIndicator();

        // 2. Multi-tier Graceful Fallback
        const fallbackResponse = this.getFallbackResponse(text);
        this.addAssistantMessage(fallbackResponse, true);
      } finally {
        this.isTyping = false;
      }
    }

    /**
     * Gemini API Client with primary model and automatic fallback model
     */
    async callGeminiAPI(userQuery) {
      const makeRequest = async (modelName) => {
        const url = `${GEMINI_CONFIG.API_BASE_URL}/${modelName}:generateContent?key=${GEMINI_CONFIG.API_KEY}`;
        
        // Prepare recent turns (limit to last 6 messages to stay lightweight and fast)
        const recentContents = this.conversationHistory.slice(-6);

        const payload = {
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: recentContents,
          generationConfig: {
            temperature: GEMINI_CONFIG.TEMPERATURE,
            maxOutputTokens: GEMINI_CONFIG.MAX_TOKENS
          }
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Gemini API HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const rawText = data.candidates[0].content.parts[0].text;
          return formatMarkdown(rawText);
        }

        throw new Error('No content returned from Gemini API');
      };

      try {
        // Try Primary Model
        return await makeRequest(GEMINI_CONFIG.PRIMARY_MODEL);
      } catch (primaryErr) {
        console.warn(`Primary model (${GEMINI_CONFIG.PRIMARY_MODEL}) failed, trying fallback model (${GEMINI_CONFIG.FALLBACK_MODEL}):`, primaryErr.message);
        // Try Fallback Model
        return await makeRequest(GEMINI_CONFIG.FALLBACK_MODEL);
      }
    }

    /**
     * Local Fallback Response Engine
     */
    getFallbackResponse(query) {
      const q = query.toLowerCase();

      for (const item of LOCAL_KNOWLEDGE_BASE) {
        if (item.keywords.some(keyword => q.includes(keyword))) {
          return item.response;
        }
      }

      return ULTIMATE_FALLBACK_RESPONSE;
    }

    appendMessage(content, sender = 'assistant') {
      if (!this.messagesContainer) return;

      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message chat-msg-${sender}`;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (sender === 'user') {
        msgDiv.innerHTML = `
          <div class="msg-bubble user-bubble">
            <div class="msg-text">${this.escapeHtml(content)}</div>
            <div class="msg-time">${timeStr}</div>
          </div>
        `;
      } else {
        msgDiv.innerHTML = `
          <div class="msg-avatar" aria-hidden="true">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="msg-bubble assistant-bubble">
            <div class="msg-text">${content}</div>
            <div class="msg-time">${timeStr}</div>
          </div>
        `;
      }

      this.messagesContainer.appendChild(msgDiv);
      this.scrollToBottom();
      return msgDiv;
    }

    addAssistantMessage(content, triggerVibration = true) {
      this.appendMessage(content, 'assistant');

      if (triggerVibration) {
        triggerHaptic(10);
      }
    }

    showTypingIndicator() {
      if (!this.messagesContainer) return;
      
      let indicator = document.getElementById('ai-chat-typing-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'ai-chat-typing-indicator';
        indicator.className = 'chat-message chat-msg-assistant typing-indicator-msg';
        indicator.innerHTML = `
          <div class="msg-avatar" aria-hidden="true">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="msg-bubble assistant-bubble typing-bubble">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        `;
        this.messagesContainer.appendChild(indicator);
      }
      indicator.style.display = 'flex';
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      const indicator = document.getElementById('ai-chat-typing-indicator');
      if (indicator) {
        indicator.remove();
      }
    }

    scrollToBottom() {
      if (!this.messagesContainer) return;
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Initialize once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.portfolioChat = new PortfolioChatWidget();
    });
  } else {
    window.portfolioChat = new PortfolioChatWidget();
  }

})();
