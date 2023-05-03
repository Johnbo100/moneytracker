const express = require('express')
const app = express()
const mysql = require('mysql2')
const cors = require('cors')

app.use(cors())
app.use(express.json())


const db = mysql.createConnection({
    user:'',
    host:'',
    password:'',
    database:''
})

app.get('/',(req,res)=>{
    db.query("SELECT * FROM expenses",(err,result)=>{
        if(err){
            console.log('there is an error in node JS' +err)
        }
        else{
            res.send(result)
            
        }
    })
})

app.listen(3003,()=>{
    console.log('server running on port 3003')
})
