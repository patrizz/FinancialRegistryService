package com.threeandahalfroses.frs.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.threeandahalfroses.frs.BankUrlStringResolver;
import com.threeandahalfroses.frs.HardcodedBankUrlStringResolver;
import com.threeandahalfroses.frs.IbanUtility;
import com.threeandahalfroses.frs.model.Bank;
import com.threeandahalfroses.frs.model.Branch;
import org.json.simple.JSONAware;
import org.json.simple.JSONObject;

/**
 * @author patrizz on 27/08/16.
 * @copyright 2015 Three and a half Roses
 */
public class IbanRedirecterLambda implements RequestHandler<IbanGetRequest, JSONAware> {

    BankUrlStringResolver bankUrlStringResolver = new HardcodedBankUrlStringResolver();

    @Override
    public JSONAware handleRequest(IbanGetRequest ibanGetRequest, Context context) {
        Branch branch = IbanUtility.getBranch(ibanGetRequest.getIban());

        if (branch == null) {
            throw new BankNotFoundException("branch not found for iban", ibanGetRequest.getIban());
        }

        Bank bank = branch.getBank();
        if (bank == null) {
            throw new BankNotFoundException("bank not found for iban", ibanGetRequest.getIban());
        }

        String urlForBank = bankUrlStringResolver.getUrlForBank(bank, ibanGetRequest.getIban());

        JSONObject bankJSONObject = new JSONObject();
        bankJSONObject.put("bankCode", bank.getBankCode());
        bankJSONObject.put("branchCode", branch.getBranchCode());
        bankJSONObject.put("country", bank.getCountry().getAlpha3());
        bankJSONObject.put("label", bank.getLabel());
        bankJSONObject.put("url", urlForBank);
        bankJSONObject.put("location", urlForBank);
        return bankJSONObject;
    }
}
