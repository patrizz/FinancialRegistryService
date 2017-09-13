package com.threeandahalfroses.frs.vc;

import org.apache.commons.validator.UrlValidator;
import org.json.simple.JSONObject;

import java.util.Date;

/**
 *
 * https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm
 *
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class Signer {

    public JSONObject sign(
            String privateKey,
            String creator,
            Date date,
            String domain,
            String nonce,
            JSONLDSignatureAlgorithm algorithm,
            JSONObject jsonObject) {
        /*
        "signature": {
            "type": "LinkedDataSignature2015",
            "created": "2016-06-18T21:19:10Z",
            "creator": "https://example.com/jdoe/keys/1",
            "domain": "json-ld.org",
            "nonce": "598c63d6",
            "signatureValue": "BavEll0/I1zpYw8XNi1bgVg/sCneO4Jugez8RwDg/+
            MCRVpjOboDoe4SxxKjkCOvKiCHGDvc4krqi6Z1n0UfqzxGfmatCuFibcC1wps
            PRdW+gGsutPTLzvueMWmFhwYmfIFpbBu95t501+rSLHIEuujM/+PXr9Cky6Ed
            +W3JT24="
          }
         */
        /*
        var privateKeyPem = options.privateKeyPem;
        var privateKeyWif = options.privateKeyWif;
        var creator = options.creator;
        var date = options.date || new Date();
        var domain = options.domain || null;
        var nonce = options.nonce || null;
        var algorithm = options.algorithm || 'GraphSignature2012';
        */

        JSONObject signedJsonObject = new JSONObject(jsonObject);
        Normalizer normalizer = new Normalizer();
        JSONObject normalizedJsonObject = normalizer.normalize(signedJsonObject);
        if (!isValidUrl(creator)) {
            throw new RuntimeException("invalid creator");
        }

        switch (algorithm) {
            case EcdsaKoblitzSignature2016:
            case GraphSignature2012:
                throw new RuntimeException("unsupported algorithm: " + algorithm.name());
            case LinkedDataSignature2015: {
                
            }
        }
        
        return signedJsonObject;
    }

    public boolean isValidUrl(String urlString) {
        String[] schemes = {"http","https"};
        UrlValidator urlValidator = new UrlValidator(schemes);
        return (urlValidator.isValid(urlString));
    }

}
