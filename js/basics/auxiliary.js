/**
 * check if the given weights are valid
 * @returns {boolean}
 */
function isValid() {
    var valid = true;
    if (document.getElementById("threshold").value.trim() === '' && document.getElementById("threshold").className === "show") {
        alert("Please enter a threshold");
        valid = false;
    } else if (isNaN(document.getElementById("threshold").value)) {
        alert("Invalid threshold");
        valid = false;
    }

    if (document.getElementById("monotonicity").value.trim() === '' && document.getElementById("SGthresholds").className === "show") {
        alert("Please enter a threshold for monotonicity");
        valid = false;
    } else if (isNaN(document.getElementById("monotonicity").value)) {
        alert("Invalid threshold");
        valid = false;
    } else if (Number(document.getElementById("monotonicity").value) > 1 || Number(document.getElementById("monotonicity").value) < 0) {
        alert("Threshold for monotonicity must be between 0 and 1");
        valid = false;
    } else if (document.getElementById("symmetry").value.trim() === '' && document.getElementById("SGthresholds").className === "show") {
        alert("Please enter a threshold for symmetry");
        valid = false;
    } else if (isNaN(document.getElementById("symmetry").value)) {
        alert("Invalid threshold");
        valid = false;
    } else if (Number(document.getElementById("symmetry").value) > 1 || Number(document.getElementById("symmetry").value) < 0) {
        alert("Threshold for symmetry must be between 0 and 1");
        valid = false;
    }

    if (document.getElementById("weights").className === "show") {
        var currentSum = forDigit(Number(document.getElementById("nlc").value) + Number(document.getElementById("ac").value) +
            Number(document.getElementById("para").value) + Number(document.getElementById("mi").value) +
            Number(document.getElementById("condi").value) + Number(document.getElementById("op").value), 2);
        if (document.getElementById("nlc").value.trim() === "") {
            alert("Please give a weight to Number of Line Crossings");
            valid = false;
        } else if (isNaN(document.getElementById("nlc").value)) {
            alert("Invalid input for Number of Line Crossings");
            valid = false
        } else if (Number(document.getElementById("nlc").value) > 1 || Number(document.getElementById("nlc").value) < 0) {
            alert("Weight for Number of Line Crossings must be between 0 and 1");
            valid = false;
        }
        else if (document.getElementById("ac").value.trim() === "") {
            alert("Please give a weight to Angles of Crossing");
            valid = false;
        } else if (isNaN(document.getElementById("ac").value)) {
            alert("Invalid input for Angles of Crossing");
            valid = false
        } else if (Number(document.getElementById("ac").value) > 1 || Number(document.getElementById("ac").value) < 0) {
            alert("Weight for Angles of Crossing must be between 0 and 1");
            valid = false;
        }

        else if (document.getElementById("para").value.trim() === "") {
            alert("Please give a weight to Parallelism");
            valid = false;
        } else if (isNaN(document.getElementById("para").value)) {
            alert("Invalid input for Parallelism");
            valid = false
        } else if (Number(document.getElementById("para").value) > 1 || Number(document.getElementById("para").value) < 0) {
            alert("Weight for Parallelism must be between 0 and 1");
            valid = false;
        }
        else if (document.getElementById("mi").value.trim() === "") {
            alert("Please give a weight to Mutual Information");
            valid = false;
        } else if (isNaN(document.getElementById("mi").value)) {
            alert("Invalid input for Mutual Information");
            valid = false
        } else if (Number(document.getElementById("mi").value) > 1 || Number(document.getElementById("mi").value) < 0) {
            alert("Weight for Mutual Information must be between 0 and 1");
            valid = false;
        }
        else if (document.getElementById("condi").value.trim() === "") {
            alert("Please give a weight to Convergence & Divergence");
            valid = false;
        } else if (isNaN(document.getElementById("condi").value)) {
            alert("Invalid input for Convergence & Divergence");
            valid = false
        } else if (Number(document.getElementById("condi").value) > 1 || Number(document.getElementById("condi").value) < 0) {
            alert("Weight for Convergence & Divergence must be between 0 and 1");
            valid = false;
        }
        else if (document.getElementById("op").value.trim() === "") {
            alert("Please give a weight to Over-plotting");
            valid = false;
        } else if (isNaN(document.getElementById("op").value)) {
            alert("Invalid input for Over-plotting");
            valid = false
        } else if (Number(document.getElementById("op").value) > 1 || Number(document.getElementById("op").value) < 0) {
            alert("Weight for Over-plotting must be between 0 and 1");
            valid = false;
        } else if (Number(currentSum.toFixed(2)) !== 1) {
            valid = false;
            alert("Sum of all weights must be 1(current sum: )" + currentSum);
        }
    }
    return valid;
}

/**
 *  show the further options needed for a specific ordering method
 */
function showSim() {
    var selectedMethod = document.getElementById("list").value;
    switch (selectedMethod) {
        case "0":
            document.getElementById("similarity").className = "hidden";
            document.getElementById("choose").innerHTML = "";
            document.getElementById("weights").className = "hidden";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*Data sets are displayed according to the original axes order.";
            break;
        case "1":
            document.getElementById("similarity").className = "hidden";
            document.getElementById("choose").innerHTML = "Please give a threshold for cluster distance:";
            document.getElementById("threshold").className = "show";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This method orders the axes so that the number of outliers between two dimensions are minimized.<br>*Reference: <a href=\"https://ieeexplore.ieee.org/abstract/document/1382895/\">Clutter Reduction in Multi-Dimensional Data Visualization Using Dimension Reordering</a>";
            break;
        case "2":
            document.getElementById("similarity").className = "hidden";
            document.getElementById("choose").innerHTML = "";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This method orders axes according to their contribution rates, which is determined by Singular Value Decomposition. <br>*Reference: <a href=\"https://www.sciencedirect.com/science/article/pii/S1045926X15300379\">Two axes re-ordering methods in parallel coordinates plots</a>";
            break;
        case "3":
            document.getElementById("choose").innerHTML = "Please choose a similarity measure:";
            document.getElementById("similarity").className = "show";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This methods uses the Nearest Neighbor Heuristic and arranges similar axes as close as possible to each other. <br>*Reference: <a href = \"https://ieeexplore.ieee.org/abstract/document/1648337/\">Enhanced High Dimensional Data Visualization through Dimension Reduction and Attribute Arrangement</a>";
            break;
        case "4":
            document.getElementById("choose").innerHTML = "Please choose a similarity measure:";
            document.getElementById("similarity").className = "show";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This method puts the dimension with the highest contribution rate at the left-most position, and add the most similar axes afterwards. <br> *Reference: <a href=\"https://www.sciencedirect.com/science/article/pii/S1045926X15300379\">Two axes re-ordering methods in parallel coordinates plots</a>";
            break;
        case "5":
            document.getElementById("similarity").className = "hidden";
            document.getElementById("choose").innerHTML = "";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This method investigates the slope of each data points in the pattern and returns the order that results in a minimized pattern.<br>*Reference: <a href=\"https://www.ijcaonline.org/archives/volume40/number13/5044-7370\">Axes Re-Ordering in Parallel Coordinate for Pattern Optimization</a>";
            break;
        case "6":
            document.getElementById("choose").innerHTML = "Please define weights between 0 and 1 for each metrics: (All weights should sum up to 1)";
            document.getElementById("similarity").className = "hidden";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "show";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This method arranges axes based on the flowing quality metrics for parallel coordinates and user-defined weights. *Reference: <a href=\"https://ieeexplore.ieee.org/document/5613439/\">Pargnostics: Screen-Space Metrics for Parallel Coordinates</a>";
            break;
        case "7":
            document.getElementById("choose").innerHTML = "Please choose the thresholds for monotonicity and symmetry:";
            document.getElementById("similarity").className = "hidden";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "show";
            document.getElementById("basicInfo2").innerHTML = "*This method minimize the total occurrence of unstructured rays in glyphs, where clutter is defined as the total number of non-monotonic and non-symmetric occurrences. *Reference: <a href=\"http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.308.2531\">Pargnostics: Screen-Space Metrics for Parallel Coordinates</a>";
            break;
        case "8":
            document.getElementById("choose").innerHTML = "Please choose a similarity measure:";
            document.getElementById("similarity").className = "show";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This methods arranges the dimensions so that neighboring sequence has the overall highest similarity";
            break;
        case "9":
            document.getElementById("choose").innerHTML = "Please choose a similarity measure:";
            document.getElementById("similarity").className = "show";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This methods arranges the dimensions so that neighboring sequence has the overall lowest similarity";
            break;
        case "10":
            document.getElementById("choose").innerHTML = "Please choose a similarity measure:";
            document.getElementById("similarity").className = "show";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This methods arranges the dimensions so that neighboring sequence has the overall lowest similarity";
            break;
        case "11":
            document.getElementById("choose").innerHTML = "Please choose a similarity measure:";
            document.getElementById("similarity").className = "show";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This methods arranges the dimensions so that neighboring sequence has the overall lowest similarity";
            break;
        case "12":
            document.getElementById("choose").innerHTML = "Please choose a similarity measure:";
            document.getElementById("similarity").className = "show";
            document.getElementById("threshold").className = "hidden";
            document.getElementById("weights").className = "hidden";
            document.getElementById("SGthresholds").className = "hidden";
            document.getElementById("basicInfo2").innerHTML = "*This methods uses the Nearest Neighbor Heuristic and arranges dissimilar axes as close as possible to each other. <br>*Reference: <a href = \"https://ieeexplore.ieee.org/abstract/document/1648337/\">Enhanced High Dimensional Data Visualization through Dimension Reduction and Attribute Arrangement</a>";
            break;
        default:
            alert("Sorry, something is wrong.");

    }
}

/**
 * Disable Button
 * @param obj
 */
function disableButton(obj) {
    setTimeout(function () {
        obj.disabled = true;
    }, 1);
}

/**
 * Draw data table if needed
 * @param dataArray
 */
function buildTable(dataArray) {
    var markup = "<table id='dataTable'  class='show'>";
    for (var i = 0; i < dataArray.length; i++) {
        markup += "<tr>";
        var row = dataArray[i];

        for (var j = 0; j < dataArray[0].length; j++) {
            markup += "<td>";
            markup += row[j];
            markup += "</td>";
        }
        markup += "</tr>";
    }
    markup += "</table>";


    $("#app").html(markup);
}

/**
 * show/hide table based on user's check
 */
function showTable() {
    var table = document.getElementById("dataTable");

    if (table.className === "show") {
        table.className = "hidden";
    } else {
        table.className = "show";
    }

}


/**
 * calculate the euclidean distance of two dimensions
 * @param dimensionA: array A
 * @param dimensionB: array B
 * @returns {number}: euclidean distance
 */
function euclidean(dimensionA, dimensionB) {
    var distance = 0;
    if (dimensionA.length === dimensionB.length) {
        for (var i = 0; i < dimensionA.length; i++) {
            var temp = Math.pow(dimensionA[i] - dimensionB[i], 2);
            distance = distance + temp;
        }
        distance = Math.sqrt(distance);
    } else {
        throw("Error: tow arrays do not have the same length");
    }
    return distance;
}

/**
 * calculate the pearson's correlation coefficient
 * @param dimensionA: array A
 * @param dimensionB: array B
 * @returns {number} pcc
 */
function pcc(dimensionA, dimensionB) {
    if (dimensionA.length === dimensionB.length) {
        var meanA = avg(dimensionA);
        var meanB = avg(dimensionB);
        var numerator = generateNumerator(dimensionA, dimensionB, meanA, meanB);
        var denumerator = generateDenumerator(dimensionA, dimensionB, meanA, meanB);
        return numerator / denumerator;
    } else {
        throw("Errors in similarity calculation");
    }
}

/**
 * calculate the mean of an array
 * @param dimension
 * @returns {number}
 */
function avg(dimension) {
    return sum(dimension) / dimension.length;
}

/**
 * get the sum of one dimension
 * @param dimension
 * @returns {number}
 */
function sum(dimension) {
    var sum = 0;
    for (var i = 0; i < dimension.length; i++) {
        sum = sum + dimension[i];
    }
    return sum;
}


/**
 * auxiliary function for pcc calculation
 * @param dimensionA
 * @param dimensionB
 * @param meanA
 * @param meanB
 * @returns {number}
 */
function generateNumerator(dimensionA, dimensionB, meanA, meanB) {
    var numerator = 0;
    for (var i = 0; i < dimensionA.length; i++) {
        numerator += (dimensionA[i] - meanA) * (dimensionB[i] - meanB);
    }
    return numerator;

}

/**
 * auxiliary function for pcc calculation
 * @param dimensionA
 * @param dimensionB
 * @param meanA
 * @param meanB
 * @returns {number}
 */
function generateDenumerator(dimensionA, dimensionB, meanA, meanB) {
    var sumA = 0;
    var sumB = 0;
    for (var i = 0; i < dimensionA.length; i++) {
        sumA += (dimensionA[i] - meanA) * (dimensionA[i] - meanA);
    }
    for (var j = 0; j < dimensionB.length; j++) {
        sumB += (dimensionB[j] - meanB) * (dimensionB[j] - meanB);
    }
    return Math.sqrt(sumA * sumB);
}


/**
 * get the i-th column in the data array
 * @param matrix
 * @param col
 * @returns {Array}
 */
function getCol(matrix, col) {
    var column = [];
    if (col >= matrix[0].length || col < 0) {
        alert("wrong column number:" + col);
    } else {
        for (var i = 0; i < matrix.length; i++) {
            column.push(matrix[i][col]);
        }
    }
    return column;
}

/**
 * get the data in a dimension and parse them into numbers
 * @param matrix
 * @param col
 * @returns {Array}
 */
function getColNumbers(matrix, col) {
    var column = [];
    if (col >= matrix[0].length || col < 0) {
        alert("wrong column number:" + col);
    } else {
        for (var i = 1; i < matrix.length; i++) {
            column.push(Number(matrix[i][col]));
        }
    }
    return column;
}

/**
 * get similarity matrix
 * @param dataArray
 * @returns {any[]}
 */
function getSimMat(dataArray) {
    var simMat = new Array(dataArray[0].length - 1);
    var simMeasure = document.getElementById("similarity").value;
    for (var i = 0; i < dataArray[0].length - 1; i++) {
        simMat[i] = new Array(dataArray[0].length - 1);
        for (var j = 0; j < i; j++) {
            if (simMeasure === "euclidean") {
                simMat[i][j] = euclidean(getColNumbers(dataArray, i + 1), getColNumbers(dataArray, j + 1));
            } else if (simMeasure === "pcc") {
                simMat[i][j] = Math.abs(pcc(getColNumbers(dataArray, i + 1), getColNumbers(dataArray, j + 1)));
                simMat[j][i] = Math.abs(pcc(getColNumbers(dataArray, i + 1), getColNumbers(dataArray, j + 1)));
            }
        }
    }
    var defaultMax = getMaxDim(simMat)[2] + 1;
    var selectedMethod = document.getElementById("list").value;

    for (i = 0; i < dataArray[0].length - 1; i++) {
        for (j = i; j < simMat.length; j++) {
            if (simMeasure === "euclidean" && selectedMethod !== "12") {
                simMat[i][j] = defaultMax;
            } else if (simMeasure === "euclidean" && selectedMethod === "12") {
                simMat[i][j] = -1;
            } else if (simMeasure === "pcc" && selectedMethod !== "12") {
                simMat[i][j] = -1;
            } else {
                simMat[i][j] = 2
            }
        }
    }
    console.log(simMat);
    return simMat;
}

/**
 * get the index of the maximal in 2-d array, and the maximal value
 * @param arr
 * @returns {*[]}
 */
function getMaxDim(arr) {
    var largest = arr[1][0];
    var a = 1;
    var b = 0;
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < i; j++) {
            if (arr[i][j] > largest) {
                largest = arr[i][j];
                a = i;
                b = j;
            }
        }
    }
    return [a, b, largest];
}

/**
 * get the index of the minimal in 2-d array, and the minimal value
 * @param arr
 * @returns {*[]}
 */
function getMinDim(arr) {
    var min = arr[1][0];
    var a = 1;
    var b = 0;
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < i; j++) {
            if (arr[i][j] < min) {
                min = arr[i][j];
                a = i;
                b = j;
            }
        }
    }
    return [a, b, min];
}

/**
 * get the index of maximal in an 1-d array, and the maximal value
 * @param arr
 * @returns {*[]}
 */
function getMaxIndex(arr) {
    var max = arr[0];
    var a = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            a = i;
            max = arr[i];
        }
    }
    return [a, max];
}

/**
 * get the index of minimal in an 1-d array, and the minimal value
 * @param arr
 * @returns {*[]}
 */
function getMinIndex(arr) {
    var min = arr[0];
    var a = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < min) {
            a = i;
            min = arr[i];
        }
    }
    return [a, min];
}


/**
 * part of function 'reconstruct'
 * @param dataArray
 * @param nc
 * @param row
 * @returns {*[]}
 */
function getRow(dataArray, nc, row) {
    var newRow = [dataArray[row][0]];
    for (var i = 0; i < nc.length; i++) {
        newRow.push(dataArray[row][nc[i] + 1]);
    }
    return newRow;
}

/**
 * form the data array according to the neighboring sequence
 * @param dataArray
 * @param nc
 * @returns {Array}
 */
function reconstruct(dataArray, nc) {
    var newArr = [];
    for (var row = 0; row < dataArray.length; row++) {
        newArr.push(getRow(dataArray, nc, row));
    }
    console.log(nc);
    return newArr;
}


/**
 * deep copy an object
 * @param obj
 * @returns {Array}
 */
function deepCopy(obj) {
    var out = [], i = 0, len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array) {
            out[i] = deepCopy(obj[i]);
        }
        else out[i] = obj[i];
    }
    return out;
}

/**
 * transform the data array into matrix with only numbers
 * @param dataArr
 * @returns {Array}
 */
function getDataMat(dataArr) {
    var numMat = deepCopy(dataArr);
    for (var i = 0; i < dataArr.length; i++) {
        numMat[i].splice(0, 1);
    }
    numMat.splice(0, 1);
    for (var row = 0; row < numMat.length; row++) {
        for (var col = 0; col < numMat[0].length; col++) {
            numMat[row][col] = Number(numMat[row][col]);
        }
    }

    return numMat;
}


/**
 * all possible permutations of all the dimensions without the arrays that are in backwards order of a former array
 * @param inputArr
 */
function permutator(inputArr) {
    var results = [];

    function permute(arr, memo) {
        var cur, memo = memo || [];

        for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1);
            if (arr.length === 0) {
                results.push(memo.concat(cur));
            }
            permute(arr.slice(), memo.concat(cur));
            arr.splice(i, 0, cur[0]);
        }

        return results;
    }

    return permute(inputArr);
}

/**
 * get the normalized data array
 * @param dataArray
 * @returns {Array}
 */
function getNomArr(dataArray) {
    var dataMat = getDataMat(dataArray);
    var nomArr = deepCopy(dataArray);
    for (var dim = 0; dim < dataMat[0].length; dim++) {
        var col = getCol(dataMat, dim);
        var max = getMaxIndex(col)[1];
        var min = getMinIndex(col)[1];
        var diff = max - min;
        for (var i = 0; i < col.length; i++) {
            nomArr[i + 1][dim + 1] = (col[i] - min) / diff;
        }
    }
    return nomArr;
}

/**
 * Convert an array to array of objects
 * @param data
 * @returns {Array}
 */
function convertToArrayOfObjects(data) {
    var keys = data.shift(),
        i = 0, k = 0,
        obj = null,
        output = [];
    for (i = 0; i < data.length; i++) {
        obj = {};
        for (k = 0; k < keys.length; k++) {
            obj[keys[k]] = data[i][k];
        }
        output.push(obj);
    }
    return output;
}

/**
 * Round a number
 * @param number
 * @param precision
 * @returns {number}
 */
function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

/**
 * retruns the median of an array
 * @param values
 * @returns {*}
 */
function median(values) {

    values.sort(function (a, b) {
        return a - b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];
    else
        return (values[half - 1] + values[half]) / 2.0;
}


/**
 * This function changes the base of the logarithm function
 * @param x
 * @param y
 * @returns {number}
 */
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

/**
 * This function calculates the entropy of an array
 * @param arr
 * @returns {number}
 */
function pixel_entropy(arr) {

    var entropy = 0;
    var values = getValues(arr);

    for (var a = 0; a < values.length; a++) {
        var h = values[a].length / arr.length;
        entropy = entropy - h * getBaseLog(2, 1 / h);
    }
    return entropy;
}

/**
 * This function forms a 2-d array for calculating the mutual information
 * @param dataMat
 * @param dimA
 * @param dimB
 * @returns {Array}
 */
function getAppearanceTable(dataMat, dimA, dimB) {
    var arrA = getCol(dataMat, dimA);
    var arrB = getCol(dataMat, dimB);
    var valuesA = getValues(arrA);
    var valuesB = getValues(arrB);
    var appearanceTable = [];
    for (var i = 0; i < valuesA.length; i++) {
        appearanceTable.push([]);
        for (var j = 0; j < valuesB.length; j++) {
            var count = 0;
            var numA = valuesA[i][0];
            var numB = valuesB[j][0];
            for (var a = 0; a < arrA.length; a++) {
                if (arrA[a] === numA && arrB[a] === numB) {
                    count++;
                }
            }
            appearanceTable[i].push(count);
        }
    }
    return appearanceTable;
}

/**
 * This function put same existing values together for further calculation of entropy
 * @param arr
 * @returns {Array}
 */
function getValues(arr) {
    var values = [];
    values.push([arr[0]]);
    for (var i = 1; i < arr.length; i++) {
        var inArr = false;
        var index = 0;
        for (var j = 0; j < values.length; j++) {
            if (values[j].indexOf(arr[i]) !== -1) {
                inArr = true;
                index = j;
            }
        }
        if (inArr) {
            values[index].push(arr[i]);
        } else {
            values.push([arr[i]]);
        }
    }
    return values;
}

function forDigit(dight, how) {

    return Math.round(dight * Math.pow(10, how)) / Math.pow(10, how);
}

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = Object.keys(objArray[0]).join() + '\r\n';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line !== '') line += ',';

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function getSimValues(simMat) {
    var results = [["Interval", "A", "B", "C", "D", "E", "F", "G"]];
    var simValues = [];

    results.push(["simValue"]);
    results.push(["linear_norm"]);
    results.push(["ZScore_norm"]);
    for (var i = 0; i < simMat.length - 1; i++) {
        results[1].push(simMat[i + 1][i]);
        simValues.push(simMat[i + 1][i])
    }

    var min = getMinIndex(simValues)[1];
    var max = getMaxIndex(simValues)[1];
    var sd = standardDeviation(simValues);
    var sum = simValues.reduce(function (a, b) {
        return a + b;
    });
    var avg = sum / simValues.length;

    for (var j = 0; j < simValues.length; j++) {
        results[2].push((simValues[j] - min) / (max - min));
        results[3].push((simValues[j] - avg) / sd);
    }

    return results;
}

function standardDeviation(numbersArr) {
    //--CALCULATE AVAREGE--
    var total = 0;
    for (var key in numbersArr)
        total += numbersArr[key];
    var meanVal = total / numbersArr.length;
    //--CALCULATE AVAREGE--

    //--CALCULATE STANDARD DEVIATION--
    var SDprep = 0;
    for (var key in numbersArr)
        SDprep += Math.pow((parseFloat(numbersArr[key]) - meanVal), 2);
    var SDresult = Math.sqrt(SDprep / numbersArr.length);
    //--CALCULATE STANDARD DEVIATION--
    return SDresult;

}



