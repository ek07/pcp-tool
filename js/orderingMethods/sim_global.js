function sim_global(dataArr, simMat) {
    var allDim = [];
    var scores = [];
    var simMeasure = document.getElementById("similarity").value;
    for (var i = 0; i < dataArr[0].length - 1; i++) {
        allDim.push(i);
    }
    var allpermutation = permutator(allDim);
    for (var nc = 0; nc < allpermutation.length; nc++) {
        var score = getScore(allpermutation[nc], simMat);
        scores.push(score);
    }
    if (simMeasure === "euclidean") {
        return allpermutation[getMinIndex(scores)[0]];
    } else if (simMeasure === "pcc") {
        return allpermutation[getMaxIndex(scores)[0]];
    }
}

function getScore(nc, simMat) {
    var score = 0;
    for (var dim = 0; dim < nc.length; dim++) {
        if (dim !== nc.length - 1) {
            score = score + simOfTwo(nc[dim], nc[dim + 1], simMat);
            } else if (document.getElementById("VisBySG").checked) {
            score = score + simOfTwo(nc[dim], nc[0], simMat);
        }
    }
    return score;
}

function simOfTwo(dim1, dim2, simMat) {
    var firstDim, lastDim;
    if (dim1 > dim2) {
        firstDim = dim1;
        lastDim = dim2;
    } else if (dim1 < dim2) {
        firstDim = dim2;
        lastDim = dim1;
    } else {
        throw ("Error: two identical dimensions." + dim1 + dim2);

    }
    return simMat[firstDim][lastDim];
}