package com.threeandahalfroses.frs.model;

/**
 * @author patrizz on 28/08/16.
 * @copyright 2015 Three and a half Roses
 */
public class Branch {
    private Bank bank;
    private String branchCode;
    public Branch(String branchCode) {
        this.branchCode = branchCode;
    }

    public Branch(Bank bank, String branchCode) {
        this.bank = bank;
        this.branchCode = branchCode;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public Bank getBank() {
        return bank;
    }
}
