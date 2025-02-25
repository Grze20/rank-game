const mongoose = require('mongoose');
const { database }= require('../config');

//db connect
if(mongoose.connect(database)){
    console.log("Połączono z baza danych")
}else{
    console.log("Nie udało się połączyć z baza danych")
}




