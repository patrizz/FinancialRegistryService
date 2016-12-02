package com.threeandahalfroses.frs.lambda.flexledger;

/**
 * @author patrizz on 25/11/2016.
 * @copyright 2015 Three and a half Roses
 */
public class Flexledger {
    private final String id;
    private final String name;


    public Flexledger(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
