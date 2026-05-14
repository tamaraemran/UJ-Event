function displayMessage(element, message, isError = false) {
    if (!element) {
        console.error("Message element not found!"); 
        return;
    }
    element.innerHTML = message; 
    element.style.display = 'block';
    element.style.padding = '15px';
    element.style.marginBottom = '20px';
    element.style.borderRadius = '8px';
    element.style.textAlign = 'center';
    element.style.fontWeight = 'bold';

    if (isError) {
        element.style.backgroundColor = '#f8d7da';
        element.style.color = '#721c24';
        element.style.border = '1px solid #f5c6cb';
    } else {
        element.style.backgroundColor = '#d4edda';
        element.style.color = '#155724';
        element.style.border = '1px solid #c3e6cb';
    }
}

// 1. contact form submission - client-side validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const responseArea = document.getElementById('responseMessage');
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const mobile = document.getElementById('mobile').value;
        const email = document.getElementById('email').value;

        if (firstName.trim() === "" || firstName.length < 2 || !/^[A-Za-z\s]+$/.test(firstName) ) {
            displayMessage(responseArea, "Please enter a valid first name.", true);
            return;
        }
        if (lastName.trim() === "" || lastName.length < 2 || !/^[A-Za-z\s]+$/.test(lastName) ) {
            displayMessage(responseArea, "Please enter a valid last name.", true);
            return;
        }
        if (mobile.trim() === "" || mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
            displayMessage(responseArea, "Mobile number must be exactly 10 digits.", true);
            return;
        }
        if (email.trim() === "" || !email.endsWith('@uj.edu.sa')|| !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            displayMessage(responseArea, "Please use your university email (@uj.edu.sa)", true);
            return;
        }

        const data = Object.fromEntries(new FormData(contactForm).entries());
        fetch('/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) { 
                displayMessage(responseArea, `Thank you, ${firstName}! Your message has been sent successfully.`); 
                contactForm.reset(); 
            }
        });
    });
}

// 2. add new event form submission - client-side validation
const addEventForm = document.getElementById('addEventForm');
if (addEventForm) {
    addEventForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const msgArea = document.getElementById('addEventMessage');
        const title = document.getElementById('eventTitle').value;
        const description = document.getElementById('eventDescription').value;
        const eventDate = document.getElementById('eventDate').value;
        const today = new Date().toISOString().split('T')[0];

        if (title.trim() === "" || title.length < 10) {
            displayMessage(msgArea, "Event title must be at least 10 characters.", true);
            return;
        }
        if (eventDate < today) {
            displayMessage(msgArea, "Error: You cannot select a date in the past!", true);
            return;
        }
        if (description.trim() === "" || description.length < 20) {
            displayMessage(msgArea, "Please provide a more detailed description (min 20 chars).", true);
            return;
        }

        const data = Object.fromEntries(new FormData(addEventForm).entries());
        fetch('/add-new-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) { 
                displayMessage(msgArea, `The event "${title}" has been published successfully.`); 
                addEventForm.reset();
                setTimeout(() => location.href = 'events.html', 2000);
            }
        })
        .catch(err => {
            displayMessage(msgArea, "Server Error. Please try again.", true);
        });
    });
}

// 3. event listing page - load events and determine status
function loadEventsToTable() {
    const tableBody = document.getElementById('eventsTableBody');
    if (!tableBody) return;

    fetch('/get-events')
        .then(res => res.json())
        .then(events => {
            tableBody.innerHTML = "";
            const today = new Date();
            today.setHours(0,0,0,0);

            events.forEach(event => {
                const eventDate = new Date(event.eventDate);
                eventDate.setHours(0,0,0,0);

                let statusText = eventDate < today ? "Past" : (eventDate.getTime() === today.getTime() ? "Today" : "Upcoming");
                let statusClass = eventDate < today ? "status-badge past" : "status-badge active";

                const row = `
                <tr>
                    <td style="font-weight: bold;">${event.eventTitle}</td>
                    <td>${eventDate.toLocaleDateString('en-GB')}</td>
                    <td>${event.eventLocation}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                    <td class="actions-cell">
                        <button class="register-btn" 
                                onclick="openRegisterModal(${event.id}, '${event.eventTitle}')"
                                ${eventDate < today ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                            ${eventDate < today ? 'Closed' : 'Register Now'}
                        </button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        });
}

// 4. open registration 
function openRegisterModal(id, title) {
    const modal = document.getElementById('registerModal');
    if (modal) {
        document.getElementById('modalEventId').value = id;
        document.getElementById('modalEventTitle').textContent = title;
        modal.style.display = 'block';
    }
}

// 5. handle registration form submission
const regForm = document.getElementById('registrationForm');
if (regForm) {
    regForm.onsubmit = function(e) {
        e.preventDefault();
        const data = {
            studentName: document.getElementById('regName').value,
            studentID: document.getElementById('regId').value,
            eventID: document.getElementById('modalEventId').value
        };

        fetch('/register-student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            const msgArea = document.getElementById('modalMessage');
            displayMessage(msgArea, result.message, !result.success);
            if (result.success) {
                setTimeout(() => location.reload(), 2000);
            }
        });
    };
}

// 6. load upcoming events for home page
function loadHomeEvents() {
    const grid = document.getElementById('homeEventsGrid');
    if (!grid) return;

    fetch('/get-home-events')
        .then(res => res.json())
        .then(events => {
            grid.innerHTML = ""; 
            events.slice(0, 6).forEach(event => {
                const card = document.createElement('div');
                card.className = 'event-card'; 
                const badgeClass = `event-badge badge-${event.eventCategory.toLowerCase()}`;
                card.innerHTML = `
                    <div class="${badgeClass}">${event.eventCategory}</div>
                    <div class="event-content">
                        <h3>${event.eventTitle}</h3>
                        <div class="event-details">
                            <p><i class="far fa-calendar-alt"></i> ${new Date(event.eventDate).toLocaleDateString('en-GB')}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${event.eventLocation}</p>
                            <p><i class="far fa-clock"></i> ${event.eventTime}</p>
                        </div>
                        <button class="view-btn" onclick='openModal(${JSON.stringify(event)})'>View Details</button>
                    </div>`;
                grid.appendChild(card);
            });
        });
    fetch('/count-upcoming-events')
    .then(res => res.json())
    .then(data => {
        const countElement = document.getElementById('upcomingCount'); 
        if (countElement) {
            countElement.innerText = data.count;
        }
    })
    .catch(err => console.error('Error fetching count:', err));
}

function openModal(event) {
    const modal = document.getElementById('detailsModal');
    if (!modal) return;

    const modalBadge = document.getElementById('modalBadge');
    modalBadge.textContent = event.eventCategory;
    modalBadge.className = `event-badge badge-${event.eventCategory.toLowerCase()}`;

    document.getElementById('modalTitle').textContent = event.eventTitle;
    document.getElementById('modalDate').textContent = new Date(event.eventDate).toLocaleDateString('en-GB');
    document.getElementById('modalTime').textContent = event.eventTime;

    document.getElementById('modalLocation').textContent = event.eventLocation;
    const eventDate = new Date(event.eventDate);
    const today = new Date();
   eventDate.setHours(0,0,0,0);
   today.setHours(0,0,0,0);
   let statusText = eventDate < today 
    ? "Past" 
    : (eventDate.getTime() === today.getTime() ? "Today" : "Upcoming");
   const modalStatus = document.getElementById('modalStatus');
  modalStatus.textContent = statusText;
  modalStatus.className = eventDate < today
    ? "status-badge past"
    : "status-badge active";
    document.getElementById('modalDesc').textContent = event.eventDescription;
    modal.style.display = "block";
}

document.addEventListener('DOMContentLoaded', () => {
    loadEventsToTable();
    loadHomeEvents();
    
    document.querySelectorAll('form').forEach(form => {
    form.addEventListener('input', () => {
        const msgArea = form.querySelector('.message-area') || document.getElementById('responseMessage') || document.getElementById('addEventMessage');
        if (msgArea) msgArea.style.display = 'none'; 
    });
});
    // close modals when clicking outside or on close button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close') || e.target.id === 'detailsModal' || e.target.id === 'registerModal') {
            if(document.getElementById('detailsModal')) document.getElementById('detailsModal').style.display = 'none';
            if(document.getElementById('registerModal')) document.getElementById('registerModal').style.display = 'none';
        }
    });
});