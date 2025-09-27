// Wishes/Comments data and pagination
let allWishes = []; // Will be populated from API
let isLoadingComments = false;

let currentPage = 1;
const wishesPerPage = 10;
let totalPages = 1;

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

        const statusStyle = getAttendanceStatusStyle(wish.status);

        // Format date if available
        let dateDisplay = "";
        if (wish.date) {
          const formattedDate = window.invitationAPI.formatCommentDate(wish.date);
          dateDisplay = `<div class="wish-date">${formattedDate}</div>`;
        }

        wishDiv.innerHTML = `
                            <div class="wish-header">
                              <strong>${authorText}</strong>
                              ${dateDisplay}
                            </div>
                            <p class="wish-text">"${wishText}"</p>
                            <small class="wish-status">Status: <span style="color: ${statusStyle.color}; font-weight: 600;">
                              ${statusStyle.icon} ${statusText}
                            </span></small>
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

async function addNewWish(author, text, status = "Hadir") {
  try {
    // Post to API
    const commentData = {
      name: author,
      commentText: text,
      status: status,
    };

    const response = await window.invitationAPI.postComment(commentData);

    if (response) {
      console.log("Comment posted successfully");

      // Reload comments from API to get the latest data with correct timestamps
      // This prevents duplicates and ensures we have the correct server timestamp
      await loadCommentsFromAPI();
    }
  } catch (error) {
    console.error("Error posting comment:", error);

    // Fallback: add to local array only if API fails
    const newWish = {
      author,
      text,
      status,
      date: new Date().toISOString(),
      id: Date.now().toString(),
    };

    allWishes.unshift(newWish);
    totalPages = Math.ceil(allWishes.length / wishesPerPage);
    currentPage = 1;
    displayWishes();
    updatePagination();

    // Show user-friendly error message
    showFormFeedback("ucapan", "Ucapan tersimpan lokal (koneksi terbatas)", "success");
    throw error; // Re-throw to handle in form submission
  }
}

// Global variable to store guest information
let currentGuest = null;

/**
 * Extract guest name from URL path
 * Supports both query parameter (?to=name) and path (/guest-name)
 */
function extractGuestFromURL() {
  try {
    const urlParams = new URLSearchParams(window.location.search);

    // Try different parameter names
    let guest = urlParams.get("to") || urlParams.get("guest") || urlParams.get("name");

    if (guest) {
      return guest
        .replace(/[-_]/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }

    // Then try path-based guest name
    const path = window.location.pathname;
    const pathSegments = path.split("/").filter((segment) => segment.length > 0);

    // Look for guest name in path (last segment that's not index.html)
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];

      // Skip if it's index.html or contains file extensions
      if (lastSegment && lastSegment !== "index.html" && !lastSegment.includes(".") && lastSegment.length > 0) {
        // Convert kebab-case or underscore to proper name
        const guestName = lastSegment
          .replace(/[-_]/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");

        return guestName;
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting guest name:", error);
    return null;
  }
}

/**
 * Validate guest name and show appropriate page
 */
function validateAndSetGuest() {
  const guestName = extractGuestFromURL();

  if (guestName && guestName.trim().length > 0) {
    currentGuest = guestName.trim();

    // Update guest name display
    const guestNameElement = document.getElementById("guest-name");
    if (guestNameElement) {
      guestNameElement.innerText = currentGuest;
    }

    // Auto-fill form name field
    const nameInput = document.getElementById("nama");
    if (nameInput) {
      nameInput.value = currentGuest;
      nameInput.classList.add("valid");
    }

    console.log("Guest validated:", currentGuest);
    return true;
  } else {
    // Check if we're in development mode and show helpful message
    const isDevelopment =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "";

    if (isDevelopment) {
      console.warn("Development mode detected. Use query parameters for guest access.");
      console.info("Example: " + window.location.origin + "/?guest=arya");
    }

    // Show invalid guest page
    showInvalidGuestPage();
    return false;
  }
}

/**
 * Show invalid guest page
 */
function showInvalidGuestPage() {
  document.body.innerHTML = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tamu Tidak Valid - Wedding Invitation</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Poppins', sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .error-container {
                background: white;
                padding: 3rem 2rem;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
                width: 90%;
            }
            
            .error-icon {
                font-size: 4rem;
                color: #e74c3c;
                margin-bottom: 1rem;
            }
            
            .error-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: 2rem;
                color: #2c3e50;
                margin-bottom: 1rem;
            }
            
            .error-message {
                color: #7f8c8d;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            
            .error-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 50px;
                font-weight: 600;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }
            
            .btn-secondary {
                background: #ecf0f1;
                color: #2c3e50;
            }
            
            .btn-secondary:hover {
                background: #d5dbdb;
            }
            
            .example-list {
                text-align: left;
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 10px;
                margin: 1rem 0;
            }
            
            .example-list li {
                margin: 0.5rem 0;
                color: #6c757d;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h1 class="error-title">Tamu Tidak Valid</h1>
            <div class="error-message">
                <p>Maaf, nama tamu tidak ditemukan atau URL tidak valid.</p>
                <p>Untuk mengakses undangan, gunakan format URL yang benar:</p>
                
                <div class="example-list">
                    <strong>Contoh URL yang benar:</strong>
                    <ul>
                        <li><code>yoursite.com?guest=andi-arya</code></li>
                        <li><code>yoursite.com?to=siti-nurhaliza</code></li>
                        <li><code>yoursite.com/index.html?guest=john-doe</code></li>
                    </ul>
                    <br>
                    <small><strong>Untuk pengembang:</strong> Jika menggunakan Live Server, gunakan format query parameter (?guest=nama) karena Live Server tidak mendukung client-side routing.</small>
                </div>
                
                <p>Silakan hubungi penyelenggara untuk mendapatkan link undangan yang benar.</p>
            </div>
            
            <div class="error-actions">
                <button class="btn btn-primary" onclick="window.location.reload()">
                    <i class="fa-solid fa-refresh"></i>
                    Coba Lagi
                </button>
                <button class="btn btn-secondary" onclick="history.back()">
                    <i class="fa-solid fa-arrow-left"></i>
                    Kembali
                </button>
            </div>
        </div>
    </body>
    </html>
  `;
}

document.addEventListener("DOMContentLoaded", async function () {
  // Validate guest first before initializing anything
  if (!validateAndSetGuest()) {
    return; // Stop execution if guest is invalid
  }

  // Initialize dynamic content from API
  await initializeDynamicContent();

  // Load comments from API
  await loadCommentsFromAPI();

  // Initialize wishes display (will be called by loadCommentsFromAPI)
  if (allWishes.length === 0) {
    displayWishes(); // Show empty state if no comments loaded
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

  // Smooth scrolling for navigation with animation reset
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 20; // Account for bottom navbar

        // Reset animations before scrolling
        const animatedElements = document.querySelectorAll(".animate-on-scroll");
        animatedElements.forEach((element) => {
          element.classList.remove("is-visible");
        });

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Reinitialize animations after scroll completes
        setTimeout(() => {
          window.reinitializeAnimations();
        }, 800); // Wait for smooth scroll to complete
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

  // Countdown Timer - Now handled dynamically in initializeDynamicContent()
  // const countdownDate = new Date("Nov 15, 2025 09:00:00").getTime();
  // const timer = () => {
  //   const now = new Date().getTime();
  //   const distance = countdownDate - now;
  //   if (distance < 0) {
  //     document.getElementById("countdown").innerHTML = "ACARA TELAH BERLANGSUNG";
  //     return;
  //   }
  //   document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
  //   document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //   document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000);
  // };
  // timer();
  // setInterval(timer, 1000);

  // Guestbook Form Submission
  const guestbookForm = document.getElementById("guestbook-form");
  const nameInput = document.getElementById("nama");
  const wishInput = document.getElementById("ucapan_text");
  const submitBtn = guestbookForm ? guestbookForm.querySelector('button[type="submit"]') : null;

  // Check if all required form elements exist
  if (!guestbookForm || !nameInput || !wishInput || !submitBtn) {
    console.error("Required form elements not found");
    return;
  }

  // Form validation function
  function validateForm() {
    if (!nameInput || !wishInput) {
      console.error("Form inputs not found during validation");
      return false;
    }

    const name = nameInput.value.trim();
    const wish = wishInput.value.trim();
    const selectedAttendanceRadio = document.querySelector('input[name="attendance"]:checked');
    let isValid = true;

    // Clear previous feedback
    document.querySelectorAll(".form-feedback").forEach((feedback) => {
      feedback.classList.remove("show", "success", "error");
    });
    document.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("success", "error");
    });

    // Validate name (should be auto-filled and readonly)
    if (!name) {
      showFormFeedback("nama", "Nama tidak valid", "error");
      isValid = false;
    } else {
      showFormFeedback("nama", "Nama valid", "success");
    }

    // Validate attendance selection
    if (!selectedAttendanceRadio) {
      showFormFeedback("attendance", "Pilih konfirmasi kehadiran", "error");
      isValid = false;
    } else {
      showFormFeedback("attendance", `Kehadiran: ${selectedAttendanceRadio.value}`, "success");
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

    // Check if feedback element exists
    if (!feedback) {
      console.warn(`Feedback element not found: ${fieldName}-feedback`);
      return;
    }

    const formGroup = feedback.closest(".form-group");

    // Check if form group exists
    if (!formGroup) {
      console.warn(`Form group not found for feedback: ${fieldName}-feedback`);
      return;
    }

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

  // Add event listener for attendance radios
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  attendanceRadios.forEach((r) => {
    r.addEventListener("change", function () {
      const attendanceFeedback = document.getElementById("attendance-feedback");
      if (attendanceFeedback) {
        attendanceFeedback.classList.remove("show", "success", "error");
      }
      if (this.checked) {
        showFormFeedback("attendance", `Kehadiran: ${this.value}`, "success");
      }
    });
  });

  guestbookForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const name = nameInput.value.trim();
    const wish = wishInput.value.trim();
    const selectedAttendanceRadio = document.querySelector('input[name="attendance"]:checked');
    const attendance = selectedAttendanceRadio ? selectedAttendanceRadio.value : "Ragu";

    // Show loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      // Call the async function and wait for it
      await addNewWish(name, wish, attendance);

      // Show success state
      submitBtn.classList.remove("loading");
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Terkirim!';
      submitBtn.style.background = "var(--color-gold)";

      // Clear the wish input
      wishInput.value = "";
      wishInput.classList.remove("valid");

      // Clear validation states for wish only
      const ucapanFeedback = document.getElementById("ucapan-feedback");
      if (ucapanFeedback) {
        ucapanFeedback.classList.remove("show", "success", "error");
      }
      wishInput.closest(".form-group").classList.remove("success", "error");

      // Show success message for the guest
      showSuccessMessage(name, attendance);

      // Reset button after delay
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Ucapan';
        submitBtn.style.background = "";
        submitBtn.disabled = false;
      }, 2000);
    } catch (error) {
      // Handle error case
      submitBtn.classList.remove("loading");
      submitBtn.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Gagal Kirim';
      submitBtn.style.background = "#e74c3c";

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Ucapan';
        submitBtn.style.background = "";
        submitBtn.disabled = false;
      }, 3000);
    }
  });

  // Scroll Animations with Repeatable Effects
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  // Create a more sophisticated observer for repeatable animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Element is entering viewport - add animation
          entry.target.classList.add("is-visible");
        } else {
          // Element is leaving viewport - remove animation for repeat effect
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px", // Start animation slightly before element is fully visible
    }
  );

  animatedElements.forEach((element) => observer.observe(element));

  // Store observer globally for dynamic content updates
  window.scrollAnimationObserver = observer;

  // Function to reinitialize animations for dynamically added content
  window.reinitializeAnimations = function () {
    // Disconnect existing observer
    if (window.scrollAnimationObserver) {
      window.scrollAnimationObserver.disconnect();
    }

    // Get all animated elements (including newly added ones)
    const allAnimatedElements = document.querySelectorAll(".animate-on-scroll");

    // Reset all elements to initial state
    allAnimatedElements.forEach((element) => {
      element.classList.remove("is-visible");
    });

    // Create new observer
    const newObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    // Observe all elements
    allAnimatedElements.forEach((element) => newObserver.observe(element));

    // Update global reference
    window.scrollAnimationObserver = newObserver;
  };

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

/**
 * Show success message after form submission
 */
function showSuccessMessage(name, attendance) {
  const successMessage = document.createElement("div");
  successMessage.className = "success-toast";

  let icon = "";
  let color = "";
  let message = "";

  switch (attendance) {
    case "Hadir":
      icon = "✅";
      color = "#27ae60";
      message = `Terima kasih ${name}! Kami tunggu kehadiran Anda.`;
      break;
    case "Tidak Hadir":
      icon = "❌";
      color = "#e74c3c";
      message = `Terima kasih ${name} atas konfirmasinya. Doa restu Anda sangat berarti.`;
      break;
    case "Ragu":
      icon = "🤔";
      color = "#f39c12";
      message = `Terima kasih ${name}! Kami harap Anda bisa hadir.`;
      break;
  }

  successMessage.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;

  successMessage.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    color: ${color};
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    border-left: 4px solid ${color};
  `;

  document.body.appendChild(successMessage);

  // Animate in
  setTimeout(() => {
    successMessage.style.transform = "translateX(0)";
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    successMessage.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.parentNode.removeChild(successMessage);
      }
    }, 300);
  }, 4000);
}

/**
 * Update wishes display to show attendance status with better styling
 */
function getAttendanceStatusStyle(status) {
  switch (status) {
    case "Hadir":
      return { color: "#27ae60", icon: "✅" };
    case "Tidak Hadir":
      return { color: "#e74c3c", icon: "❌" };
    case "Ragu":
      return { color: "#f39c12", icon: "🤔" };
    default:
      return { color: "var(--color-text)", icon: "👤" };
  }
}

// Add to Calendar function
function addToCalendar() {
  // Use dynamic data if available, otherwise use fallback
  let eventDetails;

  if (invitationData && invitationData.eventData) {
    const { generalInformation, eventData, partnerData } = invitationData;
    const eventDate = new Date(eventData.religiousEvent.eventDate);

    // Convert to UTC for calendar
    // Use Indonesia time (WIB, UTC+7), set as full day event
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, "0");
    const day = String(eventDate.getDate()).padStart(2, "0");
    const startLocal = `${year}${month}${day}`;
    const endLocal = `${year}${month}${day}`;

    eventDetails = {
      title: generalInformation.title || `Wedding of ${getCoupleNames(partnerData)}`,
      start: startLocal,
      end: endLocal,
      description: `Join us for the wedding celebration of ${getCoupleNames(partnerData)}`,
      location: eventData.location.googleMapsLink || eventData.religiousEvent.location || eventData.location.address,
    };
  } else {
    // Fallback data
    eventDetails = {
      title: "Wedding of Rara & Bima",
      start: "20251115T020000Z", // 09:00 WIB = 02:00 UTC
      end: "20251115T080000Z", // 15:00 WIB = 08:00 UTC
      description: "Join us for the wedding celebration of Rara & Bima",
      location: "https://maps.app.goo.gl/u5mGAnW82kHh8A4c6",
    };
  }

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

/**
 * Load comments from API
 */
async function loadCommentsFromAPI() {
  if (isLoadingComments) return;

  isLoadingComments = true;

  // Show loading animation
  showCommentsLoading();

  try {
    const comments = await window.invitationAPI.fetchComments();

    // Transform API data to match our display format
    allWishes = comments.map((comment) => ({
      author: comment.name,
      text: comment.commentText,
      status: comment.status,
      date: comment.createdAt,
      id: comment.id,
    }));

    // Update pagination
    totalPages = Math.ceil(allWishes.length / wishesPerPage);
    currentPage = 1;

    // Update display
    displayWishes();
    updatePagination();

    console.log(`Loaded ${allWishes.length} comments from API`);
  } catch (error) {
    console.error("Error loading comments:", error);
    // Show error message or keep existing mock data
    showCommentsError();
  } finally {
    isLoadingComments = false;
    hideCommentsLoading();
  }
}

/**
 * Show comments loading animation
 */
function showCommentsLoading() {
  const wishesContainer = document.getElementById("wishes-list");
  if (wishesContainer) {
    wishesContainer.innerHTML = `
      <div class="comments-loading">
        <div class="loading-spinner-small">
          <div class="spinner-heart">💕</div>
        </div>
        <p>Memuat ucapan...</p>
      </div>
    `;
  }
}

/**
 * Hide comments loading animation
 */
function hideCommentsLoading() {
  // Loading will be hidden when displayWishes() is called
}

/**
 * Show comments loading error
 */
function showCommentsError() {
  const wishesContainer = document.getElementById("wishes-list");
  if (wishesContainer) {
    wishesContainer.innerHTML = `
      <div class="comments-error">
        <div class="error-icon">⚠️</div>
        <p>Gagal memuat ucapan</p>
        <button onclick="loadCommentsFromAPI()" class="retry-btn">Coba Lagi</button>
      </div>
    `;
  }
}
