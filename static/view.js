$(document).ready(function(){
  //alert('hello world!');
  display_one(display);
});


const viewOne = document.querySelector('.view-one');


function display_one(art) {
  viewOne.innerHTML = '';

  const art_column = document.createElement("div");
  art_column.classList.add('col','pos-image');

  const art_image = document.createElement("img");
  art_image.classList.add("img-view");
  art_image.setAttribute('src', art[0]['image']);
  art_image.setAttribute('alt', art[0]['title']);
  art_column.appendChild(art_image);

  const dataFields = document.createElement("div");
  dataFields.classList.add('col');
  for (var key in art[0]) {
    if ((key === 'id') || (key === 'image')|| (key === 'colors')){
    }
    else{

      const temp_div = document.createElement("div");
      if (key!='artist'){
        temp_div.classList.add('mt-5');
      }
      

      const fieldValDiv = document.createElement("div");


      if (key === 'artist'){
        temp_div.classList.add(key, "flex-row", "center-parent");
        fieldValDiv.classList.add(key, "flex-row","center-parent");
      } else {
        temp_div.classList.add(key, "flex-row", "mt-5","center-parent");
        fieldValDiv.classList.add(key + 'val', "flex-row","center-parent");
      }
      
      const anotherDiv = document.createElement("div");
      const aThirdDiv = document.createElement("div");

      if (key === 'description'){
        anotherDiv.classList.add('center-child', key+'center');
        aThirdDiv.classList.add('center-child',key+'center');
      } else {
        anotherDiv.classList.add('center-child');
        aThirdDiv.classList.add('center-child');
      }

      anotherDiv.innerHTML = '<strong>'+ key.toUpperCase() + '</strong>';
      aThirdDiv.textContent = art[0][key];

      temp_div.appendChild(anotherDiv);
      fieldValDiv.appendChild(aThirdDiv);

      dataFields.appendChild(temp_div);
      dataFields.appendChild(fieldValDiv);

    }
  }

  // display list filed and make delete buttons

  const list_div = document.createElement("div");
  list_div.classList.add("mt-5", 'flex-row', "pos-image");
  list_div.innerHTML = '<strong>COLORS</strong>';

  const colors_div = document.createElement("div");
  colors_div.classList.add("row","pos-image");
  for (var j=0; j<art[0]['colors'].length;j++){

    const colorContainer = document.createElement("div");
    colorContainer.classList.add('color-container', 'mt-4', 'col-3');

    const temp_element = document.createElement("div");

    //temp_element.classList.add("col");
    if (art[0]['colors'][j]['mark_as_deleted'] != true){
      if (j === art[0]['colors'].length-1){
        temp_element.textContent = art[0]['colors'][j]['value'];
      } else {
        temp_element.textContent = art[0]['colors'][j]['value'] + ' ';
      }
      const delete_item = document.createElement("button");
      delete_item.classList.add("delete-button");
      delete_item.setAttribute('id', j.toString());
      delete_item.textContent = 'X';
      colorContainer.appendChild(temp_element);
      colorContainer.appendChild(delete_item);


      colors_div.appendChild(colorContainer);
      
    } else{

      const undoContainer = document.createElement("div");
      undoContainer.classList.add('color-container', 'col-4');

      const undoDelete = document.createElement("button");
      undoDelete.classList.add("undo-delete-button");
      undoDelete.setAttribute('id', j.toString());
      undoDelete.textContent = 'undo delete';
      colorContainer.appendChild(undoDelete);
      colors_div.appendChild(colorContainer);
      
    }
  }

  dataFields.appendChild(list_div);
  dataFields.appendChild(colors_div);

  viewOne.appendChild(art_column);
  viewOne.appendChild(dataFields);

  let description_edit = document.querySelector(".descriptioncenter");


  const editButton = document.createElement("button");
  editButton.classList.add('button', 'edit-button');
  editButton.textContent = 'edit';
  description_edit.appendChild(editButton);

  let editBtn = document.querySelector(".edit-button");
  editBtn.addEventListener('click', handleEdit);
 
}
  
function handleEdit(e){
  let description_edit = document.querySelector(".description");
  let descriptionVal = document.querySelector(".descriptionval");
  
  //e.preventDefault();
  description_edit.innerHTML='';
  descriptionVal.innerHTML = '';

  const changeForm = document.createElement("form");

  const changeFormLabel = document.createElement("input");
  changeFormLabel.classList.add('change-form-lab','text-box-pos')
  changeFormLabel.setAttribute('value',display[0]['description']);
  changeForm.appendChild(changeFormLabel);

  const submitButton = document.createElement("button");
  submitButton.classList.add('button', 'submit-button');
  submitButton.setAttribute('type','button');
  submitButton.textContent = 'submit';
  changeForm.appendChild(submitButton);

  const discardButton = document.createElement("button");
  discardButton.classList.add('button', 'discard-button');
  discardButton.textContent = 'discard changes';
  changeForm.appendChild(discardButton);

  description_edit.appendChild(changeForm);

  submitButton.addEventListener('click', handleSubmit);
  discardButton.addEventListener('click', handleDiscard);
}

function handleSubmit(e){

  e.preventDefault();

  
  let upd = document.querySelector('.change-form-lab');

  if (upd.value.trim() != ''){
    const data_to_send = [];
    data_to_send[0] = {};
    data_to_send[0]['id'] = display[0]['id'];
    data_to_send[0]['description'] = upd.value;
  
    console.log(JSON.stringify(data_to_send));
  
    $.ajax({
      type: 'PUT',
      data: JSON.stringify(data_to_send),
      dataType: 'json',
      url: '',
      contentType: 'application/json; charset=utf-8',
      success: function(result){
        window.location.href='' ;
        
      },  
      error: function(request, status, error){
        console.log('Error');
        console.log(request);
        console.log(status);
        console.log(error);
      }
    });
  }
}

function handleDiscard(e){
  e.preventDefault();
  window.location.reload();
}

// handle delete
$(document).on('click', ".delete-button", function(e) {
  const itemToDelete = e.target.id;
  handleDelete(itemToDelete);
});




function handleDelete(item){
  const arr = [];
  const dict = {};
  dict['id'] = display[0]['id'];
  dict['indx'] = item;
  
  arr[0] = dict;

  $.ajax({
    type: 'DELETE',
    data: JSON.stringify(arr),
    dataType: 'json',
    url: '',
    contentType: 'application/json; charset=utf-8',
    success: function(result){
      
      window.location.href='' ;
      
    },  
    error: function(request, status, error){
      console.log('Error');
      console.log(request);
      console.log(status);
      console.log(error);
    }
  });

}

// handle undo delete
$(document).on('click', ".undo-delete-button", function(e) {
  const itemToDelete = e.target.id;
  handleUndoDelete(itemToDelete);
});

function handleUndoDelete(item){
  const arr = [];
  const dict = {};
  dict['id'] = display[0]['id'];
  dict['indx'] = item;
  
  arr[0] = dict;

  $.ajax({
    type: 'POST',
    data: JSON.stringify(arr),
    dataType: 'json',
    url: '',
    contentType: 'application/json; charset=utf-8',
    success: function(result){  
      window.location.href='' ;
    },  
    error: function(request, status, error){
      console.log('Error');
      console.log(request);
      console.log(status);
      console.log(error);
    }
  });

}

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
  let searchItem = searchInput.value;
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