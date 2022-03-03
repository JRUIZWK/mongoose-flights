import { Flight } from "../models/flight.js"
import { Meal } from "../models/meal.js"


function index(req, res){
  Flight.find({}, function (err, flights) {
    flights.sort()
    console.log(err)
    res.render("flights/index", {
      err,
      flights,
      title: 'All Flights'
    })
  })
}

function newFlight(req,res){
  const newFlight = new Flight()
  const dt = newFlight.departs
  const departsDate = dt.toISOString().slice(0,1,6)
  console.log(departsDate)
  res.render('flights/new', {
    title: 'Add Flight',
    departsDate
  })
}

function create(req, res){
  for (let key in req.body) {
    if(req.body[key] === "") delete req.body[key]
  }
  const flight = new Flight(req.body)
  flight.save(function(err){
    if (err) return res.redirect('/flights/new')
    res.redirect(`/flights`)
  })
}

function show (req,res){
  Flight.findById(req.params.id)
  .populate('meals')
  .exec(function(err,flight){
    Meal.find({_id: {$nin: flight.meals}}, function (err, meals){
      res.render('flights/show', {
        err: err,
        flight: flight,
        title: 'Flight Detail',
        meals
      })
    })
  })
}


function deleteFlight(req,res) {
  Flight.findByIdAndDelete(req.params.id, function(err, flight){
    res.redirect('/flights')
  })
}

function createTicket(req,res) {
  Flight.findById(req.params.id, function(err,flight){
    flight.tickets.push(req.body)
    flight.save(function(err){
      res.redirect(`/flights/${flight._id}`)
    })
  })
}

function addMeal (req,res){
  Flight.findById(req.params.id, function (err, flight) {
    flight.meals.push(req.body.mealId)
    flight.save(function(err){
      res.redirect(`/flights/${flight._id}`)
    })
  })
}

export{
  index,
  newFlight as new,
  create,
  show,
  deleteFlight as delete,
  createTicket,
  addMeal
}