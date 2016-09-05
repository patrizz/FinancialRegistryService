package com.threeandahalfroses.frs.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.threeandahalfroses.frs.IbanUtility;
import com.threeandahalfroses.frs.Utility;
import org.apache.commons.lang3.StringUtils;
import org.iban4j.Iban;
import org.json.simple.JSONAware;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.io.IOException;

/**
 * @author patrizz on 05/09/16.
 * @copyright 2015 Three and a half Roses
 */
public class IbanDetailLambda  implements RequestHandler<IbanDetailGetRequest, JSONAware> {
    @Override
    public JSONAware handleRequest(IbanDetailGetRequest ibanDetailGetRequest, Context context) {
        try {
            System.out.println("start");
            String ibanString = ibanDetailGetRequest.getIban();
            System.out.println("iban: " + ibanString);
            Iban iban = IbanUtility.getIban(ibanString);
            String bankCode = ibanDetailGetRequest.getBankCode();
            System.out.println("bankCode" + bankCode);
            if (iban == null) {
                throw new RuntimeException("hm, not a good iban");
            }
            System.out.println(String.format("input = %s / %s", bankCode, iban.getBankCode()));
            if (StringUtils.equals(ibanDetailGetRequest.getBankCode(), iban.getBankCode())) {
                return Utility.loadResourceAsJSON("/" + ibanString.replaceAll(" ", "") + ".json");
            } else {
                throw new RuntimeException("wrong bank code");
            }
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("couldn't process request");
    }
}
