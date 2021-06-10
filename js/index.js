/**
 * Read csv data
 */
$(document).ready(function () {

    $('#submit').on("click", function (e) {
        e.preventDefault();
        // If there is no data input
        if (!$('#files')[0].files.length) {
            alert("Please choose at least one file to read the data.");
        }

        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: visualization
            },
            before: function (file, inputElem) {
                //console.log("Parsing file...", file);
            },
            error: function (err, file) {
                console.log("ERROR:", err, file);
            },
            complete: function () {
            }
        });
    });

});


/**
 * Main Function
 * @param results
 */
function visualization(results) {

    var fileName = document.getElementById('files').files[0].name.slice(0, -4);

    if (isValid()) {
        //disableButton(document.getElementById("submit"));
        d3.select("#targetPC").select("svg").remove();
        $("div.wrapper").remove();

        var data = results.data;
        var dataArray = [[]];
        var simMeasure = document.getElementById("similarity").value;
        var hasNullValue = [];

        //construct the data array
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            dataArray[i] = row;
            var cells = row.join(",").split(",");
            for (var j = 0; j < cells.length; j++) {
                dataArray[i][j] = cells[j];
            }
        }


        // delete rows with null value(s)
        for (var a = 1; a < dataArray.length; a++) {
            for (var b = 0; b < dataArray[0].length; b++) {
                if (dataArray[a][b] === "") {
                    hasNullValue.push(a);
                    break;
                }
            }
        }
        var deleted = 0;
        for (var index = 0; index < hasNullValue.length; index++) {
            dataArray.splice(hasNullValue[index] - deleted, 1);
            deleted++;
        }

        //get Ordering Methods
        var selectedMethod = document.getElementById("list").value;
        var newArr;
        var nomArr = getNomArr(dataArray);
        var orderingMethod;
        switch (selectedMethod) {
            //Default ordering
            case "0":
                console.log("you have chosen " + document.getElementById("0").innerHTML + ".");
                orderingMethod = "Default";
                newArr = dataArray;
                break;
            //Clutter-based Methods
            case "1":
                console.log("you have chosen " + document.getElementById("1").innerHTML + ".");

                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, peng(nomArr));
                    }
                } else {
                    newArr = reconstruct(dataArray, peng(nomArr));
                }
                orderingMethod = "Clutter-based(PC)";
                break;
            //Contribution-based Methods
            case "2":
                console.log("you have chosen " + document.getElementById("2").innerHTML + ".");
                newArr = reconstruct(dataArray, luCon(dataArray));
                orderingMethod = "Contribution-based";
                break;
            //Similarity-based Methods by Artero et al.
            case "3":
                console.log("you have chosen " + document.getElementById("3").innerHTML + ".");
                orderingMethod = "Sim(Artero)";
                var simMat = deepCopy(getSimMat(nomArr));
                newArr = reconstruct(dataArray, artero(simMat));
                break;
            //Similarity-based Methods by Lu et al.
            case "4":
                console.log("you have chosen " + document.getElementById("4").innerHTML + ".");
                orderingMethod = "Sim_Lu";
                newArr = reconstruct(dataArray, luSim(dataArray));
                break;
            //Pattern Optimization Method
            case "5":
                console.log("you have chosen " + document.getElementById("5").innerHTML + ".");
                orderingMethod = "Pattern-based";
                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, makwana(nomArr));
                    }
                } else {
                    newArr = reconstruct(dataArray, makwana(nomArr));
                }
                break;
            //Pargnostics
            case "6":
                console.log("you have chosen " + document.getElementById("6").innerHTML + ".");
                orderingMethod = "Pargnostics";
                var t1 = document.getElementById("nlc").value;
                var t2 = document.getElementById("ac").value;
                var t3 = document.getElementById("para").value;
                var t4 = document.getElementById("mi").value;
                var t5 = document.getElementById("condi").value;
                var t6 = document.getElementById("op").value;
                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, pargnostics(nomArr, t1, t2, t3, t4, t5, t6));
                    }
                } else {
                    newArr = reconstruct(dataArray, pargnostics(nomArr, t1, t2, t3, t4, t5, t6));
                }
                break;
            //Peng_sg
            case "7":
                console.log("you have chosen " + document.getElementById("7").innerHTML + ".");
                orderingMethod = "Clutter-based(SG)";
                var threshold_Mon = document.getElementById("monotonicity").value;
                var threshold_Sym = document.getElementById("symmetry").value;
                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, peng_sg(nomArr, threshold_Mon, threshold_Sym));
                    }
                } else {
                    newArr = reconstruct(dataArray, peng_sg(nomArr, threshold_Mon, threshold_Sym));
                }
                break;
            //Similarity-Global
            case "8":
                console.log("you have chosen " + document.getElementById("8").innerHTML + ".");
                orderingMethod = "Sim";
                var simMat2 = deepCopy(getSimMat(dataArray));
                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, sim_global(dataArray, simMat2));
                    }
                } else {
                    newArr = reconstruct(dataArray, sim_global(dataArray, simMat2));
                }
                break;
            //Dissimilarity-Global
            case "9":
                console.log("you have chosen " + document.getElementById("9").innerHTML + ".");
                orderingMethod = "Dis";
                var simMat3 = deepCopy(getSimMat(dataArray));
                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, dissim_global(dataArray, simMat3));
                    }
                } else {
                    newArr = reconstruct(dataArray, dissim_global(dataArray, simMat3));
                }
                break;
            case "10":
                console.log(" you have chosen " + document.getElementById("10").innerHTML + ".");
                orderingMethod = "MaxVar";
                var simMat4 = deepCopy(getSimMat(dataArray));

                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, maxVAr_global(dataArray, simMat4));
                    }
                } else {
                    newArr = reconstruct(dataArray, maxVAr_global(dataArray, simMat4));
                }
                break;
            case "11":
                console.log(" you have chosen " + document.getElementById("11").innerHTML + ".");
                orderingMethod = "MinVar";
                var simMat5 = deepCopy(getSimMat(dataArray));
                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, minVAr_global(dataArray, simMat5));
                    }
                } else {
                    newArr = reconstruct(dataArray, minVAr_global(dataArray, simMat5));
                }
                break;
            case "12":
                console.log(" you have chosen " + document.getElementById("12").innerHTML + ".");
                orderingMethod = "Dis_Artero";
                var simMat6 = deepCopy(getSimMat(dataArray));
                newArr = reconstruct(dataArray, artero_dis(simMat6));
                break;
            default:
                alert("Sorry, something is wrong.");

        }

        if (newArr !== undefined) {
            newArr[0][0] = "name";
            var visArr = deepCopy(newArr);
            var downloadArr = deepCopy(newArr);

            if (document.getElementById("storeData").checked) {
                var csvFile = ConvertToCSV(convertToArrayOfObjects(downloadArr));
                download(fileName + "_" + orderingMethod + ".csv", csvFile);
            }

            if (document.getElementById("storeSimValues").checked) {
                var maxVarArr = getSimValues(getSimMat(reconstruct(dataArray, maxVAr_global(dataArray, getSimMat(dataArray)))));
                var simArr = getSimValues(getSimMat(reconstruct(dataArray, sim_global(dataArray, getSimMat(dataArray)))));
                var disArr = getSimValues(getSimMat(reconstruct(dataArray, dissim_global(dataArray, getSimMat(dataArray)))));

                download(fileName + "_MaxVar.csv", ConvertToCSV(convertToArrayOfObjects(maxVarArr)));
                download(fileName + "_Sim.csv", ConvertToCSV(convertToArrayOfObjects(simArr)));
                download(fileName + "_Dis.csv", ConvertToCSV(convertToArrayOfObjects(disArr)));
            }

            if (document.getElementById("VisByPC").checked) {
                pcVis(convertToArrayOfObjects(visArr));
            } else {
                var labels = getLabels(visArr);
                sgVis(convertToArrayOfObjects(getNomArr(visArr)), labels);
            }

            buildTable(newArr);
            if (!document.getElementById("appendData").checked) {
                document.getElementById("dataTable").className = "hidden";
            }
        }

    }
}





