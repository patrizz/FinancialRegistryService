package com.threeandahalfroses.frs.vc;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

/**
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class SignerVerifier {

    

    public static int main(String[] arguments) throws IOException, ParseException {

        InputStream inputStream = SignerVerifier.class.getResourceAsStream("/claims/claim.json");
        Reader reader = new InputStreamReader(inputStream);
        JSONObject jsonObject = (JSONObject) (new JSONParser()).parse(reader);

        Signer signer = new Signer();
        //signer.sign(jsonObject);

        return 0;
    }
}
