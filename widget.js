// Chat Widget Script
(function () {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #f8f9fa);
            --chat--color-surface: var(--n8n-chat-surface-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #1d1d1f);
            --chat--color-subtitle: var(--n8n-chat-subtitle-color, #86868b);
            --chat--color-border: var(--n8n-chat-border-color, #e5e5e7);
            --chat--color-header-bg: var(--n8n-chat-header-bg-color, #1e3c72);
            --chat--color-header-text: var(--n8n-chat-header-text-color, #ffffff);
            --chat--color-bot-message-bg: var(--n8n-chat-bot-message-bg-color, #ffffff);
            --chat--color-toggle-bg: var(--n8n-chat-toggle-bg-color, #ffffff);
            --chat--color-toggle-icon: var(--n8n-chat-toggle-icon-color, #854fff);
            --chat--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
            --chat--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
            --chat--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: var(--chat--shadow-lg), 0 0 0 1px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            font-family: inherit;
            border: 1px solid var(--chat--color-border);
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 24px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid var(--chat--color-border);
            position: relative;
            background: var(--chat--color-header-bg) !important;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-subtitle);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            font-size: 18px;
            opacity: 0.7;
            border-radius: 6px;
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
            background: rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .brand-header img {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            object-fit: cover;
            background: transparent;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 16px;
            font-weight: 600;
            color: var(--chat--color-header-text);
        }

        .n8n-chat-widget .chat-interface {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .n8n-chat-widget .chat-messages::-webkit-scrollbar {
            width: 4px;
        }

        .n8n-chat-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .n8n-chat-widget .chat-messages::-webkit-scrollbar-thumb {
            background: var(--chat--color-border);
            border-radius: 2px;
        }

        .n8n-chat-widget .chat-message {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin: 0;
            max-width: 85%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
            transition: all 0.2s ease;
            animation: messageSlideIn 0.3s ease-out;
        }

        .n8n-chat-widget .chat-message.user {
            align-self: flex-end;
            flex-direction: row-reverse;
        }

        .n8n-chat-widget .chat-message.bot {
            align-self: flex-start;
        }

        .n8n-chat-widget .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 16px;
            flex-shrink: 0;
            background: var(--chat--color-primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
        }

        .n8n-chat-widget .message-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        .n8n-chat-widget .message-content {
            padding: 12px 16px;
            border-radius: 16px;
            max-width: calc(100% - 40px);
            word-wrap: break-word;
        }

        .n8n-chat-widget .chat-message.user .message-content {
            background: var(--chat--color-primary);
            color: white;
            border-bottom-right-radius: 4px;
            box-shadow: var(--chat--shadow-sm);
        }

        .n8n-chat-widget .chat-message.bot .message-content {
            background: var(--chat--color-bot-message-bg);
            border: 1px solid var(--chat--color-border);
            color: var(--chat--color-font);
            border-bottom-left-radius: 4px;
            box-shadow: var(--chat--shadow-sm);
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-surface);
            border-top: 1px solid var(--chat--color-border);
            display: flex;
            gap: 8px;
            align-items: flex-end;
        }

        .n8n-chat-widget .input-actions {
            display: flex;
            gap: 6px;
            align-items: center;
        }

        .n8n-chat-widget .input-button {
            width: 36px;
            height: 36px;
            border: 1px solid var(--chat--color-border);
            background: var(--chat--color-surface);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: var(--chat--color-font) !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .n8n-chat-widget .input-button.emoji-button {
            background: transparent;
            border-color: var(--chat--color-border);
            color: var(--chat--color-font) !important;
            padding: 0;
            position: relative;
            min-width: 40px;
            min-height: 40px;
        }

        .n8n-chat-widget .input-button.emoji-button::after {
            content: '🙂';
            position: absolute;
            right: 6px;
            bottom: 6px;
            font-size: 12px;
            line-height: 1;
            pointer-events: none;
            opacity: 0.95;
        }

        .n8n-chat-widget .input-button.emoji-button:hover::after {
            transform: scale(1.2);
            transition: transform 120ms ease;
        }

        .n8n-chat-widget .input-button.emoji-button:hover {
            background: rgba(0,0,0,0.04);
            transform: translateY(-1px);
        }

        .n8n-chat-widget .input-button.emoji-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }

        .n8n-chat-widget .input-button svg {
            width: 18px;
            height: 18px;
            fill: currentColor !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        .n8n-chat-widget .emoji-picker {
            position: absolute;
            bottom: 80px;
            right: 20px;
            background: var(--chat--color-surface);
            border: 1px solid var(--chat--color-border);
            border-radius: 12px;
            padding: 16px;
            box-shadow: var(--chat--shadow-lg);
            display: none;
            z-index: 1001;
            max-width: 320px;
            max-height: 300px;
            overflow-y: auto;
        }

        .n8n-chat-widget .emoji-picker.active {
            display: block;
        }

        .n8n-chat-widget .emoji-grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 4px;
        }

        .n8n-chat-widget .emoji-item {
            width: 32px;
            height: 32px;
            border: none;
            background: none;
            cursor: pointer;
            border-radius: 4px;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
        }

        .n8n-chat-widget .emoji-item:hover {
            background: var(--chat--color-background);
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid var(--chat--color-border);
            border-radius: 8px;
            background: var(--chat--color-surface);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.4;
            transition: all 0.2s ease;
            min-height: 20px;
            max-height: 120px;
        }

        .n8n-chat-widget .chat-input textarea:focus {
            outline: none;
            border-color: var(--chat--color-primary);
            box-shadow: 0 0 0 3px rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-subtitle);
            opacity: 0.7;
        }

        .n8n-chat-widget .chat-input button {
            background: var(--chat--color-primary);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
            font-weight: 500;
            font-size: 14px;
            box-shadow: var(--chat--shadow-sm);
            white-space: nowrap;
        }

        .n8n-chat-widget .chat-input button:hover {
            background: var(--chat--color-secondary);
            transform: translateY(-1px);
            box-shadow: var(--chat--shadow-md);
        }

        .n8n-chat-widget .chat-input button:active {
            transform: translateY(0);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
            border-radius: 28px;
            background: var(--chat--color-toggle-bg);
            color: var(--chat--color-toggle-icon);
            border: none;
            cursor: pointer;
            box-shadow: var(--chat--shadow-lg), 0 0 0 1px rgba(255, 255, 255, 0.2);
            z-index: 999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 24px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
            box-shadow: var(--chat--shadow-lg), 0 0 0 1px rgba(255, 255, 255, 0.3);
        }

        .n8n-chat-widget .chat-toggle:active {
            transform: scale(0.95);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .typing-indicator {
            display: none;
            align-items: center;
            padding: 8px 16px;
            margin: 0;
            border-radius: 16px;
            background: var(--chat--color-surface);
            border: 1px solid var(--chat--color-border);
            color: var(--chat--color-subtitle);
            align-self: flex-start;
            font-size: 12px;
            gap: 8px;
            box-shadow: var(--chat--shadow-sm);
        }

        .n8n-chat-widget .typing-indicator.active {
            display: flex;
        }

        .n8n-chat-widget .typing-dots {
            display: flex;
            gap: 4px;
        }

        .n8n-chat-widget .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--chat--color-subtitle);
            animation: typing 1.4s infinite;
        }

        .n8n-chat-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .n8n-chat-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.4;
            }
            30% {
                transform: translateY(-4px);
                opacity: 1;
            }
        }

        @keyframes messageSlideIn {
            0% {
                opacity: 0;
                transform: translateY(8px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px 16px;
            text-align: center;
            background: var(--chat--color-surface);
            border-top: 1px solid var(--chat--color-border);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-subtitle);
            text-decoration: none;
            font-size: 11px;
            opacity: 0.6;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        @media (max-width: 480px) {
            .n8n-chat-widget .chat-container {
                width: calc(100vw - 32px);
                height: calc(100vh - 120px);
                bottom: 16px;
                right: 16px;
                left: 16px;
                border-radius: 8px;
            }

            .n8n-chat-widget .chat-toggle {
                width: 48px;
                height: 48px;
                bottom: 16px;
                right: 16px;
            }

            .n8n-chat-widget .chat-toggle.position-left {
                right: auto;
                left: 16px;
            }
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            agentPhoto: '',
            name: 'Customer Service',
            welcomeText: 'Hi 👋, how can we help?',
            responseTimeText: 'We typically respond right away',
            poweredBy: {
                text: 'Powered by DahoAI',
                link: 'https://etugrand.com'
            }
        },
        style: {
            primaryColor: '#854fff',
            secondaryColor: '#6b3fd4',
            position: 'right',
            backgroundColor: '#f8f9fa',
            surfaceColor: '#ffffff',
            botMessageBgColor: '#ffffff',
            toggleBgColor: '#ffffff',
            toggleIconColor: '#854fff',
            fontColor: '#1d1d1f',
            subtitleColor: '#86868b',
            borderColor: '#e5e5e7',
            headerBgColor: '#1e3c72'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ?
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let isProcessing = false;

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    // Helper function to determine if a color is light or dark
    function isLightColor(color) {
        // Remove # if present
        color = color.replace('#', '');

        // Convert to RGB
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5;
    }

    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-surface-color', config.style.surfaceColor || '#ffffff');
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);
    widgetContainer.style.setProperty('--n8n-chat-subtitle-color', config.style.subtitleColor || '#86868b');
    widgetContainer.style.setProperty('--n8n-chat-border-color', config.style.borderColor || '#e5e5e7');
    widgetContainer.style.setProperty('--n8n-chat-header-bg-color', config.style.headerBgColor || '#1e3c72');
    widgetContainer.style.setProperty('--n8n-chat-bot-message-bg-color', config.style.botMessageBgColor || config.style.surfaceColor || '#ffffff');
    widgetContainer.style.setProperty('--n8n-chat-toggle-bg-color', config.style.toggleBgColor || config.style.surfaceColor || '#ffffff');
    widgetContainer.style.setProperty('--n8n-chat-toggle-icon-color', config.style.toggleIconColor || config.style.primaryColor || '#854fff');

    // Set header text color based on header background brightness
    const headerBgColor = config.style.headerBgColor || '#1e3c72';
    const headerTextColor = isLightColor(headerBgColor) ? '#333333' : '#ffffff';
    widgetContainer.style.setProperty('--n8n-chat-header-text-color', headerTextColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="typing-indicator">
                <span>Agent is typing</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
            <div class="chat-input">
                <div class="input-actions">
                    <button class="input-button emoji-button" title="Add emoji">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 4.5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-5c-.83 0-1.5.67-1.5 1.5z"/>
                        </svg>
                    </button>
                </div>
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="emoji-picker">
                <div class="emoji-grid"></div>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;

    chatContainer.innerHTML = chatInterfaceHTML;

    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;

    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const typingIndicator = chatContainer.querySelector('.typing-indicator');
    const emojiButton = chatContainer.querySelector('.emoji-button');
    const emojiPicker = chatContainer.querySelector('.emoji-picker');
    const emojiGrid = chatContainer.querySelector('.emoji-grid');

    function generateUUID() {
        return crypto.randomUUID();
    }

    // Common emojis for the picker
    const commonEmojis = [
        '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗',
        '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞',
        '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',
        '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑',
        '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮',
        '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽',
        '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋', '🤚', '🖐', '✋',
        '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
        '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾',
        '🦵', '🦿', '🦶', '👣', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'
    ];

    // Initialize emoji picker
    function initializeEmojiPicker() {
        emojiGrid.innerHTML = '';
        commonEmojis.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'emoji-item';
            button.textContent = emoji;
            button.addEventListener('click', () => {
                insertEmoji(emoji);
                emojiPicker.classList.remove('active');
            });
            emojiGrid.appendChild(button);
        });
    }

    function insertEmoji(emoji) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        textarea.value = text.substring(0, start) + emoji + text.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
        textarea.dispatchEvent(new Event('input'));
    }

    function showTypingIndicator() {
        typingIndicator.classList.add('active');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.classList.remove('active');
    }

    function initializeChat() {
        currentSessionId = generateUUID();
        startNewConversation();
    }

    async function startNewConversation() {
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        try {
            showTypingIndicator();
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            hideTypingIndicator();

            const botMessageText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            createBotMessage(botMessageText);
        } catch (error) {
            hideTypingIndicator();
            console.error('Error:', error);
            createBotMessage("Hello! I'm your customer service assistant. How can I help you today?");
        }
    }

    async function sendMessage(message) {
        if (isProcessing) return;
        isProcessing = true;

        createUserMessage(message);
        showTypingIndicator();

        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            const data = await response.json();
            hideTypingIndicator();

            const botMessageText = Array.isArray(data) ? data[0].output : data.output;
            createBotMessage(botMessageText);
        } catch (error) {
            hideTypingIndicator();
            console.error('Error:', error);
            createBotMessage("I'm sorry, but I'm having trouble connecting to the service right now. Please try again later.");
        } finally {
            isProcessing = false;
        }
    }

    function createBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        if (config.branding.agentPhoto) {
            avatarDiv.innerHTML = `<img src="${config.branding.agentPhoto}" alt="${config.branding.name}">`;
        } else if (config.branding.logo) {
            avatarDiv.innerHTML = `<img src="${config.branding.logo}" alt="${config.branding.name}">`;
        } else {
            avatarDiv.textContent = config.branding.name.charAt(0).toUpperCase();
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function createUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = 'U';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message && !isProcessing) {
            sendMessage(message);
            textarea.value = '';
        }
    });

    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message && !isProcessing) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });

    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
        if (chatContainer.classList.contains('open') && !currentSessionId) {
            initializeChat();
        }
    });

    // Emoji picker functionality
    emojiButton.addEventListener('click', () => {
        emojiPicker.classList.toggle('active');
    });

    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!emojiPicker.contains(e.target) && !emojiButton.contains(e.target)) {
            emojiPicker.classList.remove('active');
        }
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });

    // Auto-resize textarea
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Initialize emoji picker
    initializeEmojiPicker();
})();
