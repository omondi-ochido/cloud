function generateMatrixInputs() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const matrixInputsDiv = document.getElementById('matrixInputs');
    matrixInputsDiv.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'matrix-input';
            input.placeholder = `Element at row ${i + 1}, column ${j + 1}`;
            matrixInputsDiv.appendChild(input);
        }
        matrixInputsDiv.appendChild(document.createElement('br'));
    }
}

function getMatrixInput() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    const outputSection = document.getElementById('outputSection');
    const matrixInputs = document.getElementById('matrixInputs').getElementsByTagName('input');

    if (isNaN(rows) || isNaN(columns) || rows <= 0 || columns <= 0) {
        displayError('Rows and columns must be positive integers.');
        return;
    }

    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    const matrix = [];

    let inputIndex = 0;
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            const inputValue = parseFloat(matrixInputs[inputIndex].value);

            if (isNaN(inputValue) || !isFinite(inputValue)) {
                displayError('Matrix elements must be valid numbers.');
                return;
            }

            row.push(inputValue);
            inputIndex++;
        }
        matrix.push(row);
    }

    console.log('Matrix:', matrix);

    const determinantResult = calculateDeterminant(matrix);
    if (determinantResult === null || isNaN(determinantResult) || !isFinite(determinantResult)) {
        displayError('Error calculating determinant. Is it a square?');
        return;
    }

    displayResults(matrix);
}

function displayError(message) {
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    const outputSection = document.getElementById('outputSection');

    errorMsg.innerText = message;
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    outputSection.style.display = 'none';
}

function displayResults(matrix) {
    const matrixInputDiv = document.getElementById('matrixInput');
    const determinantResultDiv = document.getElementById('determinantResult');
    const inverseResultDiv = document.getElementById('inverseResult');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    const outputSection = document.getElementById('outputSection');

    matrixInputDiv.innerHTML = `Matrix Input:<br>${formatMatrixForDisplay(matrix)}`;
    const determinantResult = calculateDeterminant(matrix);
    determinantResultDiv.innerHTML = determinantResult !== null
        ? `Determinant of the matrix: ${determinantResult}`
        : 'Error calculating determinant.';

    const inverseResult = calculateInverse(matrix);
    inverseResultDiv.innerHTML = inverseResult !== null
        ? `Inverse Matrix:<br>${formatMatrixForDisplay(inverseResult)}`
        : 'Error calculating inverse.';

    errorMsg.style.display = 'none';
    successMsg.style.display = 'block';
    outputSection.style.display = 'block';
}

function formatMatrixForDisplay(matrix) {
    return matrix.map(row => {
        return `| ${row.map(element => {
            const formattedElement = element.toFixed(1);
            return formattedElement.endsWith('.0') ? formattedElement.slice(0, -2) : formattedElement;
        }).map(element => element.padEnd(7)).join(',')} |`;
    }).join('<br>') + '<br>';
}


function calculateDeterminant(matrix) {
    if (!matrix || matrix.length !== matrix[0].length) {
        return null;
    }

    if (matrix.length === 2 && matrix[0].length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let determinant = 0;
    for (let j = 0; j < matrix.length; j++) {
        determinant += matrix[0][j] * calculateDeterminant(getMinorMatrix(matrix, 0, j)) * ((j % 2 === 0) ? 1 : -1);
    }

    return determinant;
}

function calculateInverse(matrix) {
    const determinant = calculateDeterminant(matrix);

    if (matrix.length !== matrix[0].length) {
        return `Matrix is not square. Cannot find the inverse.`;
    }

    if (determinant === 0) {
        return `Singular matrix, inverse does not exist.`;
    }

    const adjointMatrix = matrix.map((row, i) =>
        row.map((_, j) => calculateDeterminant(getMinorMatrix(matrix, i, j)) * ((i + j) % 2 === 0 ? 1 : -1))
    );

    return scalarMultiply(1 / determinant, adjointMatrix);
}

// Rest of the code remains the same

function getMinorMatrix(matrix, row, col) {
    return matrix
        .filter((_, i) => i !== row)
        .map(row => row.filter((_, j) => j !== col));
}

function scalarMultiply(scalar, matrix) {
    return matrix.map(row => row.map(element => scalar * element));
}

function formatMatrix(matrix) {
    return matrix.map(row => row.map(element => Math.round(element * 100) / 100));
}
