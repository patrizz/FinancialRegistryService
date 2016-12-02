package com.threeandahalfroses.frs.lambda.flexledger;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.threeandahalfroses.frs.lambda.iban.IbanDetailGetRequest;
import org.json.simple.JSONAware;

/**
 * @author patrizz on 25/11/2016.
 * @copyright 2015 Three and a half Roses
 */
public class FlexLedgerHandler implements RequestHandler<JSONAware, JSONAware> {

    @Override
    public JSONAware handleRequest(JSONAware request, Context context) {



        return null;
    }
}
