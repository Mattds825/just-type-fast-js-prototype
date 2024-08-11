import { renderKeyboard, highlightKey } from "./modules/keybaord.js";

$(document).ready(function () {
  let words = [];
  let sampleText = "The quick brown fox jumped over the lazy dog today";
  let inputValue = "";
  let startTime = null; // used to calculate result
  let wpm = 0;
  let accuracy = 100;
  let currentLevel = 1;
  let curerntCoin = "Bronze";
  let currentCoinImg = "assets/images/coin-images/coin-image-bronze.png";

  let listenToKeys = true;

  const silverLevel = 3;
  const goldLevel = 6;
  const diamondLevel = 9;

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
  let healthBarWpmChange = 5;

  /* ./Values for healthbar */

  // Fetch the 200 most typed words from the JSON file
  $.getJSON("assets/words.json", function (data) {
    words = data.words;
    displaySampleText();
  });

  // Generate a new sample text
  const generateSampleText = () => {
    const phrase = [];
    while (phrase.length < 10) {
      const word = words[Math.floor(Math.random() * words.length)];
      if (phrase.length === 0 || phrase[phrase.length - 1] !== word) {
        phrase.push(word);
      }
    }
    return phrase.join(" ");
  };

  // Display the sample text
  const displaySampleText = () => {
    sampleText = generateSampleText();
    $("#sample-text").empty();
    sampleText.split("").forEach((char, idx) => {
      $("#sample-text").append(`<span id="char-${idx}">${char}</span>`);
    });
  };

  // Calculate WPM and accuracy
  const calculateResults = () => {
    if (!startTime) return;
    console.log("calculating results");
    const durationInMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = inputValue.trim().split(/\s+/).length;
    const correctChars = inputValue
      .split("")
      .filter((char, idx) => char === sampleText[idx]).length;

    wpm = wordsTyped / durationInMinutes;
    accuracy = (correctChars / sampleText.length) * 100;

    $("#wpm-result").text(wpm.toFixed(2));
    $("#accuracy-result").text(accuracy.toFixed(2));
    $("#health-bar-wpm-result").text(healthBarWPM.toFixed(2));

    $("#wpm").text(wpm.toFixed(2));
    $("#accuracy").text(accuracy.toFixed(2));
    $("#health-bar-wpm").text(healthBarWPM.toFixed(2));

    startTime = null;
  };

  function handleInputChange() {
    if (inputValue.length === 1 && startTime === null) {
      console.log("starting timer");
      startTime = Date.now(); // Start the timer
      startHealthBarDecrement(); // start healthbar decrement
    } else if (inputValue.length === sampleText.length) {
      console.log("calculating resluts");
      calculateResults();
      listenToKeys = false;
      // document.getElementById("typing-input").blur();
      roundCompleteModal.style.display = "block";
      stopHealthBar();
      addCoin();
    }
    updateHighlightedText(); // highlight correct keys in sample text
    highlightKey(inputValue.slice(-1)); // Highlight the last typed key
  }

  // Highlight the text based on the user's input
  const updateHighlightedText = () => {
    $("#sample-text span").removeClass("current");

    inputValue.split("").forEach((char, idx) => {
      const sampleChar = sampleText[idx];
      const span = $(`#char-${idx}`);

      if (char === sampleChar) {
        //correctly typed characters
        span.addClass("correct");
        span.removeClass("incorrect gray");
      } else {
        //incorrecly typed characters
        span.addClass("incorrect");
        span.removeClass("correct gray");
      }
    });
    for (let i = inputValue.length; i < sampleText.length; i++) {
      $(`#char-${i}`).addClass("gray");
    }

    // Add the 'current' class to the current character
    const currentIdx = inputValue.length;
    $(`#char-${currentIdx}`).addClass("current");

    for (let i = inputValue.length; i < sampleText.length; i++) {}
  };

  //Initial Render
  renderKeyboard();

  // Get the modal
  var roundCompleteModal = document.getElementById("round-complete-modal");
  var gameOverModal = document.getElementById("game-over-modal");
  var settingsModal = document.getElementById("settings-modal");

  // Get the <span> element that closes the modal
  var closeGameOver = document.getElementById("close-game-over");
  var closeRoundComplete = document.getElementById("close-round-complete");
  var closeSettings = document.getElementById("close-settings");

  // When the user clicks on <span> (x), close the modal
  closeGameOver.onclick = function () {
    console.log("clicked game over close");
    gameOverModal.style.display = "none";
    restartGame();
  };

  closeRoundComplete.onclick = function () {
    console.log("clicked round complete close");
    roundCompleteModal.style.display = "none";
    resetValues();
  };

  closeSettings.onclick = function () {
    console.log("clicked close settings");
    settingsModal.style.display = "none";
  };

  var settingsBtn = document.getElementById("settings-btn");
  var hideKeyboardBtn = document.getElementById("hide-keyboard-btn");
  var hideHandsdBtn = document.getElementById("hide-hands-btn");
  const keyboardContainer = $('#keyboard-container');
  const handsContainer = $('#hands-layout-div');

  settingsBtn.onclick = function () {
    settingsModal.style.display = "block";
  };

  hideKeyboardBtn.onclick = function () {
    
    if (keyboardContainer.is(":visible")) {
      keyboardContainer.hide();
      $(this).text("Show Keyboard");
    } else {
      keyboardContainer.show();
      $(this).text("Hide Keyboard");
    }
  };

  hideHandsdBtn.onclick = function () {
    if (handsContainer.is(":visible")) {
      handsContainer.hide();
      $(this).text("Show Hands");
    } else {
      handsContainer.show();
      $(this).text("Hide Hands");
    }
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == roundCompleteModal) {
      roundCompleteModal.style.display = "none";
      resetValues();
      // document.getElementById("typing-input").focus();
      listenToKeys = true;
    } else if (event.target == gameOverModal) {
      gameOverModal.style.display = "none";
      restartGame();
      // document.getElementById("typing-input").focus();
      listenToKeys = true;
    }
  };

  // Handle keys
  $(document).keydown(function (e) {
    if (e.key === "Enter") {
      if (roundCompleteModal.style.display != "none") {
        // document.getElementById("typing-input").blur();
        listenToKeys = false;
        console.log("enter reset");
        roundCompleteModal.style.display = "none";
        inputValue = "";
        resetValues();
      } else if (gameOverModal.style.display != "none") {
        // document.getElementById("typing-input").blur();
        listenToKeys = false;
        console.log("enter restart");
        gameOverModal.style.display = "none";
        inputValue = "";
        restartGame();
      }
    } else if (e.key === "Escape") {
      restartGame();
    } else {
      // document.getElementById("typing-input").focus();
      // Handle backspace
      if (e.key === "Backspace") {
        inputValue = inputValue.slice(0, -1);
        handleInputChange();
      } else if (e.key.length === 1) {
        // Only handle single character keys
        inputValue += e.key;
        handleInputChange();
      }
    }
  });

  // Heandle the healthbar decrement
  const startHealthBarDecrement = () => {
    console.log("decrementign by " + healthBarDecremnet);
    healthBarInterval = setInterval(() => {
      healthBarWidth -= healthBarDecremnet;
      if (healthBarWidth <= 0) {
        healthBarWidth = 0;
        calculateResults();
        clearInterval(healthBarInterval);
        // alert("Game Over");
        gameOverModal.style.display = "block";
      }
      $("#health-bar").css("width", healthBarWidth + "%"); // Update CSS
    }, 100); //Interval of 0.1 seconds
  };

  // Move to the next phrase
  const nextPhrase = () => {
    console.log("next phrase");
    currentLevel += 1;
    $("#current-level").text(currentLevel);
    $("#current-wpm").text(healthBarWPM);
    handleCoinChange();
    displaySampleText();
  };

  // handle the coin change

  function handleCoinChange() {
    console.log("handling coin change");
    if (currentLevel >= silverLevel && currentLevel < goldLevel) {
      currentCoinImg = "assets/images/coin-images/coin-image-silver.png";
      $("#current-coin-img").attr(
        "src",
        "assets/images/coin-animations/coin-animation-silver.gif"
      );
    } else if (currentLevel >= goldLevel && currentLevel < diamondLevel) {
      currentCoinImg = "assets/images/coin-images/coin-image-gold.png";
      $("#current-coin-img").attr(
        "src",
        "assets/images/coin-animations/coin-animation-gold.gif"
      );
    } else if (currentLevel >= diamondLevel) {
      $("#current-coin-img").attr(
        "src",
        "assets/images/coin-animations/coin-animation-diamond.gif"
      );
      currentCoinImg = "assets/images/coin-images/coin-image-diamond.png";
    }
  }

  // Reset the healthbar
  const resetHealthBar = () => {
    clearInterval(healthBarInterval);
    healthBarWidth = 100;
    healthBarDecremnet += healthBarWpmChange / 100; //increase diffulty by 5 wpm
    healthBarWPM += 3;
    console.log("reseting wpm to: " + healthBarWPM);
    $("#health-bar").css("width", "100%"); // Upadate CSS
  };

  const stopHealthBar = () => {
    clearInterval(healthBarInterval);
  };

  // Add coin on completion of phase
  function addCoin() {
    console.log("adding coin");
    var coinImg = $("<img>").attr("src", currentCoinImg);
    var coinImgRes = $("<img>").attr("src", currentCoinImg);
    $("#collected-coins-container").append(coinImg);
    $("#collected-coins-container-result").append(coinImgRes);
  }

  const resetCoins = () => {
    console.log("resetting coins");
    currentCoinImg = "assets/images/coin-images/coin-image-bronze.png";
    curerntCoin = "Bronze";
    document.getElementById("collected-coins-container").innerHTML = "";
    $("#current-coin-img").attr(
      "src",
      "assets/images/coin-animations/coin-animation-bronze.gif"
    );
  };

  // Handle the restart
  const resetValues = () => {
    inputValue = "";
    startTime = null;
    wpm = 0;
    accuracy = 100;
    resetHealthBar();
    nextPhrase();
    $(".key").removeClass("highlighted"); // remove highleted from all keys
    $("#typing-input").val("");
    $("#wpm").text("0");
    $("#accuracy").text("100");
    $("#sample-text").children().removeClass("correct incorrect gray current");
  };

  const restartGame = () => {
    console.log("restarting game");
    resetValues();
    resetCoins();
    healthBarWPM = 30;
    healthBarDecremnet = 0.5;
    currentLevel = 1;
    $("#current-level").text(currentLevel);
    $("#current-wpm").text(healthBarWPM);
  };
});
