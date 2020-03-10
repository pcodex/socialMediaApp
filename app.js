//load modules
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

//load the config where the mongodb connection string is set
const mykeys = require('./config/key.js');

//initialize application
const app = express();
//setup template engine
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));

app.set('view engine','handlebars');

//set up static files to server css, js, images
app.use(express.static('public'));

//connect to remote db
mongoose.connect(mykeys.MongoURI, 
    {
    useNewUrlParser:true, useUnifiedTopology:true 
    } 
    )
.then( () => {
    console.log('Connected to remote dbase Online Dating App');
})
.catch( (err) => {
    console.log(err);
}
);

//set port environment variable
var port = process.env.PORT||3001;

app.listen(port,()=>{
    console.log('Server running on port ' + port);
});

//handle home route
app.get('/', (req,res) => {
 res.render('home.handlebars');
});

//handle about route
app.get('/about',(req, res) => {
    res.render('about');
});