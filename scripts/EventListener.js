class EventListener {
    constructor() {
        this.kPressed = {
            longP: false
        };
        this.mouse = {};
        this.mouseMove = {};
        this.addEventListener();
    }

    addEventListener() {
        let stage = document.getElementById("stage");

        $(stage).mousedown((e) => {
            let offset = stage.getBoundingClientRect();

            this.mouse["start"] = this.setMousePos(e, offset);
        }).mouseup((e) => {
            let offset = stage.getBoundingClientRect();

            this.mouse["end"] = this.setMousePos(e, offset);
        }).mousemove((e) => {
            let offset = stage.getBoundingClientRect();

            this.mouseMove = this.setMousePos(e, offset);
        });

        $(document).keydown((e) => {
            switch (e.which) {
                case 87:
                    this.kPressed.W = true;
                    break;
                case 65:
                    this.kPressed.A = true;
                    break;
                case 83:
                    this.kPressed.S = true;
                    break;
                case 68:
                    this.kPressed.D = true;
                    break;
            }
        }).keyup((e) => {
            switch (e.which) {
                case 87:
                    this.kPressed.W = false;
                    break;
                case 65:
                    this.kPressed.A = false;
                    break;
                case 83:
                    this.kPressed.S = false;
                    break;
                case 68:
                    this.kPressed.D = false;
                    break;
            }
        });
    }

    setMousePos(e, offset) {
        let mX = e.pageX;
        let mY = e.pageY;
        let xOffset = offset.left;
        let yOffset = offset.top;

        return {
            x: mX - xOffset,
            y: mY - yOffset
        };
    }

    pointRectCollision(rect, x, y) {
        if (x < rect.x + rect.width &&
            x > rect.x &&
            y < rect.y + rect.height &&
            y > rect.y)
            return true

        return false;
    }

    rMCol(rect, mouse) {
        let collision = 0;

        for (const property in mouse) {
            if (mouse.hasOwnProperty(property)) {
                let state = mouse[property];

                let mX = state.x;
                let mY = state.y;

                if (this.pointRectCollision(rect, mX, mY))
                    collision++;
            }
        }

        return collision == 2;
    }
}