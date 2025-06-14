const client = require("./client");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//TODO: to expose rest call
//which internally call gRPC server function using gRPC client

app.get('/', (req, res)=>{
  client.getAll(null, (err, data)=>{
    if(!err){
      res.send(data.customers);
    }
  })
})

app.post('/create', (req, res)=>{
  let newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address
  }

  client.insert(newCustomer, (err, data)=>{
    if(err) throw err;

    console.log("Customer created scucessfully!", data);
    res.send({ message: "Customer created successfully!"});
  })
})
app.post('/update', (req, res)=>{
  let updateCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address
  }
  client.update(updateCustomer, (err, data)=>{
    if(err) throw err;

    console.log("Customer updated scucessfully!", data);
    res.send({ message: "Customer updated successfully!"});
  })
})
app.post('/remove', (req, res) => {
  client.remove({ id: req.body.customer_id }, (err, _) => {
    if (err) throw err;

    console.log("Customer removed successfully!");
    res.send({ message: "Customer removed successfully!" });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at PORT %d", PORT);
});
