// Create

$(document).ready(function(){
    document.querySelector(".title-field").focus();
  });

let createBtn = document.querySelector(".create-btn");
createBtn.addEventListener('click', handleCreate);


let titleInput = document.querySelector(".title-field");
let artistInput  = document.querySelector(".artist-field");
let imgInput  = document.querySelector(".img-field");
let descrInput  = document.querySelector(".descr-field");
let yearInput  = document.querySelector(".year-field");
let colorsInput  = document.querySelector(".colors-field");

let field_list = [titleInput, artistInput, imgInput, descrInput, yearInput, colorsInput];
let field_strings = ['Title', 'Artist', 'Image', 'Description', 'Year', 'Colors'];

$(".form-control").keypress(function(e) {
  if (e.key === 'Enter'){
      handleCreate(e); 
  }       
});

let warn  = document.querySelector(".warn");
let createSuccess1  = document.querySelector(".create-success-1");
let createSuccess2 = document.querySelector(".create-success-2");

function handleCreate(e){
    // if correctly filled out form we need to add item to our DB
    
    //alert('hello?');
    e.preventDefault();
    
    warn.innerHTML = '';
    createSuccess1.innerHTML = '';
    createSuccess2.innerHTML = '';


    const cursor_list = [];
    const errorList = [];
    for (var i=0; i < field_list.length; i++){
        if ((field_list[i].value === '') || (!field_list[i].value.trim().length)){
            errorList.push(field_strings[i]);
            cursor_list.push(field_list[i]);
        } else if (field_strings[i] === 'Year'){
            if (isNaN(field_list[i].value)){
                errorList.push(field_strings[i]);
                cursor_list.push(field_list[i]);
            }
        } else if (field_strings[i] === 'Image'){
            if (!checkURL(field_list[i].value)){
                errorList.push(field_strings[i]);
                cursor_list.push(field_list[i]);
            }
        }
    }

    if (cursor_list.length != 0){
        console.log(cursor_list);
        cursor_list[0].focus();
    }
    
    if (errorList.length === 0){
        // add to DB
        const new_art={};
        new_art['title'] = titleInput.value;
        new_art['artist'] = artistInput.value;
        new_art['image'] = imgInput.value;
        new_art['description'] = descrInput.value;
        new_art['year'] = yearInput.value;
        
        const valuesArr = colorsInput.value.split(',');
        var colorsArr = [];
        for (var n=0; n<valuesArr.length; n++){
            const tempDict = {};
            tempDict['value'] = valuesArr[n];
            colorsArr.push(tempDict);
        }
        console.log(colorsArr);
        new_art['colors'] = colorsArr;
        
        save_art(new_art);
    } else {
        const warning = document.createElement("div");
        warning.classList.add("alert", "alert-warning", "alert-dismissible", "fade", "show", "mt-5");

        let errorFields ='';
        for (var i=0; i < errorList.length; i++){
            if (i == errorList.length-1){
                errorFields = errorFields.concat(errorList[i]);
            } else {
                errorFields = errorFields.concat(errorList[i].concat(", "));
            } 
        }

        warning.textContent = "Please enter valid value(s) for: " + errorFields;
        warn.appendChild(warning);
    }
};

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}


let createForm  = document.querySelector(".create-form");
let create  = document.querySelector(".create");
let createHeader  = document.querySelector(".create-header");

function save_art(new_art) {
    
    $.ajax({
        type: 'POST',
        url: 'save_art',
        data: JSON.stringify(new_art),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(result){
            // need to return link of new piece
            //console.log(result);
            createHeader.textContent = 'Add another to the archive!';
            
            const linkText = document.createElement("span");
            linkText.classList.add('form-success');
            linkText.textContent = 'New item successfully created. ';
            createSuccess1.appendChild(linkText);

            const linkwrap = document.createElement("span");
            linkwrap.classList.add('form-success');
            const id = result['new_entry']['id'];
            const anchor = document.createElement("a");
            const url = '/view/' + id.toString();
            anchor.textContent = " Check it out!";
            anchor.setAttribute('href', url);
            linkwrap.appendChild(anchor);
            
            createSuccess2.appendChild(linkwrap);
            create.prepend(createSuccess2);
            create.prepend(createSuccess1);

            document.querySelector(".create-form").reset();
            document.querySelector(".title-field").focus();

          },
        error: function(request, status, error){
            console.log('Error');
            console.log(request);
            console.log(status);
            console.log(error);
          }
        })
};


// SEARCH
let btn = document.querySelector(".button-style");
btn.addEventListener('click', handleClick);
let searchInput = document.querySelector(".search-input");

$(".search-input").keypress(function(e) {
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