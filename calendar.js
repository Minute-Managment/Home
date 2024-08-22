const calendarDaysDiv = document.getElementById('calendarDays');
const monthYearText = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const dateList = document.getElementById('date-list');
const eventNameInput = document.getElementById('eventName');
const eventDateInput = document.getElementById('eventDate');

let currentDate = new Date();
let selectedDate = null;
const eventDates = new Set(); // Set to track dates with events

// Array of month names
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Function to get the number of days in a month
function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

// Function to populate the calendar
function populateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();

    monthYearText.innerText = `${monthNames[month]} ${year}`;
    
    calendarDaysDiv.innerHTML = ''; // Clear previous days

    // Get the first day of the month (Sunday = 0, Monday = 1, ...)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Fill in the days before the 1st of the current month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-uday');
        calendarDaysDiv.appendChild(emptyDiv);
    }

    // Populate the days of the month
    const totalDays = daysInMonth(month, year);
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.innerText = day;

        // Highlight today's date only in the current month and year
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        // Check if the day has events
        const dateKey = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        if (eventDates.has(dateKey)) {
            dayDiv.classList.add('ddays');
        }

        // Add class for the selected day
        if (dateKey === selectedDate) {
            dayDiv.classList.add('sdays');
        }

        // Add an onclick handler to select date
        dayDiv.onclick = function() {
            const selectedDay = day.toString().padStart(2, '0');
            selectedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${selectedDay}`;
            filterDatesBySelectedDate(selectedDate);
            populateCalendar(date); // Refresh calendar to update day classes
        };

        calendarDaysDiv.appendChild(dayDiv);
    }
}

// Function to add a date to the list
function adddate() {
    const taskName = eventNameInput.value;
    const taskdate = eventDateInput.value;

    if (taskName && taskdate) {
        const li = document.createElement('li');
        li.setAttribute('data-date', taskdate);

        let startTime = 'T120000';  // Fixed start time 12 PM
        let endTime = 'T120000';    // Fixed end time 12 PM

        let selectDay = `
            <input class="dayselect" type="date" value="${taskdate}">
        `;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox">
            <span class="task-name">${taskName}</span> ${selectDay}
            <a href="https://calendar.google.com/calendar/u/0/r/eventedit?dates=${taskdate.replace(/-/g, '') + startTime}/${taskdate.replace(/-/g, '') + endTime}&ctz=GMT&text=${taskName}" target="_blank">Google Calendar</a>
        `;

        dateList.insertBefore(li, dateList.firstChild); // Add new date to the top of the list

        eventDates.add(taskdate); // Add date to the set of event dates

        // Clear the input fields
        eventNameInput.value = '';
        eventDateInput.value = '';
    } else {
        alert('Please enter both an event name and a date.');
    }
}

// Function to filter and show/hide dates based on the selected date
function filterDatesBySelectedDate(selectedDate) {
    const allDates = dateList.querySelectorAll('li');

    allDates.forEach(li => {
        if (li.getAttribute('data-date') === selectedDate) {
            li.style.display = 'block';
        } else {
            li.style.display = 'none';
        }
    });
}

// Event listeners for the month navigation buttons
prevMonthBtn.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    populateCalendar(currentDate);
    selectedDate = null; // Clear selected date when month changes
    filterDatesBySelectedDate(null); // Show all dates
});

nextMonthBtn.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    populateCalendar(currentDate);
    selectedDate = null; // Clear selected date when month changes
    filterDatesBySelectedDate(null); // Show all dates
});

// Set default event date to today
eventDateInput.value = currentDate.toISOString().split('T')[0];

// Initial population of the calendar
populateCalendar(currentDate);
