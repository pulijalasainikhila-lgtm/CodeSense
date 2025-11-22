document.getElementById('explainBtn').addEventListener('click', explainCode);

async function explainCode() {
    const code = document.getElementById('codeInput').value;
    const outputDiv = document.getElementById('output');

    if (!code.trim()) {
        outputDiv.textContent = "Please paste some code first!";
        return;
    }

    outputDiv.textContent = "Analyzing... please wait 🔄";

    try {
        const response = await fetch("http://localhost:5000/explain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const data = await response.json();
        outputDiv.textContent = data.explanation || "No explanation returned.";

    } catch (error) {
        outputDiv.textContent = "Error contacting backend 😢";
    }
}
