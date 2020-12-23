var metaData = document.getElementsByTagName("meta");
var sitename = ""

for (let i = 0; i < metaData.length; i++){
  let currTag = metaData[i];
  let currProperty = currTag.getAttribute("property");
  console.log(currProperty)
  if (currProperty != null){
    if (currProperty === "og:site_name"){
      sitename = currTag.getAttribute("content");
      break;
    }
  }
}

chrome.runtime.sendMessage({
  method: "getMetaData",
  siteName: sitename
});