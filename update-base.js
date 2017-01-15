var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/db';

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
    return false;
  } else {
    var a_collection = db.collection('auditorium');
    var f_collection = db.collection('faculties');
    var f_cursor = f_collection.find();
    f_cursor.each(function(err, fac)
    {
      if(fac == null)
        return false;

      for(var i = 0; i < fac.departments.length; i++)
      {
        var dep = fac.departments[i];
        console.log(dep.dep_name);
        for(var j = 0; j < dep.auditorium.length; j++)
        {
          var aud = dep.auditorium[j];
          var data_string = "data-dep=\""+dep.dep_name+"\" data-fac=\""+fac.faculty+"\"";
          console.log(aud.toString(), data_string);
          a_collection.update({aud_id: aud.toString()},
            {$set: {data: data_string}}
            )
        }
      }
    })
    console.log('updating part');
  }

});