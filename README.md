# Dynamic Wedding Invitation

A beautiful, responsive wedding invitation website that fetches data dynamically from an API.

## ✨ Features

- **Dynamic Content**: All content is loaded from API with fallback to static data
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Elegant Animations**: Smooth scroll animations and hover effects
- **Background Music**: Auto-playing background music with controls
- **Interactive Elements**: Navigation, countdown timer, guestbook
- **Beautiful UI**: Golden theme with romantic design elements

## 🚀 API Integration

### API Endpoint

```
https://localhost:7077/api/v1/invitation/the-wedding-of-fadhlih-%26-febiana/all-data
```

### Data Structure

The API returns data in the following structure:

```json
{
  "message": "Berhasil mengambil data Invitation",
  "data": {
    "generalInformation": {
      "title": "Wedding title",
      "date": "2025-12-29T07:00:00",
      "themeCode": "Wedding1"
    },
    "coverOpening": {
      "coverImage": "Background image URL",
      "profileImage": "Couple photo URL",
      "openingTitle": "Opening title",
      "openingSubTitle": "Opening subtitle",
      "openingText": "Opening text"
    },
    "partnerData": {
      "man": {
        "fullName": "Groom full name",
        "nickName": "Groom nickname",
        "fatherName": "Father name",
        "motherName": "Mother name",
        "imageUrl": "Groom photo URL"
      },
      "woman": {
        "fullName": "Bride full name",
        "nickName": "Bride nickname",
        "fatherName": "Father name",
        "motherName": "Mother name",
        "imageUrl": "Bride photo URL"
      }
    },
    "eventData": {
      "religiousEvent": {
        "name": "Event name",
        "eventDate": "2025-12-29T00:00:00",
        "startTime": "07:00 WIB",
        "endTime": "Selesai",
        "location": "Event location"
      },
      "celebrationEvent": {
        "name": "Reception name",
        "eventDate": "2025-12-30T00:00:00",
        "startTime": "08:00 Wib",
        "endTime": "Selesai",
        "location": "Reception location"
      },
      "verse": {
        "verseTitle": "Verse title",
        "verseSource": "QS. Ar-Rum: 21",
        "verseContent": "Verse content"
      },
      "location": {
        "googleMapsLink": "Maps URL",
        "address": "Address"
      }
    },
    "stories": [
      {
        "title": "Story title",
        "when": "Date",
        "description": "Story description",
        "imageUrl": "Story image URL"
      }
    ],
    "galleries": ["Image URL 1", "Image URL 2"],
    "gift": {
      "isShown": true,
      "gifts": [
        {
          "type": "Bank name",
          "number": "Account number",
          "owner": "Account owner"
        }
      ]
    },
    "closing": {
      "closingRemark": "Closing message",
      "closingText": "Final text"
    }
  }
}
```

## 📁 File Structure

```
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Responsive styling
├── js/
│   ├── api.js          # API handling and data fetching
│   ├── dynamic-content.js  # DOM manipulation with API data
│   └── main.js         # Main application logic
├── music/
│   └── janji-suci.mp3  # Background music
└── README.md           # This file
```

## 🔧 How It Works

1. **Initialization**: When the page loads, `initializeDynamicContent()` is called
2. **API Fetch**: The system attempts to fetch data from the API endpoint
3. **Dynamic Update**: If successful, all content is updated with API data
4. **Fallback**: If API fails, static fallback data is used
5. **UI Updates**: All sections are populated with the appropriate data

## 🎨 Dynamic Sections

- **Cover Page**: Background image, couple names, opening text
- **Save the Date**: Couple photo, wedding date, venue
- **Mempelai**: Couple profiles, photos, parent names
- **Verse**: Religious verse content
- **Event Info**: Religious and celebration event details
- **Love Story**: Timeline with photos and descriptions
- **Gallery**: Photo gallery grid
- **Gift Section**: Bank account details
- **Footer**: Closing messages

## 🛠️ Development

### Adding New API Data

To add new fields from the API:

1. Update the data structure in `js/api.js`
2. Create update function in `js/dynamic-content.js`
3. Call the update function in `initializeDynamicContent()`

### Styling

All styles are in `css/style.css` with CSS custom properties for easy theming.

### Fallback Data

If the API is unavailable, the invitation uses fallback data defined in `getDefaultData()` function.

## 📱 Responsive Features

- Mobile-first design
- Adaptive photo sizes
- Touch-friendly navigation
- Optimized animations for mobile

## 🎵 Music Player

- Auto-play background music (if browser allows)
- Play/pause controls
- Volume control slider
- Beautiful music player UI

## 🔗 Features

- ✅ Dynamic content from API
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Background music
- ✅ Guest name from URL parameter
- ✅ Add to calendar functionality
- ✅ Copy to clipboard for gift details
- ✅ Pagination for guest messages
- ✅ Loading indicators
- ✅ Error handling with fallbacks

## 📞 Support

The invitation is designed to be robust and always functional, even if the API is unavailable. All dynamic features have static fallbacks to ensure a great user experience.
