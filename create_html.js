var fs = require('fs');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/db';

var area_code = " ";

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    var collection = db.collection('auditorium');
    var cursor = collection.find().toArray(
      function(err, docs){
        for(i=0;i<docs.length;i++)
        {
          var aud = docs[i];
          var data = aud.data;
          var s = "onclick=\"info("+aud.aud_id+")\"";
          var title = "title=\"аудитория " + aud.aud_id + "\"";
          if(data == null || data == 'undefined' || typeof data == undefined) {
            area_code = area_code.concat('<area id=\"', aud.aud_id, '\"', title, 'shape=\"rect\" coords=\"' , aud.coords, "\"", s, ">\n");

          } else {
            area_code = area_code.concat('<area id=\"', aud.aud_id, '\"', title, 'shape=\"rect\" ' , aud.data, ' coords=\"' , aud.coords, "\"", s, ">\n");

          }
        }
        var fileName = 'generated_map.html';
        var stream = fs.createWriteStream(fileName);
        var header = fs.readFileSync('./header.txt', "utf8");
        var map_open = fs.readFileSync('./map-open.txt', "utf8");
          var body = fs.readFileSync('./body.txt', "utf8");
          stream.once('open', function(fd) {
            var html = '<!DOCTYPE html>'
            + '<html>\n<header>\n' + header + '\n</header>\n<body>\n' + map_open + area_code + body + '\n</body>\n</html>';
            stream.end(html);
          });

        });

  }
});



