package com.threeandahalfroses.frs;

import com.threeandahalfroses.frs.model.Bank;

/**
 * @author patrizz on 02/09/16.
 * @copyright 2015 Three and a half Roses
 */
public interface BankUrlStringResolver {
    String getUrlForBank(Bank bank, String iban);
}
