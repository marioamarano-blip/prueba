/**
 * Princess Math Lab - UX Optimized v3.0
 */

const App = {
    currentAnswer: null,
    isLocked: false, // Mejora F: Flag para evitar múltiples clicks

    // Mejora H: Mensajes dinámicos de éxito
    successMessages: [
        "¡Increíble! ✨",
        "¡Excelente! 👑",
        "¡Muy bien! 🧪",
        "¡Sos una genia! 🌟"
    ],

    elements: {
        homeScreen: document.getElementById('home-screen'),
        gameScreen: document.getElementById('game-screen'),
        btnPlay: document.getElementById('btn-play'),
        btnBack: document.getElementById('btn-back'),
        num1Display: document.getElementById('num1'),
        num2Display: document.getElementById('num2'),
        feedback: document.getElementById('feedback-msg'),
        characterMsg: document.getElementById('character-msg'),
        optionsContainer: document.getElementById('options-container')
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        this.elements.btnPlay.addEventListener('click', () => this.switchScreen('game'));
        this.elements.btnBack.addEventListener('click', () => this.switchScreen('home'));
    },

    switchScreen(screenName) {
        if (screenName === 'game') {
            this.elements.homeScreen.classList.remove('active');
            this.elements.gameScreen.classList.add('active');
            this.startNewChallenge();
        } else {
            this.elements.gameScreen.classList.remove('active');
            this.elements.homeScreen.classList.add('active');
        }
    },

    startNewChallenge() {
        // Mejora G: Limpieza profunda de estados
        this.isLocked = false; 
        this.elements.optionsContainer.innerHTML = "";
        this.elements.feedback.textContent = "";
        this.elements.feedback.className = "feedback";

        const n1 = Math.floor(Math.random() * 6) + 1; 
        const n2 = Math.floor(Math.random() * 4) + 1;
        this.currentAnswer = n1 + n2;
        
        this.elements.num1Display.textContent = n1;
        this.elements.num2Display.textContent = n2;
        
        this.updateCharacterMessage("¿Cuánto da esta suma? ¡Tú puedes!");

        const options = this.generateOptions(this.currentAnswer);
        this.renderOptions(options);
    },

    generateOptions(correct) {
        let options = new Set();
        options.add(correct);
        while(options.size < 3) {
            let distractor = correct + (Math.floor(Math.random() * 5) - 2);
            if(distractor > 0 && distractor !== correct) options.add(distractor);
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    },

    renderOptions(options) {
        options.forEach(value => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = value;
            btn.addEventListener('click', (e) => this.handleSelection(e, value));
            this.elements.optionsContainer.appendChild(btn);
        });
    },

    handleSelection(event, selectedValue) {
        // Mejora F: Evitar procesos si el juego está bloqueado por éxito
        if (this.isLocked) return;

        const isCorrect = selectedValue === this.currentAnswer;
        const clickedBtn = event.currentTarget;

        if (isCorrect) {
            this.isLocked = true; // Bloquear para evitar spam de clicks en éxito
            clickedBtn.classList.add('correct');
            
            // Deshabilitar todos solo en caso de éxito
            const allButtons = this.elements.optionsContainer.querySelectorAll('.option-btn');
            allButtons.forEach(btn => btn.disabled = true);

            this.checkAnswer(true);
        } else {
            // Mejora D: Marcar incorrecto sin revelar la respuesta (fomenta el reintento)
            clickedBtn.classList.add('incorrect');
            clickedBtn.disabled = true; // Deshabilitar solo el botón fallido
            this.checkAnswer(false);
        }
    },

    checkAnswer(isCorrect) {
        if (isCorrect) {
            // Mejora H: Usar mensaje aleatorio
            const randomMsg = this.successMessages[Math.floor(Math.random() * this.successMessages.length)];
            this.elements.feedback.textContent = randomMsg;
            this.elements.feedback.className = "feedback success";
            this.updateCharacterMessage("¡Excelente! Eres una gran científica.");
            
            // Mejora B: Mantener reinicio automático tras éxito
            setTimeout(() => this.startNewChallenge(), 1800);
        } else {
            // Mejora E: Feedback educativo y amigable
            this.elements.feedback.textContent = "¡Casi! Inténtalo de nuevo 💡";
            this.elements.feedback.className = "feedback error";
            this.updateCharacterMessage("¡No te preocupes! Sigue probando.");
            
            // Mejora A: Se eliminó el setTimeout de reinicio automático en error
        }
    },

    updateCharacterMessage(msg) {
        this.elements.characterMsg.textContent = msg;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
