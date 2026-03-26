const ElectricidadGame = {
    parent: null,
    selectedNode: null,

    start(app) {
        this.parent = app;
        this.selectedNode = null;

        document.querySelectorAll('.node').forEach(node => {
            node.addEventListener('click', () => this.handleClick(node));
        });

        this.parent.updateCharacterMessage("JUANA, UNÍ LOS PUNTOS ⚡");
    },

    handleClick(node) {
        if (!this.selectedNode) {
            this.selectedNode = node;
            node.style.background = "#fde68a";
            return;
        }

        this.drawCable(this.selectedNode, node);

        this.selectedNode.style.background = "white";
        this.selectedNode = null;
    },

    drawCable(n1, n2) {
        const svg = document.getElementById("circuit-svg");

        const r1 = n1.getBoundingClientRect();
        const r2 = n2.getBoundingClientRect();
        const parent = svg.getBoundingClientRect();

        const x1 = r1.left - parent.left + 22;
        const y1 = r1.top - parent.top + 22;
        const x2 = r2.left - parent.left + 22;
        const y2 = r2.top - parent.top + 22;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        // 🔴 color según polo
        const color = n1.dataset.pole === "plus" ? "red" : "black";

        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "4");

        svg.appendChild(line);
    }
};

export default ElectricidadGame;
