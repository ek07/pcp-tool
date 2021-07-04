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
    else if (dist_type=="emd"){
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
        distance_array.push(Math.sqrt(distance));
    }
    console.log(distance_array)
    return distance_array;
}

// Wasserstein distance
// assumes feature vectors are same length
function wasserstein(fv1, fv2){
    // https://stackoverflow.com/a/65175524
    //np.mean(np.abs(np.sort(u) - np.sort(v)))

    var distance_array = [];
    for (dim=0; dim<fv1.length; dim++){
        var distance = 0;
        var fv1_sorted = fv1[dim].slice(0).sort();
        var fv2_sorted = fv2[dim].slice(0).sort();

        for (i=0; i<fv1_sorted.length; i++){
            distance += Math.abs(fv1_sorted[i]- fv2_sorted[i]);
        }
        distance_array.push(distance/fv1_sorted.length);
    }
    return distance_array;
}

/**
 * Compute and qfd for specific ordering
 * @param results
 */
function computeDistSingle(dataArray, current_pcp_id) {
    if (dataArray !== undefined) {

        var normalizedArr = getNormalizedArr(dataArray);
        var classes = getClasses(normalizedArr);
        var objArray = convertToArrayOfObjects(normalizedArr); // better way to do this?
        var classDict = convertToClassDict(normalizedArr, classes);
        var numDimensions = d3.keys(classDict[classes[0]][0]).length;

        var featureVectorType = document.getElementById("feature-vector").value;

        var featureVector, dist_type;

        if (featureVectorType=="mean") {
            featureVector = meanFV(classDict, classes);
            dist_type = "minus"
            console.log(featureVector)
            // console.log(featureVector[classes[0]])
            // console.log(featureVector[classes[1]])
            // var dist = fvDist(featureVector[classes[0]], featureVector[classes[1]], dist_type);
            // console.log(dist)
        } 
        else if (featureVectorType=="mean_std"){
            featureVector = meanStdFV(classDict, classes);
            dist_type = "euclidean2d"
            var dist = fvDist(featureVector[classes[0]], featureVector[classes[1]], dist_type);

        } 
        else if (featureVectorType=="hist"){
            featureVector = histFV(classDict, classes);
            dist_type = "euclidean2d"
        }

        // generate dist between dimensions
        var dimDistMatrix = dimensionDistMatrix(numDimensions);

        // Get dim order
        var dim_order;
        var dim_length = d3.keys(classDict[classes[0]][0]).length;
        var dim_or = `dim-order${current_pcp_id}`;
        console.log(dim_or)
        var dim_order_string = document.getElementById(dim_or).value;

        if (dim_order_string == ""){
            dim_order = numberRange(0, dim_length);
            document.getElementById(dim_or).value=numberRangeToString(dim_order);
        } else{
            dim_order = stringToNumberRange(dim_order_string);
        }

        // Reorder FV
        var class_keys = Object.keys(featureVector);
        var reordered_fvs = {};

        for (ck=0; ck<class_keys.length; ck++){
            var fv_temp = featureVector[class_keys[ck]];
            var temp = [];
            for (i=0;i<dim_order.length;i++){
                temp.push(fv_temp[dim_order[i]]);
            }
            reordered_fvs[class_keys[ck]] = temp;
        }

        var class_combinations = k_combinations(class_keys, 2)
        var total_qfd = 0;
        
        // Get total weight
        // var total_weight = (dataArray.length-1) * (class_combinations.length-1);
        var total_weight = (dataArray.length-1) * (class_keys.length-1);
        for (c=0; c<class_combinations.length; c++){
            // Calculate QFD
            var class1 = class_combinations[c][0];
            var class2 = class_combinations[c][1];
            var class1_size = classDict[class1].length;
            var class2_size = classDict[class2].length;

            var dist = fvDist(reordered_fvs[class1], reordered_fvs[class2], dist_type);

            if (featureVectorType=="mean"){
                qfd = math.sqrt(math.multiply(math.multiply(dist, dimDistMatrix), dist))
                weighted_qfd = qfd*(class1_size+class2_size)/total_weight;

                console.log(class1_size+class2_size)
                console.log(total_weight)
                total_qfd += weighted_qfd;
            }
        }

        var total_qfd = total_qfd// /class_combinations.length;


        document.getElementById(`qfd_value${current_pcp_id}`).innerHTML = total_qfd.toFixed(3); 


        // Get poly line dist

    }
}