/* Title of the video */
var title;
/* Injecting the stylesheet vis script */
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('../css/content.css');
document.head.appendChild(style);

/* Sending message to Backround Script to fetch the links
Only background script is able to to Cross-Domain AJAX calls */

chrome.extension.sendMessage({greeting: "hello"}, function(response) {
  /* Data sent by Background Script */
  var markup=response.markup;

  /* Fetch the title from data recieved */
  title=getQueryVairable(markup,"title");
  title=decodeURIComponent(title);

  /* Fetch URL stream from data recieved */
  var url_encoded_fmt_stream_map=getQueryVairable(markup,"url_encoded_fmt_stream_map");
  url_encoded_fmt_stream_map=decodeURIComponent(url_encoded_fmt_stream_map);
  var urls=getLinks(url_encoded_fmt_stream_map);

  /* Insert the download links*/
  var l=document.createElement("div");
  l.id="download-links";
  var div=$("#watch7-user-header");
  div.append("<button id='download' class='yt-uix-button'>Download</button>");

  $("#watch7-user-header #download").click(function(){
  	$("#download-links").toggle();
  })

  div.append(l);
  var temp=$("#download-links");
  l=document.createElement("div");
  l.id="link";
  temp.append(l)
  temp=$("#link");
  
  for(i in urls){
  	var obj="<a href='"+urls[i].url+"'>"+urls[i].type+"/"+urls[i].quality+"</a><br/><hr/>";
  	temp.append(obj);
  }
  $("#download-links").hide();
  
});

/* Analogy to parse_string of PHP */
function getQueryVairable(markup,key){
	var values=markup.split("&");
	for(var i=0;i<values.length;i++){
		var pairs=values[i].split("=");
		if(pairs[0]==key){
			return pairs[1];
		}
	}
}

/* Fetch quality of the video*/
function getQuality(quality)
{
	quality=decodeURIComponent(quality);
	if(quality.toLowerCase()=="small")
		return "240p";
	if(quality.toLowerCase()=="medium")
		return "360p";
	if(quality.toLowerCase()=="large")
		return "480p";
	if(quality.toLowerCase()=="hd720")
		return "720p";
	if(quality.toLowerCase()=="hd1080")
		return "1080p";
}

/* Fetch the format of video*/
function getType(type){
	type=decodeURIComponent(type);
	type=type.split(";")[0];

	if(type.toLowerCase()=="video/x-flv")
		return "flv";
	if(type.toLowerCase()=="video/mp4")
		return "mp4";
	if(type.toLowerCase()=="video/3gpp")
		return "3gpp";
	if(type.toLowerCase()=="video/webm")
		return "webm";
}


/* Extract links from URL stream */
function getLinks(url_encoded_fmt_stream_map)
{
	var links=url_encoded_fmt_stream_map.split(",");
	var urls= []
	for(i in links){
		var link=links[i];
		var url=getQueryVairable(link,"url");
		url=decodeURIComponent(url);
		var sig=getQueryVairable(link,"sig");
		sig=decodeURIComponent(sig);
		var quality=getQueryVairable(link,"quality");
		var type=getQueryVairable(link,"type");
		var finalUrl=url+"&signature="+sig+"&title="+title+"."+getType(type);
		var tempUrl=new Urls(finalUrl,getType(type),getQuality(quality));
		urls.push(tempUrl);
	}
	return urls;
}

function Urls(url,type,quality){
	this.url=url;
	this.quality=quality;
	this.type=type;
}