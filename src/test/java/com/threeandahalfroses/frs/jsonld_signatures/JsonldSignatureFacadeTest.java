package com.threeandahalfroses.frs.jsonld_signatures;


import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.github.jsonldjava.core.JsonLdError;
import com.threeandahalfroses.commons.general.JSONUtility;
import org.jose4j.lang.JoseException;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import static org.junit.Assert.*;
import org.junit.Test;

import java.io.IOException;

/**
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class JsonldSignatureFacadeTest {
    @Test
    public void test_simple_sign_request() throws IOException, ParseException, java.text.ParseException, JoseException, JsonLdError {

        String jsonString = "{\n" +
                "  \"@context\": [\"http://schema.org/\", \"https://s3.eu-central-1.amazonaws.com/fridayonskype/public/security-v1.jsonld\"],\n" +
                "  \"description\": \"Hello world!\",\n" +
                "}\n";
        JSONObject jsonObject = JSONUtility.toJSONObjectFromString(jsonString);
        JsonldSignatureFacade jsonldSignatureFacade = new JsonldSignatureFacade(Region.getRegion(Regions.EU_CENTRAL_1), "fridayonskype", "private/private.pem");
        JSONObject result = jsonldSignatureFacade.sign(jsonObject, "secret/private_pcks8", "fridayonskype.com", "https://s3.eu-central-1.amazonaws.com/fridayonskype/public/public.pem");
        assertNotNull("result is null", result);
        assertNotNull("signature null", result.get("signature"));
    }

    @Test
    public void test_simple_verification() throws IOException, ParseException, java.text.ParseException, JoseException, JsonLdError {

        String jsonString = "{\n" +
                "  \"@context\": [\"http://schema.org/\", \"https://s3.eu-central-1.amazonaws.com/fridayonskype/public/security-v1.jsonld\"],\n" +
                "  \"description\": \"Hello world!\",\n" +
                "}\n";
        JSONObject jsonObject = JSONUtility.toJSONObjectFromString(jsonString);
        JsonldSignatureFacade jsonldSignatureFacade = new JsonldSignatureFacade(Region.getRegion(Regions.EU_CENTRAL_1), "fridayonskype", "private/private.pem");
        JSONObject result = jsonldSignatureFacade.sign(jsonObject, "secret/private_pcks8", "fridayonskype.com", "https://s3.eu-central-1.amazonaws.com/fridayonskype/public/public.pem");
        assertNotNull("result is null", result);
        assertNotNull("signature null", result.get("signature"));
        assertTrue("signature should be valid", jsonldSignatureFacade.verify(result, "secret/private_pcks8", "fridayonskype.com", "https://s3.eu-central-1.amazonaws.com/fridayonskype/public/public.pem"));
    }
}
