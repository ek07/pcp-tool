// Get mean feature vector
function meanFV(classDict, classes){
    var keys = d3.keys(classDict[classes[0]][0]);

    var fvObj = {};

    for (i=0; i<classes.length; i++){
        var classData = classDict[classes[i]];
        var classFv = new Array(keys.length).fill(0);

        for (row=0; row<classData.length; row++){
            for (k=0; k<keys.length; k++){
                var key = keys[k];
                classFv[k] += Number(classData[row][key]);
            }
        }
        // console.log(classFv)
        // Get mean by dividing sum
        for (c=0; c<classFv.length; c++){
            classFv[c] /= classData.length;
        }

        fvObj[classes[i]] = classFv;
    }

    return fvObj;
}

// Get std feature vector
function meanStdFV(classDict, classes){
    var keys = d3.keys(classDict[classes[0]][0]);

    var fvObj = {};

    for (i=0; i<classes.length; i++){
        var classData = classDict[classes[i]];
        var classFv = new Array(keys.length).fill(0);
        var raw_values = new Array(keys.length).fill(0);

        for (row=0; row<classData.length; row++){
            for (k=0; k<keys.length; k++){
                var key = keys[k];
                // classFv[k] += Number(classData[row][key]);
                if (raw_values[k] == 0){
                    raw_values[k] = [Number(classData[row][key])];
                } else{
                    raw_values[k].push(Number(classData[row][key]));
                }
            }
        }

        var feature_vec = [];
        for (col=0; col<raw_values.length; col++){
            col_data = raw_values[col];
            var fv_arr = [];

            //--CALCULATE MEAN--
            var total = 0;
            for (j=0; j<col_data.length; j++){
                total+= col_data[j];
            }
            var mean = total/col_data.length;

            //--CALCULATE STANDARD DEVIATION--
            var SDprep = 0;
            for (j=0; j<col_data.length; j++){
                val = col_data[j];
                SDprep += Math.pow((val - mean), 2);
            }

            // var SDresult = Math.sqrt(SDprep / (col_data.length-1)); // std with 1 dof (how i did it in python)
            var SDresult = Math.sqrt(SDprep / (col_data.length)); // std with 0 dof

            fv_arr.push(mean-SDresult);
            fv_arr.push(mean);
            fv_arr.push(mean+SDresult);
            feature_vec.push(fv_arr);
        }
        fvObj[classes[i]] = feature_vec
    }

    return fvObj;
}

// Get histogram feature vector
function histFV(){

}

// Calculate QFD between 2 feature vectors
function qfd(){

}

// Generate distance matrix for dimension axes
function dimensionDistMatrix(numDims){
    var dist_matrix = math.zeros([numDims, numDims]);
    console.log(dist_matrix)
    var max_dist = numDims-1;

    for (i=0; i<numDims; i++){
        for (j=0; j<numDims; j++){
            bin_dist = math.abs(i-j);
            dist_matrix[i][j] = 1 - (bin_dist/max_dist);
        }
    }

    return dist_matrix;
}

// Distance functions for comparing feature vectors
function fvDist(fv1, fv2, dist_type){
    if (dist_type=="minus"){
        return math.subtract(fv1, fv2);
    }
    else if (dist_type=="euclidean2d"){
        return euclidean2d(fv1, fv2);
    }
    else if (dist_type=="end"){
        // try this: https://github.com/nklb/wasserstein-distance/blob/master/ws_distance.m
    }
}

// Euclidean dist between 2 2d-arrays
function euclidean2d(fv1, fv2) {
    var distance_array = [];

    for (var dim=0; dim < fv1.length; dim++) {
        var distance = 0;
        var fv1_dim = fv1[dim];
        var fv2_dim = fv2[dim];

        for (var i=0; i<fv1_dim.length; i++){
            var temp = Math.pow(fv1_dim[i] - fv2_dim[i], 2);
            distance = distance + temp;
        }
        distance_array.push(math.sqrt(distance));
    }
    console.log(distance_array)
    return distance_array;
}