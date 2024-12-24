document.addEventListener("DOMContentLoaded", initializeTradeJournal);

function initializeTradeJournal() {
  const tradeForm = document.getElementById("trade-form");
  const tradeEntriesContainer = document.getElementById("trade-entries");
  const nextButton = document.getElementById("next-month");
  const prevButton = document.getElementById("previous-month");

  let tradeJournal = JSON.parse(localStorage.getItem("tradeJournal")) || [];
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  // Function to render trades grouped by weeks
  function renderTrades() {
    tradeEntriesContainer.innerHTML = ""; // Clear existing trades
    const filteredTrades = tradeJournal.filter((trade) => {
      const tradeDate = new Date(trade.date);
      return (
        tradeDate.getMonth() === currentMonth &&
        tradeDate.getFullYear() === currentYear
      );
    });

    // Group trades by weeks
    const weeks = Array.from({ length: 4 }, () => []); // Four weeks per month
    filteredTrades.forEach((trade) => {
      const tradeDate = new Date(trade.date);
      const weekIndex = Math.floor((tradeDate.getDate() - 1) / 7);
      weeks[weekIndex].push(trade);
    });

    weeks.forEach((week, index) => {
      const weekRow = document.createElement("div");
      weekRow.classList.add("week-row");

      if (week.length > 0) {
        const weekHeader = document.createElement("h4");
        weekHeader.textContent = `Week ${index + 1}`;
        weekRow.appendChild(weekHeader);
      }

      week.forEach((trade, tradeIndex) => {
        const tradeCard = document.createElement("div");
        tradeCard.classList.add("trade-card", trade.profitLoss >= 0 ? "profit" : "loss");

        tradeCard.innerHTML = `
          <p><strong>${new Date(trade.date).toLocaleDateString()}</strong></p>
          <p>${trade.symbol}</p>
          <p>${trade.profitLoss >= 0 ? "+" : ""}$${trade.profitLoss.toFixed(2)}</p>
          <button class="delete-button" onclick="deleteTrade(${tradeIndex})">Delete</button>
          <button class="details-button" onclick="toggleDetails(${tradeIndex})">Details</button>
        </div>
        <div class="trade-details hidden" id="details-${tradeIndex}">
          <p><strong>Reason:</strong> ${trade.reason}</p>
        </div>
        `;

        weekRow.appendChild(tradeCard);
      });

      tradeEntriesContainer.appendChild(weekRow);
    });

    if (filteredTrades.length === 0) {
      tradeEntriesContainer.innerHTML = "<p>No trades for this month.</p>";
    }
  }

  // Function to toggle trade details visibility
  window.toggleDetails = function (index) {
    const detailsDiv = document.getElementById(`details-${index}`);
    detailsDiv.classList.toggle("hidden");
  };

  // Function to add a trade
  function addTrade(event) {
    event.preventDefault();

    const date = document.getElementById("trade-date").value;
    const symbol = document.getElementById("trade-symbol").value;
    const profitLoss = parseFloat(document.getElementById("trade-profit-loss").value);
    const reason = document.getElementById("trade-reason").value;

    if (!date || !symbol || isNaN(profitLoss) || !reason) {
      alert("Please fill in all fields.");
      return;
    }

    const newTrade = { date, symbol, profitLoss, reason };
    tradeJournal.push(newTrade);
    localStorage.setItem("tradeJournal", JSON.stringify(tradeJournal));
    renderTrades();

    // Reset form
    tradeForm.reset();
  }

  // Function to delete a trade
  window.deleteTrade = function (index) {
    tradeJournal.splice(index, 1);
    localStorage.setItem("tradeJournal", JSON.stringify(tradeJournal));
    renderTrades();
  };

  // Function to navigate months
  function navigateMonth(direction) {
    if (direction === "next") {
      if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
      } else {
        currentMonth++;
      }
    } else if (direction === "previous") {
      if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
      } else {
        currentMonth--;
      }
    }
    renderTrades();
  }

  // Add event listeners for navigation buttons
  nextButton.addEventListener("click", () => navigateMonth("next"));
  prevButton.addEventListener("click", () => navigateMonth("previous"));

  // Event listener for form submission
  tradeForm.addEventListener("submit", addTrade);

  // Initial render
  renderTrades();
}
