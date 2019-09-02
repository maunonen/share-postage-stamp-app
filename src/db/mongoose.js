const mongoose =  require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {

    // fixing deprecation warnings of MongoBD 
    replicaSet: 'luontovahdit-shard-0', 
    useNewUrlParser : true, 
    useCreateIndex : true, 
    useFindAndModify : false

}).then(() => {
    console.log('Connection successfully to DataBase')
    
}).catch((e) => {   
    console.log('Can not coonect to DB')
}) 

//const session =  mongoose.startSession() 

module.exports = mongoose

