// Importing required modules
const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const cors=require('cors');
const passport=require('passport');
const mongoose=require('mongoose');
const morgan=require('morgan');
const config=require('./config/database');

// Importing Sub Routes
const userRoutes=require('./routes/userRoutes');
const itemRoutes=require('./routes/itemRoutes');
const transactionRoutes=require('./routes/transactionRoutes');
const tagRoutes=require('./routes/tagRoutes');
const emailRoutes=require('./routes/emailRoutes');

mongoose.Promise=global.Promise;
// Connecting to MongoDB Database
mongoose.connect(config.database,{useMongoClient: true});

// On connection
mongoose.connection.on('connected',()=>{
	console.log('[INFO] Connected to database '+config.database)
})

// On error
mongoose.connection.on('error',(err)=>{
	console.log("[INFO] Connection to database failed.")
	setTimeout(()=>{
		console.log('[INFO] Reconnecting to '+config.database)
		mongoose.connect(config.database,{useMongoClient: true});
	},2000)
})

// Creating express application
const app=express();

// Setting the port number for the server
const PORT=process.env.PORT || 8080;

// CORS middleware lets the user make request to API's from other domains as well
app.use(cors());

// Morgan Middleware logs all the incoming request on the server console.
app.use(morgan('dev'));

// Serve static content for the app from the 'public' directory in the application directory
app.use('/public',express.static(path.join(__dirname,'public')));

// Body parser middleware helps to parse the request data
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

// Passport Middleware (JWT Stands for JSON Web Token)
app.use(passport.initialize());
app.use(passport.session());
// Setting the JwtStrategy and ExtractJwt
require('./config/passport')(passport);

// Adding SubRoutes
app.use('/user',userRoutes);
app.use('/',itemRoutes);
app.use('/',transactionRoutes);
app.use('/',tagRoutes);
app.use('/',emailRoutes);
// Setting the index route
app.get('/',(req,res)=>{
	res.send('Welcome to server side of VStore!!')
});

// Starting the server
app.listen(PORT,()=>{
	console.log('[INFO] VStore Server started on port '+PORT);
});