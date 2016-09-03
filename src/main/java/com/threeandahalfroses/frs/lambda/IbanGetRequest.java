package com.threeandahalfroses.frs.lambda;

/**
 * @author patrizz on 27/08/16.
 * @copyright 2015 Three and a half Roses
 */
public class IbanGetRequest extends BaseRequest {

    private Boolean redirect = Boolean.FALSE;
    private String iban;

    public IbanGetRequest() {
        super();
    }

    public IbanGetRequest(String iban) {
        this(iban, Boolean.FALSE);
    }

    public IbanGetRequest(String iban, Boolean redirect) {
        this.redirect = redirect; this.iban = iban;
    }

    public Boolean getRedirect() {
        return redirect;
    }

    public void setRedirect(Boolean redirect) {
        this.redirect = redirect;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }
}
