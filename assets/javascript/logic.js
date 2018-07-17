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

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input from each field, assigns to a variable
    var Tname = $("#train-name-input").val().trim();
    var Dest = $("#destination-input").val().trim();
    var FirstT = $("#first-train-input").val().trim();
    
    //Convert military time into...
    
    var Freq = moment("04/05/1989", "MM/DD/YYYY").format("X");
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      Train: Tname,
      Destination: Dest,
      First: FirstT,
      Frequency: Freq,
      dateAdded: database.ServerValue.TIMESTAMP
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
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










// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var TrnName = childSnapshot.val().Train;
    var TrnDest = childSnapshot.val().Destination;
    var TrnFirst = childSnapshot.val().First;
    var TrnFreq = childSnapshot.val().Frequency;
  
    // Prettify the first train time (convert to unix seconds)
    var TrnFirstPretty = moment.unix(TrnFirst).format("HH:mm Z")
    console.log(TrnFirstPretty.format())
  
  // calcuations needed to determin next arrival time as well as how many minutes until next arrival are below:

  // Assumptions
  var tFrequency = 3;

  // Time is 3:30 AM
  var firstTime = "03:30";

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
    
  
  
  
  
  
  // Calculate the months worked using hardcore math
    // To calculate the months worked

    // var empMonths = moment().diff(moment(empStart, "X"), "months");
   
    // console.log(empMonths);
  
    // Calculate the total billed rate
    
    // var empBilled = empMonths * empRate;
    // console.log(empBilled);
  
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(TrnName),
      $("<td>").text(TrnDest),
      $("<td>").text(TrnFirst),
      $("<td>").text(TrnFreq),
      $("<td>").text(empRate),
      $("<td>").text(empBilled)
    );
  
    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
  });