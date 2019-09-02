const mongoose = require('mongoose')
const validator = require('validator')

const countrySchema = new mongoose.Schema({
    
    // Afghanistan
    shortName : {
        type : String, 
        required : true 
        //trim : true
    }, 
    // the Islamic Republic of Afghanistan
    officialName : {
        type : String, 
        required  : true
    }, 
    // FI, AF 
    iso2 : {
        type : String, 
        required : true
    }, 
    flagUrl : {
           type : String , 
           validate (value){ 
               if (!validator.isURL(value)){
                   throw new Error ('Link to flag picture is not valid')
               }
           }
    }, 
    flagUrlThumbnail : {
        type : String , 
        validate (value){ 
            if (!validator.isURL(value)){
                throw new Error ('Link to flag thumbnail picture is not valid')
            }
        }
    }
})

 const temp1 = { 
    shortName : "Finland", 
    officialName : 'the Republic of Finland', 
    iso2 : 'FI', 
    flagUrl : 'http://rbc.ru/public/picture/fi.png', 
    flagUrlThumbnail : 'http://rnc.ru/public/picture/thumnail/fiTGP.png'
} 

const temp2 = { 
    shortName : "Sweden", 
    officialName :'the Kingdom of Sweden', 
    iso2 : 'SE', 
    flagUrl : 'http://rbc.ru/public/picture/se.png', 
    flagUrlThumbnail : 'http://rnc.ru/public/picture/thumbnail/seTNG.png'
} 

const temp3 = { 
    shortName : "France", 
    officialName : 'the French Republic', 
    iso2 : 'FR', 
    flagUrl : 'http://rbc.ru/public/picture/fr.png', 
    flagUrlThumbnail : 'http://rnc.ru/public/picture/thumbnail/frTNG.png'
} 

const Country = mongoose.model('Country', countrySchema)
/* const countryFI = Country.insertMany([ temp1, temp2, temp3]).then((doc) => {
    //console.log(doc)
}).catch((err) => {
    //console.log(err)
})  */

module.exports = Country