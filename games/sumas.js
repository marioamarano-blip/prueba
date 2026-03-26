/**
 * Módulo: SumasGame
 * Encargado de la lógica matemática y feedback del laboratorio.
 */
const SumasGame = {
    parent: null,
    currentAnswer: null,
    
    // Mensajes aleatorios para mantener el interés
    successMessages: [
        "¡Increíble! ✨",
        "¡Excelente! 👑",
        "¡Muy bien! 🧪",
        "¡Sos una genia! 🌟",
        "¡Misión cumplida! 🚀"
    ],

    start(appInstance) {
        if (!appInstance) return;
        this.parent = appInstance;
        this.startNewChallenge();
    },

    startNewChallenge() {
        // 1. Resetear estado visual y bloqueos
        this.parent.isLocked = false;
        this.parent.elements.optionsContainer.innerHTML = "";
        
        // Limpiamos feedback (asumiendo que existen en el DOM)
        const feedback = document.getElementById('feedback-msg');
        if (feedback) {
            feedback.textContent = "";
            feedback.className = "feedback";
        }

        // 2. Generar lógica matemática (Nivel 6 años: sumas hasta 10)
        const n1 = Math.floor(Math.random() * 6) + 1; // 1 a 6
        const n2 = Math.floor(Math.random() * 4) + 1; // 1 a 4
        this.currentAnswer = n1 + n2;

        // Actualizar visualización
        document.getElementById('num1').textContent = n1;
        document.getElementById('num2').textContent = n2;

        this.parent.updateCharacterMessage("¿Cuánto da esta suma? ¡Tú puedes, ingeniera!");

        // 3. Preparar opciones
        const options = this.generateOptions(this.currentAnswer);
        this.renderOptions(options);
    },

    generateOptions(correct) {
        let options = new Set();
        options.add(correct);

        while (options.size < 3) {
            // Genera distractores cercanos pero no negativos
            let offset = Math.floor(Math.random() * 3) + 1;
            let distractor = Math.random() > 0.5 ? correct + offset : correct - offset;
            
            if (distractor > 0 && distractor !== correct) {
                options.add(distractor);
            }
        }
        // Mezclar array
        return Array.from(options).sort(() => Math.random() - 0.5);
    },

    renderOptions(options) {
        options.forEach(value => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = value;
            
            // Usamos una función anónima para pasar el valor
            btn.onclick = (e) => this.handleSelection(e, value);
            
            this.parent.elements.optionsContainer.appendChild(btn);
        });
    },

    handleSelection(event, selectedValue) {
        if (this.parent.isLocked) return;

        const isCorrect = selectedValue === this.currentAnswer;
        const clickedBtn = event.currentTarget;
        const feedback = document.getElementById('feedback-msg');

        if (isCorrect) {
            this.parent.isLocked = true; // Bloquea clics extra
            clickedBtn.classList.add('correct');
            
            // Deshabilitar el resto
            const allButtons = this.parent.elements.optionsContainer.querySelectorAll('.option-btn');
            allButtons.forEach(btn => btn.disabled = true);

            this.showFeedback(true, feedback);
        } else {
            // Si es incorrecto, marcamos el botón pero dejamos que siga intentando
            clickedBtn.classList.add('incorrect');
            clickedBtn.disabled = true;
            this.showFeedback(false, feedback);
        }
    },

    showFeedback(isCorrect, feedbackElement) {
        if (isCorrect) {
            const msg = this.successMessages[Math.floor(Math.random() * this.successMessages.length)];
            
            if (feedbackElement) {
                feedbackElement.textContent = msg;
                feedbackElement.className = "feedback success";
            }
            
            this.parent.updateCharacterMessage("¡Fabuloso! El cálculo es perfecto. ✨");
            
            // Tiempo para celebrar antes del siguiente desafío
            setTimeout(() => this.startNewChallenge(), 2000);
        } else {
            if (feedbackElement) {
                feedbackElement.textContent = "¡Casi! Inténtalo otra vez 💡";
                feedbackElement.className = "feedback error";
            }
            this.parent.updateCharacterMessage("No pasa nada, ¡el error es parte de la ciencia!");
        }
    }
};

export default SumasGame;
