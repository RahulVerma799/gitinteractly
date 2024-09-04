
const express=require("express")
const app=express();

const bodyParser=require("body-parser")


app.use(bodyParser.json())
const contactRoutes = require('./routes/contactRoutes');
app.use('/api', contactRoutes);

app.listen(3000,()=>
    console.log("application running on port 3000")
)



