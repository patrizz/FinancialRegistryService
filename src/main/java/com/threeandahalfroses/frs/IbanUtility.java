package com.threeandahalfroses.frs;

import com.threeandahalfroses.frs.model.Bank;
import com.threeandahalfroses.frs.model.Branch;
import com.threeandahalfroses.frs.model.Country;
import org.apache.poi.ss.formula.functions.Count;
import org.iban4j.Iban;
import org.iban4j.IbanFormat;

import java.util.Locale;

/**
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class IbanUtility {

    public static Iban getIban(String fromString) {
        Iban iban = Iban.valueOf(fromString, IbanFormat.Default);
        return iban;
    }

    public static Bank getBank(String fromIbanString) {
        Iban iban = getIban(fromIbanString);

        String bankCode = iban.getBankCode();
        String label = "-"; //todo look up somewhere
        String alpha2 = iban.getCountryCode().getAlpha2();
        String alpha3 = iban.getCountryCode().getAlpha3();
        Country country = new Country(alpha2, alpha3);
        Bank bank = new Bank(country, bankCode, label);
        return bank;
    }

    public static Branch getBranch(String fromIbanString) {
        Iban iban = getIban(fromIbanString);

        String bankCode = iban.getBankCode();
        String label = "-"; //todo look up somewhere
        String alpha2 = iban.getCountryCode().getAlpha2();
        String alpha3 = iban.getCountryCode().getAlpha3();
        Country country = new Country(alpha2, alpha3);
        Branch bank = new Branch(new Bank(country, bankCode, label), iban.getBranchCode());
        return bank;
    }
}
