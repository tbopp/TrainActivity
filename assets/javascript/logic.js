// Initialize Firebase
const config = {
  apiKey: "AIzaSyDBP53Lrqjwlk3KnTQ2OkJqjqKcVfp3aJs",
  authDomain: "test-be813.firebaseapp.com",
  databaseURL: "https://test-be813.firebaseio.com",
  projectId: "test-be813",
  storageBucket: "test-be813.appspot.com",
  messagingSenderId: "357240477692"
};

firebase.initializeApp(config);

// Create a variable for the database
const database = firebase.database();

// Initial Values
let Tname = "";
let Dest = "";
let FirstT = 0;
let Freq = "";

// Button event for adding trains
$("#add-train-btn").on("click", event => {
  event.preventDefault();

  // Grabs user input from each field, assigns value to a variable
  Tname = $("#train-name-input").val().trim();
  Dest = $("#destination-input").val().trim();
  FirstT = $("#first-train-input").val().trim();
  Freq = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  const newTrain = {
    Train: Tname,
    Destination: Dest,
    First: FirstT,
    Frequency: Freq,
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
database.ref().on("child_added", Snapshot => {
  console.log(Snapshot.val());

  // Store everything into a variable.
  const TrnName = Snapshot.val().Train;
  const TrnDest = Snapshot.val().Destination;
  const TrnFirst = Snapshot.val().First;
  const TrnFreq = Snapshot.val().Frequency;
  let TrnMins = 0;
  let TrnNext = "null";

  // First Time (pushed back 1 year to make sure it comes before current time)
  const firstTimeConverted = moment(TrnFirst, "HH:mm").subtract(1, "years");

  // Current Time
  const currentTime = moment();
  console.log(`CURRENT TIME: ${moment(currentTime).format("hh:mm")}`);

  // Difference between the times
  const diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log(`DIFFERENCE IN TIME: ${diffTime}`);

  // Time apart (remainder)
  const tRemainder = diffTime % TrnFreq;
  console.log(tRemainder);

  // Minute Until Train
  TrnMins = TrnFreq - tRemainder;
  console.log(`MINUTES TILL TRAIN: ${TrnMins}`);

  // Next Arrival
  TrnNext = moment().add(TrnMins, "minutes");
  console.log(`ARRIVAL TIME: ${moment(TrnNext).format("hh:mm")}`);

  // Append a new row to the table
  $("#train-table > tbody").append(`<tr><td>${TrnName}</td><td>${TrnDest}</td><td>${TrnFreq}</td><td>${moment(TrnNext).format("hh:mm")}</td><td>${TrnMins}</td></tr>`);
});