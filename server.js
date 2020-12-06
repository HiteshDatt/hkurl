const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
const shortId = require('shortid')
const ShortUrl = require('./models/shortUrl')
const app = express()   
require('dotenv').config()  

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.use(express.static( path.join(__dirname, "public")))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"public","index.html"));
})

app.get('/url-shortener/:invalid?', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('url-shortener.ejs', 
  { shortUrls: shortUrls,
  invalidUrl: (req.params.invalid == "invalid-short-url") ? true : false 
  }) 
})

app.post('/shortUrls', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.body.shortUrl })
  if(shortUrl == null){
    await ShortUrl.create({ full: req.body.fullUrl, short: req.body.shortUrl||shortId.generate().substring(0,6) })
    res.redirect('/url-shortener')
  }
  else {
    res.redirect('/url-shortener/invalid-short-url')
  }
  
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);