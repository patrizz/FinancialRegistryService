package com.threeandahalfroses.frs.lambda;

/**
 * @author patrizz on 28/08/16.
 * @copyright 2015 Three and a half Roses
 */
public class BankNotFoundException extends RuntimeException {
    public BankNotFoundException(String message, String iban) {
        super(message + iban);
    }
}
