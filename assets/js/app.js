$(document).ready(function () {
  const sampleText = "The quick brown fox jumped over the lazy dog today";
  let inputValue = "";
  let startTime = null; // used to calculate result
  let wpm = 0;
  let accuracy = 100;

  /* Values for healthbar */

  /* 
  formula for finding the decerment:
  for intial typing speed of 30wpm

  healthbar = 100
  30wpm = 10word in 20sec

  decrement = (healthbar/time) * 0.1
  decrement = (100/20)  * 0.1
  decremnt = 0.5
  */

  let healthBarWidth = 100;
  let healthBarDecremnet = 0.5; //how much is decremented each 0.1 second
  let healthBarInterval; // used for setInterval()
  let healthBarWPM = 30; 

  /* ./Values for healthbar */

  /* Values for  keybaord mapping */
  const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
    ["Space"],
  ];

  const fingerMappings = {
    Q: "pinkie",
    W: "ring",
    E: "middle",
    R: "index",
    T: "index",
    Y: "index",
    U: "index",
    I: "middle",
    O: "ring",
    P: "pinkie",
    "[": "pinkie",
    "]": "pinkie",
    "\\": "pinkie",
    A: "pinkie",
    S: "ring",
    D: "middle",
    F: "index",
    G: "index",
    H: "index",
    J: "index",
    K: "middle",
    L: "ring",
    ";": "pinkie",
    "'": "pinkie",
    Z: "pinkie",
    X: "ring",
    C: "middle",
    V: "index",
    B: "index",
    N: "index",
    M: "index",
    ",": "middle",
    ".": "ring",
    "/": "pinkie",
    Space: "thumb", // Space for spacebar
  };
  /* /.Values for  keybaord mapping */

   // Handle the keybaord rendering
   const renderKeyboard = () => {
    const $keyboardContainer = $("#keyboard-container");
    $keyboardContainer.empty(); // Clear previous content

    keyboardLayout.forEach((row, rowIndex) => {
      const $rowDiv = $("<div>").addClass("keyboard-row");

      row.forEach((key) => {
        const isSpacebar = key === "Space";
        const keyClass = isSpacebar ? "key-space" : "key";
        const fingerClass = fingerMappings[key] || "index";

        // Create key element
        const $keyDiv = $("<div>")
          .addClass(`key ${keyClass} ${fingerClass}`)
          .text(isSpacebar ? "" : key) // Spacebar is empty
          .attr("data-key", key); // Store key value for reference

        $rowDiv.append($keyDiv);
      });

      $keyboardContainer.append($rowDiv);
    });
  };

  // Display the sample text
  const displaySampleText = () => {
    $("#sample-text").empty();
    sampleText.split("").forEach((char, idx) => {
      $("#sample-text").append(`<span id="char-${idx}">${char}</span>`);
    });
  };

  // Calculate WPM and accuracy
  const calculateResults = () => {
    if (!startTime) return;

    const durationInMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = inputValue.trim().split(/\s+/).length;
    const correctChars = inputValue
      .split("")
      .filter((char, idx) => char === sampleText[idx]).length;

    wpm = wordsTyped / durationInMinutes;
    accuracy = (correctChars / sampleText.length) * 100;

    $("#wpm").text(wpm.toFixed(2));
    $("#accuracy").text(accuracy.toFixed(2));
    $("#health-bar-wpm").text(healthBarWPM.toFixed(2));

    startTime = null;
  };

 

  // Handle input changes
  $("#typing-input").on("input", function () {
    inputValue = $(this).val();
    if (inputValue.length === 1 && startTime === null) {
      console.log("starting timer");
      startTime = Date.now(); // Start the timer
      startHealthBarDecrement(); // start healthbar decrement
    } else if (inputValue.length === sampleText.length) {
      console.log("calculating resluts");
      calculateResults();
      modal.style.display = "block";
      resetHealthBar();
    }
    updateHighlightedText();
  });

  // Highlight the text based on the user's input
  const updateHighlightedText = () => {
    inputValue.split("").forEach((char, idx) => {
      const sampleChar = sampleText[idx];
      const span = $(`#char-${idx}`);

      if (char === sampleChar) {
        span.addClass("correct");
        span.removeClass("incorrect gray");
      } else {
        span.addClass("incorrect");
        span.removeClass("correct gray");
      }
    });
    for (let i = inputValue.length; i < sampleText.length; i++) {
      $(`#char-${i}`).addClass("gray");
    }
    $(`#char-${inputValue.length}`).addClass("current");
  };

  //Initial Render
  displaySampleText();
  renderKeyboard();

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
    handleRestart();
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      handleRestart();
    }
  };

  // Heandle the healthbar decrement
  const startHealthBarDecrement = () => {
    console.log("decrementign by " + healthBarDecremnet);
    healthBarInterval = setInterval(()=>{
      healthBarWidth -= healthBarDecremnet;
      if (healthBarWidth <= 0){
        healthBarWidth = 0;
        clearInterval(healthBarInterval);
        alert("Game Over");
        handleRestart();
        resetHealthBar();
      }
      $('#health-bar').css('width', healthBarWidth + '%'); // Update CSS
    }, 100); //Interval of 0.1 seconds
  };

  // Reset the healthbar
  const resetHealthBar = () => {
    clearInterval(healthBarInterval);
    healthBarWidth = 100;
    healthBarDecremnet += 0.05; //increase diffulty by 5 wpm
    healthBarWPM += healthBarDecremnet*100;
    $('#health-bar').css('width', '100%'); // Upadate CSS
  }

  // Handle the restart
  const handleRestart = () => {
    inputValue = "";
    startTime = null;
    wpm = 0;
    accuracy = 100;
    $("#typing-input").val("");
    $("#wpm").text("0");
    $("#accuracy").text("100");
    $("#sample-text").children().removeClass("correct incorrect gray current");
    displaySampleText();
  };
});

// $(function () {
//   $("#keybaord-container").load("keyboard.html");
// });
