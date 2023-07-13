const mongoose = require('mongoose');
 
// mongoose.connect('mongodb://127.0.0.1:27017/dikmart',{
//     useNewUrlParser:true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// });
 
const username = "admin";
const password = "SYn9I544Gpcxecvy";
const cluster = "cluster0.jgkwynu";
const dbname = "dikmart";

mongoose.connect(
    `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  ); 


const Contact = mongoose.model('contact',{
    nama:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },    
    noHp: {
        type: String,
        required: true
    },   
});

module.exports = Contact;