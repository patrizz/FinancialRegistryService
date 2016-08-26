package com.threeandahalfroses.frs.model;

import java.util.Locale;

/**
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class Bank {
    private String bankId;
    private String label;
    private Country country;
    public Bank(Country country, String bankId, String label) {
        this.country = country;
        this.bankId = bankId;
        this.label = label;
    }

    public String getBankId() {
        return bankId;
    }

    public String getLabel() {
        return label;
    }

    public Country getCountry() {
        return country;
    }
}
