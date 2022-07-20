const axios = require("axios")
const express = require('express')
const app = express()
const request = require('request')
const port = 3001
const catalogServer ="http://192.168.1.167:5000"
const orderServer = "http://192.168.1.136:3003"
app.get('/', async (req, res) => {
   
    res.send("HEllo")
})
app.get('/search/:title', async (req, res) => {
    try{
      const catalogResponse = await axios.get(catalogServer + '/search/' + req.params.title)
      res.json(catalogResponse.data)  }
      catch(err){   console.log(err);
      }})

      app.get('/info/:id', async (req, res) => {
        try{ const catalogResponse = await axios.get(catalogServer + '/info/' + req.params.id)
        res.json(catalogResponse.data)
    }
    catch(err){console.log(err);
    }})
    app.put('/book/:id', (req, res) => {
      const id = req.params.id
     
     /* const url = catalogServer +'/book/' + id
   request({ url, json: true, method: 'PUT', body: req.body }, (error, { body, statusCode }={}) => {
          if (error) {
              return res.status(404).send(error)
          }
          return res.status(statusCode).send(body)
      })*/
      request(catalogServer+ '/book/' +req.params.id ,
    { json: true, method: 'PUT',body:req.body },
    (err, response2, body) => {
      if (response2.statusCode == 200) {
        res.send({ message: 'updated '+ bookName})
        
      } else {
        //console.log(req.body);
        res.send({ message: 'something went wrong' })
      }    }
    )
 
  })
    app.get('/purchase/:id', async (req, res) => {
      try{
        const catalogResponse = await axios.get(orderServer + '/purchase/' + req.params.id) 
        res.json(catalogResponse.data)
    }
    catch(err){
        console.log(err);
    }
})

app.listen(port, () => {
  console.log("Frontend Server is Running!")
})



