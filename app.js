const axios = require("axios")
const express = require('express')
const app = express()
const request = require('request')
const port = 3001
const catalogServer =["http://192.168.1.167:5000","http://192.168.1.136:5001"]
const orderServer = ["http://192.168.1.136:3003","http://192.168.1.167:3004"]

let indexCatalog = 0
let indexorder = 0
let indexPurchase = 0
let indexUpdate=0

let searchCache = {}
let infoCache = {}

app.get('/', async (req, res) => {
   
    res.send("HEllo")
})
app.get('/search/:topic', async (req, res) => {
    try{
      if(searchCache[req.params.topic] === undefined){
        indexCatalog>= catalogServer.length -1? indexCatalog =0: indexCatalog+=1
        const catalogResponse = await axios.get(catalogServer[indexCatalog] + '/search/' + req.params.topic)
         searchCache[req.params.topic] = catalogResponse.data
         console.log("not in cache")
         console.log("Return the book with topic "+req.params.topic+ " and indexCatalog= "+indexCatalog)
         res.json(catalogResponse.data)  }

         else {
          console.log("in cache")
          res.json(searchCache[req.params.topic])
         }
      }
      catch(err){ console.log(err)
      }
      finally{
        indexSearche =(indexCatalog + 1) % catalogServer.length
        console.log("***************************")
      }
    })

    app.get('/info/:id', async (req, res) => {
      try{
      if(infoCache[req.params.id] === undefined){
        indexCatalog>= catalogServer.length -1? indexCatalog =0: indexCatalog+=1
        const catalogResponse = await axios.get(catalogServer[indexCatalog] + '/info/' + req.params.id)
        infoCache[req.params.id] = catalogResponse.data
        console.log("the required information is : not in cache")
        console.log("Catalog server replica to get the information is =  "+indexCatalog)
        res.json(catalogResponse.data)
      }
      else {
        console.log("The required information is :  in cache");
        res.json(infoCache[req.params.id])}
    }
    catch(err){console.log(err);
    }
    finally{
      indexInfo = (indexCatalog+1) % catalogServer.length
      console.log("***************************")
    }
  })

   app.put('/book/:id', (req, res) => {
      const id = req.params.id
      const query=req.query;
      const price1=query.price
      const stock1=query.stock
   indexCatalog>= catalogServer.length -1? indexCatalog =0: indexCatalog+=1
   console.log("catalog server number for updating is = " +indexCatalog)

    request(
      
      catalogServer[indexCatalog]+ '/book/' + id +`?stock=${stock1}`+`&price=${price1}`,
      { json: true, method: 'PUT' },
      (err, response2, body) => {
        if (response2.statusCode == 200) {
          res.send({ message: 'Updated successfully'})
        } else {
          res.send({ message: 'something went wrong' })
        }
      }
    )
    indexUpdate = (indexUpdate + 1 ) % catalogServer.length
    console.log("***************************")
    
  })

    app.get('/purchase/:id', async (req, res) => {
      try{
        indexorder>= orderServer.length -1? indexorder =0: indexorder+=1
        console.log("order server number for purchase is="+indexorder)
        const catalogResponse = await axios.get(orderServer[indexPurchase]+ '/purchase/' + req.params.id) 
        res.json(catalogResponse.data)
       }
    catch(err){
        console.log(err);
    }
    finally{
      indexPurchase = (indexPurchase + 1 ) % orderServer.length
     
      console.log("***************************")

    }
   })

   app.put('/invalidate/:id',async(req,res)=>{
    
   delete infoCache[req.params.id]
   const keys = Object.keys(searchCache)
   let toDelete = ""
   keys.forEach((key)=>{
    searchCache[key].forEach((item) =>{
      if(item.id == req.params.id){
        toDelete = key
      }
    })
   })
   delete searchCache[toDelete]
   res.status(200).json({success:true})
   })

 app.listen(port, () => {
  console.log("Frontend Server is Running!")
 })

