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

// querying copy buttons to add event
let copyBTNS = document.querySelectorAll(".cbtn");

for (let i = 0; i < copyBTNS.length; i++){
  // adding copy event to the copy buttons
  copyBTNS[i].addEventListener("click", (event) => {
    copyTitle2(event);
  });
}

/**
 * selects and copies the desired text
 * @param {event} e 
 */
function copyTitle2(e){
  let whichBtn = e.target;
  // Selects the BUTTON element if the user
  // clicks on the IMG inside the BUTTON node
  if (whichBtn.tagName == "IMG"){
    whichBtn = whichBtn.parentElement; // The button is the parent to the img element
  }

  /**
   * Here the content of the target element id determined according to the 
   * ID of the button
   */
  whichBtn = whichBtn.getAttribute("id");
  if(whichBtn == "titleButton"){
    let thisText = document.getElementById("title").innerHTML;
    copyText(thisText);
  } else if (whichBtn == "siteButton"){
    try {
      let thisText = document.getElementById("site_title").innerHTML;
      copyText(thisText);
    } catch (TypeError) {
      copyText("");
    }
  } else if (whichBtn == "urlButton"){
    let thisText = document.getElementById("url").innerHTML;
    copyText(thisText);
  }else {
    console.log("Unknown Button")
  }
}
/**
 * copies the parameter to the clip board
 * 
 * @param {string} text 
 */
function copyText(text){
  // Displays the appropriate toast if the field is empty
  if (text == ""){
    let toast = document.getElementById("toast");

    toast.innerHTML = "Empty String!"

    toast.className = "show";

   setTimeout(function() {
      toast.className = toast.className.replace("show", "");
    }, 3000);
    
  } else {
    var dummy = document.createElement("input"); // Creates an input element
    document.body.appendChild(dummy); // adds the element to the body
    dummy.setAttribute("id", "dummy_id"); // sets the if og the element
    document.getElementById("dummy_id").value = text; // gets the input element and sets its value to parameter
    dummy.select(); // selects the content of the element
    document.execCommand("copy"); // executes the copy command Ctrl+C
    document.body.removeChild(dummy); // Removes the input element


    let toast = document.getElementById("toast"); // selects the toast
    toast.innerHTML = "Copied To Clipboard!"; // sets the text of the toast
    toast.className = "show"; // shows the toats


    // Hides the toast after 3 seconds = 3000 ms
    setTimeout(function() {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }
  
}