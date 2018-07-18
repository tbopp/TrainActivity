// This logic should be based off the Timesheet activity (#17) and include structures similar to activites 18 (Push), 19 (Add_Child), and 20 (MomentJS).

// Initialize Firebase

var config = {
    apiKey: "AIzaSyDBP53Lrqjwlk3KnTQ2OkJqjqKcVfp3aJs",
    authDomain: "test-be813.firebaseapp.com",
    databaseURL: "https://test-be813.firebaseio.com",
    projectId: "test-be813",
    storageBucket: "test-be813.appspot.com",
    messagingSenderId: "357240477692"
  };

  firebase.initializeApp(config);

// Create a variable for the database
  var database = firebase.database();

// Initial Values
var Tname = "";
var Dest = "";
var FirstT = 0;
var Freq = "";

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input from each field, assigns to a variable
    Tname = $("#train-name-input").val().trim();
    Dest = $("#destination-input").val().trim();
    FirstT = $("#first-train-input").val().trim();
    Freq = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      Train: Tname,
      Destination: Dest,
      First: FirstT,
      Frequency: Freq,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    };
  
    // Pushes (appends) train data to the database
    database.ref().push(newTrain);

    // Logs everything to console to test
    console.log(newTrain.Train);
    console.log(newTrain.Destination);
    console.log(newTrain.First);
    console.log(newTrain.Frequency);
    console.log(newTrain.dateAdded);

    // Clears all form entry text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});



// Firebase event for adding trains to the database and a row in the html table when a user adds an entry
database.ref().on("child_added", function(Snapshot) {
    console.log(Snapshot.val());
  
    // Store everything into a variable.
    var TrnName = Snapshot.val().Train;
    var TrnDest = Snapshot.val().Destination;
    var TrnFirst = Snapshot.val().First;
    var TrnFreq = Snapshot.val().Frequency;
    var TrnMins = 0
    var TrnNext = "null"

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(TrnFirst, "HH:mm").subtract(1, "years");

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % TrnFreq;
  console.log(tRemainder);

  // Minute Until Train
  TrnMins = TrnFreq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + TrnMins);

  // Next Arrival
  TrnNext = moment().add(TrnMins, "minutes");
  console.log("ARRIVAL TIME: " + moment(TrnNext).format("hh:mm"));
  
    // Append a new row to the table
    $("#train-table > tbody").append("<tr><td>" + TrnName + "</td><td>" + TrnDest + "</td><td>" + TrnFreq + "</td><td>" + moment(TrnNext).format("hh:mm") + "</td><td>" + TrnMins + "</td></tr>");
  
    
  });