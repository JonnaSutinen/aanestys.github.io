const pollsData = [

];


const users = [
    { username: "kayttaja", password: "salasana", role: "user" },
    { username: "yllapitaja", password: "admin123", role: "admin" },
];


function login() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    const username = usernameInput.value;
    const password = passwordInput.value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        errorMessage.textContent = "";
        successMessage.textContent = `Tervetuloa, ${user.username}!`;
        handleLogin(user);
    } else {
        errorMessage.textContent = "Virheellinen käyttäjätunnus tai salasana.";
        successMessage.textContent = "";
    }
}


function handleLogin(user) {
    const loginSection = document.getElementById("login-section");
    const pollsSection = document.getElementById("polls");
    const adminSection = document.getElementById("admin-section");

    loginSection.classList.add("hidden");

    if (user.role === "user") {
        pollsSection.classList.remove("hidden");
        displayPolls();
    } else if (user.role === "admin") {
        adminSection.classList.remove("hidden");
        displayPolls();
        adminActions();
    }
}

function deletePoll(pollId) {
    const index = pollsData.findIndex(poll => poll.id === pollId);
    if (index !== -1) {
        pollsData.splice(index, 1);
        displayPolls();
    } else {
        alert("Äänestystä ei löytynyt.");
    }
}
function logout() {
    const loginSection = document.getElementById("login-section");
    const pollsSection = document.getElementById("polls");
    const adminSection = document.getElementById("admin-section");

    const usernameInput = document.getElementById("username");
    usernameInput.value = ''; 

    loginSection.classList.remove("hidden");
    pollsSection.classList.add("hidden");
    adminSection.classList.add("hidden");

    const successMessage = document.getElementById("success-message");
    successMessage.textContent = "Kirjauduit ulos. Nähdään pian!";
}

function displayPolls() {
    const pollsSection = document.getElementById("polls");
    pollsSection.innerHTML = '';

    pollsData.forEach(poll => {
        const pollElement = document.createElement("div");
        pollElement.classList.add("poll");
        pollElement.innerHTML = `
            <h3>${poll.question}</h3>
            <ul>
                ${poll.options.map((option, index) => `<li>${option}: ${poll.votes[index]}</li>`).join('')}
            </ul>
            <button onclick="vote(${poll.id})">Äänestä</button>
            <button onclick="deletePoll(${poll.id})">Poista äänestys</button>
        `;
        pollsSection.appendChild(pollElement);
    });
}


function vote(pollId) {
    if (isLoggedIn()) {
        const selectedPoll = pollsData.find(poll => poll.id === pollId);
        if (selectedPoll) {
            const selectedOption = prompt(`Valitse vaihtoehto:\n${selectedPoll.options.join(', ')}`);
            const optionIndex = selectedPoll.options.indexOf(selectedOption);

            if (optionIndex !== -1) {
                selectedPoll.votes[optionIndex]++;
                displayPolls();
            } else {
                alert("Virheellinen valinta.");
            }
        } else {
            alert("Äänestystä ei löytynyt.");
        }
    } else {
        alert("Sinun on kirjauduttava sisään äänestääksesi.");
    }
}


function adminActions() {
    const adminSection = document.getElementById("admin-section");

    adminSection.innerHTML = '';


    const user = getCurrentUser();
    if (user && user.role === "admin") {
        const createPollButton = document.createElement("button");
        createPollButton.textContent = "Luo uusi äänestys";
        createPollButton.onclick = createPoll;
        adminSection.appendChild(createPollButton);
    }
}


function createPoll() {
    const question = prompt("Syötä kysymys:");
    const options = prompt("Syötä vaihtoehdot pilkulla erotettuna:").split(',');

    const newPoll = {
        id: pollsData.length + 1,
        question: question,
        options: options,
        votes: Array(options.length).fill(0),
    };

    pollsData.push(newPoll);
    displayPolls();
}


function getCurrentUser() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;

    return users.find(u => u.username === username);
}


function isLoggedIn() {
    const user = getCurrentUser();
    return user && user.role === "user";
}


function initialize() {
    displayPolls();
    adminActions();


    const body = document.body;
    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Kirjaudu ulos";
    logoutButton.onclick = logout;
    logoutButton.style.position = "fixed";
    logoutButton.style.top = "10px";
    logoutButton.style.right = "10px";
    body.appendChild(logoutButton);
}


initialize();