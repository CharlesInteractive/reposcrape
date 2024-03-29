// define port
const PORT = 8765

// get required packages
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const fs = require('fs')
const cron = require('node-cron')

// create express application
const app = express()

// define url
const githuburl = 'https://github.com'
const username = 'CharlesInteractive'
const url = githuburl + '/' + username

// create empty repos array
const repos = []

// run task every minute
cron.schedule('* * * * *', () => {
    // get time to stamp
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    console.log(`[reposcrape] notice - ${dateTime}`)
    console.log(`[reposcrape] running task: scrape pinned repos`);

    // start axios with page url
    axios(url)
    .then(response => {
        console.log(`[reposcrape] scraping from '${url}'...`)
        // return data from url
        const html = response.data

        // query the returned html from the url
        const $ = cheerio.load(html)

        // find the pinned repositorys buy class selector
        // push each pinned repository to the repos array
        $('.js-pinned-items-reorder-list li', html).each(function() {
            // defining the values we would like to save
            // repository owner (only available if the profile is not current owner)
            const owner = cleanstr( $(this).find('a .owner').text() )

            // repository title
            const title = cleanstr( $(this).find('a .repo').text() )

            // construct the name of the repository to save
            let name
            owner != '' ? name = owner + '/' + title : name = title

            // repository description
            const description = cleanstr( $(this).find('.pinned-item-desc').text() )

            // repository path
            const repopath = cleanstr( $(this).find('a').attr('href') )

            // repository url
            const url = githuburl + repopath

            // repository stars
            const stargazers = cleanstr( $(this).find('a[href="' + repopath + '/stargazers"]').text() )

            // repository language
            const language = cleanstr( $(this).find('span[itemprop="programmingLanguage"]').text() )

            repos.push({
                name,
                description,
                url,
                stargazers,
                language
            })
            
        })

        // turn our repos array into pretty printed json
        const json = JSON.stringify(repos, null, 4)

        // define the pat to output the json
        const path = 'repos.json'

        // write json to file
        fs.writeFile(path, json, (err) => {
            if(err) {
                console.error('[reposcrape] failed -> ' + err);return;
            }
            console.log(`[reposcrape] repos have be written to '${path}'`)
            console.log('')
            console.log('[reposcrape] waiting...')
            console.log('')
            // write file task complete, wait

        })
        
    })
    .catch(err => console.log('[reposcrape] failed -> ' + err))

});

// function to clean strings
function cleanstr(string) {
    const dirty = string.toString();
    const clean = dirty.trim().replace(/\n/g, '').replace(/\t/g, '')
    
    return clean;

}

// listen for changes to this js file, code will run on save
app.listen(PORT, () => console.log(`[reposcrape] server running on port ${PORT}`))