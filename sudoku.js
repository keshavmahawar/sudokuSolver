class gameGrid {
	constructor(frame, alertDiv) {
		this.mainFrame = frame;
		this.alert = alertDiv;
		this.sudoku = [
			[0, 4, 0, 0, 0, 0, 1, 7, 9],
			[0, 0, 2, 0, 0, 8, 0, 5, 4],
			[0, 0, 6, 0, 0, 5, 0, 0, 8],
			[0, 8, 0, 0, 7, 0, 9, 1, 0],
			[0, 5, 0, 0, 9, 0, 0, 3, 0],
			[0, 1, 9, 0, 6, 0, 0, 4, 0],
			[3, 0, 0, 4, 0, 0, 7, 0, 0],
			[5, 7, 0, 1, 0, 0, 2, 0, 0],
			[9, 2, 8, 0, 0, 0, 0, 6, 0],
		];
		this.delay = 1000;
		this.loadGameFrame();
	}

	setAlert(txt) {
		if (this.delay > 500) this.alert.innerText = txt;
	}

	setDelay(delay) {
		if (delay < 500) this.alert.innerText = "";
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
		this.initialLoad();
	}

	initialLoad() {
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
				this.setAlert("Trying " + k + " in current cell");
				this.grid[i][j].yellow();
				await sleep();
				if (row[i].includes(k)) {
					this.grid[i][j].red();
					this.setAlert(k + " Already in row, trying next");
					await sleep();
					continue;
				} else if (col[j].includes(k)) {
					this.grid[i][j].red();
					this.setAlert(k + " Already in column, trying next");
					await sleep();
					continue;
				} else if (selectBlock(i, j).includes(k)) {
					this.grid[i][j].red();
					this.setAlert(k + " Already in block, trying next");
					await sleep();
					continue;
				} else {
					this.grid[i][j].green();
					this.setAlert(k + " Seems ok, Moving forward");
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
			this.setAlert("Exhausted all combination, moving back");
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
        this.setAlert("Solved")
	}
	sudokuSolverDirect() {
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

		fill(0, 0, arr);
		this.initialLoad();
	}
}

class Tile {
	constructor() {
		this.node = document.createElement("div");
	}

	append(no) {
		this.node.innerHTML = "";
		this.node.append(no);
	}

	green() {
		this.node.className = "green";
	}

	yellow() {
		this.node.className = "yellow";
	}

	red() {
		this.node.className = "red";
	}

	clear() {
		this.node.innerText = "";
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
