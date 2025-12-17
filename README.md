# SCD Project
## Cricket Tracker
| Roll Numbers | Team Members|
| ----------- | ------------ |
| 231975      | Muhammad Huzaifa Qureshi |
| 232067      | Muhammad Haris Shahzad   |

## Project Architecture (MVC)
The project follows the Model-View-Controller (MVC) architectural pattern:

- **Model**: Located in `com.crickettracker.crickettracker.model`. Represents the data structure (e.g., `Match.java`).
- **View**: Located in `src/main/webapp`. The User Interface handling presentation (HTML/CSS/JS).
- **Controller**: Located in `com.crickettracker.crickettracker.controller`. Handles incoming requests and business logic (e.g., `MatchController.java`).

## Database Structure (Firestore)
The application uses Google Firebase Firestore for data persistence.

### Collection: `matches`
Stores individual match records.
- `userId` (string): Identifier for the user (default: 'local-player')
- `matchDate` (timestamp): Date of the match
- `opponent` (string): Name of the opposing team
- `runsScored` (number): Runs scored by the player
- `ballsFaced` (number): Balls faced by the player
- `wicketsTaken` (number): Wickets taken by the player
- `oversBowled` (number): Overs bowled by the player
- `runsConceded` (number): Runs conceded during bowling
- `catches` (number): Catches taken during fielding
- `createdAt` (timestamp): Record creation time
- `updatedAt` (timestamp): Record last update time

### Collection: `playerStats`
Stores aggregated statistics for performance analysis (Document ID: `local-player`).
- `totalMatches` (number): Total matches played
- `totalRuns` (number): Total runs scored
- `totalWickets` (number): Total wickets taken
- `battingAverage` (number): Calculated batting average
- `bowlingAverage` (number): Calculated bowling average
- `strikeRate` (number): Batting strike rate
- `economyRate` (number): Bowling economy rate
