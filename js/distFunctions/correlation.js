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


// computes average PCP correlation.
// calculates correlation for each class PCP then return the mean correlation score.
function computeCorrelation(dataArray, classes, ordering){
    var normalized_array = normalize(deepCopy(dataArray));
    var score = 0;

    // start from i=0 since the header is removed during normaliztion
    for (let c=0; c < classes.length; c++) {
        var class_name = classes[c];
        var class_array = [new Array(normalized_array[0].length)];

        for (let i=0; i<normalized_array.length;i++){
            if (normalized_array[i][0]==class_name){
                class_array.push(normalized_array[i]);
            }
        }
        correlation_matrix = getSimMat(class_array);

        score+= getCorrScore(correlation_matrix, ordering);
    }

    return score/classes.length;
}

function getCorrScore(correlation_matrix, ordering){
    var single_pcp_score = 0;

    for (var i=0; i<ordering.length-1; i++){
        var dim1 = ordering[i];
        var dim2 = ordering[i+1];

        single_pcp_score += correlation_matrix[dim1][dim2];
    }

    return single_pcp_score;
}

function getCorrMats(dataArray, classes){
    var normalized_array = normalize(deepCopy(dataArray));
    var class_corr_mats = {};

    // start from i=0 since the header is removed during normaliztion
    for (let c=0; c < classes.length; c++) {
        var class_name = classes[c];
        var class_array = [new Array(normalized_array[0].length)];

        for (let i=0; i<normalized_array.length;i++){
            if (normalized_array[i][0]==class_name){
                class_array.push(normalized_array[i]);
            }
        }
        correlation_matrix = getSimMat(class_array);
        class_corr_mats[classes[c]] = correlation_matrix;
    }
    return class_corr_mats;
}


function getCorrFromCorrMats(corr_mats, classes, ordering){
    var score = 0;

    // start from i=0 since the header is removed during normaliztion
    for (let c=0; c < classes.length; c++) {
        var class_name = classes[c];
        correlation_matrix = corr_mats[class_name];
        score+= getCorrScore(correlation_matrix, ordering);
    }

    return score/classes.length;
}