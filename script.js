function getExactTimeDifference(startDate, endDate) {
  // Extracting values from start date
  let startYears = startDate.getFullYear();
  let startMonths = startDate.getMonth();
  let startDays = startDate.getDate();
  let startHours = startDate.getHours();
  let startMinutes = startDate.getMinutes();
  let startSeconds = startDate.getSeconds();

  // Extracting values from end date
  let endYears = endDate.getFullYear();
  let endMonths = endDate.getMonth();
  let endDays = endDate.getDate();
  let endHours = endDate.getHours();
  let endMinutes = endDate.getMinutes();
  let endSeconds = endDate.getSeconds();

  // Calculating differences between end date and start date
  let yearsDiff = endYears - startYears;
  let monthsDiff = endMonths - startMonths;
  let daysDiff = endDays - startDays;
  let hoursDiff = endHours - startHours;
  let minutesDiff = endMinutes - startMinutes;
  let secondsDiff = endSeconds - startSeconds;

  // Handle negative differences
  if (secondsDiff < 0) {
    secondsDiff += 60;
    minutesDiff--;
  }
  if (minutesDiff < 0) {
    minutesDiff += 60;
    hoursDiff--;
  }
  if (hoursDiff < 0) {
    hoursDiff += 24;
    daysDiff--;
  }
  if (daysDiff < 0) {
    monthsDiff--;
    const previousMonth = (endMonths - 1 + 12) % 12;
    daysDiff += new Date(endYears, previousMonth + 1, 0).getDate(); // Days in the previous month
  }
  if (monthsDiff < 0) {
    monthsDiff += 12;
    yearsDiff--;
  }

  return {
    years: yearsDiff,
    months: monthsDiff,
    days: daysDiff,
    hours: hoursDiff,
    minutes: minutesDiff,
    seconds: secondsDiff,
  };
}

function displayRectangles(dob, deathAge) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const birthYear = dob.getFullYear();
  const birthMonth = dob.getMonth();
  const totalMonths = deathAge * 12;
  const ageInMonths =
    (currentYear - birthYear) * 12 + (currentMonth - birthMonth);
  const rectanglesContainer = document.getElementById("rectangles");

  rectanglesContainer.innerHTML = ""; // Clear previous rectangles

  let currentColumn = null;

  for (let i = 1; i <= totalMonths; i++) {
    if ((i - 1) % 12 === 0) {
      currentColumn = document.createElement("div");
      currentColumn.classList.add("rectangle-column");
      rectanglesContainer.appendChild(currentColumn);

      if ((i - 1) % 120 === 0) {
        const yearMarker = document.createElement("span");
        yearMarker.classList.add("year-marker");
        yearMarker.textContent = (i - 1) / 12 + 1;
        currentColumn.appendChild(yearMarker);
      }
    }

    const rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");

    if (i <= ageInMonths) {
      rectangle.classList.add("past");
    } else if (i === ageInMonths + 1) {
      rectangle.classList.add("present");
    } else {
      rectangle.classList.add("future");
    }

    currentColumn.appendChild(rectangle);
  }
}

function toggleSound() {
  let sound = document.getElementById("backgroundSound");
  let soundButton = document.getElementById("soundButton");

  if (sound.paused) {
    sound.play();
    soundButton.innerHTML = "Turn Off Sound";
  } else {
    sound.pause();
    soundButton.innerHTML = "Turn On Sound";
  }
}

document.getElementById("lifeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const dob = new Date(document.getElementById("dateOfBirth").value);
  const deathAge = Number(document.getElementById("deathAge").value);

  // Save the data to localStorage
  localStorage.setItem("dob", dob);
  localStorage.setItem("deathAge", deathAge);

  displayRectangles(dob, deathAge);
});

// When the page loads
window.onload = function () {
  const savedDOB = localStorage.getItem("dob");
  const savedDeathAge = localStorage.getItem("deathAge");

  if (savedDOB && savedDeathAge) {
    document.getElementById("lifeForm").style.display = "none"; // Hide the form if data exists

    const now = new Date();
    const dob = new Date(savedDOB);

    const lived = getExactTimeDifference(dob, now);

    // Calculate expected death date
    const deathDate = new Date(dob);
    deathDate.setFullYear(deathDate.getFullYear() + Number(savedDeathAge));

    const remaining = getExactTimeDifference(now, deathDate);

    document.getElementById("lifeInfo").innerHTML = `
        You have lived ${lived.years} years, ${lived.months} months, ${lived.days} days, ${lived.hours} hours, ${lived.minutes} minutes, and ${lived.seconds} seconds. 
        <br>You have ${remaining.years} years, ${remaining.months} months, ${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, and ${remaining.seconds} seconds left.
        `;
    document.getElementById("postSubmitContent").style.display = "block"; // Show the post-submit content
    document.getElementById("enterAgainButton").style.display = "block"; // Show the Enter Again button

    displayRectangles(new Date(savedDOB), Number(savedDeathAge));
  }

  const soundButton = document.getElementById("soundButton");
  soundButton.addEventListener("click", toggleSound);
};

function updateLifeInfo() {
  const savedDOB = localStorage.getItem("dob");
  const savedDeathAge = localStorage.getItem("deathAge");

  if (savedDOB && savedDeathAge) {
    const now = new Date();
    const dob = new Date(savedDOB);

    const lived = getExactTimeDifference(dob, now);

    // Calculate expected death date
    const deathDate = new Date(dob);
    deathDate.setFullYear(deathDate.getFullYear() + Number(savedDeathAge));

    const remaining = getExactTimeDifference(now, deathDate);

    document.getElementById("lifeInfo").innerHTML = `
        You have lived ${lived.years} years, ${lived.months} months, ${lived.days} days, ${lived.hours} hours, ${lived.minutes} minutes, and ${lived.seconds} seconds. 
        <br />You have ${remaining.years} years, ${remaining.months} months, ${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, and ${remaining.seconds} seconds left.
        `;
  }
}

setInterval(updateLifeInfo, 1000);

document
  .getElementById("enterAgainButton")
  .addEventListener("click", function () {
    document.getElementById("postSubmitContent").style.display = "none"; // Hide the post-submit content

    const savedDOB = localStorage.getItem("dob");
    const savedDeathAge = localStorage.getItem("deathAge");

    // Pre-fill the form with saved data
    document.getElementById("dateOfBirth").value = savedDOB;
    document.getElementById("deathAge").value = savedDeathAge;

    document.getElementById("lifeForm").style.display = "block"; // Show the form again
  });

/**
 * Snow
 */
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
const particleCount = 100; // Number of particles, adjust as needed

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5,
    speedX: Math.random() * 0.5 - 0.25,
    speedY: Math.random() * 0.5 + 1,
    opacity: Math.random(),
  };
}

function moveParticles() {
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    if (particle.y > canvas.height) {
      particles[i] = createParticle();
      particles[i].y = 0;
    }
    particle.opacity -= 0.005;
    if (particle.opacity <= 0) {
      particle.opacity = Math.random();
    }
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let particle of particles) {
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animate() {
  moveParticles();
  drawParticles();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < particleCount; i++) {
  particles.push(createParticle());
}

animate();
