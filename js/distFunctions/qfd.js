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

        fvObj[classes[i]] = (classFv);
    }

    return fvObj;
}

// Get std feature vector
function meanStdFV(){

}

// Get histogram feature vector
function histFV(){

}

// Calculate QFD between 2 feature vectors
function qfd(){

}

//