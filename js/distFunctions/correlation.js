// def getCorrelationScore(perm, corrMat):
//     score = 0
//     for i, dim in enumerate(perm[:-1]):
//         score = score + simOfTwo(perm[i], perm[i+1], corrMat)

//     return score

// # Used for PCC and euclidean calc
// def simOfTwo(dim1, dim2, simMat):
//     if (dim1 < dim2):
//         firstDim = dim1
//         lastDim = dim2
//     elif (dim1 > dim2):
//         firstDim = dim2
//         lastDim = dim1
//     else:
//         print("ERROR SAME DIM!!")
        
//     return simMat[firstDim][lastDim]


function computeCorrelation(classDict, classes, ordering){
    // var normalized_array = normalize(deepCopy(dataArray));
    console.log(classDict)
    var i;
    var score = 0;
    // start from i=0 since the header is removed during normaliztion
    for (i=0; i < normalized_array.length; i++) {
        var row = normalized_array[i].slice(1);
        total_line_length += lineLen(row, ordering);
    }
}