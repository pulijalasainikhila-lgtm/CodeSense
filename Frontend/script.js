// ======================
// SELECT ELEMENTS
// ======================
const authContainer = document.getElementById("authContainer");
const appContainer = document.getElementById("appContainer");

const authTitle = document.getElementById("authTitle");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const authBtn = document.getElementById("authBtn");
const toggleText = document.getElementById("toggleText");

// Admin UI
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const usersList = document.getElementById("usersList");
const loadUsers = document.getElementById("loadUsers");

// ======================
// LOGIN / SIGNUP TOGGLE
// ======================
let isLogin = true;

toggleText.addEventListener("click", () => {
    isLogin = !isLogin;

    if (isLogin) {
        authTitle.textContent = "Login";
        nameInput.style.display = "none";
        authBtn.textContent = "Login";
        toggleText.innerHTML = `Don't have an account? <span style="cursor:pointer; color:blue;">Signup</span>`;
    } else {
        authTitle.textContent = "Signup";
        nameInput.style.display = "block";
        authBtn.textContent = "Signup";
        toggleText.innerHTML = `Already have an account? <span style="cursor:pointer; color:blue;">Login</span>`;
    }
});

// ======================
// LOGIN / SIGNUP REQUEST
// ======================
authBtn.addEventListener("click", async () => {
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const url = isLogin
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/auth/signup";

    const body = isLogin ? { email, password } : { name, email, password };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!data.token) {
            alert(data.error || "Something went wrong");
            return;
        }

        // Save token & role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        // Show main app
        showMainApp();

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
});

// ======================
// SHOW / HIDE MAIN APP
// ======================
function showMainApp() {
    authContainer.style.display = "none";
    appContainer.style.display = "block";

    // Show admin button if admin
    if (localStorage.getItem("role") === "admin") {
        adminBtn.style.display = "block";
    }
}

function showAuth() {
    authContainer.style.display = "block";
    appContainer.style.display = "none";
}

// ======================
// AUTO-LOGIN CHECK
// ======================
if (localStorage.getItem("token")) {
    showMainApp();
} else {
    showAuth();
}

// ======================
// EXPLAIN CODE (unchanged)
// ======================
document.getElementById("explainBtn").addEventListener("click", explainCode);

async function explainCode() {
    const code = document.getElementById("codeInput").value;
    const outputDiv = document.getElementById("output");

    if (!code.trim()) {
        outputDiv.textContent = "Please paste some code first!";
        return;
    }

    outputDiv.textContent = "Analyzing... please wait 🔄";

    try {
        const response = await fetch("http://localhost:5000/explain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });

        const data = await response.json();
        outputDiv.textContent = data.explanation || "No explanation returned.";
    } catch (error) {
        outputDiv.textContent = "Error contacting backend 😢";
    }
}

// ======================
// ADMIN PANEL
// ======================
adminBtn.addEventListener("click", () => {
    adminPanel.style.display = "block";
});

loadUsers.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/users", {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
    });

    const users = await res.json();

    usersList.innerHTML = "";
    users.forEach((u) => {
        const li = document.createElement("li");
        li.textContent = `${u.name} — ${u.email} — Role: ${u.role}`;
        usersList.appendChild(li);
    });
});

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    // Clear stored auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Hide app, show login
    authContainer.style.display = "block";
    appContainer.style.display = "none";

    // Hide admin stuff
    adminBtn.style.display = "none";
    adminPanel.style.display = "none";

    alert("Logged out successfully!");
});
