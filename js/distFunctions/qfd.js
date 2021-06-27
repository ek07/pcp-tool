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
        console.log(raw_values)

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

//