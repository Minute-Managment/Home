let isPomodoroRunning = false;
let pomodoroInterval;
let pomodoroTime = 6; // Initial time set to 6 seconds for testing
const workTime = 25 * 60; // Work time in seconds (25 minutes)
const restTime = 5 * 60; // Rest time in seconds (5 minutes)
let isWorkPhase = true; // To track the phase (work or rest)

// Function to start the Pomodoro timer
function startPomodoro() {
    const taskName = document.getElementById('task-name').value;
    if (!taskName) {
        alert('Please select a task first.');
        return;
    }
    if (isPomodoroRunning) return;

    isPomodoroRunning = true;
    isWorkPhase = true; // Start with work phase
    updatePhaseMessage('Work', 'red'); // Update the message to "Work" and set color to red
    starttimer(workTime); // Start the work timer
}

// Function to update the timer display
function starttimer(time) {
    pomodoroTime = time;
    pomodoroInterval = setInterval(() => {
        if (pomodoroTime <= 0) {
            clearInterval(pomodoroInterval);
            alrt(); // Call your custom alert function
            if (isWorkPhase) {
                // After work session, start rest period
                isWorkPhase = false;
                updatePhaseMessage('Rest', 'green'); // Update the message to "Rest" and set color to green
                starttimer(restTime); // Start the rest timer
            } else {
                resetTimer(); // Reset after rest period
            }
            return;
        }

        pomodoroTime--;
        const minutes = Math.floor(pomodoroTime / 60);
        const seconds = pomodoroTime % 60;
        document.getElementById('timer-display').textContent = 
            `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);

    document.getElementById('start-timer-btn').style.display = 'none';
    document.getElementById('stop-timer-btn').style.display = 'inline';
}

// Function to stop the Pomodoro timer
function stopPomodoro() {
    clearInterval(pomodoroInterval);
    resetTimer();
}

// Function to reset the timer
function resetTimer() {
    pomodoroTime = workTime; // Reset to work time (25 minutes for actual use)
    document.getElementById('timer-display').textContent = '25:00'; // Reset display
    isPomodoroRunning = false;
    isWorkPhase = true; // Reset phase to work
    updatePhaseMessage('Work', 'red'); // Update the message to "Work" and set color to red
    document.getElementById('start-timer-btn').style.display = 'inline';
    document.getElementById('stop-timer-btn').style.display = 'none';
}

// Function to update phase message
function updatePhaseMessage(message, color) {
    document.getElementById('pomodoro-message').textContent = message;
    document.getElementById('pomodoro-message').style.color = color;
}

// Function to prompt user for task name and add it to the list
function addTaskPrompt() {
    const taskPromptHtml = `
        <h2>Add Task</h2>
        <button class="delete-btn" id="delete-btn" onclick="deleteTask(this.parentElement)">X</button>
    `;
    if (!document.body.innerHTML.includes(taskPromptHtml)) {
        const taskList = document.getElementById('task-list');
        const li = document.createElement('li');
        const addBtn = document.createElement('button');
        const taskInput = document.createElement('input');

        li.innerHTML = taskPromptHtml;
        li.className = `taskprompt fade-in`; // Add fade-in class
        taskInput.className = `task-name`;
        taskInput.placeholder = `Enter the task name...`;

        addBtn.innerText = 'Add';
        addBtn.addEventListener('click', function() {
            addTask(taskInput.value, li, addBtn);

            // Apply shake animation to the website when the "Add" button is clicked
            document.body.classList.add('shakeo');
            setTimeout(() => {
                document.body.classList.remove('shakeo');
            }, 500); // Duration should match the CSS animation duration
        });

        li.appendChild(taskInput);
        li.appendChild(addBtn);
        taskList.appendChild(li);

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                addBtn.click();
            }
        });
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                li.querySelector('#delete-btn').click();
            }
        });

        // Automatically focus on the input field when it appears
        taskInput.focus();
    }
}

// Function to create a task element
function createTaskElement(taskName, checked) {
    const li = document.createElement('li');
    li.className = `task fade-in`; // Add fade-in class for animation
    li.innerHTML = `<input type="checkbox" class="task-checkbox" ${checked ? 'checked' : ''}> ${taskName}
        <button class="delete-btn" onclick="deleteTask(this.parentElement)">-</button>`;
    li.onclick = function() {
        selectTask(taskName, li);
    };
    return li;
}

// Function to add a new task to the task list
function addTask(taskName, li, addBtn) {
    if (taskName) {
        li.parentNode.replaceChild(createTaskElement(taskName, false), li);
        saveTasksToCookies();
    } else {
        alert('Please, enter a task name');
    }
}

// Function to delete a task from the task list
function deleteTask(taskElement) {
    const taskNameInput = document.getElementById('task-name');
    const taskName = taskNameInput.value.trim(); // Get the value from the input and trim spaces

    let taskText = ""; // Initialize an empty string to store the text

    // Loop through the child nodes of the <li> element
    taskElement.childNodes.forEach(node => {
        // Check if the node is a text node
        if (node.nodeType === Node.TEXT_NODE) {
            // Append the text content, trimming any extra spaces
            taskText += node.textContent.trim();
        }
    });

    console.log('Task text:', taskText);
    const taskList = document.getElementById('task-list');

    if (taskName === taskText) {
        setTimeout(() => {
        console.log('Matching task found. Clearing input...');
        resetTaskName();            
        }, 200);
    }

    // Animate and remove the task element
    taskElement.style.transform = 'scale(0)';
    taskElement.style.opacity = '0';
    setTimeout(() => {
        taskList.removeChild(taskElement);
        saveTasksToCookies(); // Save tasks to cookies after deleting
    }, 100);
}

// Function to reset the task name input
function resetTaskName() {
    const taskNameInput = document.getElementById('task-name');
    taskNameInput.value = '';
    updatePhaseMessage('', 'red');
}

// Function to select a task from the list
function selectTask(taskName, li) {
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    document.getElementById('task-name').value = taskName;
    clearInterval(pomodoroInterval);
    resetTimer(); // Optionally reset the timer when a new task is selected
}

// Function to save tasks to cookies
function saveTasksToCookies() {
    const taskList = document.getElementById('task-list');
    const tasks = [];
    const taskItems = taskList.getElementsByTagName('li');

    for (let i = 0; i < taskItems.length; i++) {
        const taskName = taskItems[i].querySelector('input[type="checkbox"]').nextSibling.textContent.trim();
        const checked = taskItems[i].querySelector('input[type="checkbox"]').checked;
        tasks.push({ name: taskName, checked: checked });
    }

    // Convert tasks array to JSON string and set it as a cookie
    document.cookie = `tasks=${encodeURIComponent(JSON.stringify(tasks))}; path=/`;
}

// Function to load tasks from cookies
function loadTasksFromCookies() {
    const cookieName = 'tasks=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(cookieName) === 0) {
            const tasksString = c.substring(cookieName.length, c.length);
            const tasks = JSON.parse(tasksString);
            tasks.forEach(task => {
                document.getElementById('task-list').appendChild(createTaskElement(task.name, task.checked));
            });
            return;
        }
    }
}

// Call loadTasksFromCookies when the page loads
window.onload = function() {
    loadTasksFromCookies();
};
