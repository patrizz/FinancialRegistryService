package com.threeandahalfroses.frs.model;

/**
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class Bank {
    private String bankCode;
    private String label;
    private Country country;
    public Bank(Country country, String bankCode, String label) {
        this.country = country;
        this.bankCode = bankCode;
        this.label = label;
    }

    public String getBankCode() {
        return bankCode;
    }

    public String getLabel() {
        return label;
    }

    public Country getCountry() {
        return country;
    }

}
