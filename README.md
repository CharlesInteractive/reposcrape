# reposcrape
Node.js web scraper for pinned github repositories.

## Why?
This was just for fun. Figured it would be cool to scrape my pinned repositories into a json file to upate on my porfolio site automagicly through an api.

## Get Started
As always run

    npm install

Look in index.js and change the username variable to your own (or whoever you want really).

The script is set to scrape every minute but you can change this from the node cron settings. Learn more [here](https://www.npmjs.com/package/node-cron).

Start the server with this simple command:

    npm run start

