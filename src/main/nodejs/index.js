//https://github.com/TylerPachal/lambda-node-phantom/blob/master/README.md

console.log("handler - top - 1");

var jsonld = require('jsonld');
var jsig = require('jsonld-signatures');

var keys = require('keys');


console.log("handler - top - 2");

exports.handler = function(event, context, callback) {

    console.log("starting handler");

    // Set the path as described here: https://aws.amazon.com/blogs/compute/running-executables-in-aws-lambda/
    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];
    console.log("process env PATH:", process.env['PATH']);
    // Set the path to the phantomjs binary

    var apikey = event.params.querystring.apikey;
    var ledgerName = event.params.querystring.ledgerName;
    console.log("apiKey", apikey);
    console.log("ledgerName", ledgerName);
    // Arguments for the phantom script


    try {

        var signedEvent = {

        }

        var privateKeyPem = keys.private();
        var publicKey = keys.public();

        // sign the ledger event
        var signingOptions = {
            algorithm: 'LinkedDataSignature2015',
            privateKeyPem: privateKeyPem,
            creator: publicKey
        };
        jsigs.sign(self.event, signingOptions, writeToLedger);

        // write the ledger event
        var signedEvent = results.sign;
        $http.post($location.url(), signedEvent).then(function(res) {
            callback(null, res);
        }, function(err) {
            callback(err);
        });


        return callback(true, JSON.stringify(result));
    } catch(err) {
        callback(null, JSON.stringify(err));
    }














    var stdout = '';
    var stderr = '';

    phantom.stdout.on('data', function(data) {
        stdout += data;
    });

    phantom.stderr.on('data', function(data) {
        stderr += data;
    });

    phantom.on('uncaughtException', function(err) {
        console.log('uncaught exception: ' + err);
    });

    phantom.on('exit', function(exitCode) {
        if (exitCode !== 0) {
            return callback(true, stderr);
        }
        callback(null, stdout);
    });
};
console.log("handler - top - 3");