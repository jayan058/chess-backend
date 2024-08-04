# Chess Game Application

## Overview

This Chess Game Application is a web-based platform that enables users to play chess online or offline. It supports features such as user authentication, game history tracking, room creation, spectator mode, and game replays. 

## Functional Requirements

### User Authentication
- **Signup with Picture:** Users can sign up by providing their details and uploading a profile picture using Multer.
- **Sign in:** Users can sign in with their registered credentials.

### User Dashboard
- **Game History:** Displays all games played by the user, including the winner's name and win type.
- **Play Options:** Users can choose to play offline or online.

### Online Gameplay
- **Room Creation/Joining:** Users can create or join rooms by entering the room name.
- **Waiting Room:** After creating a room, users are redirected to a waiting page until an opponent joins.
- **Game Start:** Once an opponent joins, both players are redirected to the game page.
- **Timer:** A timer is implemented to enhance the challenge of the game.

### Offline Gameplay
- **Algorithm:** Offline gameplay is implemented using the minimax algorithm with alpha-beta pruning.
- **Difficulty Levels:** Users can adjust the AI difficulty to easy, medium, or hard.

### Spectator Mode
- **Game Watching:** Additional users can join the room as spectators to watch the game live.


### Game Conclusion
- **Result Page:** After the game, users are taken to a page displaying the result (win/lose)  

### Leader Board
- **Leaderboard:** The leaderboard ranks all the players that play the games based upon their number of wins 


### Game Replay
- **Stored Moves:** All moves of a game are stored for later playback. Users can watch past games by selecting them from their game history.

## Installation

To set up and run the Chess Game Application locally, follow these steps:
1. **Clone the Repository**  
  ```bash
  git clone https://github.com/jayan058/chess-backend.git  
   ````
2. **Navigate To The directory**  
  ```bash
  cd chess-backend
  cd chess-backend
  ```
3. **Install the packages**  
  ```bash
  npm install
  ```

4. **Setup the .env file by taking reference form the .env.example file**  

5. **Setup the Database**  
  ```bash
  npm run migrate
  ```

6. **Start The server**  
  ```bash
  npm start
  ```




 