/**
 * EngranajesGame — Aprende sobre engranajes con ruedas animadas ⚙️
 *
 * Mecánica:
 *  - Se muestran engranajes girando en canvas animado
 *  - Si gira la rueda A en sentido horario, ¿hacia dónde gira B?
 *  - ¿Qué rueda gira más rápido, la grande o la chica?
 */
const EngranajesGame = {
    app: null,
    canvas: null,
    ctx: null,
    animFrame: null,
    angle: 0,
    currentCorrect: null,
    questions: [],
    qIndex: 0,
    currentQ: null,

    start(appInstance) {
        this.app = appInstance;
        this.canvas = document.getElementById('engranajes-canvas');
        this.ctx    = this.canvas ? this.canvas.getContext('2d') : null;
        this.angle  = 0;
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
                setup: 'two',           // dos engranajes
                dirA: 'clockwise',
                question: 'La rueda verde gira ↻. ¿Hacia dónde gira la rueda rosa?',
                options: ['↺ Al revés', '↻ Igual', 'No gira'],
                correct: '↺ Al revés',
                explanation: 'Los engranajes que se tocan siempre giran en dirección contraria.',
            },
            {
                setup: 'two',
                dirA: 'counter',
                question: 'La rueda verde gira ↺. ¿Hacia dónde gira la rosa?',
                options: ['↻ Al revés', '↺ Igual', 'Se detiene'],
                correct: '↻ Al revés',
                explanation: '¡Los engranajes se "empujan" entre sí al contrario!',
            },
            {
                setup: 'size',
                question: '¿Cuál rueda gira más RÁPIDO?',
                options: ['La chica 🔵', 'La grande 🟣', 'Igual de rápido'],
                correct: 'La chica 🔵',
                explanation: 'La rueda pequeña da más vueltas porque tiene menos dientes.',
            },
            {
                setup: 'three',
                question: 'Tres engranajes en fila: A gira ↻, B gira ↺, ¿y C?',
                options: ['↻ Igual que A', '↺ Igual que B', 'No gira'],
                correct: '↻ Igual que A',
                explanation: 'En 3 engranajes en fila, el 1.° y el 3.° giran en la misma dirección.',
            },
            {
                setup: 'two',
                dirA: 'clockwise',
                question: 'Si la rueda grande mueve a la chica, la chica gira…',
                options: ['Más rápido', 'Igual', 'Más lento'],
                correct: 'Más rápido',
                explanation: 'Rueda pequeña = más velocidad. Es la magia de los engranajes! ⚡',
            },
        ];
        this.questions.sort(() => Math.random() - 0.5);
    },

    newChallenge() {
        this.app.isLocked = false;
        this.angle = 0;

        if (this.qIndex >= this.questions.length) {
            this.qIndex = 0;
            this.questions.sort(() => Math.random() - 0.5);
        }

        const q = this.questions[this.qIndex];
        this.currentQ = q;
        this.currentCorrect = q.correct;

        const feedbackEl = document.getElementById('engranajes-feedback');
        const questionEl = document.getElementById('engranajes-question');
        const optionsEl  = document.getElementById('engranajes-options');

        if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.className = 'feedback'; }
        if (questionEl) questionEl.textContent = q.question;
        if (optionsEl)  optionsEl.innerHTML = '';

        this.app.updateCharacterMessage('engranajes', '¡Observa cómo giran los engranajes y responde! ⚙️');

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn text-option';
            btn.textContent = opt;
            btn.onclick = (e) => this.handleAnswer(e, opt, q.explanation);
            optionsEl.appendChild(btn);
        });

        this.animate();
    },

    animate() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        const step = () => {
            this.angle += 0.018;
            this.draw();
            this.animFrame = requestAnimationFrame(step);
        };
        step();
    },

    draw() {
        if (!this.ctx || !this.currentQ) return;
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        ctx.clearRect(0, 0, W, H);

        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#fffbeb');
        grad.addColorStop(1, '#fef3c7');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        const q = this.currentQ;
        const dir = q.dirA === 'counter' ? -1 : 1;

        if (q.setup === 'two') {
            const r1 = 60, r2 = 50;
            const cx1 = W * 0.35, cy = H / 2;
            const cx2 = cx1 + r1 + r2;
            const ratio = r1 / r2;
            this.drawGear(ctx, cx1, cy, r1, 10, this.angle * dir, '#a855f7', '#7c3aed', '🟣');
            this.drawGear(ctx, cx2, cy, r2, 8,  -this.angle * dir * ratio, '#f472b6', '#db2777', '🩷');
            // Labels
            ctx.font = 'bold 13px Nunito, sans-serif';
            ctx.fillStyle = '#7c3aed';
            ctx.textAlign = 'center';
            ctx.fillText('A', cx1, cy + r1 + 20);
            ctx.fillStyle = '#db2777';
            ctx.fillText('B', cx2, cy + r2 + 20);

        } else if (q.setup === 'size') {
            const r1 = 72, r2 = 36;
            const cx1 = W * 0.3, cy = H / 2;
            const cx2 = cx1 + r1 + r2;
            const ratio = r1 / r2;
            this.drawGear(ctx, cx1, cy, r1, 12, this.angle, '#7c3aed', '#5b21b6', '🟣');
            this.drawGear(ctx, cx2, cy, r2, 6,  -this.angle * ratio, '#3b82f6', '#1d4ed8', '🔵');
            ctx.font = 'bold 12px Nunito, sans-serif';
            ctx.fillStyle = '#5b21b6';
            ctx.textAlign = 'center';
            ctx.fillText('Grande', cx1, cy + r1 + 18);
            ctx.fillStyle = '#1d4ed8';
            ctx.fillText('Chica', cx2, cy + r2 + 18);

        } else if (q.setup === 'three') {
            const r = 45;
            const cx1 = W * 0.18, cy = H / 2;
            const cx2 = cx1 + r * 2;
            const cx3 = cx2 + r * 2;
            this.drawGear(ctx, cx1, cy, r, 8,  this.angle, '#10b981', '#059669', '🟢');
            this.drawGear(ctx, cx2, cy, r, 8,  -this.angle, '#f59e0b', '#d97706', '🟡');
            this.drawGear(ctx, cx3, cy, r, 8,  this.angle, '#a855f7', '#7c3aed', '🟣');
            ctx.font = 'bold 13px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ['A','B','C'].forEach((lbl, i) => {
                const colors = ['#059669','#d97706','#7c3aed'];
                ctx.fillStyle = colors[i];
                ctx.fillText(lbl, cx1 + i * r * 2, cy + r + 20);
            });
        }
    },

    drawGear(ctx, cx, cy, r, teeth, angle, fill, stroke, _emoji) {
        const toothH = r * 0.28;
        const innerR = r - toothH * 0.6;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Draw teeth
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
            const a0 = (i / teeth) * Math.PI * 2;
            const a1 = ((i + 0.35) / teeth) * Math.PI * 2;
            const a2 = ((i + 0.65) / teeth) * Math.PI * 2;
            const a3 = ((i + 1) / teeth) * Math.PI * 2;

            if (i === 0) ctx.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
            ctx.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
            ctx.lineTo(Math.cos(a1) * (r + toothH), Math.sin(a1) * (r + toothH));
            ctx.lineTo(Math.cos(a2) * (r + toothH), Math.sin(a2) * (r + toothH));
            ctx.lineTo(Math.cos(a3) * r, Math.sin(a3) * r);
        }
        ctx.closePath();

        const grad = ctx.createRadialGradient(0, 0, innerR * 0.2, 0, 0, r + toothH);
        grad.addColorStop(0, fill + 'dd');
        grad.addColorStop(1, stroke);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner circle
        ctx.beginPath();
        ctx.arc(0, 0, innerR * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = stroke;
        ctx.fill();

        // Spokes
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * innerR * 0.52, Math.sin(a) * innerR * 0.52);
            ctx.stroke();
        }

        ctx.restore();
    },

    handleAnswer(e, selected, explanation) {
        if (this.app.isLocked) return;
        this.app.isLocked = true;

        const btn = e.currentTarget;
        const feedbackEl = document.getElementById('engranajes-feedback');
        const allBtns = document.querySelectorAll('#engranajes-options .option-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selected === this.currentCorrect) {
            btn.classList.add('correct');
            this.app.addStar('engranajes');
            if (feedbackEl) { feedbackEl.textContent = '¡Correcto! ' + explanation; feedbackEl.className = 'feedback success'; }
            this.app.updateCharacterMessage('engranajes', '¡Entendiste los engranajes! ⚙️✨');
            this.qIndex++;
            setTimeout(() => this.newChallenge(), 2500);
        } else {
            btn.classList.add('incorrect');
            allBtns.forEach(b => { if (b.textContent === this.currentCorrect) b.classList.add('correct'); });
            if (feedbackEl) { feedbackEl.textContent = '¡Casi! ' + explanation; feedbackEl.className = 'feedback error'; }
            this.app.updateCharacterMessage('engranajes', '¡Mira bien cómo giran y vuelve a intentarlo! 🔄');
            setTimeout(() => {
                this.app.isLocked = false;
                allBtns.forEach(b => { b.disabled = false; b.classList.remove('incorrect','correct'); });
                if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.className = 'feedback'; }
            }, 1800);
        }
    },
};

export default EngranajesGame;
