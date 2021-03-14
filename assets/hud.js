(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("hud",
{ "height":9,
 "infinite":false,
 "layers":[
        {
         "draworder":"topdown",
         "id":2,
         "name":"triggers",
         "objects":[
                {
                 "height":15,
                 "id":1,
                 "name":"PausePlay",
                 "properties":[
                        {
                         "name":"pause",
                         "type":"bool",
                         "value":false
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":15,
                 "x":231,
                 "y":10
                }, 
                {
                 "height":15,
                 "id":2,
                 "name":"sound",
                 "properties":[
                        {
                         "name":"playing",
                         "type":"bool",
                         "value":true
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":15,
                 "x":206.875,
                 "y":10
                }],
         "opacity":1,
         "properties":[
                {
                 "name":"purpose",
                 "type":"string",
                 "value":"triggers"
                }],
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }],
 "nextlayerid":3,
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"left-up",
 "tiledversion":"1.2.4",
 "tileheight":16,
 "tilesets":[],
 "tilewidth":16,
 "type":"map",
 "version":1.2,
 "width":16
});