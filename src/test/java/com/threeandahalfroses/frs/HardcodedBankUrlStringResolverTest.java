package com.threeandahalfroses.frs;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * @author patrizz on 03/09/16.
 * @copyright 2015 Three and a half Roses
 */
public class HardcodedBankUrlStringResolverTest {

    @Test
    public void test_getFortis() {
        HardcodedBankUrlStringResolver resolver = new HardcodedBankUrlStringResolver();
        String urlString = resolver.getUrlForBank(IbanUtility.getBank("BE59 0012 1942 8426"), "BE59 0012 1942 8426");
        //assertEquals("wrong url", "http://fortis.be2840.be?le-iban=BE59+0012+1942+8426", urlString);

    }

}
