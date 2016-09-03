package com.threeandahalfroses.frs.model;

/**
 * @author patrizz on 02/09/16.
 * @copyright 2015 Three and a half Roses
 */
public class Account {

    Bank bank;
    Branch branch;
    String accountNumber;
    String iban;

    public Account(Bank bank, Branch branch, String accountNumber, String iban) {
        this.bank = bank;
        this.branch = branch;
        this.accountNumber = accountNumber;
        this.iban = iban;
    }

    public Bank getBank() {
        return bank;
    }

    public Branch getBranch() {
        return branch;
    }

    public String getIban() {
        return iban;
    }

    public String getAccountNumber() {
        return accountNumber;
    }
}
