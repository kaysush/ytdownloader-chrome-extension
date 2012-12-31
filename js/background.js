chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	var url=sender.tab.url;
  	var part=url.split("&")[0];
  	var id=part.split("=")[1];
  	var markup=getMarkup(id,sendResponse);
  	return true;
  });

function getMarkup(vid,sendResponse)
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET",'http://www.youtube.com/get_video_info?video_id='+ vid, true);
	xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
  	sendResponse({markup: xhr.responseText});
  }
}
	xhr.send();
}

function getUrl(){
chrome.tabs.getSelected(null, 
	function(tab) 
	{ 
		var myTabUrl = tab.url; 
		return myTabUrl;
	});
}