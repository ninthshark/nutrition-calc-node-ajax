const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Nutri = require('./models/nutrition_facts');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:1234abcd@ds119685.mlab.com:19685/nutris-calc', {useMongoClient:true})
//mongoose.connect('mongodb://localhost/testJson', {useMongoClient:true})
  .then(() => { console.log('Database connected')}, err => {console.log(err)});


const db = mongoose.model

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const nutriFact = [
    {
      "food_name": "Ackee, canned, drained",
      "protein": "2.9",
      "fat": "15.2",
      "saturates": "4.44",
      "carbohydrate": "0.8",
      "sugar": "0.8",
      "energy_kcal": "151",
      "energy_kj": "625",
      "id": 1
    },
    {
      "food_name": "Agar, dried",
      "protein": "1.3",
      "fat": "1.2",
      "carbohydrate": "Tr",
      "sugar": "Tr",
      "energy_kcal": "16",
      "energy_kj": "67",
      "id": 2
    },
    {
      "food_name": "Agar, dried, soaked and drained",
      "protein": "0.2",
      "fat": "0.1",
      "carbohydrate": "Tr",
      "sugar": "Tr",
      "energy_kcal": "2",
      "energy_kj": "7",
      "id": 3
    },
    {
      "food_name": "Alfalfa sprouts, raw",
      "protein": "4.0",
      "fat": "0.7",
      "carbohydrate": "0.4",
      "sugar": "0.3",
      "energy_kcal": "24",
      "energy_kj": "100",
      "id": 4
    },
    {
      "food_name": "Allspice, ground",
      "protein": "6.1",
      "fat": "8.7",
      "carbohydrate": "N",
      "sugar": "N",
      "energy_kcal": "N",
      "energy_kj": "N",
      "id": 5
    },
    {
      "food_name": "Almonds, flaked and ground",
      "protein": "21.1",
      "fat": "55.8",
      "saturates": "4.43",
      "carbohydrate": "6.9",
      "sugar": "4.2",
      "energy_kcal": "612",
      "energy_kj": "2534",
      "fibre": "N",
      "id": 6
    },
    {
      "food_name": "Almonds, toasted",
      "protein": "21.2",
      "fat": "56.7",
      "carbohydrate": "7.0",
      "sugar": "4.3",
      "energy_kcal": "621",
      "energy_kj": "2570",
      "id": 7
    },
    {
      "food_name": "Almonds, weighed with shells",
      "protein": "7.8",
      "fat": "20.6",
      "carbohydrate": "2.5",
      "sugar": "1.5",
      "energy_kcal": "229",
      "energy_kj": "935",
      "id": 8
    },
    {
      "food_name": "Amaranth leaves, boiled in unsalted water",
      "protein": "3.0",
      "fat": "0.3",
      "carbohydrate": "0.3",
      "sugar": "0.2",
      "energy_kcal": "16",
      "energy_kj": "67",
      "id": 9
    },
    {
      "food_name": "Amaranth leaves, raw",
      "protein": "3.5",
      "fat": "0.3",
      "carbohydrate": "0.3",
      "sugar": "0.2",
      "energy_kcal": "18",
      "energy_kj": "75",
      "id": 10
    },
    {
      "food_name": "Amla",
      "protein": "0.5",
      "fat": "0.1",
      "carbohydrate": "13.7",
      "sugar": "N",
      "energy_kcal": "58",
      "energy_kj": "243",
      "id": 11
    }
  ];


app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.post('/ingredients/', (req, res) => {
    const result = req.body.food_name;
    Nutri.find({ $text: {$search:result}})
      .then((data) => {
        res.send(data);
      })
      .catch(err => console.log(err));   
});

app.get('/ingredients/:foodId', (req, res) => {
    const foodId = req.params.foodId;
    Nutri.findById(foodId)
      .then((result) => {
        res.send(result);
      })
      .catch(err => console.log(err));
});

// function lookFor(food, word) {
//     let foundList = [];
//     //let word = 'almond';
//     let lookfor = new RegExp(word,'i');
//       for ( let i=0; i<food.length; i++) {
//         var pos = food[i]["food_name"].search(lookfor);
//         if (pos != -1) {
//             foundList.push(food[i]);
//         }
//       }
//       return foundList;
// }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));