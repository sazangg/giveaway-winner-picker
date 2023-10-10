// Variables to store participants and their entries
let participants = [];
let totalEntries = 0;
let selectedWinners = [];

// Function to read and parse the CSV file
function parseCSV(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        
        participants = lines.map(line => {
            const [name, entries] = line.split(',');
            return { name: name.trim(), entries: parseInt(entries.trim()) };
        });

        totalEntries = participants.reduce((sum, participant) => sum + participant.entries, 0);
    };

    reader.readAsText(file);
}

// Function to shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to draw winners
function drawWinners() {
    const numWinners = parseInt(document.getElementById("numWinners").value);

    if (isNaN(numWinners) || numWinners <= 0) {
        alert("Please enter a valid number of winners.");
        return;
    }

    if (participants.length === 0) {
        alert("Please upload a CSV file first.");
        return;
    }

    if (numWinners > participants.length) {
        alert("Not enough participants to draw that many winners.");
        return;
    }

    const winners = [];

    // Reset selectedWinners array when Draw is clicked
    selectedWinners = [];
	// Shuffle the participants array randomly
	shuffleArray(participants);

    while (winners.length < numWinners) {
        const randomEntry = Math.floor(Math.random() * totalEntries);
        let cumulativeEntries = 0;

        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i];

            if (!selectedWinners.includes(participant.name)) {
                cumulativeEntries += participant.entries;
                if (randomEntry < cumulativeEntries) {
                    winners.push(participant.name);
                    selectedWinners.push(participant.name);
                    break;
                }
            }
        }
    }

    // Display the winners with Bootstrap styling
    const winnersContainer = document.getElementById("winners");
    winnersContainer.innerHTML = ''; // Clear the previous content

    if (winners.length > 0) {
        // Display the winners
        winnersContainer.classList.remove("d-none"); // Show the winners container
        winnersContainer.innerHTML = '<h4 class="text-center mb-3 text-decoration-underline">Winners</h4><ul>';
        
        winners.forEach(winner => {
            const chance = (participants.find(p => p.name === winner).entries / totalEntries * 100).toFixed(2);
            winnersContainer.innerHTML += `<li>${winner} (Chances: ${chance}%)</li>`;
        });

        winnersContainer.innerHTML += '</ul>';
    } else {
        winnersContainer.classList.add("d-none"); // Hide the winners container when there are no winners
    }
}

// Event listener for file input change
document.getElementById("csvFileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    parseCSV(file);
});

function toggleDarkMode() {
    const body = document.body;
    const winnersContainer = document.getElementById("winners");

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        winnersContainer.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-mode-border-color');
    } else {
        winnersContainer.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--light-mode-border-color');
    }
}