# import os module
import os
from types import MethodType

# import flask
from flask import Flask, url_for

# import template engine
from flask import render_template

from flask import json, jsonify, request

# create an app instance
app = Flask(__name__)


filename = os.path.join(app.static_folder, 'data.json')
with open(filename) as art_data:
  art = json.load(art_data)

current_id = art[len(art)-1]['id']

# show all books route
@app.route('/')

# write a method to show all books
def home():
  global art
  global current_id
  removeColors()

  return render_template('art.html', art=art)


# show search route
@app.route('/search/<str>', methods=['GET','POST'])

# write a method to search art
def search(str):
 
  global art

  removeColors()
  request_data_str = str.lower()
  searchResults=[] #create empty array to fill with matches

  searchResults.append(str) # put search param in first element
  
  for i in range(len(art)):
    if request_data_str in art[i]['title'].lower() or request_data_str in art[i]['artist'].lower():
      searchResults.append(art[i])

  return render_template('search.html', searchResults = searchResults, art=art)

# show view route
@app.route('/view/<id>', methods=['GET','POST','PUT','DELETE'])

# write a method to show a piece of art
def view(id):
    
  global art

  #handle different requests
  if(request.method == 'PUT'):
    removeColors()
    request_data = request.get_json()
    id_to_upd = request_data[0]['id']
    descr_to_upd = request_data[0]['description']
    for i in range(len(art)):
      if id_to_upd == art[i]['id']:
        art[i]['description'] = descr_to_upd
  elif (request.method == 'DELETE'): #delete
    request_data = request.get_json()
    id_to_upd = request_data[0]['id']
    color_to_delete = request_data[0]['indx']
    for i in range(len(art)):
      if id_to_upd == art[i]['id']:
        art[i]['colors'][int(color_to_delete)]['mark_as_deleted']=True  
  elif (request.method == 'POST'): #undo delete
    request_data = request.get_json()
    id_to_upd = request_data[0]['id']
    color_to_delete = request_data[0]['indx']
    for i in range(len(art)):
      if id_to_upd == art[i]['id']:
        art[i]['colors'][int(color_to_delete)]['mark_as_deleted']=False
  else:
    request_data = False

  # handle get request
  display=[]
  for i in range(len(art)):
    if id == str(art[i]['id']):
      display.append(art[i])

  if request_data:
    return jsonify(art = art, display=display)
  else:
    return render_template('view.html', art=art, display=display)

# Create route
@app.route('/create')

# write a method to show a piece of art
def create():
 
  global new_entry
  removeColors()
  return render_template('create.html', new_entry=None)


# create a new art route that can handle the GET and POST methods
@app.route('/save_art', methods=['GET', 'POST'])

# save new art
def save_art():
    
  global art
  global current_id

  # get item from the POST body
  request_data = request.get_json()


  # increment the current id
  current_id += 1
  new_id = current_id

  # format new sale object
  new_art_entry = {
    "id": new_id,
    "title": request_data['title'],
    "artist": request_data['artist'],
    "image": request_data['image'],
    "description": request_data['description'],
    "year": request_data['year'],
    #"colors": request_data['colors']
  }

  # need to fix colors list
  fixed_colors=[]
  for i in request_data['colors']:
    if i['value'].strip() != '':
      tempDict = {}
      tempDict['value'] = i['value'].strip()
      tempDict['mark_as_deleted'] = False
      fixed_colors.insert(len(fixed_colors), tempDict)

  new_art_entry['colors'] = fixed_colors
  # add new sales object to the python data list
  art.append(new_art_entry)


  return jsonify(new_entry=new_art_entry)


def removeColors():
  #removes any colors marked as deleted after navigating away from view
  global art

  for i in range(len(art)):
    colorsToDelete = []
    for j in range(len(art[i]['colors'])):
      if art[i]['colors'][j]['mark_as_deleted'] == True:
        colorsToDelete.append(j)
    m = len(colorsToDelete)
    while (m > 0):
        colorIndexToDelete = colorsToDelete[m-1] #start from back
        art[i]['colors'].pop(colorIndexToDelete)
        m = m-1
  
