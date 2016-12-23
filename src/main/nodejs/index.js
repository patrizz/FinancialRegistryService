//https://github.com/TylerPachal/lambda-node-phantom/blob/master/README.md

console.log("handler - top - 1");

var querystring = require('querystring');

var uuid = require("uuid");
var http = require('http');

var jsonld = require('jsonld');
var jsig = require('jsonld-signatures');
jsig.use('jsonld', jsonld);

var keys = require('./keys');

var serviceUrl = "http://dhs2016ledger.digitalbazaar.com/ledgers";

console.log("handler - top - 2");


function getLedgerInfoByName(ledgerName, ledgerInfoCB) {
    //http://dhs2016ledger.digitalbazaar.com/ledgers/<name>
    http.get({
        hostname: 'dhs2016ledger.digitalbazaar.com',
        port: 80,
        path: '/ledgers/'+ledgerName,
        agent: false  // create a new agent just for this one request
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            console.log("body=", body);

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            ledgerInfoCB(parsed);
        });
    });
}


function postCode(path, signedevent, callback) {
    // Build the post string from an object
    var post_data = JSON.stringify(signedevent);

    // An object of options to indicate where to post to
    var post_options = {
        host: 'dhs2016ledger.digitalbazaar.com',
        port: '80',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
            'Accept': 'application/ld+json, application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Length': Buffer.byteLength(post_data),
            'Accept-Language': 'en-US,en;q=0.8,de;q=0.6,es;q=0.4,fr;q=0.2,nl;q=0.2',
            'Origin': 'http://dhs2016ledger.digitalbazaar.com',
            'Referer': 'http://dhs2016ledger.digitalbazaar.com',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    console.log('post_options: ', post_options);
    console.log('post_data: ', post_data);

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ', chunk);
            callback(chunk, null);
        });
        res.on('error', function (err) {
            console.log('Error: ', err);
            callback(err, null);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

}

console.log("handler - top - 3");

function signIt(unsignedEvent, callback) {
    try {

        var privateKeyPem = keys.private();
        console.log("private key", privateKeyPem);
        var publicKey = keys.public();
        console.log("public key", publicKey);
        // sign the ledger event
        var signingOptions = {
            algorithm: 'LinkedDataSignature2015',
            privateKeyPem: privateKeyPem,
            creator: publicKey
        };
        console.log("signingoptions", signingOptions);

        console.log("about to sign");
        var sign = jsig.promises.sign(unsignedEvent, signingOptions);
        sign.then(function(signedEvent) {
            console.log("writing to ledger - signed event", signedEvent);
            // write the ledger event

            callback(signedEvent, null);
        }, function(err) {
            console.log("writing to ledger - err", err);
        });
        console.log("signing fired");


    } catch(err) {
        console.log("caught error", err);
        callback(null, JSON.stringify(err));
    }
}

exports.handler_createLedger = function(event, context, callback) {

    console.log("starting handler_createLedger, event = ", event);
    var ledgerName = event.ledgerName;
    console.log("ledgerName", ledgerName);

    try {
        console.log("defining unsigned event to create ledger");
        var did = uuid();
        //did =did.replace(/-/g, "");
        console.log("did=", did);
        var unsignedEvent = {
            //"@context": "http://dhs2016ledger.digitalbazaar.com/contexts/flex-v1.jsonld",
            //"@context": "https://w3id.org/flex/v1",
            "@context": {
                "id": "@id",
                "type": "@type",

                "dc": "http://purl.org/dc/terms/",
                "flex": "https://w3id.org/flex#",
                "identity": "https://w3id.org/identity#",
                "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                "sec": "https://w3id.org/security#",
                "schema": "http://schema.org/",
                "xsd": "http://www.w3.org/2001/XMLSchema#",

                "CryptographicKey": "sec:Key",
                "GraphSignature2012": "sec:GraphSignature2012",
                "Identity": "identity:Identity",
                "LedgerCheckpointEvent": "flex:LedgerCheckpointEvent",
                "LedgerConfigurationEvent": "flex:LedgerConfigurationEvent",
                "LedgerConsensusEvent": "flex:LedgerConsensusEvent",
                "LedgerStorageEvent": "flex:LedgerStorageEvent",
                "LinkedDataSignature2015": "sec:LinkedDataSignature2015",
                "LinkedDataSignature2016": "sec:LinkedDataSignature2016",
                "MerklePatriciaTrie": "flex:MerklePatriciaTrie",
                "MerkleTree": "flex:MerkleTree",
                "ProofOfBallot2015": "flex:ProofOfBallot2015",
                "ProofOfSignature2016": "flex:ProofOfSignature2016",
                "ProofOfWork2016": "flex:ProofOfWork2016",
                "SequentialList": "flex:SequentialList",

                "addsObject": "flex:addsObject",
                "approvedSigner": "flex:approvedSigner",
                "canonicalizationAlgorithm": "sec:canonicalizationAlgorithm",
                "checkpointLog": "flex:checkpointLog",
                "checkpointLogHash": "flex:checkpointLogHash",
                "comment": "rdfs:comment",
                "consensusAlgorithm": "flex:consensusAlgorithm",
                "created": {"@id": "dc:created", "@type": "xsd:dateTime"},
                "creator": {"@id": "dc:creator", "@type": "@id"},
                "description": "schema:description",
                "digestAlgorithm": "sec:digestAlgorithm",
                "digestValue": "sec:digestValue",
                "domain": "sec:domain",
                "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
                "label": "rdfs:label",
                "ledgerConfig": "flex:ledgerConfig",
                "minimumQuorumPercentage": "flex:minimumQuorumPercentage",
                "minimumSignaturesRequired": "flex:minimumSignaturesRequired",
                "minimumVotePercentage": "flex:minimumVotePercentage",
                "nextEvent": "flex:nextEvent",
                "nonce": "sec:nonce",
                "normalizationAlgorithm": "sec:normalizationAlgorithm",
                "owner": {"@id": "sec:owner", "@type": "@id"},
                "previousEvent": "flex:previousEvent",
                "privateKey": {"@id": "sec:privateKey", "@type": "@id"},
                "privateKeyPem": "sec:privateKeyPem",
                "proofOfWorkAlgorithm": "flex:proofOfWorkAlgorithm",
                "publicKey": {"@id": "sec:publicKey", "@type": "@id"},
                "publicKeyPem": "sec:publicKeyPem",
                "replacesObject": "flex:replacesObject",
                "revoked": {"@id": "sec:revoked", "@type": "xsd:dateTime"},
                "signature": "sec:signature",
                "signatureAlgorithm": "sec:signatureAlgorithm",
                "signatureValue": "sec:signatureValue",
                "storageMechanism": "flex:storageMechanism",
                "targetDifficulty": "flex:targetDifficulty"
            },
            "id": "did:" + did + "/events/1",
            "type": "LedgerConfigurationEvent",
            "ledgerConfig": {
                "id": "did:" + did,
                "type": "LedgerConfiguration",
                "name": ledgerName,
                "description": "superledger",
                "storageMechanism": "SequentialList",
                "consensusAlgorithm": {
                    "type": "ProofOfSignature2016",
                    "approvedSigner": [
                        "http://dhs2016ledger.digitalbazaar.com/keys/cbp-key-1",
                        "http://dhs2016ledger.digitalbazaar.com/keys/ice-key-1",
                        "http://dhs2016ledger.digitalbazaar.com/keys/cis-key-1",
                        "http://dhs2016ledger.digitalbazaar.com/keys/tsa-key-1",
                        "http://dhs2016ledger.digitalbazaar.com/keys/fletc-key-1",
                        "http://dhs2016ledger.digitalbazaar.com/keys/fema-key-1",
                        "http://dhs2016ledger.digitalbazaar.com/keys/us-cert-key-1",
                        "http://dhs2016ledger.digitalbazaar.com/keys/occ-key-1",
                        "http://dhs2016ledger.digitalbazaar.com/keys/cg-key-1",
                        "http://dhs2016ledger.digitalbazaar.com/keys/ss-key-1"
                    ],
                    "minimumSignaturesRequired": 1
                }
            },
            "previousEvent": {
                "hash": "urn:sha256:0000000000000000000000000000000000000000000000000000000000000000"
            }
        };
        console.log("unsigned event defined", unsignedEvent);
        signIt(unsignedEvent, function(signedEvent, error) {
            if (signedEvent != null) {
                console.log("posting CREATE LEDGER event", signedEvent);
                postCode('/ledgers', signedEvent, callback);
            } else {
                console.log("darn", error);
            }
        });


    } catch(err) {
        console.log("caught error", err);
        callback(null, JSON.stringify(err));
    }

};

exports.handler_addToLedger = function(event, context, callback) {

    console.log("starting handler_addToLedger, event = ", event);

    var ledgerName = event.ledgerName;
    console.log("getting ledger info for ledger with name:", ledgerName);

    getLedgerInfoByName(ledgerName, function(ledgerInfo) {
        /*
         {
            "id":"http://dhs2016ledger.digitalbazaar.com/ledgers/zerz",
            "name":"zerz",
            "ledgerConfig":{
                "id":"did:d8b9c96b-24ad-4f65-8de8-845af344693f",
                "type":"LedgerConfiguration",
                "name":"zerz",
                "description":"zer",
                "storageMechanism":"SequentialList",
                "consensusAlgorithm":{
                    "type":"ProofOfSignature2016","approvedSigner":["http://dhs2016ledger.digitalbazaar.com/keys/cbp-key-1","http://dhs2016ledger.digitalbazaar.com/keys/ice-key-1","http://dhs2016ledger.digitalbazaar.com/keys/cis-key-1","http://dhs2016ledger.digitalbazaar.com/keys/tsa-key-1","http://dhs2016ledger.digitalbazaar.com/keys/fletc-key-1","http://dhs2016ledger.digitalbazaar.com/keys/fema-key-1","http://dhs2016ledger.digitalbazaar.com/keys/us-cert-key-1","http://dhs2016ledger.digitalbazaar.com/keys/occ-key-1","http://dhs2016ledger.digitalbazaar.com/keys/cg-key-1","http://dhs2016ledger.digitalbazaar.com/keys/ss-key-1"],"minimumSignaturesRequired":1}
                },
                "latestEvent":{
                    "id":"did:d8b9c96b-24ad-4f65-8de8-845af344693f/events/2","hash":"urn:sha256:197800217646643f6cc0772063f9a675d8c16fb62cda339a658db081c48813b8"
                },
                "nextEvent":{"id":"did:d8b9c96b-24ad-4f65-8de8-845af344693f/events/3"}
            }
         */

        console.log("info for ledger =", ledgerInfo);
        var newId = ledgerInfo.nextEvent.id;
        var previousEvent = {
            "id":ledgerInfo.latestEvent.id,
            "hash":ledgerInfo.latestEvent.hash
        };

        try {
            console.log("defining unsigned event to add stuff to the ledger");
            var did = uuid();
            //did =did.replace(/-/g, "");
            console.log("did=", did);
            var unsignedEvent = {

                "@context": [
                    "https://w3id.org/flex/v1",
                    {"@vocab": "https://w3id.org/banking#"}
                ],
                /*
                "@context": [
                    "https://w3id.org/flex/v1",
                    "https://w3id.org/dhs/v1"
                ],
                 */
                "id": newId,
                "type": "LedgerStorageEvent",
                "replacesObject": [
                    {
                        "id": "http://www.fatf-gafi.org/iban-clearinghouse/938121",
                        "type": [
                            "Credential",
                            "OpenBanking_PSD2_RegitryCredential"
                        ],
                        "claim": {
                            "id": "LEI:931566398328492910600",
                            "PISP": "Recognized Payment Initiation Service Provider",
                            "AISP": "Recognized Account Initiation Service Provider"
                        }
                    }
                ],
                "previousEvent": previousEvent
            };
            console.log("unsigned event defined", unsignedEvent);
            signIt(unsignedEvent, function(signedEvent, error) {
                if (signedEvent != null) {
                    console.log("posting STORE EVENT event", signedEvent);
                    postCode('/ledgers/' + ledgerName, signedEvent, callback);
                } else {
                    console.log("darn", error);
                }
            });
            console.log("signing fired");


        } catch(err) {
            console.log("caught error", err);
            callback(null, JSON.stringify(err));
        }
    })




};

console.log("handler - top - 4");