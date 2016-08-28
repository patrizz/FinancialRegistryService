package com.threeandahalfroses.frs.lambda;

/**
 * @author patrizz on 27/08/16.
 * @copyright 2015 Three and a half Roses
 */
public class IbanGetRequest extends BaseRequest {
    private String iban;
    public IbanGetRequest(String iban) {
        this.iban = iban;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }
}
