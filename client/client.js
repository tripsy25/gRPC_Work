const PROTO_PATH = './customers.proto';

const grpc = require("@grpc/grpc-js");
const protoLoader = require('@grpc/proto-loader');


//Using this loader we're going to load the customer
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepcase: true,
    longs: String,
    enums: String,
    arrays: true
});



const CustomerService = grpc.loadPackageDefinition(packageDefinition).CustomerService;

const client = new CustomerService(
    "127.0.0.1:30043",
    grpc.credentials.createInsecure()
)

module.exports = client;