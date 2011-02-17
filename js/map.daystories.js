// Tell Safari not to move the window
 function BlockMove(event) {event.preventDefault() ;}

//KHTML: Init the kmap
map=null;
img=null;

function initkmap(){
	map=new kmap(document.getElementById("map"));
	var center=new kPoint(52.15,5.3833333);
	map.setCenter(center,7);
}

// Defining img
img=document.createElement("img");
img.setAttribute("src","i/shape.png");
img.style.position="absolute";
img.style.top="-5px";    //<---  flag
img.style.left="-5px";    //<---  flag
img.style.width="20px";    //<---  flag
img.style.height="10px";

function setpoint(lat, lon){  
  var img2 = img.cloneNode(true);
	var point=new kPoint(lat, lon);
	var m=new kMarker(point,img2);
	map.addOverlay(m);
}

function go(){
  setpoint(52.15, 5.38);
  setpoint(52,5.3833333);  
  setpoint(52,5.5);  
}

function bbox(){
	var NE=map.getBounds().getNE();
	var SW=map.getBounds().getSW();
	var bbox = (NE.lat + "," + NE.lng + "," + SW.lat + "," + SW.lng);
	//console.log(bbox);
	return bbox;
}
