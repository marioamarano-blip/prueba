const SumasGame = {
    parent: null,
    currentAnswer: null,
    
    start(appInstance) {
        this.parent = appInstance;
        this.startNewChallenge();
    },

    startNewChallenge() {
        this.parent.isLocked = false;
        this.parent.elements.optionsContainer.innerHTML = "";
        document.getElementById('feedback-msg').textContent = "";
        document.getElementById('answer-slot').textContent = "?";

        // Generar suma (Max 10 para nivel inicial)
        const n1 = Math.floor(Math.random() * 6) + 1;
        const n2 = Math.floor(Math.random() * 4) + 1;
        this.currentAnswer = n1 + n2;

        document.getElementById('num1').textContent = n1;
        document.getElementById('num2').textContent = n2;

        this.parent.updateCharacterMessage("¿Cuánto da esta suma? ¡Tú puedes, ingeniera!");

        const options = this.generateOptions(this.currentAnswer);
        this.renderOptions(options);
    },

    generateOptions(correct) {
        let options = new Set([correct]);
        while (options.size < 3) {
            let dist = correct + (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
            if (dist > 0 && dist !== correct) options.add(dist);
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    },

    renderOptions(options) {
        options.forEach(val => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = val;
            btn.onclick = (e) => this.handleSelection(e, val);
            this.parent.elements.optionsContainer.appendChild(btn);
        });
    },

    handleSelection(e, val) {
        if (this.parent.isLocked) return;
        const isCorrect = val === this.currentAnswer;
        const feedback = document.getElementById('feedback-msg');

        if (isCorrect) {
            this.parent.isLocked = true;
            e.target.classList.add('correct');
            document.getElementById('answer-slot').textContent = val;
            feedback.textContent = "¡Excelente! 🌟";
            feedback.className = "feedback success";
            this.parent.updateCharacterMessage("¡Fabuloso! El cálculo es perfecto.");
            setTimeout(() => this.startNewChallenge(), 2000);
        } else {
            e.target.classList.add('incorrect');
            e.target.disabled = true;
            feedback.textContent = "¡Casi! Inténtalo otra vez 💡";
            feedback.className = "feedback error";
        }
    }
};

export default SumasGame;
