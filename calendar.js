
function adddate(taskdate) {
    let date = '';
    date = prompt('Add your task or event name');

    // Default date if no input
    if (taskdate === 0) {
        taskdate = '01';
    }

    if (date && taskdate) {
        addDate(date, taskdate);
    }
}

function addDate(taskName, taskdate) {
    const dateList = document.getElementById('date-list');
    const li = document.createElement('li');
    let specificDate = `2024-04-${taskdate}`;
    let startTime = 'T120000';  // Fixed start time 12 PM
    let endTime = 'T120000';    // Fixed end time 12 PM

    let selectDay = `
        <input class="dayselect" type="date" value="${specificDate}">
    `;

    li.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <span class="task-name">${taskName}</span> ${selectDay}
        <a href="https://calendar.google.com/calendar/u/0/r/eventedit?dates=${specificDate.replace(/-/g, '') + startTime}/${specificDate.replace(/-/g, '') + endTime}&ctz=GMT&text=${taskName}" target="_blank">Google Calendar</a>
    `;

    dateList.appendChild(li);

    // Call the function to upload the date to Google Calendar (via gAPI)
    addEventToCalendar(taskName, specificDate);
}

function addEventToCalendar(taskName, date) {
    var event = {
      'summary': taskName,
      'start': {
        'date': date,  // Date in the format YYYY-MM-DD
        'timeZone': 'America/Los_Angeles'  // Set the appropriate timezone
      },
      'end': {
        'date': date,  // Same end date for all-day events
        'timeZone': 'America/Los_Angeles'
      }
    };

    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',  // Add to the user's primary calendar
      'resource': event
    });

    request.execute(function(event) {
      console.log('Event created: ' + event.htmlLink);
    });
}


const calendarDaysDiv = document.getElementById('calendarDays');
const monthYearText = document.getElementById('monthYear');

const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth(); // 0-based index
const currentYear = currentDate.getFullYear();

// Array of month names
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Set month and year header
monthYearText.innerText = `${monthNames[currentMonth]} ${currentYear}`;

// Function to get the number of days in a month
function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

// Get the first day of the month (Sunday = 0, Monday = 1, ...)
const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

// Fill in the days before the 1st of the current month
for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('calendar-uday');
    calendarDaysDiv.appendChild(emptyDiv);
}

// Populate the days of the month
const totalDays = daysInMonth(currentMonth, currentYear);
for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.innerText = day;

    // Highlight today's date
    if (day === currentDay) {
        dayDiv.classList.add('today');
    }

    // Add an onclick handler if needed
    dayDiv.onclick = function() {
        adddate(day.toString().padStart(2, '0'));
    };

    calendarDaysDiv.appendChild(dayDiv);
}

// Function to handle date click (can be customized)
// function adddate(date) {
//     alert(`You selected ${date} ${monthNames[currentMonth]} ${currentYear}`);
// }