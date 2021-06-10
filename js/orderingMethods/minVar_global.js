function minVAr_global(dataArr, simMat) {
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
        return allpermutation[getMinIndex(scores)[0]];
    }
    else {
        return allpermutation[getMaxIndex(scores)[0]];
    }
}