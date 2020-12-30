var metaData = document.getElementsByTagName("meta"); // Getting all of the meta tag
var sitename = ""

for (let i = 0; i < metaData.length; i++){
  let currTag = metaData[i];
  let currProperty = currTag.getAttribute("property");
  if (currProperty != null){
    // og:site_name = the site's title
    if (currProperty === "og:site_name"){
      sitename = currTag.getAttribute("content");
      break;
    }
  }
}

// Sending the message from the injected script to the extension on 
// run time
chrome.runtime.sendMessage({
  method: "getMetaData",
  siteName: sitename
});