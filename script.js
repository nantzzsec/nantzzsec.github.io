let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header navbar');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a [href*=' + id + ' ]').classList.add('active');
            })
        }
    })
}

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

//download certificate path
function downloadCertificate(filePath, fileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
}

//download pdf path
function downloadLaporan(filePath, fileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
}

//contact Whatsapp
function sendWhatsApp() {
    var name = document.getElementById('full-name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value;
    var messageText = encodeURIComponent("Hi, I'm " + name + ". \nEmail: " + email + "\nPhone: " + phone + "\nSubject: " + subject + "\nMessage: " + message);
    var phoneNumber = "6285896873540"; 
    var url = "https://wa.me/" + phoneNumber + "?text=" + messageText;
    window.open(url, "_blank");
}


// Tampilkan Popup CV
const showCV = document.getElementById('showCV');
const popup = document.getElementById('popup');
const closeButton = document.getElementById('closeButton');

showCV.addEventListener('click', (event) => {
  event.preventDefault();
  popup.style.display = 'flex';
});

closeButton.addEventListener('click', () => {
  popup.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.style.display = 'none';
  }
});



// Umur
const tanggalLahir = new Date(2003, 6, 24);
const today = new Date();

let umur = today.getFullYear() - tanggalLahir.getFullYear();

const bulanSekarang = today.getMonth();
const tanggalSekarang = today.getDate();
const bulanLahir = tanggalLahir.getMonth();
const tanggalLahirHari = tanggalLahir.getDate();

if (bulanSekarang < bulanLahir || (bulanSekarang === bulanLahir && tanggalSekarang < tanggalLahirHari)) {
  umur--;
}

document.getElementById("umur").textContent = umur;

