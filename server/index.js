const PROTO_PATH = "./customers.proto";
const { v4: uuidv4 } = require('uuid');

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const customersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
//It's a pure grpc server where definitions of all the procedures are going to be written

const customers = [
  {
    id: "sdffwer3ew1q2e",
    name: "Tripti",
    age: 22,
    address: "Bangalore",
  },
  {
    id: "sdffwer3ew1q2e",
    name: "Priya",
    age: 22,
    address: "Pune",
  }
];

server.addService(customersProto.CustomerService.service, {
  getAll: (call, callback) => {
    callback(null, {customers});
  },
  get: (call, callback) => {
    let customer = customers.find(n=>n.id == call.request.id);
    if(customer){
        callback(null, customer);
    } else{
        callback({
            code:grpc.status.NOT_FOUND,
            details:"Not Found"
        });
    }
  },
  insert: (call, callback) => {
    let customer = call.request;

    customer.id = uuidv4();
    customers.push(customer);
    callback(null, customer);
  },
  update: (call, callback) => {
    let existingCustomer = customers.find(n => n.id == call.request.id);

    if(existingCustomer){
        existingCustomer.name = call.request.name;
        existingCustomer.age = call.request.age;
        existingCustomer.address = call.request.address;
        callback(null, existingCustomer);
    } else{
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not Found"
        });
    }
  },
  remove: (call, callback) => {
    let existingCustomerIndex = customers.findIndex(
        n=> n.id == call.request.id
    );

    if(existingCustomerIndex != -1){
        customers.splice(existingCustomerIndex, 1);
        callback(null, {});
    } else{
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not Found"
        })
    }
  },
  //Definitions is done for all methods
});

server.bindAsync("127.0.0.1:30043", grpc.ServerCredentials.createInsecure(), (err, port)=>{
    if(err){
        console.log(`Error starting gRPC server: ${err}`);
    } else{
        // server.start();
        console.log(`gRPC server is listening on ${port}`);
    }
}); //it's the port where it'll run alongwith some authentic request to this server
