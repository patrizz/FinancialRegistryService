package com.threeandahalfroses.frs;

import com.threeandahalfroses.frs.model.Bank;
import com.threeandahalfroses.frs.model.Country;
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
        Bank bank = new Bank(new Country(alpha2, alpha3), bankCode, label);
        return bank;
    }

}
