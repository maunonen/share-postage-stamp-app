const mongoose =  require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {

    // fixing deprecation warnings of MongoBD 
    
    useNewUrlParser : true, 
    useCreateIndex : true, 
    useFindAndModify : false

}).then(() => {
    console.log('Connection successfully to DataBase')
}).catch((e) => {   
    console.log('Can not coonect to DB')
}) 