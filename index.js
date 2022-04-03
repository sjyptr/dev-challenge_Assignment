/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
let i=0; 
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

function connectCallback() {
  return new Promise((resolve, reject) => {
    client.subscribe("/fx/prices", (message) => {
      let response =JSON.parse(message.body);
    let sparklingid="example-sparkline"+i;
    let tblBody= document.getElementById('stompbody');
    let node =document.createElement('tr');
      let newRowData=`
      <td class="mdl-data-table__cell--non-numeric">${response.name}</td>
      <td>${response.bestBid}</td>
      <td>${response.bestAsk}</td>
      <td>${response.lastChangeAsk}</td>
      <td>${response.lastChangeBid}</td>
      <td> <span id=${sparklingid}></span></td>
    `;
    node.innerHTML =newRowData;
    tblBody.insertBefore(node, tblBody.firstChild)

    let midprice = (response.bestBid + response.bestAsk)/2;
     drawSparkline(sparklingid, midprice);
      i++;
    },
    (error) =>{
        resolve(false);
    });
});
  //document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
}
function drawSparkline(id,midprice){
  Sparkline.draw(document.getElementById(id), [midprice]);
  
}
client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})

// const exampleSparkline = document.getElementById('example-sparkline')
// Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])