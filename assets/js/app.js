$(document).ready(function () {
    const sampleText = "The quick brown fox jumps over the lazy dog.";
    let inputValue = '';
    let startTime = null;
    let wpm = 0;
    let accuracy = 100;
  
    // Display the sample text
    const displaySampleText = () => {
      $('#sample-text').empty();
      sampleText.split('').forEach((char, idx) => {
        $('#sample-text').append(`<span id="char-${idx}">${char}</span>`);
      });
    };

    //Initial Render
    displaySampleText()
});