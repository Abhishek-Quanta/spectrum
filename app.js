require('dotenv').config()
const express=require('express')
const http=require('http')
const createError=require('http-errors')

const mongoose=require('mongoose')
const session=require('express-session')
const MongoDBStore=require('connect-mongodb-session')(session)

const cors=require('cors')
const app=express()
const indexRouter=require('./routes/index')
const usersRouter=require('./routes/users')

const server=http.createServer(app)
const port=normalizePort(process.env.PORT||'5000')
function normalizePort(val){
    var port=parseInt(val,10)
    if(isNaN(port))
        return val
    if(port>=0)
        return port
    return false
}
//connect to mongoDB
const mongoDB=process.env.MONGODB_URI
mongoose.connect(mongoDB,{useNewUrlParser:true,useUnifiedTopology:true})
const db=mongoose.connection
db.on('error',console.error.bind(console,"MongoDB connection error: "))
//set store for sessions
const store=new MongoDBStore({
    uri:mongoDB,
    collection:"mySessions"
})
store.on("error",err=>console.error(err))

app.set('port',port)

app.use(cors({origin:"http://localhost:3000",credentials:true}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

if(process.env.NODE_ENV==="production"){
    app.use(express.static("spectrum-client/build"))
}

app.use(session({
    secret:process.env.SECRET_CK,
    resave:false,
    saveUninitialized:false,
    store:store
}))

app.use('/',indexRouter)
app.use('/users',usersRouter)
app.use(function(req,res,next){
    next(createError(404))
})
app.use(function(err,req,res,next){
    res.locals.message=err.message
    res.locals.error=req.app.get('env')==="development"?err:{}
    res.status(err.status||500).end()
})

server.listen(port)
server.on("error",onError)
server.on("listening",onListening)

function onError(err){
    if(err.syscall!=="listen")
        throw err
    var bind=typeof port==="string"?"Pipe "+port
                :"Port "+port
    switch(err.code){
        case "EACCES":
            console.error(bind+" requires elevated privilages")
            process.exit(1)
            break
        case "EADDRINUSE":
            console.error(bind+" is already in use")
            process.exit(1)
            break
        default:
            throw err
    }
}
function onListening(){
    var addr=server.address()
    var bind=typeof addr==="string"?"pipe "+addr
                :"port "+addr.port
    console.log("Listening on",bind)
}