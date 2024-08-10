/* 
this file is a module for the keybaord component
it creates the keyboad layout and handles the key highlighting
*/


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
export const renderKeyboard = () => {
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
        .addClass(`eightbit-btn key ${keyClass} ${fingerClass}`)
        .text(isSpacebar ? "" : key) // Spacebar is empty
        .attr("data-key", key); // Store key value for reference

      $rowDiv.append($keyDiv);
    });

    $keyboardContainer.append($rowDiv);
  });
};

// Highlight the corresponding key on the virtual keyboard
export const highlightKey = (key) => {
    $(".key").removeClass("highlighted"); // remove highleted from all keys
    $(`.key[data-key="${key == " " ? "Space" : key.toUpperCase()}"]`).addClass(
      "highlighted"
    );
  };
