const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
//import { get } from 'axios'
//import { load } from 'cheerio'

const app = express()

const newspapers = [
    {
        name: 'The-Indian-Express',
        address: 'https://indianexpress.com/?s=rape',
        base: ''
    },
    {
        name: 'India-Today',
        address: 'https://www.indiatoday.in/topic/rape',
        base: ''
    },
    {
        name: 'NDTV',
        address: 'https://www.ndtv.com/search?searchtext=rape',
        base: '',
    },
    {
        name: 'Telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'Times-of-India',
        address: 'https://timesofindia.indiatimes.com/topic/rape',
        base: '',
    },
    {
        name: 'Economic-Times',
        address: 'https://economictimes.indiatimes.com/topic/rape',
        base: 'https://economictimes.indiatimes.com',
    },
    {
        name: 'Business-Standard',
        address: 'https://www.business-standard.com/search?q=rape',
        base: '',
    },
    {
        name: 'Dawn',
        address: 'https://www.dawn.com/search?cx=016184311056644083324%3Aa1i8yd7zymy&cof=FORID%3A10&ie=UTF-8&q=rape',
        base: '',
    },

    {
        name: 'The-Sentinel-Assam',
        address: 'https://www.sentinelassam.com/search?search=rape',
        base: 'https://www.sentinelassam.com'
    },
    {
        name: 'The-Assam-Tribune',
        address: 'https://assamtribune.com/search?search=rape',
        base: 'https://assamtribune.com'
    },
    {
        name: 'Gizbot',
        address: 'https://www.gizbot.com/search/results.html?q=rape#news',
        base: 'https://www.gizbot.com'
    },

    {
        name: 'The-Quint',
        address: 'https://www.thequint.com/search?q=rape',
        base: ''
    },
    {
        name: 'India-TV-News',
        address: 'https://www.indiatvnews.com/topic/rape',
        base: ''
    },
    {
        name: 'Zee-news',
        address: 'https://zeenews.india.com/Search?q=rape',
        base: ''
    }
]
const articles = []
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("rape")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json("Welcome to rape case monitor api")

})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperName', (req, res) => {
    const newspaperName = req.params.newspaperName
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperName)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperName)[0].base

    axios.get(newspaperAddress).then(
        response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("rape")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperName
                })
                res.json(specificArticles)
            }).catch(err => console.log(err))
        })

})

app.listen(PORT, () => console.log(`server running on Port ${PORT}`))