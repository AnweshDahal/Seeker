var userAgent = navigator.userAgent; // getting the useragent for determining the browser
var platform = "";

if (userAgent.includes(" Edg")){
  platform = "Edge"
} else if (userAgent.includes(" Chrome")){
  platform = "Chrome"
}

document.querySelector("#platform").innerHTML = platform; // adding the platform to the ext.

// Querying the tabs
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  let thisTab = tabs[0]; // Selecting the current tab
  document.getElementById("title").innerHTML = thisTab.title; // currTab -> title
  document.getElementById("url").innerHTML = thisTab.url; // currTab -> url
});

function getMetas() {
  // Injecting a script onto a page
  chrome.tabs.executeScript(null, {
    file: "getMetaData.js" // gets the metadata
  }, function() {
    if (chrome.runtime.lastError){
      console.log("Error Occured");
    }
  });
}

// Checking for a message from the injected scripts
chrome.runtime.onMessage.addListener(function(request, sender){
  if(request.method == "getMetaData"){
    document.getElementById("site_title").innerHTML = request.siteName
  }
});

window.onload = getMetas; // Injecting the script after the page loads completely

let copyBTNS = document.querySelectorAll(".cbtn");

for (let i = 0; i < copyBTNS.length; i++){
  copyBTNS[i].addEventListener("click", (event) => {
    copyTitle2(event);
  });
}


function copyTitle2(e){
  let whichBtn = e.target;
  if (whichBtn.tagName == "IMG"){
    whichBtn = whichBtn.parentElement;
  }
  whichBtn = whichBtn.getAttribute("id");
  if(whichBtn == "titleButton"){
    let thisText = document.getElementById("title").innerHTML;
    copyText(thisText);
  } else if (whichBtn == "siteButton"){
    try {
      let thisText = document.getElementById("site_name").innerHTML;
      copyText(thisText);
    } catch (TypeError) {
      copyText("");
    }
  } else if (whichBtn == "urlButton"){
    let thisText = document.getElementById("url").innerHTML;
    copyText(thisText);
  }else {
    console.log("Error")
  }
}

// // Adding copy function to the copy title button
// document.getElementById("titleButton").addEventListener("click", (event) => {
//   copyTitle();
// })


// function copyTitle(){
  // let thisText = document.getElementById("title").innerHTML;
  // copyText(thisText);
// }

// document.getElementById("siteButton").addEventListener("click", (event) => {
//   copySite();
// })

// function copySite(){ 
//   let thisText = document.getElementById("site_title").innerHTML;
//   copyText(thisText);
// }

// document.getElementById("urlButton").addEventListener("click", (event) => {
//   copyURL();
// });

// function copyURL(){
//   let thisText = document.getElementById("url").innerHTML;
//   copyText(thisText)
// }


function copyText(text){
  if (text === ""){
    let toast = document.getElementById("toast");

    toast.innerHTML = "Empty String!"

    toast.className = "show";

   setTimeout(function() {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  } else {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);


    let toast = document.getElementById("toast");
    toast.innerHTML = "Copied To Clipboard!";
    toast.className = "show";

    setTimeout(function() {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }
  
}