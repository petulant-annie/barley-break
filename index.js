window.onload = function () {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 320;
    canvas.height = 320;
    const cellSize = canvas.width / 4;

    const game = new BarleyBreak(context, cellSize);
    game.mix(300);
    context.fillRect(0, 0, canvas.width, canvas.height); //отрисовка пустой клетки
    game.draw();

    canvas.onclick = function (e) {
        let x = (e.pageX - canvas.offsetLeft) / cellSize | 0; // клик события
        let y = (e.pageY - canvas.offsetTop) / cellSize | 0;
        event(x, y);
    };
    canvas.ontouchend = function (e) {
        let x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0; //тач события
        let y = (e.touches[0].pageY - canvas.offsetTop) / cellSize | 0;
        event(x, y);
    };

    function event(x, y) { // собираем
        game.move(x, y);
        // game.audio();
        context.fillRect(0, 0, canvas.width, canvas.height); //отрисовка пустой клетки
        game.draw(); //отрисовка заполненых клеток и текста
        if (game.victory()) { //проверка на правильность сборки
            alert("Congratulations! Finished with " + game.getClicks() + " clicks!");
            game.mix(300);
            context.fillRect(0, 0, canvas.width, canvas.height); //отрисовка пустой клетки
            game.draw(context, cellSize);
        }
    }
};

function BarleyBreak(context, cellSize) {
    const arr = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0]
    ];
    let clicks = 0;

    function cellView(x, y) {
        context.clearRect(x + 1, y + 1, cellSize - 2, cellSize - 2); // очистка ячейки
    }

    function numView() {
        context.font = "normal " + (cellSize / 3) + "px Verdana, Geneva, sans-serif"; // стилизация чисел
        context.textAlign = "center";
        context.textBaseline = "middle";
        // context.shadowOffsetX = "-2";
        // context.shadowOffsetY = "-2";
        // context.shadowColor = "#f8c790";
        // context.shadowBlur = 1;
        // context.fillStyle = "#000000";
    }

    this.getNullCell = function () { // определение пустой ячейки
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[j][i] === 0) {
                    return {'x': i, 'y': j};
                }
            }
        }
    };

    this.draw = function () { // основная отрисовка
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j] > 0) {
                    cellView(j * cellSize, i * cellSize);
                    numView();
                    context.fillText(arr[i][j], j * cellSize + cellSize / 2, i * cellSize + cellSize / 2);
                }
            }
        }
    };

    this.move = function (x, y) { // движение
        let nullX = this.getNullCell().x;
        let nullY = this.getNullCell().y;
        if (((x - 1 == nullX || x + 1 == nullX) && y == nullY) || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)) {
            arr[nullY][nullX] = arr[y][x];
            arr[y][x] = 0;
            clicks++;
            let audio = new Audio();
            audio.src = "audio/click.mp3";
            audio.autoplay = true;
        }
    };

    // this.audio = function audio() {
    //     let audio = new Audio();
    //     audio.src = "audio/click.mp3";
    //     audio.autoplay = true;
    // };

    this.victory = () => { // в случае победы
        const e = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
        let res = true;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (e[i][j] != arr[i][j]) {
                    res = false;
                }
            }
        }
        return res;
    };

    function getRandom() {
        if (Math.floor(Math.random() * 2) === 0) {
            return true;
        }
    }

    this.mix = function (stepCount) { //перемешивание
        let x, y;
        for (let i = 0; i < stepCount; i++) {
            const nullX = this.getNullCell().x;
            const nullY = this.getNullCell().y;
            const hMove = getRandom();
            const upLeft = getRandom();
            if (!hMove && !upLeft) {
                y = nullY;
                x = nullX - 1;
            }
            if (hMove && !upLeft) {
                x = nullX;
                y = nullY + 1;
            }
            if (!hMove && upLeft) {
                y = nullY;
                x = nullX + 1;
            }
            if (hMove && upLeft) {
                x = nullX;
                y = nullY - 1;
            }
            if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
                this.move(x, y);
            }
        }
        clicks = 0;
    };

    this.getClicks = () => {
        return clicks;
    };
}




