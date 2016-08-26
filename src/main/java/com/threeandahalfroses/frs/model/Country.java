package com.threeandahalfroses.frs.model;

/**
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class Country {
    private String alpha2;
    private String alpha3;
    public Country(String alpha2, String alpha3) {
        this.alpha2 = alpha2;
        this.alpha3 = alpha3;
    }

    public String getAlpha2() {
        return alpha2;
    }

    public String getAlpha3() {
        return alpha3;
    }
}
