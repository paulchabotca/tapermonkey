// ==UserScript==
// @name         AmazonTopSearch
// @namespace    http://www.paulchabot.ca
// @version      0.1
// @description  adds search nav to top of page
// @author       Paul Chabot
// @include https://www.amazon.ca/s?*
// @grant        none
// ==/UserScript==

// finds the next page link in the ul list at bottom of search page
var pages = [];

function anpPages(){
    setTimeout(3000);
    var nextpage = $x('//*[@id="search"]/div[1]/div[2]/div/span[7]/div/div/div/ul/li[@class="a-last"]/a', XPathResult.FIRST_ORDERED_NODE_TYPE);
    var prevpage = $x('//*[@id="search"]/div[1]/div[2]/div/span[7]/div/div/div/ul/li/a', XPathResult.FIRST_ORDERED_NODE_TYPE);
    var total = $x('//*[@id="search"]/div[1]/div[2]/div/span[7]/div/div/div/ul/li[@class="a-disabled"]', XPathResult.FIRST_ORDERED_NODE_TYPE);
    console.log(total)
    console.log(prevpage)
    console.log(nextpage)
    pages[2] = nextpage.href
    pages[1] = prevpage.href
    pages[0] = total.innerHTML
    pages[3] = ampJumpLink(pages[2], pages[0])
    return pages;
}
// takes next url and creates jump link
function ampJumpLink(nextUrl, total){
    total = parseInt(total);
    var returnUrl = nextUrl;
    var currentPage = /sr_pg_(\d+)/g.exec(nextUrl)[1];
    var pageRe = /page=\d+/g

    var jumpLink = 10;
    var nextJump = parseInt(currentPage) + parseInt(jumpLink);

    console.log('Next Jump:'+nextJump);
    console.log
    if( nextJump < total){
        returnUrl = nextUrl.replace(pageRe, 'page='+nextJump)
        return returnUrl
    }
    else{
        return 0
    }
}

pages = anpPages();

console.log(pages);

// create a container for our links
var container = document.createElement("div");

// set the style for the container
container.style = "position: absolute;right:0; top: 0;z-index: 9999;width:auto;height:45px;background-color:#fff;";

// assign html elements


// if we are further than 10 pages from the total amount of search results
// create next prev and jump link else, without the jumplink
if(pages[3]){
   container.innerHTML = '[<a href="'+ pages[1] + '" class="button">Previous Page</a>] &nbsp; [<a href="'+ pages[2] + '" class="button">Next Page</a>]<br/><a href="'+pages[3]+'" class="button">Jump 10 Pages</a>';
}else{
    container.innerHTML = '[<a href="'+ pages[1] + '" class="button">Previous Page</a>] &nbsp; [<a href="'+ pages[2] + '" class="button">Next Page</a>]';
}
document.body.appendChild(container);

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
