/**
 * ElectricidadGame — Construye circuitos eléctricos simples ⚡
 *
 * Mecánica:
 *  - Se muestra un circuito con: pila 🔋, interruptor, cables y una luz 💡
 *  - El jugador debe cerrar el interruptor para completar el circuito
 *  - Desafíos varían: ¿falta un componente? ¿el interruptor está abierto?
 *  - Canvas animado muestra la electricidad "fluyendo" cuando el circuito está completo
 */
const ElectricidadGame = {
    app: null,
    canvas: null,
    ctx: null,
    animFrame: null,
    flowOffset: 0,
    circuitOn: false,
    switchClosed: false,
    missingPart: null,
    currentQ: null,
    questions: [],
    qIndex: 0,

    start(appInstance) {
        this.app = appInstance;
        this.canvas = document.getElementById('electricidad-canvas');
        this.ctx    = this.canvas ? this.canvas.getContext('2d') : null;
        this.flowOffset = 0;
        this.circuitOn = false;
        this.switchClosed = false;
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
                type: 'switch',
                title: '¡El interruptor está abierto!',
                message: 'Presiona el interruptor para cerrar el circuito y encender la luz. 💡',
                controls: [{ id: 'toggle-switch', label: '🔘 Cerrar interruptor', action: 'switch' }],
                solution: 'switch',
            },
            {
                type: 'trivia',
                title: '¿Qué hace el interruptor?',
                message: '¿Para qué sirve el interruptor en un circuito eléctrico?',
                options: ['Abre y cierra el circuito', 'Guarda energía', 'Emite luz'],
                correct: 'Abre y cierra el circuito',
                explanation: '¡El interruptor corta o une el paso de electricidad!',
            },
            {
                type: 'switch',
                title: '¡Conecta el circuito!',
                message: 'El interruptor está abierto. ¡Ciérralo para que fluya la electricidad!',
                controls: [{ id: 'toggle-switch', label: '🔘 Cerrar interruptor', action: 'switch' }],
                solution: 'switch',
            },
            {
                type: 'trivia',
                title: '¿Qué produce la pila?',
                message: '¿Cuál es la función de la pila en el circuito?',
                options: ['Da energía eléctrica', 'Emite luz', 'Controla el flujo'],
                correct: 'Da energía eléctrica',
                explanation: '¡La pila o batería es la fuente de energía del circuito!',
            },
            {
                type: 'trivia',
                title: '¿Qué necesita el circuito?',
                message: 'Para que la bombilla encienda, el circuito debe estar…',
                options: ['Cerrado ✅', 'Abierto ❌', 'Roto 💥'],
                correct: 'Cerrado ✅',
                explanation: '¡La electricidad solo fluye cuando el circuito está cerrado (completo)!',
            },
            {
                type: 'switch',
                title: '¡El circuito está incompleto!',
                message: '¡Cierra el interruptor para encender la luz de la princesa! 👑',
                controls: [{ id: 'toggle-switch', label: '🔘 Cerrar interruptor', action: 'switch' }],
                solution: 'switch',
            },
        ];
        this.questions.sort(() => Math.random() - 0.5);
    },

    newChallenge() {
        this.app.isLocked = false;
        this.switchClosed = false;
        this.circuitOn = false;
        this.flowOffset = 0;

        if (this.qIndex >= this.questions.length) {
            this.qIndex = 0;
            this.questions.sort(() => Math.random() - 0.5);
        }

        const q = this.questions[this.qIndex];
        this.currentQ = q;

        const feedbackEl = document.getElementById('electricidad-feedback');
        const questionEl = document.getElementById('electricidad-question');
        const controlsEl = document.getElementById('electricidad-controls');

        if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.className = 'feedback'; }
        if (questionEl) questionEl.textContent = q.message;
        if (controlsEl) controlsEl.innerHTML = '';

        this.app.updateCharacterMessage('electricidad', q.title + ' ⚡');

        if (q.type === 'switch') {
            q.controls.forEach(ctrl => {
                const btn = document.createElement('button');
                btn.className = 'circuit-btn';
                btn.id = ctrl.id;
                btn.textContent = ctrl.label;
                btn.onclick = () => this.handleSwitchAction(ctrl.action, btn);
                controlsEl.appendChild(btn);
            });
        } else if (q.type === 'trivia') {
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'circuit-btn';
                btn.textContent = opt;
                btn.onclick = (e) => this.handleTriviaAnswer(e, opt, q.correct, q.explanation);
                controlsEl.appendChild(btn);
            });
        }

        this.animate();
    },

    handleSwitchAction(action, btn) {
        if (this.app.isLocked) return;
        if (action === 'switch') {
            this.switchClosed = true;
            this.circuitOn = true;
            btn.textContent = '💡 ¡Circuito cerrado!';
            btn.classList.add('connected');
            btn.disabled = true;
            this.app.isLocked = true;

            const feedbackEl = document.getElementById('electricidad-feedback');
            if (feedbackEl) { feedbackEl.textContent = '¡La luz se encendió! ⚡💡'; feedbackEl.className = 'feedback success'; }
            this.app.updateCharacterMessage('electricidad', '¡Brillante! El circuito está completo. 👑⚡');
            this.app.addStar('electricidad');
            this.qIndex++;
            setTimeout(() => this.newChallenge(), 2800);
        }
    },

    handleTriviaAnswer(e, selected, correct, explanation) {
        if (this.app.isLocked) return;
        this.app.isLocked = true;

        const btn = e.currentTarget;
        const feedbackEl = document.getElementById('electricidad-feedback');
        const allBtns = document.querySelectorAll('#electricidad-controls .circuit-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selected === correct) {
            btn.classList.add('active'); // green-ish
            this.circuitOn = true;
            this.app.addStar('electricidad');
            if (feedbackEl) { feedbackEl.textContent = '¡Correcto! ' + explanation; feedbackEl.className = 'feedback success'; }
            this.app.updateCharacterMessage('electricidad', '¡Sos una ingeniera eléctrica! ⚡👑');
            this.qIndex++;
            setTimeout(() => this.newChallenge(), 2500);
        } else {
            btn.style.background = 'linear-gradient(145deg,#fee2e2,#fecaca)';
            btn.style.color = '#991b1b';
            allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('active'); });
            if (feedbackEl) { feedbackEl.textContent = '¡Casi! ' + explanation; feedbackEl.className = 'feedback error'; }
            this.app.updateCharacterMessage('electricidad', '¡Los errores enseñan! Vuelve a intentarlo 🔬');
            setTimeout(() => {
                this.app.isLocked = false;
                allBtns.forEach(b => {
                    b.disabled = false;
                    b.classList.remove('active');
                    b.style.background = '';
                    b.style.color = '';
                });
                if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.className = 'feedback'; }
            }, 1800);
        }
    },

    animate() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        const step = () => {
            if (this.circuitOn) this.flowOffset = (this.flowOffset + 2) % 40;
            this.draw();
            this.animFrame = requestAnimationFrame(step);
        };
        step();
    },

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        ctx.clearRect(0, 0, W, H);

        // Background
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#eff6ff');
        bg.addColorStop(1, '#e0f2fe');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Circuit layout: rectangle path
        // top-left: Battery, top-right: bulb, bottom: switch + wire
        const pad = 36;
        const top = 48, bottom = H - 45;
        const left = pad, right = W - pad;

        // === Draw wires ===
        const wireColor = this.circuitOn ? '#f59e0b' : '#94a3b8';
        const wireWidth = this.circuitOn ? 5 : 3.5;
        const dashOn = this.circuitOn;

        ctx.strokeStyle = wireColor;
        ctx.lineWidth = wireWidth;
        ctx.lineCap = 'round';

        if (dashOn) {
            ctx.setLineDash([12, 8]);
            ctx.lineDashOffset = -this.flowOffset;
        } else {
            ctx.setLineDash([]);
        }

        // Top wire: battery → bulb
        ctx.beginPath();
        ctx.moveTo(left + 40, top);
        ctx.lineTo(right - 40, top);
        ctx.stroke();

        // Right wire: bulb down
        ctx.beginPath();
        ctx.moveTo(right, top + 25);
        ctx.lineTo(right, bottom);
        ctx.stroke();

        // Bottom wire: right → switch → left
        ctx.beginPath();
        ctx.moveTo(right, bottom);
        ctx.lineTo(W / 2 + 50, bottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(W / 2 - 50, bottom);
        ctx.lineTo(left, bottom);
        ctx.stroke();

        // Left wire: up to battery
        ctx.beginPath();
        ctx.moveTo(left, bottom);
        ctx.lineTo(left, top + 35);
        ctx.stroke();

        ctx.setLineDash([]);

        // === Battery ===
        this.drawBattery(ctx, left, top);

        // === Bulb ===
        this.drawBulb(ctx, right, top, this.circuitOn);

        // === Switch ===
        this.drawSwitch(ctx, W / 2, bottom, this.switchClosed);
    },

    drawBattery(ctx, x, y) {
        const w = 50, h = 38;
        ctx.save();
        ctx.translate(x, y);

        // Body
        const grad = ctx.createLinearGradient(0, -h/2, 0, h/2);
        grad.addColorStop(0, '#6ee7b7');
        grad.addColorStop(1, '#059669');
        ctx.fillStyle = grad;
        this.roundRect(ctx, -w/2, -h/2, w, h, 8);
        ctx.fill();

        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 2;
        this.roundRect(ctx, -w/2, -h/2, w, h, 8);
        ctx.stroke();

        // Poles
        ctx.fillStyle = '#047857';
        ctx.fillRect(-4, -h/2 - 8, 8, 10);   // negative (left)
        ctx.fillStyle = '#065f46';
        ctx.fillRect(-4, h/2 - 2, 8, 10);    // positive (right-ish, bottom)

        // + and - symbols
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Nunito';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔋', 0, 2);
        ctx.restore();
    },

    drawBulb(ctx, x, y, on) {
        ctx.save();
        ctx.translate(x, y);

        // Glow when on
        if (on) {
            const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, 42);
            glow.addColorStop(0, 'rgba(253,224,71,0.7)');
            glow.addColorStop(1, 'rgba(253,224,71,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, 42, 0, Math.PI * 2);
            ctx.fill();
        }

        // Bulb body
        const bulbGrad = ctx.createRadialGradient(-6, -6, 2, 0, 0, 20);
        bulbGrad.addColorStop(0, on ? '#fef08a' : '#e2e8f0');
        bulbGrad.addColorStop(1, on ? '#fbbf24' : '#94a3b8');
        ctx.fillStyle = bulbGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = on ? '#d97706' : '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.stroke();

        // Filament symbol
        ctx.font = on ? 'bold 20px serif' : '18px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(on ? '💡' : '⚫', 0, 1);

        ctx.restore();
    },

    drawSwitch(ctx, x, y, closed) {
        ctx.save();
        ctx.translate(x, y);

        // Switch body
        ctx.fillStyle = closed ? '#fbbf24' : '#e2e8f0';
        ctx.strokeStyle = closed ? '#d97706' : '#94a3b8';
        ctx.lineWidth = 2;
        this.roundRect(ctx, -44, -18, 88, 36, 10);
        ctx.fill();
        ctx.stroke();

        // Switch arm
        ctx.strokeStyle = closed ? '#d97706' : '#64748b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (closed) {
            ctx.moveTo(-24, 0);
            ctx.lineTo(24, 0);
        } else {
            ctx.moveTo(-24, 4);
            ctx.lineTo(10, -14);
        }
        ctx.stroke();

        // Contact points
        ctx.fillStyle = closed ? '#d97706' : '#64748b';
        [-24, 24].forEach(px => {
            ctx.beginPath();
            ctx.arc(px, 0, 5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Label
        ctx.fillStyle = closed ? '#92400e' : '#475569';
        ctx.font = 'bold 10px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(closed ? '✅ CERRADO' : '❌ ABIERTO', 0, 20);

        ctx.restore();
    },

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    },
};

export default ElectricidadGame;
