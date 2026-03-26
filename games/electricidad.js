const ElectricidadGame = {
    parent: null,
    connections: {},

    start(app) {
        this.parent = app;
        this.connections = {};

        this.initDragAndDrop();

        this.parent.updateCharacterMessage("JUANA, ARMEMOS EL CIRCUITO ⚡");
    },

    initDragAndDrop() {
        const items = document.querySelectorAll('.item');
        const zones = document.querySelectorAll('.dropzone');

        items.forEach(item => {
            item.addEventListener('dragstart', e => {
                e.dataTransfer.setData('type', item.dataset.type);
            });
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', e => e.preventDefault());

            zone.addEventListener('drop', e => {
                e.preventDefault();
                const type = e.dataTransfer.getData('type');

                zone.textContent =
                    type === "battery" ? "🔋" :
                    type === "switch" ? "🔘" :
                    "🌀";

                this.connections[zone.dataset.slot] = type;

                this.checkCircuit();
            });
        });
    },

    checkCircuit() {
        if (
            this.connections.battery === "battery" &&
            this.connections.switch === "switch" &&
            this.connections.motor === "motor"
        ) {
            this.activateCircuit();
        }
    },

    activateCircuit() {
        const motor = document.querySelector('.dropzone[data-slot="motor"]');
        motor.classList.add('motor');

        this.parent.updateCharacterMessage("¡JUANA! ¡FUNCIONA! ⚡✨");
        this.parent.addStar("electricidad");
    }
};

export default ElectricidadGame;
