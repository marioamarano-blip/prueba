/**
 * SumasGame — Matemática con 3 niveles de dificultad
 * Nivel 1: sumas hasta 10
 * Nivel 2: sumas hasta 20
 * Nivel 3: sumas hasta 30 con restas
 */
const SumasGame = {
    app: null,
    currentAnswer: null,
    level: 1,
    correctStreak: 0,  // aciertos seguidos para subir de nivel
    STREAK_TO_LEVEL_UP: 5,

    levelConfig: {
        1: { n1max: 6,  n2max: 4,  op: '+', label: 'Nivel 1 ⭐',   hint: '¡Suma hasta 10!' },
        2: { n1max: 12, n2max: 8,  op: '+', label: 'Nivel 2 ⭐⭐',  hint: '¡Suma hasta 20!' },
        3: { n1max: 20, n2max: 10, op: '±', label: 'Nivel 3 ⭐⭐⭐', hint: '¡Suma y resta!' },
    },

    successMessages: [
        "¡Increíble! ✨", "¡Excelente! 👑", "¡Muy bien! 🧪",
        "¡Sos una genia! 🌟", "¡Misión cumplida! 🚀", "¡Perfecto! 💜",
    ],

    start(appInstance) {
        this.app = appInstance;
        this.level = 1;
        this.correctStreak = 0;
        this.updateLevelUI();
        this.newChallenge();
    },

    stop() {
        // cleanup if needed
    },

    updateLevelUI() {
        const cfg = this.levelConfig[this.level];
        const levelText = document.getElementById('sumas-level-text');
        if (levelText) levelText.textContent = cfg.label;

        const badge = document.getElementById('sumas-level-badge');
        if (badge) badge.textContent = `Nivel ${this.level}`;

        // progress bar shows streak progress toward next level
        const fill = document.getElementById('sumas-progress');
        if (fill) {
            const pct = this.level >= 3 ? 100 : (this.correctStreak / this.STREAK_TO_LEVEL_UP) * 100;
            fill.style.width = pct + '%';
        }
    },

    newChallenge() {
        this.app.isLocked = false;

        const optionsEl = document.getElementById('sumas-options');
        const feedbackEl = document.getElementById('sumas-feedback');
        if (optionsEl)  optionsEl.innerHTML = '';
        if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.className = 'feedback'; }

        const cfg = this.levelConfig[this.level];

        let n1 = Math.floor(Math.random() * cfg.n1max) + 1;
        let n2 = Math.floor(Math.random() * cfg.n2max) + 1;
        let op = '+';

        // Nivel 3: a veces resta, asegurando resultado positivo
        if (cfg.op === '±' && Math.random() > 0.5) {
            op = '-';
            if (n1 < n2) [n1, n2] = [n2, n1]; // swap so result >= 0
        }

        this.currentAnswer = op === '+' ? n1 + n2 : n1 - n2;
        this.currentOp = op;

        // Update DOM
        document.getElementById('num1').textContent = n1;
        document.getElementById('num2').textContent = n2;

        // Show operator in display
        const opEl = document.querySelector('#sumas-screen .op');
        if (opEl) opEl.textContent = op;

        const hint = cfg.hint;
        this.app.updateCharacterMessage('sumas', `${hint} ¿Cuánto da? 🧮`);

        const options = this.generateOptions(this.currentAnswer);
        this.renderOptions(options);
    },

    generateOptions(correct) {
        const set = new Set([correct]);
        let tries = 0;
        while (set.size < 3 && tries < 50) {
            tries++;
            const offset = Math.floor(Math.random() * 4) + 1;
            const d = Math.random() > 0.5 ? correct + offset : correct - offset;
            if (d >= 0 && d !== correct) set.add(d);
        }
        return Array.from(set).sort(() => Math.random() - 0.5);
    },

    renderOptions(options) {
        const container = document.getElementById('sumas-options');
        options.forEach(val => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = val;
            btn.onclick = (e) => this.handleAnswer(e, val);
            container.appendChild(btn);
        });
    },

    handleAnswer(e, selected) {
        if (this.app.isLocked) return;
        const btn = e.currentTarget;
        const feedbackEl = document.getElementById('sumas-feedback');

        if (selected === this.currentAnswer) {
            this.app.isLocked = true;
            btn.classList.add('correct');
            document.querySelectorAll('#sumas-options .option-btn').forEach(b => b.disabled = true);

            this.correctStreak++;
            this.app.addStar('sumas');

            // Level up?
            if (this.correctStreak >= this.STREAK_TO_LEVEL_UP && this.level < 3) {
                this.level++;
                this.correctStreak = 0;
                this.app.updateCharacterMessage('sumas', `¡Subiste al ${this.levelConfig[this.level].label}! 🎉`);
                if (feedbackEl) { feedbackEl.textContent = '🎉 ¡Nuevo nivel!'; feedbackEl.className = 'feedback success'; }
                this.updateLevelUI();
                setTimeout(() => this.newChallenge(), 2200);
            } else {
                const msg = this.successMessages[Math.floor(Math.random() * this.successMessages.length)];
                if (feedbackEl) { feedbackEl.textContent = msg; feedbackEl.className = 'feedback success'; }
                this.app.updateCharacterMessage('sumas', '¡Fabuloso! El cálculo es perfecto. ✨');
                this.updateLevelUI();
                setTimeout(() => this.newChallenge(), 1800);
            }
        } else {
            this.correctStreak = Math.max(0, this.correctStreak - 1);
            btn.classList.add('incorrect');
            btn.disabled = true;
            if (feedbackEl) { feedbackEl.textContent = '¡Casi! Inténtalo otra vez 💡'; feedbackEl.className = 'feedback error'; }
            this.app.updateCharacterMessage('sumas', '¡El error es parte de la ciencia! 🔬');
            this.updateLevelUI();
        }
    },
};

export default SumasGame;
