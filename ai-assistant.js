/**
 * OneDashboard AI Assistant — Powered by Google Gemini
 * Connects to Gemini API to analyze page content and provide live insights.
 * API key is stored in localStorage (never hardcoded).
 */
(function () {
    'use strict';

    const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
    const STORAGE_KEY = 'onedashboard_gemini_key';
    const MODEL_STORAGE_KEY = 'onedashboard_gemini_model';

    // ===== Inject Styles =====
    const style = document.createElement('style');
    style.textContent = `
        /* ===== Floating Button ===== */
        .ai-fab {
            position: fixed;
            bottom: 28px;
            right: 28px;
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: linear-gradient(135deg, #E60000 0%, #B80000 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(230, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: all 0.3s cubic-bezier(.4,0,.2,1);
        }
        .ai-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 28px rgba(230, 0, 0, 0.55);
        }
        .ai-fab.open {
            transform: rotate(45deg) scale(1);
            background: linear-gradient(135deg, #404040 0%, #171717 100%);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .ai-fab svg { width: 26px; height: 26px; }

        /* FAB Tooltip */
        .ai-fab-tooltip {
            position: fixed;
            bottom: 96px;
            right: 28px;
            background: #171717;
            color: #fff;
            font-size: 12.5px;
            font-weight: 500;
            padding: 8px 14px;
            border-radius: 8px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transform: translateY(6px);
            transition: all 0.25s cubic-bezier(.4,0,.2,1);
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        .ai-fab-tooltip::after {
            content: '';
            position: absolute;
            bottom: -6px;
            right: 22px;
            width: 12px;
            height: 12px;
            background: #171717;
            transform: rotate(45deg);
            border-radius: 2px;
        }
        .ai-fab:hover + .ai-fab-tooltip,
        .ai-fab:focus + .ai-fab-tooltip {
            opacity: 1;
            transform: translateY(0);
        }
        .ai-fab.open + .ai-fab-tooltip {
            opacity: 0 !important;
            pointer-events: none;
        }

        /* ===== Chat Panel ===== */
        .ai-panel {
            position: fixed;
            bottom: 100px;
            right: 28px;
            width: 420px;
            max-height: 560px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 12px 48px rgba(0,0,0,0.18);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.35s cubic-bezier(.4,0,.2,1);
        }
        .ai-panel.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        .ai-panel-header {
            background: linear-gradient(135deg, #E60000, #B80000);
            color: white;
            padding: 18px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
        }
        .ai-panel-header-icon {
            width: 36px; height: 36px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .ai-panel-header-icon svg { width: 20px; height: 20px; }
        .ai-panel-header-text h3 { font-size: 15px; font-weight: 700; margin: 0; }
        .ai-panel-header-text p { font-size: 11px; opacity: 0.85; margin: 0; }

        .ai-panel-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px 18px;
            font-size: 13.5px;
            line-height: 1.75;
            color: #333;
            min-height: 180px;
        }
        .ai-panel-body::-webkit-scrollbar { width: 5px; }
        .ai-panel-body::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 8px; }

        /* Chat bubbles */
        .ai-msg { margin-bottom: 14px; }
        .ai-msg-assistant {
            background: #F5F5F5;
            border: 1px solid #E5E5E5;
            border-radius: 12px 12px 12px 2px;
            padding: 14px 16px;
            font-size: 13px;
            line-height: 1.75;
            color: #333;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .ai-msg-user {
            background: linear-gradient(135deg, #E60000, #B80000);
            color: white;
            border-radius: 12px 12px 2px 12px;
            padding: 10px 16px;
            font-size: 13px;
            margin-left: 40px;
            text-align: right;
        }
        .ai-msg-assistant strong { color: #171717; }
        .ai-msg-assistant em { color: #E60000; font-style: normal; font-weight: 600; }

        /* Typing indicator */
        .ai-typing { display: flex; gap: 5px; padding: 10px 0; align-items: center; }
        .ai-typing span {
            width: 8px; height: 8px; border-radius: 50%; background: #D4D4D4;
            animation: aiBounce 1.4s infinite both;
        }
        .ai-typing span:nth-child(2) { animation-delay: 0.16s; }
        .ai-typing span:nth-child(3) { animation-delay: 0.32s; }
        @keyframes aiBounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
        }

        /* Input bar */
        .ai-panel-input {
            padding: 12px 14px;
            border-top: 1px solid #E5E5E5;
            display: flex;
            gap: 8px;
            flex-shrink: 0;
            background: #FAFAFA;
        }
        .ai-panel-input input {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid #E5E5E5;
            border-radius: 10px;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s;
            background: #fff;
        }
        .ai-panel-input input:focus { border-color: #E60000; }
        .ai-panel-input button {
            padding: 0 16px;
            background: #E60000;
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            flex-shrink: 0;
        }
        .ai-panel-input button:hover { background: #CC0000; }
        .ai-panel-input button:disabled { background: #D4D4D4; cursor: not-allowed; }

        /* API key setup */
        .ai-setup {
            padding: 24px 20px;
            text-align: center;
        }
        .ai-setup h4 { font-size: 15px; margin-bottom: 6px; color: #171717; }
        .ai-setup p { font-size: 12px; color: #525252; margin-bottom: 16px; line-height: 1.6; }
        .ai-setup input {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #E5E5E5;
            border-radius: 8px;
            font-size: 13px;
            margin-bottom: 12px;
            outline: none;
            font-family: monospace;
        }
        .ai-setup input:focus { border-color: #E60000; }
        .ai-setup button {
            width: 100%;
            padding: 11px;
            background: #E60000;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        .ai-setup button:hover { background: #CC0000; }
        .ai-setup .ai-setup-link {
            display: inline-block;
            margin-top: 10px;
            font-size: 11px;
            color: #E60000;
            text-decoration: none;
        }
        .ai-setup .ai-setup-link:hover { text-decoration: underline; }

        .ai-error-msg {
            background: #FEE2E2;
            border: 1px solid #FECACA;
            color: #991B1B;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .ai-rate-limit {
            background: #FEF3C7;
            border: 1px solid #FDE68A;
            color: #92400E;
            padding: 14px 16px;
            border-radius: 10px;
            font-size: 12.5px;
            margin-bottom: 10px;
            line-height: 1.6;
        }
        .ai-rate-limit strong { color: #78350F; }
        .ai-retry-btn {
            display: inline-block;
            margin-top: 8px;
            padding: 7px 18px;
            background: #E60000;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        .ai-retry-btn:hover { background: #CC0000; }
        .ai-retry-btn:disabled { background: #D4D4D4; cursor: not-allowed; }
        .ai-countdown { font-weight: 700; color: #E60000; font-size: 14px; }

        /* Pulse ring on FAB */
        .ai-fab::after {
            content: '';
            position: absolute;
            width: 100%; height: 100%;
            border-radius: 50%;
            border: 2px solid #E60000;
            animation: aiPulse 2.5s infinite;
        }
        .ai-fab.open::after { animation: none; opacity: 0; }
        @keyframes aiPulse {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.6); opacity: 0; }
        }

        @media (max-width: 500px) {
            .ai-panel { width: calc(100vw - 24px); right: 12px; bottom: 90px; max-height: 70vh; }
            .ai-fab { bottom: 16px; right: 16px; }
        }
    `;
    document.head.appendChild(style);

    // ===== Create DOM =====
    const fab = document.createElement('button');
    fab.className = 'ai-fab';
    fab.setAttribute('aria-label', 'AI Assistant');
    fab.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C12 0 14.5 8.5 12 12C9.5 15.5 12 24 12 24C12 24 14.5 15.5 12 12C9.5 8.5 12 0 12 0Z" />
        <path d="M0 12C0 12 8.5 9.5 12 12C15.5 14.5 24 12 24 12C24 12 15.5 9.5 12 12C8.5 14.5 0 12 0 12Z" />
    </svg>`;
    document.body.appendChild(fab);

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'ai-fab-tooltip';
    tooltip.textContent = 'SNAPI AI — Analyze & get insights on this page';
    document.body.appendChild(tooltip);

    const panel = document.createElement('div');
    panel.className = 'ai-panel';
    panel.innerHTML = `
        <div class="ai-panel-header">
            <div class="ai-panel-header-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C12 0 14.5 8.5 12 12C9.5 15.5 12 24 12 24C12 24 14.5 15.5 12 12C9.5 8.5 12 0 12 0Z"/><path d="M0 12C0 12 8.5 9.5 12 12C15.5 14.5 24 12 24 12C24 12 15.5 9.5 12 12C8.5 14.5 0 12 0 12Z"/></svg>
            </div>
            <div class="ai-panel-header-text">
                <h3>SNAPI AI</h3>
                <p id="aiStatusText">Powered by Google Gemini</p>
            </div>
        </div>
        <div class="ai-panel-body" id="aiPanelBody"></div>
        <div class="ai-panel-input" id="aiInputBar" style="display:none;">
            <input type="text" id="aiUserInput" placeholder="Ask about this page…" />
            <button id="aiSendBtn">Send</button>
        </div>
    `;
    document.body.appendChild(panel);

    const panelBody = document.getElementById('aiPanelBody');
    const inputBar = document.getElementById('aiInputBar');
    const userInput = document.getElementById('aiUserInput');
    const sendBtn = document.getElementById('aiSendBtn');
    const statusText = document.getElementById('aiStatusText');

    let isOpen = false;
    let conversationHistory = [];
    let isProcessing = false;

    // ===== Toggle =====
    fab.addEventListener('click', () => {
        isOpen = !isOpen;
        fab.classList.toggle('open', isOpen);
        panel.classList.toggle('visible', isOpen);
        if (isOpen && panelBody.children.length === 0) {
            initPanel();
        }
    });

    // ===== Init =====
    function initPanel() {
        // Clear stale model from cache if it's not in the valid list
        const cachedModel = localStorage.getItem(MODEL_STORAGE_KEY);
        if (cachedModel && !GEMINI_MODELS.includes(cachedModel)) {
            localStorage.removeItem(MODEL_STORAGE_KEY);
        }
        const apiKey = localStorage.getItem(STORAGE_KEY);
        if (apiKey) {
            showChat();
            runInitialAnalysis();
        } else {
            showSetup();
        }
    }

    // ===== API Key Setup Screen =====
    function getSelectedModel() {
        return localStorage.getItem(MODEL_STORAGE_KEY) || GEMINI_MODELS[0];
    }

    function showSetup() {
        inputBar.style.display = 'none';
        const modelOptions = GEMINI_MODELS.map(m => `<option value="${m}">${m}</option>`).join('');
        panelBody.innerHTML = `
            <div class="ai-setup">
                <h4>🔑 Connect to Gemini</h4>
                <p>Enter your Google Gemini API key to enable live AI insights.<br>Your key is stored locally in your browser and never sent anywhere except Google's API.</p>
                <input type="password" id="aiKeyInput" placeholder="Paste your Gemini API key…" />
                <label style="display:block;font-size:11px;color:#525252;margin-bottom:4px;text-align:left;">Model (change if you hit rate limits)</label>
                <select id="aiModelSelect" style="width:100%;padding:9px 12px;border:1px solid #E5E5E5;border-radius:8px;font-size:13px;margin-bottom:14px;background:#fff;">
                    ${modelOptions}
                </select>
                <button id="aiSaveKeyBtn">Connect & Analyze</button>
                <br>
                <a class="ai-setup-link" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">
                    Get a free API key from Google AI Studio →
                </a>
            </div>
        `;
        document.getElementById('aiSaveKeyBtn').addEventListener('click', () => {
            const key = document.getElementById('aiKeyInput').value.trim();
            if (!key) return;
            localStorage.setItem(STORAGE_KEY, key);
            localStorage.setItem(MODEL_STORAGE_KEY, document.getElementById('aiModelSelect').value);
            showChat();
            runInitialAnalysis();
        });
    }

    function showChat() {
        panelBody.innerHTML = '';
        inputBar.style.display = 'flex';
        conversationHistory = [];
    }

    // ===== Page Content Scraper =====
    function scrapePageContent() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        const pageTitle = document.querySelector('h1')?.textContent?.trim() || document.title;

        // KPIs
        const kpis = [];
        document.querySelectorAll('.kpi-card, .stat-card, .metric-card').forEach(card => {
            const title = card.querySelector('.kpi-title, .stat-title, .metric-label, h3, h4')?.textContent?.trim();
            const value = card.querySelector('.kpi-value, .stat-value, .metric-value, .value')?.textContent?.trim();
            const change = card.querySelector('.kpi-change, .stat-change, .change')?.textContent?.trim();
            if (title && value) kpis.push(`${title}: ${value}${change ? ' (' + change + ')' : ''}`);
        });

        // Tables
        const tables = [];
        document.querySelectorAll('table').forEach(table => {
            const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
            const rows = [];
            table.querySelectorAll('tbody tr').forEach(tr => {
                const cells = [...tr.querySelectorAll('td')].map(td => td.textContent.trim().replace(/\s+/g, ' '));
                rows.push(cells.join(' | '));
            });
            if (headers.length) tables.push(`Headers: ${headers.join(', ')}\nRows (${rows.length}):\n${rows.slice(0, 8).join('\n')}${rows.length > 8 ? '\n... and ' + (rows.length - 8) + ' more rows' : ''}`);
        });

        // Charts
        const charts = [];
        document.querySelectorAll('canvas').forEach(canvas => {
            const container = canvas.closest('.chart-container, .chart-section, .chart-container-inner, div');
            const title = container?.querySelector('.chart-title, h2, h3')?.textContent?.trim() || canvas.id;
            if (title) charts.push(title);
        });

        // Config sections
        const configs = [];
        document.querySelectorAll('.config-section').forEach(sec => {
            const title = sec.querySelector('.config-title')?.textContent?.trim();
            if (title) configs.push(title);
        });

        // Filter values
        const filters = [];
        document.querySelectorAll('.filter-group').forEach(fg => {
            const label = fg.querySelector('label')?.textContent?.trim();
            const input = fg.querySelector('input, select');
            if (label && input) {
                const val = input.value || input.options?.[input.selectedIndex]?.text;
                filters.push(`${label}: ${val}`);
            }
        });

        // Events (custom events page)
        const eventItems = [];
        document.querySelectorAll('.event-item').forEach(item => {
            eventItems.push(item.getAttribute('data-event'));
        });

        let content = `PAGE: ${pageTitle} (${page})\n`;
        if (filters.length) content += `\nACTIVE FILTERS:\n${filters.join('\n')}\n`;
        if (kpis.length) content += `\nKPI METRICS:\n${kpis.join('\n')}\n`;
        if (charts.length) content += `\nCHARTS ON PAGE:\n${charts.join('\n')}\n`;
        if (tables.length) content += `\nTABLE DATA:\n${tables.join('\n\n')}\n`;
        if (configs.length) content += `\nCONFIGURATION SECTIONS:\n${configs.join('\n')}\n`;
        if (eventItems.length) content += `\nAVAILABLE CUSTOM EVENTS:\n${eventItems.join(', ')}\n`;

        return content;
    }

    // ===== Gemini API Call with Fallback =====
    async function callGeminiWithModel(messages, model) {
        const apiKey = localStorage.getItem(STORAGE_KEY);
        if (!apiKey) { showSetup(); return null; }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const contents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const body = {
            contents: contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024, topP: 0.9 },
            systemInstruction: {
                parts: [{
                    text: `You are "SNAPI AI", an expert analytics assistant embedded inside a Vodafone analytics dashboard called OneDashboard. Your job is to analyze the page content provided to you and give actionable insights.

Rules:
- Be concise but insightful. Use bullet points and bold text for key findings.
- Focus on data patterns, anomalies, recommendations, and potential issues.
- If KPIs show trends (up/down arrows), comment on whether they are healthy or concerning.
- If table data is provided, look for outliers, high error rates, or notable patterns.
- Suggest specific next steps the user can take.
- Use emoji sparingly for visual emphasis (📈 📉 ⚠️ ✅ 💡).
- Keep responses under 300 words.
- You are analyzing a LIVE dashboard, so be specific to the data you see.`
                }]
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.json();
            const errMsg = err.error?.message || `API error (${response.status})`;
            if (response.status === 429) {
                // Extract retry delay from message
                const retryMatch = errMsg.match(/retry in ([\d.]+)s/i);
                const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
                const error = new Error(errMsg);
                error.isRateLimit = true;
                error.retrySeconds = retrySeconds;
                error.model = model;
                throw error;
            }
            if (response.status === 404 || errMsg.includes('is not found')) {
                // Model not found — treat as fallback trigger
                const error = new Error(errMsg);
                error.isModelNotFound = true;
                error.model = model;
                throw error;
            }
            if (response.status === 400 || response.status === 403) {
                throw new Error('Invalid API key. Please check your Gemini API key.');
            }
            throw new Error(errMsg);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    }

    async function callGemini(messages) {
        const preferredModel = getSelectedModel();
        // Build fallback order: preferred model first, then others
        const models = [preferredModel, ...GEMINI_MODELS.filter(m => m !== preferredModel)];

        for (let i = 0; i < models.length; i++) {
            try {
                statusText.textContent = `Using ${models[i]}…`;
                const result = await callGeminiWithModel(messages, models[i]);
                // If a fallback model worked, remember it
                if (i > 0) localStorage.setItem(MODEL_STORAGE_KEY, models[i]);
                return result;
            } catch (err) {
                if ((err.isRateLimit || err.isModelNotFound) && i < models.length - 1) {
                    // Try next model
                    const reason = err.isRateLimit ? 'rate-limited' : 'unavailable';
                    statusText.textContent = `${models[i]} ${reason}, trying ${models[i + 1]}…`;
                    continue;
                }
                throw err; // No more fallbacks or non-recoverable error
            }
        }
    }

    // ===== Chat Functions =====
    function appendMessage(role, text) {
        const div = document.createElement('div');
        div.className = 'ai-msg';
        if (role === 'user') {
            div.innerHTML = `<div class="ai-msg-user">${escapeHtml(text)}</div>`;
        } else {
            div.innerHTML = `<div class="ai-msg-assistant">${formatResponse(text)}</div>`;
        }
        panelBody.appendChild(div);
        panelBody.scrollTop = panelBody.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'ai-msg ai-typing-wrapper';
        div.innerHTML = `<div class="ai-msg-assistant"><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
        panelBody.appendChild(div);
        panelBody.scrollTop = panelBody.scrollHeight;
        return div;
    }

    function removeTyping(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatResponse(text) {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- /gm, '• ')
            .replace(/^• (.+)$/gm, '• $1')
            .replace(/\n/g, '<br>');
    }

    async function runInitialAnalysis() {
        const pageContent = scrapePageContent();
        const typing = showTyping();
        statusText.textContent = 'Analyzing page content…';
        isProcessing = true;
        sendBtn.disabled = true;

        const userMessage = `Analyze the following dashboard page and provide key insights, patterns, and recommendations:\n\n${pageContent}`;
        conversationHistory.push({ role: 'user', content: userMessage });

        try {
            const response = await callGemini(conversationHistory);
            removeTyping(typing);
            conversationHistory.push({ role: 'assistant', content: response });
            appendMessage('assistant', response);
            statusText.textContent = 'Powered by Google Gemini';
        } catch (err) {
            removeTyping(typing);
            handleError(err.message, err);
        } finally {
            isProcessing = false;
            sendBtn.disabled = false;
        }
    }

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text || isProcessing) return;

        userInput.value = '';
        appendMessage('user', text);

        // Include fresh page content for context if it's a new question
        const pageContent = scrapePageContent();
        const contextMessage = `[Current page data for context]\n${pageContent}\n\n[User question]\n${text}`;

        conversationHistory.push({ role: 'user', content: contextMessage });

        const typing = showTyping();
        statusText.textContent = 'Thinking…';
        isProcessing = true;
        sendBtn.disabled = true;

        try {
            const response = await callGemini(conversationHistory);
            removeTyping(typing);
            conversationHistory.push({ role: 'assistant', content: response });
            appendMessage('assistant', response);
            statusText.textContent = 'Powered by Google Gemini';
        } catch (err) {
            removeTyping(typing);
            handleError(err.message);
        } finally {
            isProcessing = false;
            sendBtn.disabled = false;
        }
    }

    let retryTimer = null;

    function handleError(message, error) {
        statusText.textContent = 'Error occurred';
        const div = document.createElement('div');
        div.className = 'ai-msg';

        if (message.includes('Invalid API key') || message.includes('API_KEY')) {
            div.innerHTML = `<div class="ai-error-msg">
                ⚠️ ${message}<br><br>
                <a href="#" id="aiResetKey" style="color:#991B1B;font-weight:600;">Click here to re-enter your API key</a>
            </div>`;
            panelBody.appendChild(div);
            document.getElementById('aiResetKey').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem(STORAGE_KEY);
                showSetup();
            });
        } else if (error && error.isRateLimit) {
            let seconds = error.retrySeconds || 60;
            const retryId = 'aiRetry_' + Date.now();
            const countdownId = 'aiCountdown_' + Date.now();
            const btnId = 'aiRetryBtn_' + Date.now();
            div.innerHTML = `<div class="ai-rate-limit">
                ⏳ <strong>Rate limit reached</strong> on all models.<br>
                The free tier has a per-minute request cap. The API will be available again in:
                <div style="text-align:center;margin:10px 0;"><span class="ai-countdown" id="${countdownId}">${seconds}s</span></div>
                <div style="text-align:center;">
                    <button class="ai-retry-btn" id="${btnId}" disabled>Retrying automatically…</button>
                </div>
                <div style="margin-top:10px;font-size:11px;color:#78350F;">💡 Tip: You can also <a href="#" id="${retryId}" style="color:#E60000;font-weight:600;">switch model or API key</a> to bypass the limit.</div>
            </div>`;
            panelBody.appendChild(div);
            panelBody.scrollTop = panelBody.scrollHeight;

            // Countdown timer
            if (retryTimer) clearInterval(retryTimer);
            retryTimer = setInterval(() => {
                seconds--;
                const el = document.getElementById(countdownId);
                const btn = document.getElementById(btnId);
                if (el) el.textContent = seconds + 's';
                if (seconds <= 0) {
                    clearInterval(retryTimer);
                    retryTimer = null;
                    if (el) el.textContent = 'Ready!';
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = '🔄 Retry Now';
                    }
                    // Auto-retry
                    statusText.textContent = 'Retrying…';
                    if (conversationHistory.length > 0) {
                        div.remove();
                        retryLastMessage();
                    }
                }
            }, 1000);

            // Manual retry button
            setTimeout(() => {
                const btn = document.getElementById(btnId);
                if (btn) btn.addEventListener('click', () => {
                    if (retryTimer) { clearInterval(retryTimer); retryTimer = null; }
                    div.remove();
                    retryLastMessage();
                });
            }, 0);

            // Switch key/model link
            setTimeout(() => {
                const link = document.getElementById(retryId);
                if (link) link.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (retryTimer) { clearInterval(retryTimer); retryTimer = null; }
                    localStorage.removeItem(STORAGE_KEY);
                    showSetup();
                });
            }, 0);
        } else {
            div.innerHTML = `<div class="ai-error-msg">⚠️ ${escapeHtml(message)}</div>`;
            panelBody.appendChild(div);
        }
        panelBody.scrollTop = panelBody.scrollHeight;
    }

    async function retryLastMessage() {
        const typing = showTyping();
        isProcessing = true;
        sendBtn.disabled = true;
        try {
            const response = await callGemini(conversationHistory);
            removeTyping(typing);
            conversationHistory.push({ role: 'assistant', content: response });
            appendMessage('assistant', response);
            statusText.textContent = 'Powered by Google Gemini';
        } catch (err) {
            removeTyping(typing);
            handleError(err.message, err);
        } finally {
            isProcessing = false;
            sendBtn.disabled = false;
        }
    }

    // ===== Event Listeners =====
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

})();
