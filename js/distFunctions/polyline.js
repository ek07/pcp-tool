// PYTHON IMPLEMENTATION
// def get_mean_polyline_dist(df, perm):
//     total_line_dist = 0
//     rows_in_df = len(df)
    
//     for i, dim in enumerate(perm[:-1]):
//         total_line_dist = total_line_dist + line_dist(df.iloc[:,perm[i]], df.iloc[:,perm[i+1]]).sum()

//     return total_line_dist/rows_in_df


// def line_dist(dim1, dim2):
//     linedist = np.sqrt((dim1-dim2)**2+1)
//     return linedist

// don't need to split by class obv
// calculates mean line length
function computePolyLineLength(dataArray, ordering){
    normalized_array = normalize(deepCopy(dataArray));
    var total_line_length = 0;
    var i;

    // start from i=0 since the header is removed during normaliztion
    for (i=0; i < normalized_array.length; i++) {
        var row = normalized_array[i].slice(1);
        total_line_length += lineLen(row, ordering);
    }

    console.log(normalized_array)
    return total_line_length/normalized_array.length;
}

// Calculate line length a 1d array of values
function lineLen(arr, ordering){
    // console.log(arr)
    var i;
    var line_len = 0;
    for (i=0; i<(arr.length-1); i++){
        var dim1 = ordering[i];
        var dim2 = ordering[i+1];

        line_len += Math.sqrt(Math.pow(arr[dim1]-arr[dim2], 2) + 1);
    }

    return line_len;
}


// create poly line dist table (similar to correlation matrix)
function getPlcMat(dataArray){
    normalized_array = normalize(deepCopy(dataArray));
    console.log(normalized_array);
    var plcMat = new Array(dataArray[0].length - 1);

    for (var i=0; i<normalized_array[0].length-1; i++){
        plcMat[i] = new Array(dataArray[0].length - 1);
         for (var j = 0; j < i; j++) {
             mean_dim_dist = dimDist(normalized_array, i, j)/normalized_array.length;
             plcMat[i][j] = mean_dim_dist;
             plcMat[j][i] = mean_dim_dist;
         }
    }

    for (i = 0; i < plcMat.length; i++) {
        plcMat[i][i] = 0;
    }
    console.log(plcMat)
    return plcMat;
}

// compute length between dimensions
function dimDist(mat, dim1_index, dim2_index){
    total_dim_dist = 0;

    for (i=0; i < mat.length; i++) {
        var row = mat[i].slice(1);
        total_dim_dist += Math.sqrt(Math.pow(row[dim1_index]-row[dim2_index], 2) + 1);
    }
    return total_dim_dist;
}


function computeDistFromMat(plcMat, ordering){
    var total_line_length = 0;
    for (var i=0; i<ordering.length-1; i++){
        total_line_length += plcMat[ordering[i]][ordering[i+1]];
    }
    return total_line_length;
}