var Promise = require('bluebird');
var router = require('express').Router();

var db = require('../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');

router.get('/', function(req, res, next) {
	Promise.all([
		Hotel.findAll({ include: [Place] }),
		Restaurant.findAll({ include: [Place] }),
		Activity.findAll({ include: [Place] })
	])
	.spread(function(hotels, restaurants, activities) {
		res.render('index', {
			hotels: hotels,
			restaurants: restaurants,
			activities: activities
		});
	})
	.catch(next);
});

// Example:
//
// Use Fetch (built in browser API):
//
//   fetch('/api').then(res => json()).then(doSomethingWithIt)
//
// Use jQuery's $.get:
//
//   $.get('/api').then(doSomethingWithIt)
//
// Or:
//
//   $.ajax('/api', {method: 'get'}).then(doSomethingWithIt)
//
router.get('/api', (req, res, next) =>
	Promise.props({
		hotels: Hotel.findAll({ include: [Place] }),
		restaurants: Restaurant.findAll({ include: [Place] }),
		activities: Activity.findAll({ include: [Place] })
	})
		.then(data => res.json(data))
		.catch(next)
);

// Use Fetch (built in browser API):
//
//   IDK, look it up on MDN?
//
// Use jQuery's $.post:
//
//   $.post('/api/echo', {hello: 'world'}).then(doSomethingWithIt)
// router.post('/api/echo', (req, res) => res.json(req.body));

// router.post('/api/hotels',
// 	(req, res, next) =>
// 		Hotel.create(req.body)
// 			.then(hotel => res.json(hotel))
// 			.catch(next));

router.post('/api/days/create', function(req, res, next){
	Day.create({
		number: 1
	})
	.then(function(day){
		res.send(day);
	});
});

router.get('/api/days/:id', function(req, res, next){
	Day.findById(req.params.id)
	.then(function(day){
		res.send(day);
	});
});

router.delete('/api/days/:id', function(req, res, next){
	Day.findById(req.params.id)
	.then(function(day){
		return day.destroy();
	})
	.then(function(){
		res.send('deleted')
	})
})

router.get('/api/days/all', function(req, res, next){
	Day.findAll({})
	.then(function(days){
		res.send(days)
	})
})

router.post('/api/days/:id/restaurants', function(req, res, next){

})

router.post('/api/days/:id/hotels', function(req, res, next){

})

router.post('/api/days/:id/activities', function(req, res, next){

})

router.delete('/api/days/:id/restaurants', function(req, res, next){

})

router.delete('/api/days/:id/hotels', function(req, res, next){

})

router.delete('/api/days/:id/activities', function(req, res, next){

})

module.exports = router;
