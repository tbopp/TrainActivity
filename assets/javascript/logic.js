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
    var empRole = childSnapshot.val().role;
    var empStart = childSnapshot.val().start;
    var empRate = childSnapshot.val().rate;
  
    // Employee Info
    // console.log(empName);
    // console.log(empRole);
    // console.log(empStart);
    // console.log(empRate);
  
    // Prettify the employee start
    // console.log(moment.unix(empStart).format("dddd, MMMM Do YYYY, h:mm:ss a"))
    //empStart = 04/05/1989
    //moment.js takes the date, casts it in miliseconds 
    //THEN 
    //Calculates the EPOCTIME - empStart
    console.log(empStart);
    console.log(typeof empStart)
    var empStartPretty = moment.unix(empStart)
    console.log(empStartPretty.format())
  
  
  
    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var empMonths = moment().diff(moment(empStart, "X"), "months");
    // console.log(empMonths);
  
    // Calculate the total billed rate
    var empBilled = empMonths * empRate;
    console.log(empBilled);
  
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(empName),
      $("<td>").text(empRole),
      $("<td>").text(empStartPretty),
      $("<td>").text(empMonths),
      $("<td>").text(empRate),
      $("<td>").text(empBilled)
    );
  
    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
  });