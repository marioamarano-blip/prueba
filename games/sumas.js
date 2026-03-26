const SumasGame = {
    parent: null,
    currentAnswer: null,
    successMessages: [
        "¡Increíble! ✨",
        "¡Excelente! 👑",
        "¡Muy bien! 🧪",
        "¡Sos una genia! 🌟"
    ],

    start(appInstance) {
        if (!appInstance) return;
        this.parent = appInstance;
        this.startNewChallenge();
    },

    startNewChallenge() {
        this.parent.isLocked = false;
        this.parent.elements.optionsContainer.innerHTML = "";
        this.parent.elements.feedback.textContent = "";
        this.parent.elements.feedback.className = "feedback";

        const n1 = Math.floor(Math.random() * 6) + 1;
        const n2 = Math.floor(Math.random() * 4) + 1;
        this.currentAnswer = n1 + n2;

        this.parent.elements.num1Display.textContent = n1;
        this.parent.elements.num2Display.textContent = n2;

        this.parent.updateCharacterMessage("¿Cuánto da esta suma? ¡Tú puedes!");

        const options = this.generateOptions(this.currentAnswer);
        this.renderOptions(options);
    },

    generateOptions(correct) {
        let options = new Set();
        options.add(correct);
        while (options.size < 3) {
            let distractor = correct + (Math.floor(Math.random() * 5) - 2);
            if (distractor > 0 && distractor !== correct) options.add(distractor);
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    },

    renderOptions(options) {
        options.forEach(value => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = value;
            btn.addEventListener('click', (e) => this.handleSelection(e, value));
            this.parent.elements.optionsContainer.appendChild(btn);
        });
    },

    handleSelection(event, selectedValue) {
        if (this.parent.isLocked || !this.parent) return;

        const isCorrect = selectedValue === this.currentAnswer;
        const clickedBtn = event.currentTarget;

        if (isCorrect) {
            this.parent.isLocked = true;
            clickedBtn.classList.add('correct');
            
            const allButtons = this.parent.elements.optionsContainer.querySelectorAll('.option-btn');
            allButtons.forEach(btn => btn.disabled = true);

            this.checkAnswer(true);
        } else {
            clickedBtn.classList.add('inif (!clickedBtn.classList.contains('incorrect')) {
    clickedBtn.classList.add('incorrect');
}correct');
            clickedBtn.disabled = true;
            this.checkAnswer(false);
        }
    },

    checkAnswer(isCorrect) {
        if (isCorrect) {
            const randomMsg = this.successMessages[Math.floor(Math.random() * this.successMessages.length)];
            this.parent.elements.feedback.textContent = randomMsg;
            this.parent.elements.feedback.className = "feedback success";
            this.parent.updateCharacterMessage("¡Excelente! Eres una gran científica.");
            
            setTimeout(() => this.startNewChallenge(), 1800);
        } else {
            this.parent.elements.feedback.textContent = "¡Casi! Inténtalo de nuevo 💡";
            this.parent.elements.feedback.className = "feedback error";
            this.parent.updateCharacterMessage("¡No te preocupes! Sigue probando.");
        }
    }
};

export default SumasGame;
