# ghost-sessions
Write Discord Rich Presence activities for authorized users _from the cloud!_


## Functionality
`ghost-sessions` is a tool for developers integrating Discord Rich Presence into their games and apps. It's written in JavaScript ([Node.js](https://nodejs.org/)) and provides a working end-to-end example of:

1. Obtaining auth tokens ([OAuth2](https://discordapp.com/developers/docs/topics/oauth2)) for a Discord user.
1. Setting their Discord presence data ([Activity](https://discordapp.com/developers/docs/game-sdk/activities)) via REST API.
1. Clearing presence data.

It also outputs the data being sent to / from Discord to the terminal so you can see how everything fits together.

## Requirements

1. [Node.js](https://nodejs.org/) 12 or newer
1. Discord [application](https://discordapp.com/developers/applications/)


## Installation

1. Clone this repository via Git from a terminal emulator
1. From the project root directory, run the command: `npm install`


## Usage

This tool is released as a set of interactive scripts that can be executed via command-line interface. 

1. Configure your Discord app: `npm run setup`
1. Obtain a user auth token: `npm run token`
1. Set Rich Presence activity: `npm run set`
1. Clear Rich Presence activity: `npm run clear`

Each one will prompt you for the information it needs to successfully execute, no command line arguments are necessary.
