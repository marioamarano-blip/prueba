/**
 * PoleasGame — Aprende sobre poleas levantando objetos mágicos 🪝
 *
 * Mecánica:
 *  - Se muestra una escena animada con poleas, cuerdas y un objeto.
 *  - Se pregunta: con N poleas, ¿la carga se hace más fácil o más difícil?
 *  - O: ¿cuántas poleas necesitas para levantar este objeto pesado?
 */
const PoleasGame = {
    app: null,
    canvas: null,
    ctx: null,
    animFrame: null,
    currentCorrect: null,
    ropeOffset: 0,
    isLifting: false,
    liftProgress: 0,
    questions: [],
    qIndex: 0,

    start(appInstance) {
        this.app = appInstance;
        this.canvas = document.getElementById('poleas-canvas');
        this.ctx    = this.canvas ? this.canvas.getContext('2d') : null;
        this.ropeOffset = 0;
        this.isLifting = false;
        this.liftProgress = 0;
        this.buildQuestions();
        this.qIndex = 0;
        this.newChallenge();
    },

    stop() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.animFrame = null;
    },

    buildQuestions() {
        this.questions = [
            {
                pulleys: 1,
                weight: '🦄',
                weightLabel: 'unicornio',
                question: '¿Cuántas poleas hay en la escena?',
                options: ['1 polea', '2 poleas', '3 poleas'],
                correct: '1 polea',
                explanation: '¡Con 1 polea puedes cambiar la dirección de la fuerza! 💪',
            },
            {
                pulleys: 2,
                weight: '🧸',
                weightLabel: 'osito',
                question: 'Con 2 poleas, el esfuerzo para levantar el osito es…',
                options: ['¡Más fácil!', 'Igual', 'Más difícil'],
                correct: '¡Más fácil!',
                explanation: '¡Más poleas = menos fuerza necesaria! 🎉',
            },
            {
                pulleys: 3,
                weight: '🪨',
                weightLabel: 'piedra',
                question: '¿Qué necesitas para levantar una piedra pesada?',
                options: ['Muchas poleas', '1 polea', 'Sin poleas'],
                correct: 'Muchas poleas',
                explanation: '¡Las poleas multiplican tu fuerza! 🏋️',
            },
            {
                pulleys: 1,
                weight: '🌙',
                weightLabel: 'luna',
                question: 'La polea cambia la dirección de…',
                options: ['La fuerza', 'El color', 'El tamaño'],
                correct: 'La fuerza',
                explanation: '¡La polea cambia hacia dónde empujas o jalas! ✨',
            },
            {
                pulleys: 2,
                weight: '⭐',
                weightLabel: 'estrella',
                question: '¿Cuántas poleas tiene esta máquina?',
                options: ['2 poleas', '1 polea', '4 poleas'],
                correct: '2 poleas',
                explanation: '¡Contaste bien! 2 poleas trabajan juntas 🤝',
            },
        ];
        // shuffle
        this.questions.sort(() => Math.random() - 0.5);
    },

    newChallenge() {
        this.app.isLocked = false;
        this.isLifting = false;
        this.liftProgress = 0;

        if (this.qIndex >= this.questions.length) {
            this.qIndex = 0;
            this.questions.sort(() => Math.random() - 0.5);
        }

        const q = this.questions[this.qIndex];
        this.currentCorrect = q.correct;

        const feedbackEl = document.getElementById('poleas-feedback');
        const questionEl = document.getElementById('poleas-question');
        const optionsEl  = document.getElementById('poleas-options');

        if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.className = 'feedback'; }
        if (questionEl) questionEl.textContent = q.question;
        if (optionsEl)  optionsEl.innerHTML = '';

        this.app.updateCharacterMessage('poleas', '¡Observa la máquina y responde! 🪝');

        // Render options
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn text-option';
            btn.textContent = opt;
            btn.onclick = (e) => this.handleAnswer(e, opt, q.explanation);
            optionsEl.appendChild(btn);
        });

        this.drawScene(q);
        this.animate(q);
    },

    drawScene(q) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        ctx.clearRect(0, 0, W, H);

        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#f0f4ff');
        grad.addColorStop(1, '#fdf4ff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Ceiling beam
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.roundRect(20, 10, W - 40, 18, 6);
        ctx.fill();

        // Draw pulleys and ropes based on count
        const numPulleys = q.pulleys;
        const pulleyY = 50;
        const pulleyRadius = 22;
        const objectY = H - 60 - this.liftProgress * 120;

        if (numPulleys === 1) {
            this.drawPulley(ctx, W / 2, pulleyY, pulleyRadius, this.ropeOffset);
            // Rope down left
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.moveTo(W / 2 - 12, pulleyY + pulleyRadius);
            ctx.lineTo(W / 2 - 12, objectY);
            ctx.stroke();
            // Rope up right (pull side)
            ctx.beginPath();
            ctx.moveTo(W / 2 + 12, pulleyY + pulleyRadius);
            ctx.lineTo(W / 2 + 12, H - 20);
            ctx.stroke();
            ctx.setLineDash([]);

        } else if (numPulleys === 2) {
            this.drawPulley(ctx, W * 0.35, pulleyY, pulleyRadius, this.ropeOffset);
            this.drawPulley(ctx, W * 0.65, pulleyY, pulleyRadius, this.ropeOffset);
            // Ropes
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.moveTo(W * 0.35, pulleyY + pulleyRadius);
            ctx.lineTo(W * 0.5, objectY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(W * 0.65, pulleyY + pulleyRadius);
            ctx.lineTo(W * 0.5, objectY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(W * 0.35 - 12, pulleyY);
            ctx.lineTo(W * 0.35 - 12, H - 20);
            ctx.stroke();
            ctx.setLineDash([]);

        } else {
            // 3 pulleys
            [W * 0.25, W * 0.5, W * 0.75].forEach(px => {
                this.drawPulley(ctx, px, pulleyY, pulleyRadius - 5, this.ropeOffset);
            });
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 3]);
            ctx.beginPath();
            ctx.moveTo(W * 0.25, pulleyY + 17);
            ctx.lineTo(W * 0.5 - 10, objectY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(W * 0.5, pulleyY + 17);
            ctx.lineTo(W * 0.5, objectY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(W * 0.75, pulleyY + 17);
            ctx.lineTo(W * 0.5 + 10, objectY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(W * 0.25 - 10, pulleyY);
            ctx.lineTo(W * 0.25 - 10, H - 20);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Object / weight
        ctx.font = '2.8rem serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(q.weight, W / 2, objectY + 20);

        // Ground line
        ctx.strokeStyle = 'rgba(124,58,237,0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(20, H - 25);
        ctx.lineTo(W - 20, H - 25);
        ctx.stroke();
        ctx.setLineDash([]);
    },

    drawPulley(ctx, x, y, r, ropeOffset) {
        // Outer wheel
        const grad = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, r);
        grad.addColorStop(0, '#e9d5ff');
        grad.addColorStop(1, '#7c3aed');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Groove
        ctx.strokeStyle = '#5b21b6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, r - 7, 0, Math.PI * 2);
        ctx.stroke();

        // Center hub
        ctx.fillStyle = '#c4b5fd';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Spoke animation
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const angle = (ropeOffset / 20) + (i * Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * (r - 7), y + Math.sin(angle) * (r - 7));
            ctx.stroke();
        }
    },

    animate(q) {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        const step = () => {
            this.ropeOffset = (this.ropeOffset + 1) % 100;
            if (this.isLifting && this.liftProgress < 1) {
                this.liftProgress = Math.min(1, this.liftProgress + 0.015);
            }
            this.drawScene(q);
            this.animFrame = requestAnimationFrame(step);
        };
        step();
    },

    handleAnswer(e, selected, explanation) {
        if (this.app.isLocked) return;
        this.app.isLocked = true;

        const btn = e.currentTarget;
        const feedbackEl = document.getElementById('poleas-feedback');
        const allBtns = document.querySelectorAll('#poleas-options .option-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selected === this.currentCorrect) {
            btn.classList.add('correct');
            this.isLifting = true;
            this.app.addStar('poleas');
            if (feedbackEl) { feedbackEl.textContent = '¡Correcto! ' + explanation; feedbackEl.className = 'feedback success'; }
            this.app.updateCharacterMessage('poleas', '¡Levantaste el objeto con la polea! 🏆');
            this.qIndex++;
            setTimeout(() => this.newChallenge(), 2500);
        } else {
            btn.classList.add('incorrect');
            // highlight correct
            allBtns.forEach(b => { if (b.textContent === this.currentCorrect) b.classList.add('correct'); });
            if (feedbackEl) { feedbackEl.textContent = '¡Casi! ' + explanation; feedbackEl.className = 'feedback error'; }
            this.app.updateCharacterMessage('poleas', '¡Los errores nos enseñan! Inténtalo de nuevo 💡');
            setTimeout(() => {
                this.app.isLocked = false;
                allBtns.forEach(b => { b.disabled = false; b.classList.remove('incorrect','correct'); });
                if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.className = 'feedback'; }
            }, 1800);
        }
    },
};

export default PoleasGame;
