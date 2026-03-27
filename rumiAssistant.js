class RumiAssistant {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.queue = [];
        this.isSpeaking = false;

        this.initVoices();
        this.createUI();
    }

    initVoices() {
        const loadVoices = () => {
            const voices = this.synth.getVoices();
            // Buscar voz femenina en español (preferentemente México o España para claridad)
            this.voice = voices.find(v => 
                (v.lang.includes('es') && v.name.toLowerCase().includes('google')) || 
                (v.lang.includes('es') && v.name.toLowerCase().includes('female'))
            ) || voices.find(v => v.lang.includes('es'));
        };

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        loadVoices();
    }

    createUI() {
        // Eliminar si ya existe
        const old = document.querySelector('.rumi-dialog');
        if (old) old.remove();

        this.container = document.createElement('div');
        this.container.className = 'rumi-dialog rumi-hidden'; // Empezamos ocultos
        this.container.innerHTML = `
            <div class="rumi-avatar">🦄</div>
            <div class="rumi-text"></div>
        `;
        document.body.appendChild(this.container);
        this.textEl = this.container.querySelector('.rumi-text');
    }

    speak(text) {
        if (!text) return;
        this.queue.push(text);
        if (!this.isSpeaking) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length === 0) {
            // Ocultar después de un momento de silencio
            setTimeout(() => {
                if (!this.isSpeaking) this.container.classList.add('rumi-hidden');
            }, 3000);
            return;
        }

        const text = this.queue.shift();
        this.isSpeaking = true;

        this.updateUI(text);

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "es-ES"; 
        utter.rate = 0.9;
        utter.pitch = 1.2;
        utter.voice = this.voice;

        utter.onstart = () => {
            this.container.classList.remove('rumi-hidden');
        };

        utter.onend = () => {
            this.isSpeaking = false;
            this.processQueue();
        };

        this.synth.cancel(); 
        this.synth.speak(utter);
    }

    updateUI(text, type = '') {
        this.textEl.textContent = text;
        this.container.classList.remove('rumi-celebrate', 'rumi-encourage');
        if (type) {
            this.container.classList.add(type);
        }
    }

    celebrate(text = "¡Excelente Juana! 🎉") {
        this.updateUI(text, 'rumi-celebrate');
        this.speak(text);
    }

    encourage(text = "¡El error es parte de la ciencia! 🔬 Intentemos de nuevo") {
        this.updateUI(text, 'rumi-encourage');
        this.speak(text);
    }
}
