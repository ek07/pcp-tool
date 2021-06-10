function maxVAr_global(dataArr, simMat) {
    var allDim = [];
    var scores = [];
    var simMeasure = document.getElementById("similarity").value;
    for (var i = 0; i < dataArr[0].length - 1; i++) {
        allDim.push(i);
    }
    var allpermutation = permutator(allDim);
    for (var nc = 0; nc < allpermutation.length; nc++) {
        var score = getVarScore(allpermutation[nc], simMat);
        scores.push(score);
    }
    if (simMeasure === "euclidean") {
        return allpermutation[getMaxIndex(scores)[0]];
    }
    else {
        return allpermutation[getMinIndex(scores)[0]];
    }
}

function getVarScore(nc, simMat) {
    var score = [];
    for (var dim = 0; dim < nc.length; dim++) {
        if (dim !== nc.length - 1) {
            score.push(simOfTwo(nc[dim], nc[dim + 1], simMat));
        }else if(document.getElementById("VisBySG").checked){
            score.push(simOfTwo(nc[dim], nc[0], simMat));
        }
    }
    return variance(score);
}


function variance(arr) {
    var len = 0;
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
        } else {
            len = len + 1;
            sum = sum + parseFloat(arr[i]);
        }
    }
    var v = 0;
    if (len > 1) {
        var mean = sum / len;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === "") {
            }
            else {
                v = v + (arr[i] - mean) * (arr[i] - mean);
            }
        }
        return v / len;
    }
    else {
        return 0;
    }
}