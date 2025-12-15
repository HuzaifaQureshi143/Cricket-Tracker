# 🏏 Cricket Tracker

A modern web application for local-level cricket players to track their match performances, view detailed statistics, and monitor their progress over time.

## 🎯 Features

- **📊 Dashboard** - Quick overview of your cricket statistics
- **➕ Add Match** - Record match performance with batting, bowling, and fielding stats
- **📜 Match History** - View, edit, and delete all your match records
- **📈 Detailed Statistics** - Comprehensive performance analysis
- **🔄 Auto-Calculations** - Automatic computation of averages, strike rates, and economy rates
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **🚫 Duplicate Prevention** - Prevents recording the same match twice
- **✅ Form Validation** - Real-time input validation with helpful error messages

## 🚀 Quick Start

### Prerequisites

- Java Development Kit (JDK) 11 or higher
- Apache Tomcat 9.0 or higher
- NetBeans IDE (recommended) or any Java IDE
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for Firebase Firestore)

### Installation & Deployment

#### Option 1: Using NetBeans

1. **Open Project in NetBeans**
   - File → Open Project
   - Navigate to `CricketTracker` folder
   - Click "Open Project"

2. **Configure Tomcat Server**
   - Right-click project → Properties
   - Select "Run" category
   - Choose your Tomcat server
   - Click OK

3. **Build and Run**
   - Right-click project → Clean and Build
   - Right-click project → Run
   - Application will open in your default browser

#### Option 2: Manual Deployment

1. **Build WAR file**
   ```bash
   cd CricketTracker
   mvn clean package
   ```

2. **Deploy to Tomcat**
   - Copy `target/CricketTracker-1.0-SNAPSHOT.war` to Tomcat's `webapps` folder
   - Start Tomcat server
   - Access: `http://localhost:8080/CricketTracker-1.0-SNAPSHOT/`

## 📖 User Guide

### Adding a Match

1. Click **"Add Match"** in the navigation menu
2. Fill in the match details:
   - **Match Date** (required) - Cannot be a future date
   - **Opponent** (required) - Name of the opposing team
3. Enter your **Batting Performance**:
   - Runs Scored
   - Balls Faced
4. Enter your **Bowling Performance**:
   - Wickets Taken (max 10)
   - Overs Bowled (use decimal format, e.g., 4.5)
   - Runs Conceded
5. Enter **Fielding Stats**:
   - Catches
6. Click **"Save Match"**

### Viewing Statistics

- **Dashboard** - Shows quick stats and recent 5 matches
- **Statistics** - Detailed breakdown of batting, bowling, and fielding performance

### Managing Match History

1. Click **"Match History"** in navigation
2. View all matches in a sortable table
3. **Edit** - Click ✏️ icon to modify match details
4. **Delete** - Click 🗑️ icon to remove a match (requires confirmation)

## 📊 Statistics Explained

### Batting Statistics

- **Batting Average** = Total Runs ÷ Matches with Runs Scored
- **Strike Rate** = (Total Runs ÷ Total Balls Faced) × 100

### Bowling Statistics

- **Bowling Average** = Total Runs Conceded ÷ Total Wickets
- **Economy Rate** = Total Runs Conceded ÷ Total Overs Bowled

### Overall Statistics

- **Total Matches** - Number of matches recorded
- **Total Runs** - Cumulative runs scored
- **Total Wickets** - Cumulative wickets taken
- **Total Catches** - Cumulative catches taken

## 🔒 Firebase Configuration

### Current Setup

The application uses Firebase Firestore for data storage. The configuration is already set up in `src/main/webapp/js/firebase-config.js`.

### Security Rules (IMPORTANT)

⚠️ **Before deploying to production**, set up Firestore Security Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/project/cricket-tracker-8f91d/firestore)
2. Navigate to **Firestore Database** → **Rules**
3. Use these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Matches collection - read/write for all (single-user app)
    match /matches/{matchId} {
      allow read, write: if true;
    }
    
    // Player stats - read/write for all
    match /playerStats/{userId} {
      allow read, write: if true;
    }
  }
}
```

> **Note**: For multi-user version in the future, add authentication and update rules accordingly.

## 🗂️ Project Structure

```
CricketTracker/
├── src/
│   └── main/
│       ├── java/                           # Java backend (if needed)
│       ├── resources/                      # Application resources
│       └── webapp/
│           ├── css/
│           │   └── styles.css             # Main stylesheet
│           ├── js/
│           │   ├── firebase-config.js     # Firebase initialization
│           │   ├── firestore-service.js   # Firestore CRUD operations
│           │   ├── match-service.js       # Match business logic
│           │   ├── validation.js          # Form validation
│           │   ├── ui-components.js       # UI components (modals, toasts)
│           │   └── app.js                 # Main application controller
│           ├── index.html                 # Main application page
│           ├── META-INF/
│           └── WEB-INF/
├── pom.xml                                 # Maven configuration
└── README.md                               # This file
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6 Modules)
- **Backend**: Java EE 10 (Jakarta EE)
- **Database**: Firebase Firestore (NoSQL Cloud Database)
- **Server**: Apache Tomcat 9.0+
- **Build Tool**: Apache Maven
- **Fonts**: Google Fonts (Inter)

## 🎨 Design Features

- **Dark Mode** - Modern dark theme with cricket-themed colors
- **Responsive Layout** - Mobile-first design approach
- **Smooth Animations** - Micro-interactions for better UX
- **Gradient Accents** - Cricket green and blue gradients
- **Toast Notifications** - Non-intrusive success/error messages
- **Modal Dialogs** - Confirmation dialogs and edit forms
- **Loading States** - Visual feedback during operations

## ⚙️ Functional Requirements Checklist

✅ Single-page web application accessible via browser  
✅ Add match details (date, opponent, batting, bowling, fielding stats)  
✅ Automatic save to Firestore database  
✅ Unique ID assignment for each match  
✅ Automatic calculation of batting average, strike rate, bowling average, economy rate  
✅ Instant refresh of summary statistics  
✅ View complete list of previous matches  
✅ Edit existing match entries  
✅ Delete match records with confirmation  
✅ Revalidation and recalculation on data modification  
✅ Confirmation dialog before deletion  
✅ Immediate database updates  
✅ Dashboard with total matches, runs, wickets, averages  
✅ Recent performance summaries  
✅ Navigation between sections (Dashboard, Add Match, History, Stats)  
✅ Success and error messages for all operations  
✅ Duplicate prevention (same date + opponent)  
✅ Internal consistency of calculated values  
✅ No login required (single-user version)  
✅ Error messages for database connection failures  

## 🐛 Troubleshooting

### Firebase Connection Issues

**Problem**: "Failed to initialize Firebase"  
**Solution**: 
- Check internet connection
- Verify Firebase configuration in `firebase-config.js`
- Check browser console for specific errors

### Data Not Saving

**Problem**: Match data not appearing after save  
**Solution**:
- Check Firestore Security Rules in Firebase Console
- Verify browser console for permission errors
- Ensure date is not in the future

### Duplicate Match Error

**Problem**: "A match against [opponent] on this date already exists"  
**Solution**:
- This is intentional to prevent duplicate entries
- Edit the existing match instead, or change the date/opponent

### Validation Errors

**Problem**: Form won't submit  
**Solution**:
- Check for red error messages below input fields
- Ensure required fields (Date, Opponent) are filled
- Verify numeric fields have valid values

### Statistics Not Updating

**Problem**: Stats don't reflect recent changes  
**Solution**:
- Refresh the page
- Check browser console for errors
- Verify Firestore connection

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Internet Explorer (Not Supported - use modern browser)

## 🔮 Future Enhancements

- 🔐 User authentication (multi-user support)
- 📊 Charts and graphs for performance trends
- 🏆 Achievements and milestones
- 📤 Export data to PDF/CSV
- 🎯 Performance goals and tracking
- 📸 Match photos upload
- 🌐 Social sharing features
- 📱 Progressive Web App (PWA) support
- 🔔 Performance notifications
- 🎮 Gamification elements

## 📄 License

This project is for educational and personal use.

## 👨‍💻 Developer

Built with ❤️ for local-level cricket players

## 📞 Support

For issues or questions:
1. Check this README
2. Review browser console for errors
3. Verify Firebase configuration
4. Check Firestore Security Rules

---

**Version**: 1.0.0  
**Last Updated**: December 15, 2025  
**Status**: Production Ready ✅
