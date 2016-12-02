package com.threeandahalfroses.frs.lambda.iban;

/**
 * @author patrizz on 05/09/16.
 * @copyright 2015 Three and a half Roses
 */
public class IbanDetailGetRequest {

    private String bankCode;
    private String iban;

    public IbanDetailGetRequest() {
        super();
    }

    public IbanDetailGetRequest(String bankCode, String iban) {
        this.bankCode = bankCode;
        this.iban = iban;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }
}
