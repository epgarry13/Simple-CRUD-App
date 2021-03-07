$(document).ready(function(){
  console.log('ready!');
  display_matches(searchResults); // the first element of search results contains search param
});

// SEARCH
let btn = document.querySelector(".button-style");
btn.addEventListener('click', handleClick);
let searchInput = document.querySelector(".search-input");

$("input").keypress(function(e) {
  if (e.key === 'Enter'){
      handleClick(e); 
  }       
});

function handleClick(event){
  event.preventDefault();
  const searchItem = searchInput.value;
  if (searchItem.trim() != ''){
    searchArt(searchItem);
  }
  return false;
}

const artList = document.querySelector('.art');
artList.classList.add("row-cols-1", "row-cols-md-3", "g-4", "mt-3", "gx-5","justify-content-center");

const srDiv = document.querySelector('.search-results');

function display_matches(art) {

  artList.innerHTML = '';

  const tempContainer = document.createElement("div");
  tempContainer.classList.add("d-flex", "justify-content-center", "col-12");
  
  const headerTag = document.createElement("h3");
  let lenSR = searchResults.length;
  if (lenSR == 2){
    headerTag.innerHTML = "There is " +'<span class=\'helper3\'><strong>1</strong></span>' + " search result.";
  } else{
    headerTag.innerHTML = "There are " + "<span class=\'helper3\'><strong>" + (searchResults.length-1).toString() + "</strong></span>" + "search results.";
  }
  

  tempContainer.appendChild(headerTag);
  srDiv.appendChild(tempContainer);
  

  for (let i = 1; i<art.length; i++) {

    const row = document.createElement("div");

    const art_column = document.createElement("div");
    art_column.classList.add('col')
    row.appendChild(art_column);

    const art_card = document.createElement("div");
    art_card.classList.add('card');
    art_card.setAttribute('id', art[i]['id'].toString());
    art_card.setAttribute('onclick', "view_art(event)");
    art_column.appendChild(art_card);

    const art_image = document.createElement("img");
    art_image.classList.add("img-thumbnail");
    art_image.setAttribute('id', art[i]['id'].toString());
    art_image.setAttribute('src', art[i]['image']);
    art_image.setAttribute('alt', art[i]['title']);
    art_card.appendChild(art_image);

    const data_fields = document.createElement("div");
    const temp_div = document.createElement("div");
    temp_div.innerHTML = highlightText(searchResults[0], art[i]['title']);
    temp_div.classList.add('helper');
    data_fields.appendChild(temp_div);

    const temp_div2 = document.createElement("div");
    temp_div2.innerHTML = "<em>by: </em>" + '<span class=\'helper2\'>' + highlightText(searchResults[0], art[i]['artist']) + '</span>';
    temp_div2.classList.add('helper2');
  
    data_fields.appendChild(temp_div2);
    data_fields.classList.add('summary');

    art_card.appendChild(data_fields);

    artList.prepend(row);
  }
  
}

function highlightText(needle, haystack){

  result = '<span>';
  const len = needle.length;
  console.log(haystack);
  let j = 0;
  while (j < haystack.length){
    const tempSubStr = haystack.substring(j, j+len);
    if (tempSubStr.toLowerCase() == needle.toLowerCase()){
      innerHTML = "<strong>" + tempSubStr + "</strong>";
      result = result + innerHTML;
    } else {
      result = result + tempSubStr
    }

    j = j + len;
  }

  result = result + "</span>";
  console.log(result);
  return result
}

function searchArt(search) {


  const url_nav = '../search/' + search;


  $.ajax({
    type: 'POST',
    url: url_nav,
    contentType: 'application/json; charset=utf-8',
    success: function(result){
      window.location.replace("http://" + window.location.host + '/search/' + search);
    },
    error: function(request, status, error){
      console.log('Error');
      console.log(request);
      console.log(status);
      console.log(error);
    }
  });

}

// one_piece section

function view_art(e){
  // get id of event for render
  // e.preventDefault();
  highlight_art(e.target.id); 
};

function highlight_art(id) {
  const url_nav = '../view/' + id;

  $.ajax({
    type: 'GET',
    url: url_nav,
    contentType: 'application/json; charset=utf-8',
    success: function(result){
      //display_one(result['art'][0])
      window.location.replace("http://" + window.location.host + '/view/' + id);
    },  
    error: function(request, status, error){
      console.log('Error');
      console.log(request);
      console.log(status);
      console.log(error);
    }
  });
}


