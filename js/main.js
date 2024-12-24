document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();

  // Load the initial tab
  showTab("trade-section");
});

function setupNavigation() {
  const tabs = document.querySelectorAll("nav button");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.id.replace("-tab", "-section");
      showTab(target);
    });
  });
}

function showTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((section) => {
    section.classList.remove("active");
  });

  // Show the selected tab
  const activeSection = document.getElementById(tabId);
  activeSection.classList.add("active");

  // Call initialization functions for specific tabs
  if (tabId === "trade-section") {
    initializeTradeSuggestions();
  } else if (tabId === "demo-trading-section") {
    initializeDemoTrading();
  } else if (tabId === "trade-journal-section") {
    initializeTradeJournal();
  }
}
