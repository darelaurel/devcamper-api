const nodeGeocoder=require('node-geocoder');

const options={
    provider:'mapquest',
    httpAdapter:'https',
    apiKey:'WzYCLToTMWHj5Yr3fFwQeGVT9ZMGnRdm',
    formatter:null
}

const geocoder=nodeGeocoder(options);

module.exports=geocoder;