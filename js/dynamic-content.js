/**
 * Dynamic Content Updates
 * This file contains functions to update HTML content with API data
 */

/**
 * Update cover section with dynamic data
 * @param {Object} data - Invitation data from API
 */
function updateCoverSection(data) {
  try {
    const coverSection = document.getElementById("cover");
    const { coverOpening, partnerData } = data;

    // Update background image
    if (coverOpening.coverImage) {
      coverSection.style.backgroundImage = `url('${coverOpening.coverImage}')`;
    }

    // Update opening text
    const openingTitle = coverSection.querySelector("p:first-of-type");
    if (openingTitle && coverOpening.openingTitle) {
      openingTitle.textContent = coverOpening.openingTitle;
    }

    // Update couple names
    const coupleNamesElement = coverSection.querySelector("h1");
    if (coupleNamesElement) {
      coupleNamesElement.textContent = getCoupleNames(partnerData);
    }

    // Update opening subtitle
    const openingSubtitle = coverSection.querySelector("p:nth-of-type(2)");
    if (openingSubtitle && coverOpening.openingSubTitle) {
      openingSubtitle.textContent = coverOpening.openingSubTitle;
    }
  } catch (error) {
    console.error("Error updating cover section:", error);
  }
}

/**
 * Update save the date section with dynamic data
 * @param {Object} data - Invitation data from API
 */
function updateSaveDateSection(data) {
  try {
    const { generalInformation, partnerData, coverOpening } = data;

    // Update background image
    const saveDateSection = document.getElementById("save-date");
    if (coverOpening.coverImage) {
      saveDateSection.style.backgroundImage = `url('${coverOpening.coverImage}')`;
    }

    // Update couple names
    const coupleNamesElement = document.querySelector(".save-date-section .couple-names");
    if (coupleNamesElement) {
      coupleNamesElement.textContent = getCoupleNames(partnerData);
    }

    // Update wedding date
    const weddingDateElement = document.querySelector(".wedding-date");
    if (weddingDateElement && generalInformation.date) {
      weddingDateElement.textContent = formatDate(generalInformation.date, "date");
    }

    // Update couple profile photo
    const couplePhotoElement = document.querySelector(".couple-photo");
    if (couplePhotoElement && coverOpening.profileImage) {
      couplePhotoElement.src = coverOpening.profileImage;
      couplePhotoElement.alt = getCoupleNames(partnerData);
    }

    // Update venue (if available in eventData)
    const venueElement = document.querySelector(".wedding-venue");
    if (venueElement && data.eventData.location.address) {
      venueElement.textContent = data.eventData.location.address;
    }
  } catch (error) {
    console.error("Error updating save date section:", error);
  }
}

/**
 * Update mempelai section with dynamic data
 * @param {Object} data - Invitation data from API
 */
function updateMempelaiSection(data) {
  try {
    const { partnerData, coverOpening } = data;

    // Update opening text
    const openingTextElement = document.querySelector("#mempelai .section-subtitle");
    if (openingTextElement && coverOpening.openingText) {
      openingTextElement.innerHTML = `
                ${coverOpening.openingSubTitle || "Assalamu'alaikum Warahmatullahi Wabarakatuh"}<br><br>
                ${coverOpening.openingText}
            `;
    }

    // Update woman's profile (first profile)
    const womanProfile = document.querySelector(".couple-profile:first-of-type");
    if (womanProfile && partnerData.woman) {
      const womanImg = womanProfile.querySelector("img");
      const womanName = womanProfile.querySelector(".couple-name");
      const womanParents = womanProfile.querySelector("p");

      if (womanImg && partnerData.woman.imageUrl) {
        womanImg.src = partnerData.woman.imageUrl;
        womanImg.alt = partnerData.woman.nickName;
      }

      if (womanName) {
        womanName.textContent = partnerData.woman.fullName;
      }

      if (womanParents && partnerData.woman.fatherName && partnerData.woman.motherName) {
        womanParents.innerHTML = `Putri dari Bapak ${partnerData.woman.fatherName}<br>& Ibu ${partnerData.woman.motherName}`;
      }
    }

    // Update man's profile (last profile)
    const manProfile = document.querySelector(".couple-profile:last-of-type");
    if (manProfile && partnerData.man) {
      const manImg = manProfile.querySelector("img");
      const manName = manProfile.querySelector(".couple-name");
      const manParents = manProfile.querySelector("p");

      if (manImg && partnerData.man.imageUrl) {
        manImg.src = partnerData.man.imageUrl;
        manImg.alt = partnerData.man.nickName;
      }

      if (manName) {
        manName.textContent = partnerData.man.fullName;
      }

      if (manParents && partnerData.man.fatherName && partnerData.man.motherName) {
        manParents.innerHTML = `Putra dari Bapak ${partnerData.man.fatherName}<br>& Ibu ${partnerData.man.motherName}`;
      }
    }

    // Reinitialize animations for this section
    setTimeout(() => {
      reinitializeSectionAnimations("mempelai");
    }, 100);
  } catch (error) {
    console.error("Error updating mempelai section:", error);
  }
}

/**
 * Update verse section with dynamic data
 * @param {Object} data - Invitation data from API
 */
function updateVerseSection(data) {
  try {
    const { eventData } = data;

    if (eventData.verse) {
      // Update verse title
      const verseTitleElement = document.querySelector("#pembukaan .section-title");
      if (verseTitleElement && eventData.verse.verseTitle) {
        verseTitleElement.textContent = eventData.verse.verseTitle;
      }

      // Update verse content and source
      const verseContentElement = document.querySelector("#pembukaan .quote");
      if (verseContentElement && eventData.verse.verseContent) {
        verseContentElement.innerHTML = `
                    "${eventData.verse.verseContent}"
                    <br>
                    <small>(${eventData.verse.verseSource})</small>
                `;
      }
    }
  } catch (error) {
    console.error("Error updating verse section:", error);
  }
}

/**
 * Update event section with dynamic data
 * @param {Object} data - Invitation data from API
 */
function updateEventSection(data) {
  try {
    const { eventData } = data;

    // Update religious event (Akad)
    if (eventData.religiousEvent) {
      const religiousCard = document.querySelector(".event-card:first-of-type");
      if (religiousCard) {
        const title = religiousCard.querySelector("h3");
        const dateElement = religiousCard.querySelector("p:nth-of-type(1)");
        const timeElement = religiousCard.querySelector("p:nth-of-type(2)");
        const locationElement = religiousCard.querySelector("p:nth-of-type(3)");

        if (title) title.textContent = eventData.religiousEvent.name;

        if (dateElement && eventData.religiousEvent.eventDate) {
          const formattedDate = formatDate(eventData.religiousEvent.eventDate, "datetime");
          dateElement.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${formattedDate}`;
        }

        if (timeElement && eventData.religiousEvent.startTime) {
          const timeText = eventData.religiousEvent.endTime
            ? `${eventData.religiousEvent.startTime} - ${eventData.religiousEvent.endTime}`
            : eventData.religiousEvent.startTime;
          timeElement.innerHTML = `<i class="fa-solid fa-clock"></i> Pukul ${timeText}`;
        }

        if (locationElement && eventData.religiousEvent.location) {
          locationElement.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${eventData.religiousEvent.location}`;
        }
      }
    }

    // Update celebration event (Resepsi)
    if (eventData.celebrationEvent) {
      const celebrationCard = document.querySelector(".event-card:last-of-type");
      if (celebrationCard) {
        const title = celebrationCard.querySelector("h3");
        const dateElement = celebrationCard.querySelector("p:nth-of-type(1)");
        const timeElement = celebrationCard.querySelector("p:nth-of-type(2)");
        const locationElement = celebrationCard.querySelector("p:nth-of-type(3)");
        const mapButton = celebrationCard.querySelector(".primary-button");

        if (title) title.textContent = eventData.celebrationEvent.name;

        if (dateElement && eventData.celebrationEvent.eventDate) {
          const formattedDate = formatDate(eventData.celebrationEvent.eventDate, "datetime");
          dateElement.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${formattedDate}`;
        }

        if (timeElement && eventData.celebrationEvent.startTime) {
          const timeText = eventData.celebrationEvent.endTime
            ? `${eventData.celebrationEvent.startTime} - ${eventData.celebrationEvent.endTime}`
            : eventData.celebrationEvent.startTime;
          timeElement.innerHTML = `<i class="fa-solid fa-clock"></i> Pukul ${timeText}`;
        }

        if (locationElement && eventData.celebrationEvent.location) {
          locationElement.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${eventData.celebrationEvent.location}`;
        }

        // Update map link
        if (mapButton && eventData.location.googleMapsLink) {
          mapButton.href = eventData.location.googleMapsLink;
        }
      }
    }

    // Reinitialize animations for this section
    setTimeout(() => {
      reinitializeSectionAnimations("acara");
    }, 100);
  } catch (error) {
    console.error("Error updating event section:", error);
  }
}

/**
 * Update story section with dynamic data
 * @param {Object} data - Invitation data from API
 */
function updateStorySection(data) {
  try {
    const { stories } = data;
    const storyContainer = document.querySelector(".story-container");

    console.log("Updating story section with data:", { stories, storyContainer });

    if (!storyContainer) {
      console.error("Story container not found");
      return;
    }

    // Only update if we have story data, otherwise keep existing content
    if (stories && stories.length > 0) {
      console.log("Found", stories.length, "stories to display");
      // Store existing content as backup
      const existingContent = storyContainer.innerHTML;

      try {
        // Clear existing stories
        storyContainer.innerHTML = "";

        // Add each story
        stories.forEach((story, index) => {
          const isEven = index % 2 === 1;
          const storyHTML = `
                        <div class="story-item${isEven ? " even-story" : ""}">
                            <div class="story-image animate-on-scroll ${isEven ? "slide-left" : "slide-right"}">
                                <img src="${story.imageUrl}" alt="${story.title}" onerror="this.style.display='none'">
                            </div>
                            <div class="story-text animate-on-scroll ${isEven ? "slide-right" : "slide-left"}">
                                <h4>${story.title}</h4>
                                <small>${story.when}</small>
                                <p>${story.description}</p>
                            </div>
                        </div>
                    `;
          storyContainer.insertAdjacentHTML("beforeend", storyHTML);
        });

        // Apply even story styling
        const evenStories = storyContainer.querySelectorAll(".even-story");
        evenStories.forEach((story) => {
          story.style.flexDirection = "row-reverse";
        });

        // Reapply scroll animations
        const newAnimatedElements = storyContainer.querySelectorAll(".animate-on-scroll");
        newAnimatedElements.forEach((element) => {
          // Remove existing animation classes first
          element.classList.remove("is-visible");

          if (window.scrollAnimationObserver) {
            window.scrollAnimationObserver.observe(element);
          }
        });

        // Trigger animations for visible elements
        setTimeout(() => {
          newAnimatedElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) {
              element.classList.add("is-visible");
            }
          });
        }, 100);

        console.log("Story section updated successfully with", stories.length, "stories");
      } catch (innerError) {
        console.error("Error building story content, restoring original:", innerError);
        // Restore original content if there was an error
        storyContainer.innerHTML = existingContent;
      }
    } else {
      console.log("No story data available, keeping existing content");
    }

    // Reinitialize animations for this section
    setTimeout(() => {
      reinitializeSectionAnimations("story");
    }, 100);
  } catch (error) {
    console.error("Error updating story section:", error);
  }
}

/**
 * Update gallery section with dynamic data
 * @param {Object} data - Invitation data from API
 */
function updateGallerySection(data) {
  try {
    const { galleries } = data;

    if (galleries && galleries.length > 0) {
      const galleryGrid = document.querySelector(".gallery-grid");
      if (galleryGrid) {
        // Clear existing gallery
        galleryGrid.innerHTML = "";

        // Add each gallery image
        galleries.forEach((imageUrl, index) => {
          const imgHTML = `
                        <img src="${imageUrl}" 
                             alt="Foto ${index + 1}" 
                             class="animate-on-scroll zoom-in" 
                             style="transition-delay: ${index * 0.1}s;">
                    `;
          galleryGrid.insertAdjacentHTML("beforeend", imgHTML);
        });

        // Reapply scroll animations
        const newAnimatedElements = galleryGrid.querySelectorAll(".animate-on-scroll");
        newAnimatedElements.forEach((element) => {
          // Remove existing animation classes first
          element.classList.remove("is-visible");

          if (window.scrollAnimationObserver) {
            window.scrollAnimationObserver.observe(element);
          }
        });

        // Trigger animations for visible elements
        setTimeout(() => {
          newAnimatedElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) {
              element.classList.add("is-visible");
            }
          });
        }, 100);
      }
    }

    // Reinitialize animations for this section
    setTimeout(() => {
      reinitializeSectionAnimations("gallery");
    }, 100);
  } catch (error) {
    console.error("Error updating gallery section:", error);
  }
}

/**
 * Update gift section with dynamic data
 * @param {Object} data - Invitation data from API
 */
function updateGiftSection(data) {
  try {
    const { gift } = data;

    if (gift && gift.isShown && gift.gifts && gift.gifts.length > 0) {
      const giftList = document.querySelector(".gift-list");
      if (giftList) {
        // Clear existing gifts
        giftList.innerHTML = "";

        // Digital envelope card
        const digitalGifts = gift.gifts.filter((g) => g.type && g.number);
        if (digitalGifts.length > 0) {
          let digitalHTML = `
                        <div class="gift-card animate-on-scroll zoom-in">
                            <h4>Amplop Digital</h4>
                    `;

          digitalGifts.forEach((giftItem) => {
            const bankLogoUrl = getBankLogoUrl(giftItem.type);
            digitalHTML += `
                            <img src="${bankLogoUrl}" alt="${giftItem.type} Logo">
                            <p>No. Rek: ${giftItem.number}<br>a.n. ${giftItem.owner}
                                <button onclick="copyToClipboard('${giftItem.number}')">Salin</button>
                            </p>
                        `;
          });

          digitalHTML += "</div>";
          giftList.insertAdjacentHTML("beforeend", digitalHTML);
        }

        // Reapply scroll animations
        const newAnimatedElements = giftList.querySelectorAll(".animate-on-scroll");
        newAnimatedElements.forEach((element) => {
          if (window.scrollAnimationObserver) {
            window.scrollAnimationObserver.observe(element);
          }
        });
      }
    }
  } catch (error) {
    console.error("Error updating gift section:", error);
  }
}

/**
 * Update footer section with dynamic data
 * @param {Object} data - Invitation data from API
 */
function updateFooterSection(data) {
  try {
    const { closing, partnerData } = data;
    const footer = document.querySelector("footer");

    if (footer) {
      let footerHTML = "";

      if (closing.closingRemark) {
        footerHTML += `<p>${closing.closingRemark}</p><br>`;
      }

      footerHTML += `<h3>${getCoupleNames(partnerData)}</h3>`;

      if (closing.closingText) {
        footerHTML += `<p>${closing.closingText}</p>`;
      }

      footer.innerHTML = footerHTML;
    }
  } catch (error) {
    console.error("Error updating footer section:", error);
  }
}

/**
 * Initialize countdown with dynamic date
 * @param {Date} targetDate - Target date for countdown
 */
function initializeCountdown(targetDate) {
  const timer = () => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      document.getElementById("countdown").innerHTML = "ACARA TELAH BERLANGSUNG";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (daysElement) daysElement.innerText = days.toString().padStart(2, "0");
    if (hoursElement) hoursElement.innerText = hours.toString().padStart(2, "0");
    if (minutesElement) minutesElement.innerText = minutes.toString().padStart(2, "0");
    if (secondsElement) secondsElement.innerText = seconds.toString().padStart(2, "0");
  };

  timer();
  setInterval(timer, 1000);
}

/**
 * Get bank logo URL based on bank name
 * @param {string} bankName - Bank name
 * @returns {string} - Bank logo URL
 */
function getBankLogoUrl(bankName) {
  const bankLogos = {
    BNI: "https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1280px-BNI_logo.svg.png",
    BCA: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia_logo.svg/2560px-Bank_Central_Asia_logo.svg.png",
    "Bank Mandiri":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/1280px-Bank_Mandiri_logo_2016.svg.png",
    BRI: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/1280px-BRI_2020.svg.png",
  };

  return bankLogos[bankName] || "https://via.placeholder.com/200x60?text=" + encodeURIComponent(bankName);
}

/**
 * Reinitialize animations for a specific section after content update
 * @param {string} sectionId - ID of the section to reinitialize
 */
function reinitializeSectionAnimations(sectionId) {
  try {
    const section = document.getElementById(sectionId);
    if (section) {
      // Get all animated elements in this section
      const animatedElements = section.querySelectorAll(".animate-on-scroll");

      // Reset animation states
      animatedElements.forEach((element) => {
        element.classList.remove("is-visible");

        // Re-observe with the global observer if it exists
        if (window.scrollAnimationObserver) {
          window.scrollAnimationObserver.observe(element);
        }
      });

      console.log(`Reinitialized animations for section: ${sectionId}`);
    }
  } catch (error) {
    console.error(`Error reinitializing animations for section ${sectionId}:`, error);
  }
}

/**
 * Trigger animations for currently visible sections
 */
function triggerVisibleAnimations() {
  try {
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    animatedElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

      if (isVisible) {
        element.classList.add("is-visible");
      } else {
        element.classList.remove("is-visible");
      }
    });
  } catch (error) {
    console.error("Error triggering visible animations:", error);
  }
}

// Make functions available globally
window.dynamicContent = {
  updateCoverSection,
  updateSaveDateSection,
  updateMempelaiSection,
  updateVerseSection,
  updateEventSection,
  updateStorySection,
  updateGallerySection,
  updateGiftSection,
  updateFooterSection,
  initializeCountdown,
  reinitializeSectionAnimations,
  triggerVisibleAnimations,
};
