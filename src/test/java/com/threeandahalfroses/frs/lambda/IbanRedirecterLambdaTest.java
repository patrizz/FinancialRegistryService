package com.threeandahalfroses.frs.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.threeandahalfroses.frs.lambda.iban.IbanGetRequest;
import com.threeandahalfroses.frs.lambda.iban.IbanRedirecterLambda;
import org.json.simple.JSONAware;
import org.json.simple.JSONObject;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * @author patrizz on 28/08/16.
 * @copyright 2015 Three and a half Roses
 */
public class IbanRedirecterLambdaTest {

    @Test
    public void test_handleRequest_BE() {
        IbanRedirecterLambda ibanRedirecterLambda = new IbanRedirecterLambda();
        IbanGetRequest request = new IbanGetRequest("BE59 0012 1942 8426");
        Context context = null;
        JSONAware jsonAware = ibanRedirecterLambda.handleRequest(request, context);
        assertNotNull("response is null", jsonAware);
        assertTrue("wrong type of response", jsonAware instanceof JSONObject);
        JSONObject jsonObject = (JSONObject) jsonAware;
        assertEquals("bank code is wrong", "001", jsonObject.get("bankCode"));
    }

    @Test
    public void test_handleRequest_DE() {
        IbanRedirecterLambda ibanRedirecterLambda = new IbanRedirecterLambda();
        IbanGetRequest request = new IbanGetRequest("DE89 3704 0044 0532 0130 00");
        Context context = null;
        JSONAware jsonAware = ibanRedirecterLambda.handleRequest(request, context);
        assertNotNull("response is null", jsonAware);
        assertTrue("wrong type of response", jsonAware instanceof JSONObject);
        JSONObject jsonObject = (JSONObject) jsonAware;
        assertEquals("bank code is wrong", "37040044", jsonObject.get("bankCode"));
    }

    @Test
    public void test_handleRequest_GR() {
        IbanRedirecterLambda ibanRedirecterLambda = new IbanRedirecterLambda();
        IbanGetRequest request = new IbanGetRequest("GR73 0380 1150 0000 0000 1208 017");
        Context context = null;
        JSONAware jsonAware = ibanRedirecterLambda.handleRequest(request, context);
        assertNotNull("response is null", jsonAware);
        assertTrue("wrong type of response", jsonAware instanceof JSONObject);
        JSONObject jsonObject = (JSONObject) jsonAware;
        assertEquals("bank code is wrong", "038", jsonObject.get("bankCode"));
        assertEquals("branch code is wrong", "0115", jsonObject.get("branchCode"));
    }
}
