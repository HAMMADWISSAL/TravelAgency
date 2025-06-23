document.addEventListener('DOMContentLoaded', () => {
  const mainVideo = document.getElementById('mainVideo');
  const videoBtns = document.querySelectorAll('.video-btn');
  const videoSources = Array.from(videoBtns).map(btn => btn.getAttribute('data-video'));

  let currentVideoIndex = 0;

  function playVideoByIndex(index) {
    if (index >= 0 && index < videoSources.length) {
      mainVideo.classList.add('hidden-video');
      mainVideo.src = videoSources[index];
      mainVideo.load();

      mainVideo.oncanplay = () => {
        mainVideo.classList.remove('hidden-video');
        mainVideo.play();
        mainVideo.oncanplay = null;
      };

      currentVideoIndex = index;

      videoBtns.forEach((btn, idx) => {
        btn.classList.toggle('active-video-btn', idx === index);
      });
    }
  }

  mainVideo.addEventListener('ended', () => {
    currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
    playVideoByIndex(currentVideoIndex);
  });

  videoBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playVideoByIndex(index);
    });
  });

  playVideoByIndex(0);
});

// cards experiences
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".testimonial-cards-wrapper");
  const prevBtn = document.querySelector(".nav-button.prev");
  const nextBtn = document.querySelector(".nav-button.next");

  if (!wrapper || !prevBtn || !nextBtn) return;

  const scrollAmount = wrapper.querySelector(".testimonial-card").offsetWidth + 20;

  prevBtn.addEventListener("click", () => {
    wrapper.scrollLeft -= scrollAmount;
  });

  nextBtn.addEventListener("click", () => {
    wrapper.scrollLeft += scrollAmount;
  });
});

// navbar
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('full-width');
  } else {
    navbar.classList.remove('full-width');
  }
});

// ==================== CRUD & Admin Login ====================

function loginAdmin(e) {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  if (email === 'admin@gmail.com' && pass === 'admin12') {
    e.preventDefault();
    document.getElementById("login_form").style.display = "none";
    document.getElementById("client").style.display = "none";
    document.getElementById("admin_section").style.display = "block";
    localStorage.setItem('isAdminLoggedIn', 'true');
  } else {
    alert("Invalid email or password!");
  }
}

function logoutAdmin() {
  document.getElementById("admin_section").style.display = "none";
  document.getElementById("client").style.display = "block";
  localStorage.removeItem('isAdminLoggedIn');
}

function showLoginForm() {
  document.getElementById("client").style.display = "none";
  document.getElementById("login_form").style.display = "block";
}

function goback() {
  document.getElementById("login_form").style.display = "none";
  document.getElementById("client").style.display = "block";
}

window.onload = function() {
  if (localStorage.getItem('isAdminLoggedIn') === 'true') {
    document.getElementById("login_form").style.display = "none";
    document.getElementById("client").style.display = "none";
    document.getElementById("admin_section").style.display = "block";
  } else {
    document.getElementById("login_form").style.display = "none";
    document.getElementById("client").style.display = "block";
    document.getElementById("admin_section").style.display = "none";
  }
  showdistanation();
  afficherDestinationsClient();
};

let indexModifier = null;
let destinations = JSON.parse(localStorage.getItem('destinations')) || [];

function adddestination() {
  let title = document.getElementById('title').value.trim();
  let place = document.getElementById('place').value.trim();
  let subtitle = document.getElementById('subtitle').value.trim();
  let description = document.getElementById('description').value.trim();
  let imagesinput = document.getElementById('images').value.trim();

  if (!title || !place || !subtitle || !description || !imagesinput) {
    alert('Please fill in all fields.');
    return;
  }

  let images = imagesinput.split(',').map(img => img.trim()).filter(img => img !== '');

  let destination = { title, place, subtitle, description, images };

  if (indexModifier !== null) {
    destinations[indexModifier] = destination;
    indexModifier = null;
    document.getElementById("add").textContent = "Add Destination";
  } else {
    destinations.push(destination);
  }

  localStorage.setItem('destinations', JSON.stringify(destinations));
  document.getElementById('destinationForm').reset();
  showdistanation();
  afficherDestinationsClient();
}

function showdistanation() {
  const tableBody = document.getElementById('destinationTable');
  tableBody.innerHTML = '';

  if (destinations.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No destinations found</td></tr>';
    return;
  }

  destinations.forEach((dest, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${dest.title}</td>
      <td>${dest.place}</td>
      <td>${dest.subtitle}</td>
      <td>${dest.description}</td>
      <td><img src="${dest.images[0]}" alt="${dest.title}" style="width:50px;"></td>
      <td>
        <button type="button" class="modifier-btn" onclick="modifierDestination(${index})">Modify</button>
        <button type="button" class="supprimer-btn" onclick="supprimerDestination(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function supprimerDestination(id) {
  if (!confirm("Are you sure you want to delete this destination?")) return;

  destinations.splice(id, 1);
  localStorage.setItem('destinations', JSON.stringify(destinations));
  showdistanation();
  afficherDestinationsClient();
}

function modifierDestination(index) {
  if (!destinations[index]) return;

  let dest = destinations[index];

  document.getElementById("title").value = dest.title;
  document.getElementById("place").value = dest.place;
  document.getElementById("subtitle").value = dest.subtitle;
  document.getElementById("description").value = dest.description;
  document.getElementById("images").value = dest.images.join(', ');

  indexModifier = index;
  let btn = document.getElementById("add");
  if (btn) btn.textContent = "Modify";
}

function cancel() {
  document.getElementById('destinationForm').reset();
  indexModifier = null;
  const btn = document.getElementById('add');
  if (btn) btn.textContent = 'Add Destination';
}

function afficherDestinationsClient() {
  let container = document.querySelector("#destinations .destinations-grid");
  if (!container) return;
  
  container.innerHTML = '';

  if (destinations.length === 0) {
    container.innerHTML = "<p>No destinations available.</p>";
    return;
  }

  destinations.forEach((dest, index) => {
    let card = document.createElement('div');
    card.className = "destination-card";
    card.innerHTML = `
      <div class="destination-image-wrapper">
        <img src="${dest.images[0]}" alt="${dest.title}">
      </div>
      <div class="destination-content">
        <h3>${dest.place}, ${dest.title}</h3>
        <p>${dest.subtitle}</p>
        <button type="button" class="btn-show" onclick="voirDetails(${index})">
          View Details <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}
function voirDetails(index) {
  let cardsContainer = document.querySelector(".destinations-grid");
  let detailSection = document.getElementById("destinationDetails");

  cardsContainer.style.display = "none";
  detailSection.style.display = "flex";

  let dest = destinations[index];

  detailSection.innerHTML = `
    <div class="containerDetails">
      <div class="imagesDetails">
        ${dest.images.map(src => `<img src="${src}" alt="${dest.title}">`).join('')}
      </div>
      <div class="textDetails">
        <h3>${dest.place}, ${dest.title}</h3>
        <p><strong>${dest.subtitle}</strong></p>
        <p>${dest.description}</p>
        <button type="button" class="retour" onclick="retour()">Back to list</button>
      </div>
    </div>
  `;
}


function retour() {
  let detailSection = document.getElementById("destinationDetails");
  let cardsContainer = document.querySelector(".destinations-grid");
  if (!detailSection || !cardsContainer) return;

  detailSection.style.display = "none";
  cardsContainer.style.display = "grid";
}

document.getElementById('searchInput').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const container = document.querySelector('.destinations-grid');
  container.innerHTML = '';

  const destinations = JSON.parse(localStorage.getItem('destinations')) || [];

  const filtered = destinations.filter(dest =>
    dest.title.toLowerCase().includes(searchTerm) ||
    dest.place.toLowerCase().includes(searchTerm) ||
    dest.subtitle.toLowerCase().includes(searchTerm)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<p>No destinations found.</p>';
    return;
  }

  filtered.forEach(dest => {
    const card = document.createElement('div');
    card.className = "destination-card";
    card.innerHTML = `
      <div class="destination-image-wrapper">
        <img src="${dest.images[0]}" alt="${dest.title}">
      </div>
      <div class="destination-content">
        <h3>${dest.place}, ${dest.title}</h3>
        <p>${dest.subtitle}</p>
        <button type="button" class="btn-show" onclick="voirDetailsByFiltered('${dest.title}')">View Details <i class="fas fa-arrow-right"></i></button>
      </div>
    `;
    container.appendChild(card);
  });
});

function voirDetailsByFiltered(title) {
  const index = destinations.findIndex(dest => dest.title === title);
  if (index !== -1) voirDetails(index);
}
