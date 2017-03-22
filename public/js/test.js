$.get('/api')
.then(function (db) {
  db.hotels.forEach(function(hotel){
    console.log(hotel.name);
  });
})
.catch( console.error.bind(console) );
