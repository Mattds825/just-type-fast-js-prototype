$(document).ready(function () {
  const sampleText = "The quick brown fox jumps over the lazy dog.";
  let inputValue = "";
  let startTime = null; // used to calculate result
  let wpm = 0;
  let accuracy = 100;

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

    startTime = null;
  };

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

  // Handle input changes
  $("#typing-input").on("input", function () {
    inputValue = $(this).val();
    if (inputValue.length === 1 && startTime === null) {
      console.log("starting timer");
      startTime = Date.now();
    } else if (inputValue.length === sampleText.length) {
      console.log("calculating resluts");
      calculateResults();
      modal.style.display = "block";
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

  const handleRestart = () => {
    inputValue = '';
    startTime = null;
    wpm = 0;
    accuracy = 100;
    $('#typing-input').val('');
    $('#wpm').text('0');
    $('#accuracy').text('100');
    $('#sample-text').children().removeClass('correct incorrect gray current');
    displaySampleText();
  };

});

// $(function () {
//   $("#keybaord-container").load("keyboard.html");
// });
