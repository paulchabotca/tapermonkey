// ==UserScript==
// @name         AmazonTopSearchNav
// @namespace    http://www.paulchabot.ca
// @version      0.2
// @description  adds search nav to top of page
// @author       Paul Chabot
// @include https://www.amazon.ca/s?*
// @grant        none
// ==/UserScript==

// xpath helper function from
// https://wiki.greasespot.net/XPath_Helper
function $x() {
  var x='';
  var node=document;
  var type=0;
  var fix=true;
  var i=0;
  var cur;

  function toArray(xp) {
    var final=[], next;
    while (next=xp.iterateNext()) {
      final.push(next);
    }
    return final;
  }

  while (cur=arguments[i++]) {
    switch (typeof cur) {
      case "string": x+=(x=='') ? cur : " | " + cur; continue;
      case "number": type=cur; continue;
      case "object": node=cur; continue;
      case "boolean": fix=cur; continue;
    }
  }

  if (fix) {
    if (type==6) type=4;
    if (type==7) type=5;
  }

  // selection mistake helper
  if (!/^\//.test(x)) x="//"+x;

  // context mistake helper
  if (node!=document && !/^\./.test(x)) x="."+x;

  var result=document.evaluate(x, node, null, type, null);
  if (fix) {
    // automatically return special type
    switch (type) {
      case 1: return result.numberValue;
      case 2: return result.stringValue;
      case 3: return result.booleanValue;
      case 8:
      case 9: return result.singleNodeValue;
    }
  }

  return fix ? toArray(result) : result;
}

function addAMPNav(){
    var container = $x('//*[@id="search"]', XPathResult.FIRST_ORDERED_NODE_TYPE);
    var nav = $x('//*[@id="search"]/div[1]/div[2]/div/span[7]', XPathResult.FIRST_ORDERED_NODE_TYPE);
    container.innerHTML = nav.innerHTML + container.innerHTML
}

(function() {
    'use strict';
    addAMPNav();
    // Your code here...
})();