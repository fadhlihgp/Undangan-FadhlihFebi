// Wishes/Comments data and pagination
let allWishes = [
  {
    author: "Rina & Doni",
    text: "Selamat Rara & Bima! Semoga menjadi keluarga samawa, cepat diberi momongan ya!",
    status: "Hadir",
  },
  {
    author: "Bapak Sutrisno",
    text: "Selamat menempuh hidup baru, semoga langgeng hingga akhir hayat.",
    status: "Hadir",
  },
  { author: "Andi Wijaya", text: "Congrats bro! Akhirnya pecah telor juga. Lancar sampai hari H!", status: "Hadir" },
  {
    author: "Siti Nurhaliza",
    text: "Masya Allah, ikut bahagia. Semoga pernikahannya diberkahi Allah SWT. Mohon maaf belum bisa hadir.",
    status: "Tidak Hadir",
  },
  { author: "Dewi Lestari", text: "Selamat yaa kalian berdua, pasangan favoritku! Bahagia selalu.", status: "Hadir" },
  {
    author: "Ahmad Rahman",
    text: "Barakallahu laka wa baraka alaika wa jama'a bainakuma fi khair. Semoga berkah selalu!",
    status: "Hadir",
  },
  {
    author: "Sari Indah",
    text: "Alhamdulillah akhirnya kalian menikah juga. Selamat ya, semoga bahagia dunia akhirat.",
    status: "Hadir",
  },
  {
    author: "Yoga Pratama",
    text: "Selamat buat kalian berdua! Semoga menjadi keluarga yang harmonis dan diberkahi Allah.",
    status: "Tidak Hadir",
  },
  {
    author: "Ibu Retno",
    text: "Selamat menempuh hidup baru nak. Semoga menjadi keluarga yang sakinah mawaddah warahmah.",
    status: "Hadir",
  },
  {
    author: "Farhan & Maya",
    text: "Congratulations! Kalian couple goals banget. Semoga langgeng sampai maut memisahkan.",
    status: "Hadir",
  },
  {
    author: "Pak RT",
    text: "Selamat ya Rara dan Bima. Sebagai tetangga, saya ikut bahagia. Semoga rukun selalu.",
    status: "Hadir",
  },
  {
    author: "Teman Kuliah",
    text: "Masya Allah, dari jaman kuliah udah keliatan cocok. Selamat ya, semoga bahagia!",
    status: "Tidak Hadir",
  },
  {
    author: "Keluarga Besar",
    text: "Alhamdulillah, akhirnya ada yang nikah di keluarga kita. Selamat ya!",
    status: "Hadir",
  },
  {
    author: "Sahabat SMA",
    text: "Dari SMA udah tau kalian jodoh. Selamat ya! Jangan lupa undang pas 7 bulanan.",
    status: "Hadir",
  },
  {
    author: "Tim Kerja",
    text: "Selamat dari tim kantor! Semoga bisa tetap produktif setelah menikah hehe.",
    status: "Tidak Hadir",
  },
  {
    author: "Guru Ngaji",
    text: "Barakallahu fiikum. Semoga menjadi keluarga yang istiqomah dan diberkahi Allah SWT.",
    status: "Hadir",
  },
  {
    author: "Tetangga Sebelah",
    text: "Selamat ya nak Rara dan Bima. Kalian pasangan yang manis. Semoga langgeng!",
    status: "Hadir",
  },
  {
    author: "Komunitas Motor",
    text: "Selamat bro Bima! Jangan lupa touring bareng setelah honeymoon ya!",
    status: "Hadir",
  },
  {
    author: "Teman Arisan Ibu",
    text: "Anaknya Ibu Sriasih cantik banget. Selamat ya bu, semoga menjadi menantu yang baik.",
    status: "Hadir",
  },
  {
    author: "Sepupu Jauh",
    text: "Selamat dari Jogja! Maaf tidak bisa hadir, tapi doa selalu menyertai kalian.",
    status: "Tidak Hadir",
  },
  {
    author: "Teman Gym",
    text: "Bro Bima akhirnya settle down! Selamat ya, semoga istri gak protes kalau masih gym terus.",
    status: "Hadir",
  },
  {
    author: "Alumni Pesantren",
    text: "Barakallahu laka. Semoga Allah memberikan keturunan yang sholeh dan sholeha.",
    status: "Hadir",
  },
  {
    author: "Rekan Bisnis",
    text: "Selamat mas Bima dan mbak Rara! Semoga bisnis dan rumah tangga sama-sama lancar.",
    status: "Tidak Hadir",
  },
  {
    author: "Tetangga Kos",
    text: "Selamat ya! Seneng banget lihat kalian akhirnya menikah. Jangan lupa traktir!",
    status: "Hadir",
  },
  {
    author: "Guru SD",
    text: "Rara murid yang baik dari kecil. Selamat ya nak, semoga menjadi istri yang sholehah.",
    status: "Hadir",
  },
];

let currentPage = 1;
const wishesPerPage = 5;
let totalPages = Math.ceil(allWishes.length / wishesPerPage);

function displayWishes() {
  const startIndex = (currentPage - 1) * wishesPerPage;
  const endIndex = startIndex + wishesPerPage;
  const currentWishes = allWishes.slice(startIndex, endIndex);

  const wishesContainer = document.getElementById("wishes-list");

  // Add fade out effect
  wishesContainer.style.opacity = "0.3";

  setTimeout(() => {
    wishesContainer.innerHTML = "";

    if (currentWishes.length === 0) {
      wishesContainer.innerHTML =
        '<div class="no-wishes"><p style="text-align: center; color: var(--color-text); opacity: 0.7; padding: 2rem;">Belum ada ucapan</p></div>';
    } else {
      currentWishes.forEach((wish, index) => {
        const wishDiv = document.createElement("div");
        wishDiv.className = "wish-item";
        wishDiv.style.animationDelay = `${index * 0.1}s`;

        // Sanitize text content
        const authorText = wish.author.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const wishText = wish.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const statusText = wish.status.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        wishDiv.innerHTML = `
                            <strong>${authorText}</strong>
                            <p>"${wishText}"</p>
                            <small>Status: <span style="color: ${
                              wish.status === "Hadir" ? "var(--color-gold)" : "var(--color-text)"
                            }; font-weight: 600;">${statusText}</span></small>
                        `;
        wishesContainer.appendChild(wishDiv);
      });
    }

    // Fade back in
    wishesContainer.style.opacity = "1";
    updatePaginationInfo();

    // Scroll to top of wishes list
    wishesContainer.scrollTop = 0;
  }, 150);
}

function updatePaginationInfo() {
  const totalComments = allWishes.length;
  const startItem = (currentPage - 1) * wishesPerPage + 1;
  const endItem = Math.min(currentPage * wishesPerPage, totalComments);

  document.getElementById("pageInfo").innerHTML = `
                <span>Menampilkan ${startItem}-${endItem} dari ${totalComments} ucapan</span><br>
                <small>Halaman ${currentPage} dari ${totalPages}</small>
            `;

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Update button states
  if (currentPage === 1) {
    prevBtn.classList.add("disabled");
  } else {
    prevBtn.classList.remove("disabled");
  }

  if (currentPage === totalPages) {
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.classList.remove("disabled");
  }
}

function changePage(direction) {
  const newPage = currentPage + direction;
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    displayWishes();
  }
}

function addNewWish(author, text, status = "Hadir") {
  allWishes.unshift({ author, text, status });
  totalPages = Math.ceil(allWishes.length / wishesPerPage);
  currentPage = 1; // Go to first page to see the new wish
  displayWishes();
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize wishes display
  displayWishes();

  // Get Guest Name from URL Parameter
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get("to");
  if (guest) {
    document.getElementById("guest-name").innerText = guest.replace(/_/g, " ");
  }

  // Elements
  const openButton = document.getElementById("open-invitation");
  const cover = document.getElementById("cover");
  const mainInvitation = document.getElementById("main-invitation");
  const music = document.getElementById("background-music");
  const navbar = document.getElementById("navbar");
  const musicPlayer = document.getElementById("musicPlayer");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const volumeControl = document.getElementById("volumeControl");
  const volumeSlider = document.getElementById("volumeSlider");

  let isPlaying = false;

  // Open Invitation
  openButton.addEventListener("click", function () {
    cover.style.transition = "opacity 1s, transform 1s cubic-bezier(0.65, 0, 0.35, 1)";
    cover.style.opacity = "0";
    cover.style.transform = "scale(1.2)";

    setTimeout(() => {
      cover.style.display = "none";
      mainInvitation.style.display = "block";
      document.body.style.overflowY = "auto";

      // Show navbar and music player
      setTimeout(() => {
        navbar.classList.add("visible");
        musicPlayer.style.display = "flex";
      }, 500);

      // Auto-play music
      music.volume = 0.5;
      music
        .play()
        .then(() => {
          isPlaying = true;
          playIcon.className = "fa-solid fa-pause";
          musicPlayer.classList.add("playing");
        })
        .catch(() => {
          console.log("Auto-play prevented by browser");
        });
    }, 1000);
  });

  // Music Player Controls
  playBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (isPlaying) {
      music.pause();
      isPlaying = false;
      playIcon.className = "fa-solid fa-play";
      musicPlayer.classList.remove("playing");
    } else {
      music.play();
      isPlaying = true;
      playIcon.className = "fa-solid fa-pause";
      musicPlayer.classList.add("playing");
    }
  });

  // Music Player Toggle Volume Control
  musicPlayer.addEventListener("click", function () {
    volumeControl.classList.toggle("show");
  });

  // Volume Control
  volumeSlider.addEventListener("input", function () {
    music.volume = this.value / 100;
  });

  // Set initial volume
  music.volume = 0.5;

  // Navigation
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  // Smooth scrolling for navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 20; // Account for bottom navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Update active navigation link on scroll
  function updateActiveNav() {
    let current = "";
    const scrollTop = window.scrollY;

    // Special handling for top section (save-date)
    if (scrollTop < 100) {
      current = "save-date";
    } else {
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
          current = section.getAttribute("id");
        }
      });
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  // Show navbar on scroll
  function handleNavbarScroll() {
    if (mainInvitation.style.display === "block") {
      navbar.classList.add("visible");
      updateActiveNav();
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);

  // Countdown Timer
  const countdownDate = new Date("Nov 15, 2025 09:00:00").getTime();
  const timer = () => {
    const now = new Date().getTime();
    const distance = countdownDate - now;
    if (distance < 0) {
      document.getElementById("countdown").innerHTML = "ACARA TELAH BERLANGSUNG";
      return;
    }
    document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000);
  };
  timer();
  setInterval(timer, 1000);

  // Guestbook Form Submission
  const guestbookForm = document.getElementById("guestbook-form");
  const nameInput = document.getElementById("nama");
  const wishInput = document.getElementById("ucapan_text");
  const submitBtn = guestbookForm.querySelector('button[type="submit"]');

  // Form validation function
  function validateForm() {
    const name = nameInput.value.trim();
    const wish = wishInput.value.trim();
    let isValid = true;

    // Clear previous feedback
    document.querySelectorAll(".form-feedback").forEach((feedback) => {
      feedback.classList.remove("show", "success", "error");
    });
    document.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("success", "error");
    });

    // Validate name
    if (!name) {
      showFormFeedback("nama", "Nama harus diisi", "error");
      isValid = false;
    } else if (name.length < 2) {
      showFormFeedback("nama", "Nama minimal 2 karakter", "error");
      isValid = false;
    } else {
      showFormFeedback("nama", "Nama valid", "success");
    }

    // Validate wish
    if (!wish) {
      showFormFeedback("ucapan", "Ucapan harus diisi", "error");
      isValid = false;
    } else if (wish.length < 10) {
      showFormFeedback("ucapan", "Ucapan minimal 10 karakter", "error");
      isValid = false;
    } else {
      showFormFeedback("ucapan", "Ucapan valid", "success");
    }

    return isValid;
  }

  function showFormFeedback(fieldName, message, type) {
    const feedback = document.getElementById(`${fieldName}-feedback`);
    const formGroup = feedback.closest(".form-group");

    feedback.textContent = message;
    feedback.classList.add("show", type);
    formGroup.classList.add(type);
  }

  // Real-time validation
  nameInput.addEventListener("input", function () {
    if (this.value.trim()) {
      this.classList.add("valid");
    } else {
      this.classList.remove("valid");
    }
  });

  wishInput.addEventListener("input", function () {
    if (this.value.trim()) {
      this.classList.add("valid");
    } else {
      this.classList.remove("valid");
    }
  });

  guestbookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const name = nameInput.value.trim();
    const wish = wishInput.value.trim();

    // Show loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
      addNewWish(name, wish, "Hadir");

      // Show success state
      submitBtn.classList.remove("loading");
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Terkirim!';
      submitBtn.style.background = "var(--color-gold)";

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Ucapan';
        submitBtn.style.background = "";
        submitBtn.disabled = false;
      }, 2000);

      guestbookForm.reset();

      // Clear validation states
      nameInput.classList.remove("valid");
      wishInput.classList.remove("valid");
      document.querySelectorAll(".form-feedback").forEach((feedback) => {
        feedback.classList.remove("show", "success", "error");
      });
      document.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("success", "error");
      });
    }, 1000);
  });

  // Scroll Animations
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.15 }
  );
  animatedElements.forEach((element) => observer.observe(element));

  // Music player initially hidden
  musicPlayer.style.display = "none";
});

// Copy to Clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      alert("Berhasil disalin!");
    },
    () => {
      alert("Gagal menyalin.");
    }
  );
}

// Add to Calendar function
function addToCalendar() {
  const eventDetails = {
    title: "Wedding of Rara & Bima",
    start: "20251115T020000Z", // 09:00 WIB = 02:00 UTC
    end: "20251115T080000Z", // 15:00 WIB = 08:00 UTC
    description: "Join us for the wedding celebration of Rara & Bima",
    location: "Masjid Istiqlal & Balai Kartini, Jakarta",
  };

  // Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventDetails.title
  )}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(
    eventDetails.description
  )}&location=${encodeURIComponent(eventDetails.location)}`;

  // Try to open Google Calendar
  window.open(googleCalendarUrl, "_blank");

  // Also create an ICS file for other calendar apps
  const icsContent = `BEGIN:VCALENDAR
                VERSION:2.0
                PRODID:-//Wedding Invitation//EN
                BEGIN:VEVENT
                UID:wedding-Rara-bima-${Date.now()}@wedding.com
                DTSTART:${eventDetails.start}
                DTEND:${eventDetails.end}
                SUMMARY:${eventDetails.title}
                DESCRIPTION:${eventDetails.description}
                LOCATION:${eventDetails.location}
                STATUS:CONFIRMED
                SEQUENCE:0
                END:VEVENT
                END:VCALENDAR`;

  // Create downloadable ICS file as fallback
  const blob = new Blob([icsContent], { type: "text/calendar" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wedding-Rara-bima.ics";

  // Show success message
  setTimeout(() => {
    alert("Calendar event created! You can also download the .ics file for other calendar apps.");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 500);
}
