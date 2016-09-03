package com.threeandahalfroses.frs;

import com.threeandahalfroses.frs.model.Bank;
import org.iban4j.Iban;
import org.iban4j.IbanFormatException;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class IbanUtilityTest {


    @Test
    public void test_getBank_be2() {
        Iban iban = IbanUtility.getIban("BE10 3101 1234 2345");
        assertNotNull("iban is null", iban);
    }

    @Test
    public void test_getIban() {
        Iban iban = IbanUtility.getIban("DE89 3704 0044 0532 0130 00");
        assertNotNull("iban is null", iban);
    }

    @Test
    public void test_getIban_forNullString() {
        try {
            Iban iban = IbanUtility.getIban(null);
            fail("expecting nullpointer exception");
        } catch(NullPointerException NPe) {
            //expected
        }
    }


    @Test
    public void test_getIban_forGarbageString() {
        try {
            Iban iban = IbanUtility.getIban("'h\"§g\"k'(hjg§\"'kh(j§'");
            fail("expecting parse exception exception");
        } catch(IbanFormatException IFe) {
            //expected
        }
    }


    @Test
    public void test_getBank_BE() {
        Bank bank = IbanUtility.getBank("BE59 0012 1942 8426");
        assertNotNull("bank is null", bank);
        assertNotNull("country null", bank.getCountry());
        assertEquals("wrong country", "BE", bank.getCountry().getAlpha2());
        assertEquals("wrong bank code", "001", bank.getBankCode());
    }

    @Test
    public void test_getBank_DE() {
        Bank bank = IbanUtility.getBank("DE89 3704 0044 0532 0130 00");
        assertNotNull("bank is null", bank);
        assertNotNull("country null", bank.getCountry());
        assertEquals("wrong country", "DE", bank.getCountry().getAlpha2());
        assertEquals("wrong bank code", "37040044", bank.getBankCode());
    }

}
