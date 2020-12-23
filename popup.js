chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  let thisTab = tabs[0];
  document.getElementById("title").innerHTML = thisTab.title;
  document.getElementById("url").innerHTML = thisTab.url;
});

// function getMetas() {
//   chrome.tabs.executeScript(null, {
//     file: 'getMetaData.js'
//   }, function() {
//     if (chrome.runtime.lastError){
//       console.log("Error Occured");
//     }
//   });
// }

var siteCode = `
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
`

function getMetas() {
  chrome.tabs.executeScript(null, {
    code: siteCode
  }, function() {
    if (chrome.runtime.lastError){
      console.log("Error Occured");
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender){
  if(request.method == "getMetaData"){
    document.getElementById("site_title").innerHTML = request.siteName
  }
});

window.onload = getMetas;

document.getElementById("titleButton").addEventListener("click", (event) => {
  copyTitle();
})

function copyTitle(){
  let thisText = document.getElementById("title").innerHTML;
  copyText(thisText);
}

document.getElementById("siteButton").addEventListener("click", (event) => {
  copySite();
})

function copySite(){ 
  let thisText = document.getElementById("site_title").innerHTML;
  copyText(thisText);
}

document.getElementById("urlButton").addEventListener("click", (event) => {
  copyURL();
});

function copyURL(){
  let thisText = document.getElementById("url").innerHTML;
  copyText(thisText)
}


function copyText(text){
  var dummy = document.createElement("input");

  document.body.appendChild(dummy);

  dummy.setAttribute("id", "dummy_id");

  document.getElementById("dummy_id").value = text;

  dummy.select();

  document.execCommand("copy");

  document.body.removeChild(dummy);

  console.log("Done");
}