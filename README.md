## Twumps - FrontEnd
latform to present dynamic data using D3 charts. We aim to find interesting statistics through Donald Trump twitter account.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Nodejs & npm
- yarn

### Installing

Clone this repository and install all node modules

```
yarn install
```

Edit the configuration file `global.config.factory.js`

```
const url_server = "http://localhost:5000/";
const url_back = "http://localhost:3005/";
```

Start the server
```
gulp watch
```
