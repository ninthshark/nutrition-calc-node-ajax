const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nutritionalSchema = new Schema({
    "food_name": {type: String},
    "protein": {type: String, default: "0"},
    "fat": {type: String, default: "0"},
    "saturated_fat": {type: String, default: "0"},
    "carbohydrate": {type: String, default: "0"},
    "energy_kcal": {type: String, default: "0"},
    "energy_kj": {type: String, default: "0"},
    "sugars": {type: String, default: "0"},
    "fibre": {type: String, default: "0"},
    "sodium": {type: String, default: "0"}
});

const Nutri = mongoose.model('nutrifacts', nutritionalSchema);
module.exports = Nutri;