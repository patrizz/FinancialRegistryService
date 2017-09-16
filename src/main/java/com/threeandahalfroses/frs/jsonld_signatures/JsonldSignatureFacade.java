package com.threeandahalfroses.frs.jsonld_signatures;

import com.amazonaws.regions.Region;
import com.amazonaws.services.s3.AmazonS3Client;
import com.github.jsonldjava.core.JsonLdError;
import com.threeandahalfroses.commons.aws.s3.S3Utility;
import com.threeandahalfroses.commons.general.Utility;
import info.weboftrust.ldsignatures.LdSignature;
import info.weboftrust.ldsignatures.signer.RsaSignature2017LdSigner;
import org.apache.commons.codec.binary.Base64;
import org.jose4j.lang.JoseException;
import org.json.simple.JSONObject;

import javax.xml.bind.DatatypeConverter;
import java.io.BufferedReader;
import java.io.StringReader;
import java.net.URI;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Random;

/**
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class JsonldSignatureFacade {
    public static final String CREATE_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssZ";
    private S3Utility s3Utility;
    private String bucketname;

    public JsonldSignatureFacade(Region region, String bucketname, String privateKeyKey) {
        AmazonS3Client amazonS3Client = new AmazonS3Client();
        amazonS3Client.setRegion(region);
        s3Utility = new S3Utility(amazonS3Client);
        this.bucketname = bucketname;
    }

    public JSONObject sign(JSONObject jsonldObjectToSign, String privateKeyOnS3, String domain, String creator) throws JsonLdError, ParseException, JoseException {

        JSONObject signedJsonldObject = new JSONObject(jsonldObjectToSign);
        URI creatorUri = URI.create(creator);
        String created = (new SimpleDateFormat(CREATE_DATE_FORMAT)).format(new Date());
        String nonce = String.valueOf (Math.abs((new Random()).nextInt()));

        RsaSignature2017LdSigner signer = new RsaSignature2017LdSigner(
                toLinkedHashMap(jsonldObjectToSign),
                getPrivateKeyFromS3(privateKeyOnS3),
                creatorUri,
                created,
                domain,
                nonce
        );
        LdSignature ldSignature = signer.buildLdSignature();
        LinkedHashMap<String, Object> jsonLdSignatureObject = ldSignature.buildJsonLdSignatureObject();
        JSONObject signatureObject = new JSONObject();
        for (String key:jsonLdSignatureObject.keySet()) {
            signatureObject.put(key, jsonLdSignatureObject.get(key));
        }
        signedJsonldObject.put("signature", signatureObject);
        return signedJsonldObject;
    }

    public boolean verify(JSONObject jsonObjectToVerify, String privateKeyOnS3, String domain, String creator) throws ParseException, JoseException, JsonLdError {
        if (jsonObjectToVerify != null && jsonObjectToVerify.get("signature") != null) {
            JSONObject signatureObject = (JSONObject) jsonObjectToVerify.get("signature");
            String signatureValueToVerify = (String) signatureObject.get("signatureValue");

            URI creatorToVerify = (URI) signatureObject.get("creator");
            if (!creator.equals(creatorToVerify.toString())) {
                throw new RuntimeException("wrong creator");
            }
            String created = (String) signatureObject.get("created");
            String domainToVerify = (String) signatureObject.get("domain");
            if (!domain.equals(domainToVerify)) {
                throw new RuntimeException("wrong domain");
            }
            String nonce = (String) signatureObject.get("nonce");
            jsonObjectToVerify.remove("signature");
            RsaSignature2017LdSigner signer = new RsaSignature2017LdSigner(
                    toLinkedHashMap(jsonObjectToVerify),
                    getPrivateKeyFromS3(privateKeyOnS3),
                    creatorToVerify,
                    created,
                    domainToVerify,
                    nonce
            );
            LdSignature ldSignature = signer.buildLdSignature();
            LinkedHashMap<String, Object> jsonLdSignatureObject = ldSignature.buildJsonLdSignatureObject();
            Object signature = jsonLdSignatureObject.get("signatureValue");
            return signature != null && signatureValueToVerify != null && signatureValueToVerify.equals(signature);
        }
        return false;
    }

    private LinkedHashMap<String, Object> toLinkedHashMap(JSONObject jsonldObjectToSign) {
        LinkedHashMap<String, Object> linkedHashMap = new LinkedHashMap<String, Object>();
        for (Object key:jsonldObjectToSign.keySet()) {
            linkedHashMap.put((String) key, jsonldObjectToSign.get(key));
        }
        return linkedHashMap;
    }

    private RSAPublicKey getPublicKeyFromHttp(URL publicKeyUri) {
        //https://s3.eu-central-1.amazonaws.com/fridayonskype/public/public.pem
        try {

            String pem = Utility.loadAsString(publicKeyUri);
            pem = pem.replace("-----BEGIN PUBLIC KEY-----", "").replace("\n", "");
            pem = pem.replace("-----END PUBLIC KEY-----", "");

            byte[] encoded = Base64.decodeBase64(pem);

            X509EncodedKeySpec spec = new X509EncodedKeySpec(encoded);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return (RSAPublicKey) keyFactory.generatePublic(spec);
        } catch (Exception ex) {

            throw new RuntimeException(ex.getMessage(), ex);
        }

    }

    private RSAPrivateKey getPrivateKeyFromS3(String privateKeyOnS3) {
        RSAPrivateKey privateKey;
        try {

            String temp = s3Utility.loadAsString(this.bucketname, privateKeyOnS3);

            //TODO care about the linefeeds
            BufferedReader br = new BufferedReader(new StringReader(temp));
            StringBuilder builder = new StringBuilder();
            boolean inKey = false;
            for (String line = br.readLine(); line != null; line = br.readLine()) {
                if (!inKey) {
                    if (line.startsWith("-----BEGIN ") &&
                            line.endsWith(" PRIVATE KEY-----")) {
                        inKey = true;
                    }
                    continue;
                }
                else {
                    if (line.startsWith("-----END ") &&
                            line.endsWith(" PRIVATE KEY-----")) {
                        inKey = false;
                        break;
                    }
                    builder.append(line);
                }
            }
            //
            byte[] encoded = DatatypeConverter.parseBase64Binary(builder.toString());
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PrivateKey key = kf.generatePrivate(keySpec);
            return (RSAPrivateKey) key;
        } catch (Exception ex) {

            throw new RuntimeException(ex.getMessage(), ex);
        }
    }


}
