// ui.js
function renderTradeSuggestions(suggestion) {
  const suggestionsContainer = document.getElementById("trade-suggestions");
  suggestionsContainer.innerHTML = `
    <h2>${suggestion.decision}</h2>
    <p>${suggestion.reason}</p>
  `;
}
