var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');

var app = express();
var request = require('request');

var bodyParser = require('body-parser');


app.use(bodyParser.json());   
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
// app.use(express.favicon(path.join('/', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use('/templates', express.static(__dirname + '/views/'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
   next();
});


app.get('/',function(req, res){
	res.render("home");
});


app.get('/convert/',function(req, res){
	if(req.query.url){
		var url  = req.query.url;
		if(url.substr(-4) == ".csv"){
			request(url,function(error, response, body){
                if(error){
                	res.status(200).send('Invalid url.');
                }
                else if(response.statusCode !== 200){
			       res.status(200).send('Invalid file or url.');
			    }
                else{
                	try{
                		var lines = body;
                		var Json = [];
                		var keys =[];
                		var status = false;
                		lines = (lines).split("\n");
		   				if(lines.length > 1){
		   					
		   					lines.map(function(d, i){
		   						var columns = d.split(","); 
		   						if(i != 0){
		   							var jsonObj = createJosn(columns, keys);
		   							if(typeof jsonObj !== "object"){
		   								throw error;
		   							}	
		   							Json.push(jsonObj);
		   						}
		   						else{
		   							keys = addKeys(columns);
		   							if(typeof keys !== "object"){
		   								throw error;
		   							}
		   						}	
		   					});
		   					res.set('content-type','application/json');
		   					res.status(200).send(Json);		
		   				}else{
		   					res.status(200).send('Empty File.');		
		   				}
                	}catch(err){
                		res.status(200).send('File parse error.');
                	}
                }
			});
		}else{
				res.status(200).send("Invalid File Format.");
		}
	}else{
		res.status(200).sendStatus("Please provide a valid url.");	
	}
});

function addKeys(columns){
   try{
   	   var keys = [];
	   columns.map(function(d, i){
			keys.push(d);		
	   });	
	   return keys
   }catch(err){
   		return 0;
   }
}

function createJosn(columns, keys){
   try{
   	   var json = {};
	   columns.map(function(d, i){
	   	    d = d.replace(/\r/ig,"");
	   	    if(parseFloat(d)){
	   	    	json[keys[i]] = parseFloat(d);	
	   	    }else if(!d.match(/null/ig)){
	   	    	json[keys[i]] = d;
	   	    }else{
	   	    	json[keys[i]] = null;
	   	    }
					
	   });	
	   return json
   }catch(err){
   		return 0;
   }
}

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.listen(process.env.PORT || 3000, function () {
	console.log("server listening on port 3000");
});
