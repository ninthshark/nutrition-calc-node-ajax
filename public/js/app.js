
$(document).ready(function() {
    let selectedIngredients = [];
    let recipeName = '';
    let ingredients = []
    let ingredientItem = [];
    let ingredientItemQty = [];
    let quantity;
    let displaySelectedItem;
    let defaultValue = 100;
    let numOfServing;
    let totalWeight;

//---------------Search ingredients from database------------------

    $('.search-box').keypress(function(event) {
        //$('.result-container').slideUp();
        $('select').children().remove();
        if(event.which == 13) {
            let text = $('input').val();
            $('input').val('');

            $.post('/ingredients/', {food_name: text})
                .then((result) => {
                    result.forEach(function(item) {
                        let ingredient = "<option data-id="+item._id+">"+item.food_name+"</option>";
                        $('#search-result').append(ingredient); 
                       //$('.result-container').slideDown();
                    })
                })
        };
    });

//------------ Select ingredients from search list -----------

    $('#search-result').click(function(event) {
        let selectedItem = event.target;
        console.log(selectedItem);
        if (selectedItem.value === '') {
            return false;
        } else {
            displaySelectedItem = {
                item: selectedItem.value,
                id: selectedItem.getAttribute('data-id')
            }
            $('.selected-ingredient').html(selectedItem.value);
        }           
    });

//------------Submit selected ingredient for recipe------------

    $('.add-ingredient-btn').click(function() {
        quantity = $('#qty').val();
        //console.log(parseFloat(quantity));
        if (isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
            $('.error-qty').html('Please enter the proper number');
            return false;
        } else {
            $('.error-qty').html('');
            displaySelectedItem.qty = quantity || defaultValue;

//------------------- Get complete nutrition value from database---------------
            let foodId = displaySelectedItem.id;
            $.get('/ingredients/' + foodId)
                .then((result) => {
                    ingredientItem.push(result);
                })
                .catch(err => console.log(err));
//------------------ Add selected ingredient to recipe section ---------------
            selectedIngredients.push(displaySelectedItem);
            ingredientItemQty.push(displaySelectedItem.qty);
            //$('.result-container').slideUp();
            let recipeItem = 
            `<div class="item">
                <div class="ingredient">
                    <li class="ingredient-item">${displaySelectedItem.item}</li>
                </div>
                <div class="ing-qty">${displaySelectedItem.qty}</div>
            </div>`
            $('.ingredient-list').append(recipeItem);
            $('#qty').val('');
            $('.selected-ingredient').html('<span>&nbsp;</span>');
            $('#search-result').html('');
        }       
    });

    $('.get-nutrition').click(function() {
        numOfServing = $('#num-of-servings').val();
        totalWeight = ingredientItemQty.map((i) => parseFloat(i)).reduce((acc, cur) => acc + cur, 0);
        if(isNaN(parseFloat(numOfServing)) || parseFloat(numOfServing) <= 0) {
            $('.error-serv').html('Please enter the proper number');
            return false;
        } else {
            $('.error-serv').html('');
            if (ingredientItem.length > 0) {
                let userNutritionFact = nutriCal(ingredientItem, ingredientItemQty);
                let hundredGContains = perHundredContains(userNutritionFact, totalWeight);
                let portionContains = perPortionContains(userNutritionFact, numOfServing);
                let referenceIntakes = referenceIntakesCal(userNutritionFact);
                let dailyRI = dailyRIContains(referenceIntakes, numOfServing);
                let nutritionData = `
                    <tr>
                        <td class="compos">Energy</td>
                        <td class="hd">${hundredGContains.hdKJ.toFixed(1)}kJ</td>
                        <td class="portion">${portionContains.ppKJ.toFixed(1)}kJ</td>
                        <td class="ri"></td>
                    </tr>
                    <tr>
                        <td class="compos"></td>
                        <td class="hd">${hundredGContains.hdKcal.toFixed(1)}kcal</td>
                        <td class="portion">${portionContains.ppKcal.toFixed(1)}kcal</td>
                        <td class="ri">${dailyRI.driKcal.toFixed()} %</td>
                    </tr>
                    <tr>
                        <td class="compos">Fat</td>
                        <td class="hd">${hundredGContains.hdFat.toFixed(1)}</td>
                        <td class="portion">${portionContains.ppFat.toFixed(1)}</td>
                        <td class="ri">${dailyRI.driFat.toFixed()} %</td>
                    </tr>
                    <tr>
                        <td class="compos">of which saturates</td>
                        <td class="hd">${hundredGContains.hdSat.toFixed(1)}</td>
                        <td class="portion">${portionContains.ppSat.toFixed(1)}</td>
                        <td class="ri">${dailyRI.driSat.toFixed()} %</td>
                    </tr>
                    <tr>
                        <td class="compos">Carbohydrate</td>
                        <td class="hd">${hundredGContains.hdCarb.toFixed(1)}</td>
                        <td class="portion">${portionContains.ppCarb.toFixed(1)}</td>
                        <td class="ri"></td>
                    </tr>
                    <tr>
                        <td class="compos">of which sugars</td>
                        <td class="hd">${hundredGContains.hdSugars.toFixed(1)}</td>
                        <td class="portion">${portionContains.ppSugars.toFixed(1)}</td>
                        <td class="ri">${dailyRI.driSugars.toFixed()} %</td>
                    </tr>
                    <tr>
                        <td class="compos">Fibre</td>
                        <td class="hd">${hundredGContains.hdFibre.toFixed(1)}</td>
                        <td class="portion">${portionContains.ppFibre.toFixed(1)}</td>
                        <td class="ri"></td>
                    </tr>
                    <tr>
                        <td class="compos">Protein</td>
                        <td class="hd">${hundredGContains.hdProtein.toFixed(1)}</td>
                        <td class="portion">${portionContains.ppProtein.toFixed(1)}</td>
                        <td class="ri">${dailyRI.driProtein.toFixed()} %</td>
                    </tr>
                    <tr>
                        <td class="compos">Salt</td>
                        <td class="hd">${hundredGContains.hdSalt.toFixed(1)}</td>
                        <td class="portion">${portionContains.ppSalt.toFixed(1)}</td>
                        <td class="ri">${dailyRI.driSalt.toFixed()} %</td>
                    </tr>
                `;
                let labelData = `
                <div class="pompos-label">
                    <div class="compos-name"><span>Enery</span></div>
                    <div class="compos-qty"><span>${portionContains.ppKJ.toFixed(1)}kJ</span></div>
                    <div class="compos-qty"><span>${portionContains.ppKcal.toFixed(1)}kcal</span></div>
                    <div class="ri-energy"><span>${dailyRI.driKcal.toFixed()} %</span></div>
                </div>
                <div class="pompos-label">
                    <div class="compos-name"><span>Fat</span></div>
                    <div class="compos-qty"><span>${portionContains.ppFat.toFixed(1)}g</span></div>
                    <div class="compos-ri"><span>${dailyRI.driFat.toFixed()}%</span></div>
                    <div class="compos-level ${labelFat(portionContains.ppFat).color}"><span>${labelFat(portionContains.ppFat).level}</span></div>
                </div>
                <div class="pompos-label">
                    <div class="compos-name"><span>Saturated</span></div>
                    <div class="compos-qty"><span>${portionContains.ppSat.toFixed(1)}g</span></div>
                    <div class="compos-ri"><span>${dailyRI.driSat.toFixed()}%</span></div>
                    <div class="compos-level ${labelSatFat(portionContains.ppSat).color}"><span>${labelSatFat(portionContains.ppSat).level}</span></div>
                </div>
                <div class="pompos-label">
                    <div class="compos-name"><span>Sugars</span></div>
                    <div class="compos-qty"><span>${portionContains.ppSugars.toFixed(1)}g</span></div>
                    <div class="compos-ri"><span>${dailyRI.driSugars.toFixed()}%</span></div>
                    <div class="compos-level ${labelFat(portionContains.ppSugars).color}"><span>${labelFat(portionContains.ppSugars).level}</span></div>
                </div>
                <div class="pompos-label">
                    <div class="compos-name"><span>Salt</span></div>
                    <div class="compos-qty"><span>${portionContains.ppSalt.toFixed(1)}g</span></div>
                    <div class="compos-ri"><span>${dailyRI.driSalt.toFixed()}%</span></div>
                    <div class="compos-level ${labelSalt(portionContains.ppSalt).color}"><span>${labelSalt(portionContains.ppSalt).level}</span></div>
                </div>
                `;
                let recipeInfo = `
                <div>This recipe contains ${numOfServing} servings of ${(totalWeight/numOfServing).toFixed()}g each</div>
                `;
                $('.nutrition-values').html(nutritionData);
                $('.recipe-info').html(recipeInfo);
                $('.label-row').html(labelData);
            } else {
                $('.error-serv').html('Not enough information')
            }           
            $('#num-of-servings').val('');  
        }
                            
    });
});

//------------------------------ Calculators-------------------------------//

function nutriCal(ingredients, quantity, devisor = 100) {
    let totalFibre = 0 , totalSugars = 0, totalEnergyKJ = 0, totalEnergyKCal =0, totalCarbohydrate =0, totalSaturatedFat =0, totalFat=0, totalProtein=0, sodium=0;

    for (let i=0; i<ingredients.length; i++) {
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
            ingredients[i].sodium = 0.1
        } else {
            sodium += (parseFloat(ingredients[i].sodium)  * parseFloat(quantity[i]))/devisor;
        }
    }
    return {energyKCal: totalEnergyKCal, energyKJ: totalEnergyKJ, protein: totalProtein, carbohydrate: totalCarbohydrate, sugars: totalSugars, fat: totalFat, saturatedFat: totalSaturatedFat, fibre: totalFibre, salt:(sodium*2.5)/1000}
}

function referenceIntakesCal(nutriObj) {
    let [riKcal, riKJ, riProtein, riCarb, riSugars, riFat, riSat, riFibre, riSalt] 
    = [(nutriObj.energyKCal * 100) / 2000,
        (nutriObj.energyKJ * 100)/ 8400,
        (nutriObj.protein * 100) / 50,
        (nutriObj.carbohydrate *100) / 260,
        (nutriObj.sugars * 100) / 90,
        (nutriObj.fat * 100) / 70,
        (nutriObj.saturatedFat * 100) / 20,
        nutriObj.fibre,
        (nutriObj.salt * 100) / 6];
    
    return {riKcal, riKJ, riProtein, riCarb, riSugars, riFat, riSat, riFibre, riSalt};
};

function perHundredContains(nutriObj, totalWeight) {
    let [hdKcal, hdKJ, hdProtein, hdCarb, hdSugars, hdFat, hdSat, hdFibre, hdSalt]
    = [nutriObj.energyKCal, nutriObj.energyKJ, nutriObj.protein, nutriObj.carbohydrate,
        nutriObj.sugars, nutriObj.fat, nutriObj.saturatedFat, nutriObj.fibre,
        nutriObj.salt].map((i) => (i * 100) / totalWeight);
    return {hdKcal, hdKJ, hdProtein, hdCarb, hdSugars, hdFat, hdSat, hdFibre, hdSalt}
};

function perPortionContains(nutriObj, numOfServings) {
    let [ppKcal, ppKJ, ppProtein, ppCarb, ppSugars, ppFat, ppSat, ppFibre, ppSalt]
    = [nutriObj.energyKCal, nutriObj.energyKJ, nutriObj.protein, nutriObj.carbohydrate,
        nutriObj.sugars, nutriObj.fat, nutriObj.saturatedFat, nutriObj.fibre,
        nutriObj.salt].map((i) => i / numOfServings);
    return {ppKcal, ppKJ, ppProtein, ppCarb, ppSugars, ppFat, ppSat, ppFibre, ppSalt}
};

function dailyRIContains(riObj, numOfServings) {
    let [driKcal, driKJ, driProtein, driCarb, driSugars, driFat, driSat, driFibre, driSalt]
    = [riObj.riKcal, riObj.riKJ, riObj.riProtein, riObj.riCarb,
        riObj.riSugars, riObj.riFat, riObj.riSat, riObj.riFibre,
        riObj.riSalt].map((i) => i / numOfServings);
    return {driKcal, driKJ, driProtein, driCarb, driSugars, driFat, driSat, driFibre, driSalt}
}

function labelFat(fatPerHundredGrams) {
    // Fat low-3, high-17.5
    if (fatPerHundredGrams <= 3) {
        return {level:'Low', color: 'green'};
    }
    else if(fatPerHundredGrams > 3 && fatPerHundredGrams < 17.5) {
        return {level: 'Medium', color: 'amber'};
    } else {
        return {level: 'High', color: 'red'};
    }
}

function labelSatFat(satFatPerHundredGrams) {
    // Saturated fat low-1.5, high-5
    if (satFatPerHundredGrams <= 1.5) {
        return {level:'Low', color: 'green'};
    }
    else if (satFatPerHundredGrams > 1.5 && satFatPerHundredGrams < 5) {
        return {level: 'Medium', color: 'amber'};
    } else {
        return {level: 'High', color: 'red'};
    }
}

function labelSugars(sugarsPerHundredGrams) {
    // // Sugars low-5, high-22.5
    if (sugarsPerHundredGrams <= 5) {
        return {level:'Low', color: 'green'};
    }
    else if (sugarsPerHundredGrams > 5 && sugarsPerHundredGrams < 22.5) {
        return {level: 'Medium', color: 'amber'};
    } else {
        return {level: 'High', color: 'red'};
    }
}

function labelSalt(saltPerHundredGrams) {
    // Salt low-0.3, high-1.5 or sodium low-0.1, high-0.6
    if (saltPerHundredGrams <= 0.3) {
        return {level:'Low', color: 'green'};
    }
    else if (saltPerHundredGrams > 0.3 && saltPerHundredGrams < 1.5) {
        return {level: 'Medium', color: 'amber'};
    } else {
        return {level: 'High', color: 'red'};
    }
}