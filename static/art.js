$(document).ready(function(){
  console.log('ready!');
  display_latest(art);
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
}

const artList = document.querySelector('.art');
artList.classList.add("row-cols-1", "row-cols-md-3", "g-4", "mt-3", "gx-5", "justify-content-center");

function display_latest(art) {

  artList.innerHTML = '';

  let i = 0;
  if (art.length > 5){
    i = art.length-5;
  }

  for (i; i<art.length;i++) {

    const row = document.createElement("div");


    const art_column = document.createElement("div");
    art_column.classList.add('col','border-format');
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
    temp_div.innerHTML = art[i]['title'];
    temp_div.classList.add('helper');
    data_fields.appendChild(temp_div);

    const temp_div2 = document.createElement("div");
    temp_div2.innerHTML = "<em>by: </em>" + '<span class=\'helper2\'>' + art[i]['artist'] + '</span>';
    temp_div2.classList.add('helper2');
  
    data_fields.appendChild(temp_div2);
    data_fields.classList.add('summary');
    
    art_card.appendChild(data_fields);

    artList.prepend(row)
  }
  
}

function searchArt(search) {


  const url_nav = 'search/' + search;


  $.ajax({
    type: 'POST',
    url: url_nav,
    contentType: 'application/json; charset=utf-8',
    success: function(result){
      window.location.href=url_nav;
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
  const url_nav = 'view/' + id;

  $.ajax({
    type: 'GET',
    url: url_nav,
    contentType: 'application/json; charset=utf-8',
    success: function(result){

      window.location.href=url_nav;
    },  
    error: function(request, status, error){
      console.log('Error');
      console.log(request);
      console.log(status);
      console.log(error);
    }
  });

}