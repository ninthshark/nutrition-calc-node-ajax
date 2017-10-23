
var nutriCal = function(ingredients, quantity, devisor = 100) {
    var totalFibre = 0 , totalSugars = 0, totalEnergyKJ = 0, totalEnergyKCal =0, totalCarbohydrate =0, totalSaturatedFat =0, totalFat=0, totalProtein=0, salt=0;

    // if (ingredients.length === 1) {
    //     quantity = quantity.split();
    // }

    for (var i=0; i<ingredients.length; i++) {
        if ( ingredients[i].fibre === 'N') {
            ingredients[i].fibre = 0;
        } else if ( ingredients[i].fibre === 'Tr') {
            ingredients[i].fibre = 0.5
        } else {
            totalFibre += (parseFloat(ingredients[i].fibre)  * parseFloat(quantity[i]))/devisor;
        }

        if ( ingredients[i].sugars === 'N') {
            ingredients[i].sugars = 0;
        } else if ( ingredients[i].sugars === 'Tr') {
            ingredients[i].sugars = 0.5
        } else {
            totalSugars += (parseFloat(ingredients[i].sugars)  * parseFloat(quantity[i]))/devisor;
        }

        if ( ingredients[i].energy_kj === 'N') {
            ingredients[i].energy_kj = 0;
        } else if ( ingredients[i].energy_kj === 'Tr') {
            ingredients[i].energy_kj = 0.5
        } else {
            totalEnergyKJ += (parseFloat(ingredients[i].energy_kj)  * parseFloat(quantity[i]))/devisor;
        }

        if ( ingredients[i].energy_kcal === 'N') {
            ingredients[i].energy_kcal = 0;
        } else if ( ingredients[i].energy_kcal === 'Tr') {
            ingredients[i].energy_kcal = 0.5
        } else {
            totalEnergyKCal += (parseFloat(ingredients[i].energy_kcal)  * parseFloat(quantity[i]))/devisor;
        }

        if ( ingredients[i].carbohydrate === 'N') {
            ingredients[i].carbohydrate = 0;
        } else if ( ingredients[i].carbohydrate === 'Tr') {
            ingredients[i].carbohydrate = 0.5
        } else {
            totalCarbohydrate += (parseFloat(ingredients[i].carbohydrate)  * parseFloat(quantity[i]))/devisor;
        }

        if ( ingredients[i].saturated_fat === 'N') {
            ingredients[i].saturated_fat = 0;
        } else if ( ingredients[i].saturated_fat === 'Tr') {
            ingredients[i].saturated_fat = 0.5
        } else {
            totalSaturatedFat += (parseFloat(ingredients[i].saturated_fat)  * parseFloat(quantity[i]))/devisor;
        }

        if ( ingredients[i].fat === 'N') {
            ingredients[i].fat = 0;
        } else if ( ingredients[i].fat === 'Tr') {
            ingredients[i].fat = 0.5
        } else {
            totalFat += (parseFloat(ingredients[i].fat)  * parseFloat(quantity[i]))/devisor;
        }

        if ( ingredients[i].protein === 'N') {
            ingredients[i].protein = 0;
        } else if ( ingredients[i].protein === 'Tr') {
            ingredients[i].protein = 0.5
        } else {
            totalProtein += (parseFloat(ingredients[i].protein)  * parseFloat(quantity[i]))/devisor;
        }

        if ( ingredients[i].sodium === 'N') {
            ingredients[i].sodium = 0;
        } else if ( ingredients[i].sodium === 'Tr') {
            ingredients[i].sodium = 0.5
        } else {
            salt += (parseFloat(ingredients[i].sodium)  * parseFloat(quantity[i]))/devisor;
        }
    }
    return {energyKCal: totalEnergyKCal, energyKJ: totalEnergyKJ, protein: totalProtein, carbohydrate: totalCarbohydrate, sugars: totalSugars, fat: totalFat, saturatedFat: totalSaturatedFat, fibre: totalFibre, salt:salt/1000}
}

var referenceIntakesCal = function(nutriObj) {
    var [riKcal, riKJ, riProtein, riCarb, riSugars, riFat, riSat, riFibre, riSalt] 
    = [(nutriObj.energyKCal * 100) / 2000,
        nutriObj.energyKJ,
        (nutriObj.protein * 100) / 50,
        (nutriObj.carbohydrate *100) / 260,
        (nutriObj.sugars * 100) / 90,
        (nutriObj.fat * 100) / 70,
        (nutriObj.saturatedFat * 100) / 20,
        nutriObj.fibre,
        (nutriObj.salt * 100) / 6];
    
    return {riKcal, riKJ, riProtein, riCarb, riSugars, riFat, riSat, riFibre, riSalt};
};

var perHundredContains = function(nutriObj, totalWeight) {
    var [hdKcal, hdKJ, hdProtein, hdCarb, hdSugars, hdFat, hdSat, hdFibre, hdSalt]
    = [nutriObj.energyKCal, nutriObj.energyKJ, nutriObj.protein, nutriObj.carbohydrate,
        nutriObj.sugars, nutriObj.fat, nutriObj.saturatedFat, nutriObj.fibre,
        nutriObj.salt].map((i) => (i * 100) / totalWeight);
    return {hdKcal, hdKJ, hdProtein, hdCarb, hdSugars, hdFat, hdSat, hdFibre, hdSalt}
};

var perPortionContains = function(nutriObj, numOfServings) {
    var [ppKcal, ppKJ, ppProtein, ppCarb, ppSugars, ppFat, ppSat, ppFibre, ppSalt]
    = [nutriObj.energyKCal, nutriObj.energyKJ, nutriObj.protein, nutriObj.carbohydrate,
        nutriObj.sugars, nutriObj.fat, nutriObj.saturatedFat, nutriObj.fibre,
        nutriObj.salt].map((i) => i / numOfServings);
    return {ppKcal, ppKJ, ppProtein, ppCarb, ppSugars, ppFat, ppSat, ppFibre, ppSalt}
};

var dailyRIContains = function(riObj, numOfServings) {
    var [driKcal, driKJ, driProtein, driCarb, driSugars, driFat, driSat, driFibre, driSalt]
    = [riObj.riKcal, riObj.riKJ, riObj.riProtein, riObj.riCarb,
        riObj.riSugars, riObj.riFat, riObj.riSat, riObj.riFibre,
        riObj.riSalt].map((i) => i / numOfServings);
    return {driKcal, driKJ, driProtein, driCarb, driSugars, driFat, driSat, driFibre, driSalt}
}

module.exports = { nutriCal, referenceIntakesCal, perHundredContains, perPortionContains, dailyRIContains };