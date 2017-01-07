package com.threeandahalfroses.frs.lambda.payment;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.threeandahalfroses.frs.lambda.FlexledgerManager;
import com.threeandahalfroses.frs.lambda.flexledger.Flexledger;
import com.threeandahalfroses.frs.lambda.iban.IbanDetailGetRequest;
import org.json.simple.JSONAware;
import org.json.simple.JSONObject;

import java.util.NoSuchElementException;

/**
 * @author patrizz on 14/12/2016.
 * @copyright 2015 Three and a half Roses
 */
public class PaymentLambda  implements RequestHandler<PaymentRequest, JSONAware> {
    private static final String FLEX_LEDGER = "TWB_LEDGER";

    @Override
    public JSONAware handleRequest(PaymentRequest paymentRequest, Context context) {

        FlexledgerManager flexledgerManager = new FlexledgerManager();
        Flexledger flexledger = null;
        try {
            flexledgerManager.getFlexledger(FLEX_LEDGER);
        } catch(NoSuchElementException NSEe) {
            if (flexledgerManager.createFlexledger(FLEX_LEDGER)) {
                flexledger = flexledgerManager.getFlexledger(FLEX_LEDGER);
                //flexledgerManager.addParty("amazon.com");
            }
        }

        return null;
    }
}
