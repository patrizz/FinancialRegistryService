//https://github.com/TylerPachal/lambda-node-phantom/blob/master/README.md

console.log("handler - top - 1");

var sleep = require('sleep-promise');

var querystring = require('querystring');

var uuid = require("uuid");
var http = require('http');

var jsonld = require('jsonld');
var jsig = require('jsonld-signatures');
jsig.use('jsonld', jsonld);

var keys = require('./keys');

var serviceUrl = "http://dhs2016ledger.digitalbazaar.com/ledgers";

console.log("handler - top - 2");


function getLedgerInfoByName(ledgerName, ledgerInfoCB, cookiejar) {
    //http://dhs2016ledger.digitalbazaar.com/ledgers/<name>
    console.log("getLedgerInfoByName for ledgerName: " + ledgerName);
    console.log("getLedgerInfoByName cookiejar before call: ", cookiejar);
    var httpRequest = {
        hostname: 'dhs2016ledger.digitalbazaar.com',
        port: 80,
        path: '/ledgers/'+ledgerName,
        agent: false  // create a new agent just for this one request
    };

    if (cookiejar) {
        httpRequest.headers = {
            "Cookie": "XSRF-TOKEN="+cookiejar["XSRF-TOKEN"],
            "XSRF-TOKEN": cookiejar["XSRF-TOKEN"]
        };
        console.log("headers:", httpRequest.headers);
    }


    http.get(
        httpRequest,
        function(response) {

        console.log("resonse: ", response);
        console.log("resonse headers: ", response.headers);

        var cookiejar = [];

        var setcookie = response.headers["set-cookie"];

        console.log("setcookie: ", setcookie);

        if ( setcookie ) {
            setcookie.forEach(
                function ( cookiestr ) {
                    cookiejar.push(cookiestr);
                }
            );
        }

        console.log("getLedgerInfoByName cookiejar after call: ", cookiejar);

        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            console.log("body=", body);

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            ledgerInfoCB(parsed, cookiejar);
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

    getLedgerInfoByName(ledgerName, function(ledgerInfo, cookies) {
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
                            "name": "Azamon Ltd",
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

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

function loadEvent(ledgerName, eventid, cookiejar, loadEventCallback) {
    console.log("loading event with id '" + eventid, cookiejar);
    var httpRequest = {
        hostname: 'dhs2016ledger.digitalbazaar.com',
        port: 80,
        path: '/ledgers/' + ledgerName + "/" + eventid,
        agent: false,  // create a new agent just for this one request
    };

    var token = uuid();

    httpRequest.headers = {
        "Cookie": "XSRF-TOKEN="+token,
        "XSRF-TOKEN": token,
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json, application/json, text/plain, */*',
        //'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.8,de;q=0.6,es;q=0.4,fr;q=0.2,nl;q=0.2',
        'Origin': 'http://dhs2016ledger.digitalbazaar.com',
        'Referer': 'http://dhs2016ledger.digitalbazaar.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
    };
    console.log("headers:", httpRequest.headers);


    console.log("request: ", httpRequest);

    http.get(httpRequest, function (response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {

            console.log("body: ", body);

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            console.log("calling loadEventCallback: ", parsed);
            loadEventCallback(parsed);
        });
    });


}

exports.handler_findTppClaim = function(event, context, handlerCallback) {

    console.log("starting handler_findTppClaim, event = ", event);

    var ledgerName = event.ledgerName;
    var tppId = event.tppId;
    console.log("finding event info on ledger with name:", ledgerName);
    console.log("finding event info for ttp with id:", tppId);

    var cookiejar = [];
    cookiejar["XSRF-TOKEN"]=uuid();

    var betterHandlerCallback = function(errorObject, successObject) {
        if (typeof(errorObject) != "undefined" && errorObject != null) {
            handlerCallback(JSON.stringify(errorObject));
            return;
        }
        if (typeof(successObject) != "undefined" && successObject != null) {
            handlerCallback(null, JSON.stringify(successObject));
            return;
        }
    };

    getLedgerInfoByName(ledgerName, function(ledgerInfo, cookiejar) {
        console.log("info for ledger =", ledgerInfo);
        var eventLoaderUntilClaimFound = function(event) {
            console.log("visiting event: ", event);
            if (event != null && typeof(event) != "undefined") {
                if (typeof(event.replacesObject) != "undefined") {
                    console.log("replaces object defined", event.replacesObject);
                    if (typeof(event.replacesObject[0].claim) != "undefined") {
                        console.log("claim defined", event.replacesObject[0].claim);
                        if (typeof(event.replacesObject[0].claim.id) != "undefined") {
                            console.log("claim id defined", event.replacesObject[0].claim.id);
                            if (event.replacesObject[0].claim.id.localeCompare(tppId) === 0) {
                                console.log("id defined and matching the tppId requested, returning claim");
                                betterHandlerCallback(null, event.replacesObject[0].claim);
                                return;
                            } else {
                                console.log("id not matching");
                                //do not call callback here don't stop here, we need to go tp next if/then check!  Maybe the previous event is a match!!
                            }
                        } else {
                            console.log("claim id NOT defined");
                        }
                    } else {
                        console.log("no claim defined");
                        betterHandlerCallback({"error":"no claim defined"});
                        return;
                    }
                } else {
                    console.log("no replaces object defined");
                    betterHandlerCallback({"error":"no replaces object defined"});
                    return;
                }
                if (typeof(event.previousEvent) != "undefined") {
                    console.log("previousEvent defined");
                    if (typeof(event.previousEvent.id) != "undefined") {
                        console.log("id defined");

                        loadEvent(
                            ledgerInfo.name,
                            event.previousEvent.id,
                            cookiejar,
                            eventLoaderUntilClaimFound
                        )

                    } else {
                        console.log("id not defined");
                        betterHandlerCallback({"error":"previousEvent.id defined"});
                        return;
                    }
                } else {
                    console.log("no previousEvent defined");
                    betterHandlerCallback({"error":"previousEvent defined"});
                    return;
                }
            } else {
                console.log("event==null");
                betterHandlerCallback({"error":"event is null"});
                return;
            }
            betterHandlerCallback({"error":"the impossible happened.  This line should be unreachable..."});
            return;
        };
        try {
            console.log("getting first event from ledgerInfo: ", ledgerInfo);
            if (typeof(ledgerInfo.latestEvent) != "undefined") {
                loadEvent(
                    ledgerInfo.name,
                    ledgerInfo.latestEvent.id,
                    cookiejar,
                    eventLoaderUntilClaimFound
                )
            } else {
                console.log("failed to get latest event from ledgerInfo");
            }
            console.log("getting first event with cookiejar: ", cookiejar);



        } catch(err) {
            console.log("caught error", err);
            betterHandlerCallback(err);
        }
    }, cookiejar)




};

console.log("handler - top - 5");