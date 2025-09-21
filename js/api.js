// API Configuration
const API_BASE_URL = "https://wedding-api.fadhlih.com/api/v1/invitation";
const INVITATION_SLUG = "the-wedding-of-fadhlih-&-febiana";

// Global variable to store invitation data
let invitationData = null;

/**
 * Fetch invitation data from API
 * @returns {Promise<Object>} - Invitation data
 */
async function fetchInvitationData() {
  try {
    const response = await fetch(`${API_BASE_URL}/${INVITATION_SLUG}/all-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.data) {
      invitationData = result.data;
      return invitationData;
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Error fetching invitation data:", error);
    // Return fallback/default data structure
    return getDefaultData();
  }
}

/**
 * Get default/fallback data when API fails
 * @returns {Object} - Default invitation data
 */
function getDefaultData() {
  return {
    generalInformation: {
      title: "The Wedding of Rara & Bima",
      date: "2025-11-15T09:00:00",
      themeCode: "Wedding1",
    },
    coverOpening: {
      coverImage: "https://picsum.photos/1280/720?random=5",
      profileImage: "https://picsum.photos/400/400?random=10",
      openingTitle: "The Wedding Of",
      openingSubTitle: "Rara & Bima",
      openingText: "Kepada Yth. Bapak/Ibu/Saudara/i",
    },
    partnerData: {
      man: {
        fullName: "Bima Perkasa",
        nickName: "Bima",
        fatherName: "Drs. H. Muhammad Santoso",
        motherName: "Hj. Siti Aminah",
        imageUrl: "https://picsum.photos/1280/720?random=7",
      },
      woman: {
        fullName: "Rara Putri",
        nickName: "Rara",
        fatherName: "I Gede Suhartana",
        motherName: "Ni Wayan Sriasih",
        imageUrl: "https://picsum.photos/1280/720?random=6",
      },
    },
    eventData: {
      religiousEvent: {
        name: "Akad Nikah",
        eventDate: "2025-11-15T09:00:00",
        startTime: "09.00",
        endTime: "10.00",
        location: "Masjid Istiqlal, Jakarta",
      },
      celebrationEvent: {
        name: "Resepsi Pernikahan",
        eventDate: "2025-11-15T12:00:00",
        startTime: "12.00",
        endTime: "15.00",
        location: "Balai Kartini, Jakarta",
      },
      verse: {
        verseTitle: "Allah Berfirman",
        verseSource: "QS. Ar-Rum: 21",
        verseContent:
          "Dan diantara tanda-tanda (kebesaran) Allah ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya yang demikian itu benar-benar terdapat tanda-tanda (Kebesaran Allah) bagi kaum yang berfikir.",
      },
      location: {
        googleMapsLink: "https://maps.app.goo.gl/u5mGAnW82kHh8A4c6",
        address: "Jakarta",
      },
    },
    stories: [
      {
        title: "Awal Bertemu",
        when: "12 Juni 2021",
        description:
          "Di sebuah kedai kopi senja, takdir mempertemukan kami dalam tawa dan cerita yang tak kunjung usai.",
        imageUrl: "https://picsum.photos/1280/720?random=2",
      },
      {
        title: "Lamaran",
        when: "25 Desember 2024",
        description:
          "Di bawah langit berbintang, sebuah janji terucap untuk mengarungi sisa hidup dalam satu perahu yang sama.",
        imageUrl: "https://picsum.photos/1280/720?random=1",
      },
    ],
    galleries: [
      "https://picsum.photos/1280/720?random=5",
      "https://picsum.photos/1280/720?random=5",
      "https://picsum.photos/1280/720?random=5",
      "https://picsum.photos/1280/720?random=5",
      "https://picsum.photos/1280/720?random=5",
      "https://picsum.photos/1280/720?random=5",
    ],
    gift: {
      isShown: true,
      gifts: [
        {
          type: "BNI",
          number: "1234567890",
          owner: "Rara Putri",
        },
        {
          type: "BCA",
          number: "0987654321",
          owner: "Bima Perkasa",
        },
      ],
    },
    closing: {
      closingRemark:
        "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",
      closingText: "#RaraBimaBahagia2025",
    },
  };
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @param {string} format - Format type ('date', 'datetime', 'day')
 * @returns {string} - Formatted date
 */
function formatDate(dateString, format = "date") {
  const date = new Date(dateString);
  const options = {
    date: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    datetime: {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    },
    day: {
      weekday: "long",
    },
  };

  return date.toLocaleDateString("id-ID", options[format]);
}

/**
 * Get couple names for display
 * @param {Object} partnerData - Partner data from API
 * @returns {string} - Formatted couple names
 */
function getCoupleNames(partnerData) {
  const manName = partnerData.man.nickName || partnerData.man.fullName;
  const womanName = partnerData.woman.nickName || partnerData.woman.fullName;
  return `${womanName} & ${manName}`;
}

/**
 * Get countdown target date
 * @param {Object} eventData - Event data from API
 * @returns {Date} - Target date for countdown
 */
function getCountdownDate(eventData) {
  // Use religious event date for countdown
  return new Date(eventData.religiousEvent.eventDate);
}

/**
 * Update page title dynamically
 * @param {Object} generalInfo - General information from API
 */
function updatePageTitle(generalInfo) {
  document.title = generalInfo.title || "Wedding Invitation";
}

/**
 * Show loading state with enhanced animations
 */
function showLoadingState() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  const loadingContainer = document.getElementById("loadingContainer");
  const errorContainer = document.getElementById("errorContainer");
  const loadingText = document.getElementById("loadingText");

  if (loadingOverlay) {
    // Reset states
    loadingContainer.style.display = "flex";
    errorContainer.classList.remove("show");
    loadingOverlay.classList.add("show");

    // Animate loading text
    const loadingMessages = [
      "Memuat undangan spesial...",
      "Menyiapkan momen bahagia...",
      "Mengunduh kenangan indah...",
      "Hampir selesai...",
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (loadingText && messageIndex < loadingMessages.length) {
        loadingText.style.opacity = "0";
        setTimeout(() => {
          loadingText.textContent = loadingMessages[messageIndex];
          loadingText.style.opacity = "1";
          messageIndex++;
        }, 300);
      }

      if (messageIndex >= loadingMessages.length) {
        clearInterval(messageInterval);
      }
    }, 2000);

    // Store interval reference for cleanup
    window.loadingMessageInterval = messageInterval;
  }
  console.log("Loading invitation data...");
}

/**
 * Hide loading state
 */
function hideLoadingState() {
  const loadingOverlay = document.getElementById("loadingOverlay");

  // Clear loading message interval
  if (window.loadingMessageInterval) {
    clearInterval(window.loadingMessageInterval);
  }

  if (loadingOverlay) {
    // Smooth transition out
    setTimeout(() => {
      loadingOverlay.classList.remove("show");
    }, 500);
  }
  console.log("Invitation data loaded successfully");
}

/**
 * Show error state with retry options
 */
function showErrorState(error) {
  const loadingContainer = document.getElementById("loadingContainer");
  const errorContainer = document.getElementById("errorContainer");
  const errorMessage = document.getElementById("errorMessage");

  // Clear loading message interval
  if (window.loadingMessageInterval) {
    clearInterval(window.loadingMessageInterval);
  }

  if (loadingContainer && errorContainer) {
    loadingContainer.style.display = "none";

    // Set appropriate error message
    let message = "Tidak dapat memuat data undangan. ";
    if (error.message.includes("fetch")) {
      message += "Pastikan koneksi internet Anda stabil dan server dapat diakses.";
    } else if (error.message.includes("timeout")) {
      message += "Waktu tunggu habis. Silakan coba lagi.";
    } else if (error.message.includes("CORS")) {
      message += "Terjadi masalah akses. Server mungkin sedang maintenance.";
    } else {
      message += "Terjadi kesalahan teknis. Silakan coba lagi atau lanjutkan dengan data default.";
    }

    if (errorMessage) {
      errorMessage.textContent = message;
    }

    errorContainer.classList.add("show");
    errorContainer.style.animation = "fadeInError 0.5s ease-out";
  }

  console.error("Error loading invitation data:", error);
}

/**
 * Retry loading data function
 */
function retryLoadingData() {
  console.log("Retrying to load invitation data...");

  // Reset error state
  const errorContainer = document.getElementById("errorContainer");
  if (errorContainer) {
    errorContainer.classList.remove("show");
  }

  // Show loading again
  showLoadingState();

  // Retry initialization after a short delay
  setTimeout(() => {
    initializeDynamicContent();
  }, 1000);
}

/**
 * Proceed with fallback data
 */
function proceedWithFallback() {
  console.log("Proceeding with fallback data...");

  // Hide error state
  hideLoadingState();

  // Initialize with default data
  setTimeout(() => {
    const fallbackData = getDefaultData();

    try {
      // Update page title
      updatePageTitle(fallbackData.generalInformation);

      // Update all sections with fallback data
      if (window.dynamicContent) {
        window.dynamicContent.updateCoverSection(fallbackData);
        window.dynamicContent.updateSaveDateSection(fallbackData);
        window.dynamicContent.updateMempelaiSection(fallbackData);
        window.dynamicContent.updateVerseSection(fallbackData);
        window.dynamicContent.updateEventSection(fallbackData);
        window.dynamicContent.updateStorySection(fallbackData);
        window.dynamicContent.updateGallerySection(fallbackData);
        window.dynamicContent.updateGiftSection(fallbackData);
        window.dynamicContent.updateFooterSection(fallbackData);
        window.dynamicContent.initializeCountdown(getCountdownDate(fallbackData.eventData));
      }

      console.log("Fallback data loaded successfully");
    } catch (error) {
      console.error("Error loading fallback data:", error);
      alert("Terjadi kesalahan saat memuat data default. Silakan refresh halaman.");
    }
  }, 500);
}

/**
 * Initialize dynamic content with enhanced error handling
 * This function will be called after API data is loaded
 */
async function initializeDynamicContent() {
  try {
    // Show loading state
    showLoadingState();

    // Add timeout for API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout after 15 seconds")), 15000);
    });

    // Race between API call and timeout
    const data = await Promise.race([fetchInvitationData(), timeoutPromise]);

    if (data) {
      console.log("Fetched invitation data:", data);

      // Update page title
      updatePageTitle(data.generalInformation);

      // Update all sections with dynamic data - use try-catch for each section
      // Make sure to use the dynamicContent namespace
      try {
        if (window.dynamicContent) {
          window.dynamicContent.updateCoverSection(data);
        }
      } catch (e) {
        console.error("Error updating cover:", e);
      }

      try {
        if (window.dynamicContent) {
          window.dynamicContent.updateSaveDateSection(data);
        }
      } catch (e) {
        console.error("Error updating save date:", e);
      }

      try {
        if (window.dynamicContent) {
          window.dynamicContent.updateMempelaiSection(data);
        }
      } catch (e) {
        console.error("Error updating mempelai:", e);
      }

      try {
        if (window.dynamicContent) {
          window.dynamicContent.updateVerseSection(data);
        }
      } catch (e) {
        console.error("Error updating verse:", e);
      }

      try {
        if (window.dynamicContent) {
          window.dynamicContent.updateEventSection(data);
        }
      } catch (e) {
        console.error("Error updating event:", e);
      }

      try {
        if (window.dynamicContent) {
          window.dynamicContent.updateStorySection(data);
        }
      } catch (e) {
        console.error("Error updating story:", e);
      }

      try {
        if (window.dynamicContent) {
          window.dynamicContent.updateGallerySection(data);
        }
      } catch (e) {
        console.error("Error updating gallery:", e);
      }

      try {
        if (window.dynamicContent) {
          window.dynamicContent.updateGiftSection(data);
        }
      } catch (e) {
        console.error("Error updating gift:", e);
      }

      try {
        if (window.dynamicContent) {
          window.dynamicContent.updateFooterSection(data);
        }
      } catch (e) {
        console.error("Error updating footer:", e);
      }

      // Update countdown with dynamic date
      try {
        if (window.dynamicContent) {
          window.dynamicContent.initializeCountdown(getCountdownDate(data.eventData));
        }
      } catch (e) {
        console.error("Error updating countdown:", e);
      }

      console.log("Dynamic content loaded successfully");

      // Hide loading state after successful load
      hideLoadingState();
    } else {
      throw new Error("No data received from API");
    }
  } catch (error) {
    console.error("Error initializing dynamic content:", error);
    showErrorState(error);
  }
}

// Export functions for use in other files
window.invitationAPI = {
  fetchInvitationData,
  initializeDynamicContent,
  formatDate,
  getCoupleNames,
  getCountdownDate,
};

// Make retry and fallback functions globally available
window.retryLoadingData = retryLoadingData;
window.proceedWithFallback = proceedWithFallback;
