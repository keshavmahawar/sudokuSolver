class gameGrid {
	constructor(frame, alertDiv) {
		this.mainFrame = frame;
		this.alert = alertDiv;
		this.sudoku = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
		this.delay = 1000;
		this.loadGameFrame();
	}

	setVisualizerAlert(txt) {
		if (this.delay > 400) this.setAlert(txt);
	}

	setAlert(txt) {
		this.alert.innerText = txt;
	}

	sudokuInput() {
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				this.sudoku[i][j] = this.grid[i][j].getValue();
			}
		}
        console.log(this.sudoku);
	}

	setDelay(delay) {
		if (delay < 400) this.alert.innerText = "";

		this.delay = delay;
	}

	loadGameFrame() {
		const gameFrame = document.createElement("div");
		gameFrame.id = "gameFrame";
		this.grid = [];
		for (let i = 0; i < 9; i++) {
			const row = document.createElement("div");
			row.className = "row";

			const gridRow = [];

			for (let j = 0; j < 9; j++) {
				const tile = new Tile(i, j);
				row.append(tile.node);
				gridRow.push(tile);
			}

			this.grid.push(gridRow);
			gameFrame.append(row);
		}

		this.mainFrame.innerText = "";
		this.mainFrame.append(gameFrame);
		// this.loadSudoku();
	}

	loadSudoku() {
		let arr = this.sudoku;
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (arr[i][j] != 0) {
					this.grid[i][j].append(arr[i][j]);
				}
			}
		}
	}

	sudokuSolver() {
        this.sudokuInput()
		let arr = this.sudoku;
		let row = [],
			col = [],
			block;

		for (let i = 0; i < 9; i++) {
			row.push([]);
			col.push([]);
		}

		block = [
			[[], [], []],
			[[], [], []],
			[[], [], []],
		];

		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (arr[i][j] != 0) {
					row[i].push(arr[i][j]);
					col[j].push(arr[i][j]);
					selectBlock(i, j).push(arr[i][j]);
				}
			}
		}

		const sleep = () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, this.delay);
			});
		};

		var fill = async (i, j, arr) => {
			if (i == 9 && j == 8) return true;
			if (i == 9) {
				j++;
				i = 0;
			}
			if (arr[i][j] != 0) {
				return await fill(i + 1, j, arr);
			}
			for (let k = 1; k <= 9; k++) {
				this.grid[i][j].append(k);
				this.setVisualizerAlert("Trying " + k + " in current cell");
				this.grid[i][j].yellow();

				await sleep();
				if (row[i].includes(k)) {
					this.grid[i][j].red();
					this.setVisualizerAlert(k + " Already in row, trying next");

					await sleep();

					continue;
				} else if (col[j].includes(k)) {
					this.grid[i][j].red();
					this.setVisualizerAlert(k + " Already in column, trying next");

					await sleep();

					continue;
				} else if (selectBlock(i, j).includes(k)) {
					this.grid[i][j].red();
					this.setVisualizerAlert(k + " Already in block, trying next");

					await sleep();

					continue;
				} else {
					this.grid[i][j].green();
					this.setVisualizerAlert(k + " Seems ok, Moving forward");

					await sleep();

					row[i].push(k);
					col[j].push(k);
					selectBlock(i, j).push(k);
					arr[i][j] = k;
					if (await fill(i + 1, j, arr)) return true;
					else {
						row[i].pop();
						col[j].pop();
						selectBlock(i, j).pop();
						arr[i][j] = 0;
					}
				}
			}

			this.grid[i][j].red();
			this.setVisualizerAlert("Exhausted all combination, moving back");

			await sleep();

			this.grid[i][j].clear();
			return false;
		};

		function selectBlock(i, j) {
			i = parseInt(i / 3);
			j = parseInt(j / 3);
			return block[i][j];
		}

		fill(0, 0, arr);
		this.setVisualizerAlert("Solved");
	}

	sudokuSolverDirect() {
        this.sudokuInput()
		let arr = this.sudoku;
		let row = [],
			col = [],
			block;

		for (let i = 0; i < 9; i++) {
			row.push([]);
			col.push([]);
		}

		block = [
			[[], [], []],
			[[], [], []],
			[[], [], []],
		];

		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (arr[i][j] != 0) {
					row[i].push(arr[i][j]);
					col[j].push(arr[i][j]);
					selectBlock(i, j).push(arr[i][j]);
				}
			}
		}

		var fill = (i, j, arr) => {
			if (i == 9 && j == 8) return true;
			if (i == 9) {
				j++;
				i = 0;
			}
			if (arr[i][j] != 0) {
				return fill(i + 1, j, arr);
			}
			for (let k = 1; k <= 9; k++) {
				if (row[i].includes(k) || col[j].includes(k) || selectBlock(i, j).includes(k)) {
					continue;
				} else {
					row[i].push(k);
					col[j].push(k);
					selectBlock(i, j).push(k);
					arr[i][j] = k;
					if (fill(i + 1, j, arr)) return true;
					else {
						row[i].pop();
						col[j].pop();
						selectBlock(i, j).pop();
						arr[i][j] = 0;
					}
				}
			}
			return false;
		};

		function selectBlock(i, j) {
			i = parseInt(i / 3);
			j = parseInt(j / 3);
			return block[i][j];
		}

		if (fill(0, 0, arr)) {
			this.setAlert("Solved");
			this.loadSudoku();
		} else {
			this.setAlert("No Solution");
		}
	}
}

class Tile {
	constructor() {
		this.node = document.createElement("div");
		this.input = document.createElement("input");
		this.input.setAttribute("type", "number");
		this.input.className = "inputCell";
		this.node.append(this.input);
	}

	append(no) {
		this.input.value = no;
	}

	getValue() {
		let no = this.input.value;
		if (no == "") {
			return 0;
		} else {
			return Number(no);
		}
	}

	green() {
		this.input.className = "inputCell green";
	}

	yellow() {
		this.input.className = "inputCell yellow";
	}

	red() {
		this.input.className = "inputCell red";
	}

	clear() {
		this.input.value = "";
	}
}

window.addEventListener("load", () => {
	const frame = document.getElementById("mainFrame");
	const alertDiv = document.getElementById("alert");
	const delaySlider = document.getElementById("delay");
	const solveButton = document.getElementById("solve");
	const visualSolveButton = document.getElementById("vSolve");

	const game = new gameGrid(frame, alertDiv);
	visualSolveButton.addEventListener("click", () => {
		game.sudokuSolver();
	});
	solveButton.addEventListener("click", () => {
		game.sudokuSolverDirect();
	});
	delaySlider.addEventListener("input", () => {
		game.setDelay(2000 - event.target.value);
	});
});
