// Register Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/static/js/serviceWorker.js")
    .then(registration => {
        console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch(error => {
        console.error("Service Worker registration failed:", error);
    });
}

// Initialize IndexedDB
let db;
const request = indexedDB.open("todoDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("tasks", { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;
    attachFormHandler();
    updateStatus();
    setupReminderChecker();
};

// Attach form submit handler
function attachFormHandler() {
    document.getElementById("todoForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const task = document.getElementById("taskInput").value.trim();
        if (!task) return;

        if (navigator.onLine) {
            fetch("/add", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `task=${encodeURIComponent(task)}`
            }).then(() => {
                saveTaskTime(task);
                showToast("Task Added Successfully!");
                setTimeout(() => window.location.reload(), 1500);
            });
        } else {
            const transaction = db.transaction(["tasks"], "readwrite");
            const store = transaction.objectStore("tasks");
            store.add(task);
            showToast("Saved Offline!");
            document.getElementById("taskInput").value = "";
            saveTaskTime(task);
        }
    });

    window.addEventListener("online", syncTasks);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
}

// Sync tasks when back online
function syncTasks() {
    const transaction = db.transaction(["tasks"], "readwrite");
    const store = transaction.objectStore("tasks");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length === 0) return;
        let syncedCount = 0;
        getAll.result.forEach(task => {
            fetch("/add", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `task=${encodeURIComponent(task)}`
            }).then(() => {
                syncedCount++;
                if (syncedCount === getAll.result.length) {
                    store.clear();
                    window.location.reload();
                }
            });
        });
    };
}

// Status update
function updateStatus() {
    document.getElementById("status").textContent = navigator.onLine
        ? "Online"
        : "Offline - changes will sync when online";
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 4000);
}

// Dark Mode Logic
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("darkModeToggle");
    const darkModeEnabled = localStorage.getItem("darkMode") === "true";
    toggle.checked = darkModeEnabled;
    document.body.classList.toggle("dark-mode", darkModeEnabled);

    toggle.addEventListener("change", function () {
        document.body.classList.toggle("dark-mode", toggle.checked);
        localStorage.setItem("darkMode", toggle.checked);
    });

    if ("Notification" in window) {
        Notification.requestPermission();
    }
});

// Save task time for reminder system
function saveTaskTime(task) {
    let taskTimeMap = JSON.parse(localStorage.getItem("taskTimeMap")) || {};
    const timestamp = Date.now();
    taskTimeMap[task] = timestamp;
    localStorage.setItem("taskTimeMap", JSON.stringify(taskTimeMap));
}

// Setup reminder checker
function setupReminderChecker() {
    setInterval(checkPendingTasks, 15 * 60 * 1000); // every 15 min
    checkPendingTasks(); // initial check immediately on load
}

// Reminder check logic
function checkPendingTasks() {
    const thresholdHours = 4; // after 4 hours show reminder
    const taskMap = JSON.parse(localStorage.getItem("taskTimeMap")) || {};

    for (const [task, time] of Object.entries(taskMap)) {
        const hoursPassed = (Date.now() - time) / (1000 * 60 * 60);
        if (hoursPassed >= thresholdHours) {
            notifyPending(task);
        }
    }
}

// Trigger browser notification
function notifyPending(task) {
    if (Notification.permission === "granted") {
        new Notification("Reminder 🕰️", {
            body: `Don't forget to complete: "${task}"`,
            icon: "/static/icons/icon-192.png"
        });
    } else {
        showToast(`Pending: "${task}"`);
    }
}
