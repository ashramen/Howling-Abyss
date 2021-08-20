# Welcome to the Howling Abyss! ❄️
Howling Abyss is a Discord bot that offers quick, accurate information on the user's LoL profile and ARAM statistics using simple commands and a visually pleasing UI 

<img src="https://cdn1.dotesports.com/wp-content/uploads/2020/10/03111644/Howling-Abyss-Legends-of-Runeterra-Teaser.png" width="600"/>

### The purpose of this project is to learn and practice concepts related to: 
- Using asynchronous functions and promises effectively 
- Fetching data with APIs 
- Caching API calls to speed up application and reduce server load 
- CRUD operations on cloud database system 
- Following Javascript module pattern 
- Deploying an app through Heroku

## Instructions to run:
1. 'yarn install' in root directory
2. Fill in config.js values
3. Modify existing commands or add new commands using the [SlashCommandBuilder](https://discordjs.guide/interactions/replying-to-slash-commands.html#receiving-interactions)
4. To test commands for development, run **deploy_local.js** to test it on a dev server. To publish commands for ALL servers, run **deploy_global.js**.

## Commands
| Commands  | Description  |  Usage |
|---|---|---|
| /summoner  | Stores user metadata in database  | /summoner username (required)  |
| /profile  | Shows username's profile or the current user's profile  | /profile username (optional)  |
|  /build |  Sends a link to the optimal build, runes, and skill order for champion | /build champion (required)  |
| /recent | Shows the user's 10 most recent games | /recent |

## Demo
#### Summoner
![](https://i.imgur.com/Z0qsULr.gif)
#### Profile
![](https://i.imgur.com/dPChHd1.gif)
#### Build
![](https://i.imgur.com/yM2RtXo.gif)
#### Recent
![](https://i.imgur.com/SYJ0cCD.gif)

