var csvConvertDOMObj = {};

function convertCsvToJosn () {
	csvConvertDOMObj.errorMessage.innerText = "";
	csvConvertDOMObj.jsonData.value = "";
	var url = csvConvertDOMObj.csvFileUrl.value;
	var urlRegx = "(https?|http)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";
	if(url.match(urlRegx)){
		if(url.substr(-4) == ".csv"){
			var xmlHttp = new XMLHttpRequest();
		    xmlHttp.onreadystatechange = function() { 
		        if (xmlHttp.readyState == 4 && (xmlHttp.status == 200 || xmlHttp.status == 0 || xmlHttp.status == 304)){
		        	csvConvertDOMObj.requestLoader.style.display = "none";
		            if(xmlHttp.responseText.indexOf("[") > -1){
		            	alert("length "+JSON.parse(xmlHttp.responseText).length);
		            	csvConvertDOMObj.jsonData.value = JSON.stringify(JSON.parse(xmlHttp.responseText), null, 2);
		            }else{
		            	csvConvertDOMObj.errorMessage.innerText = xmlHttp.responseText;
		            }
		        }
		        else if(xmlHttp.readyState == 4 && xmlHttp.status == 404){
		        	csvConvertDOMObj.errorMessage.innerText = "File not found.";	
		        }else if(xmlHttp.readyState == 2){
		        	csvConvertDOMObj.requestLoader.style.display = "inline-flex";
		        }
		    }
		    xmlHttp.open("GET", 'http://localhost:3000/convert/?url='+url, true); // true for asynchronous 
		    xmlHttp.send(null);
		}else{
			csvConvertDOMObj.errorMessage.innerText = "Invalid file format.";	
		}
	}else{
		csvConvertDOMObj.errorMessage.innerText = "Please provide a valid url. Eg: http://domainName.com/filePath/CSVFileName.csv";
	}
}

function loadCsvConvertDomObj () {
	csvConvertDOMObj.errorMessage = document.getElementById("errorMessage");
	csvConvertDOMObj.jsonData = document.getElementById("jsonData");
	csvConvertDOMObj.csvFileUrl = document.getElementById("csvFileUrlInput");
	csvConvertDOMObj.requestLoader = document.getElementById("requestLoader");	
}