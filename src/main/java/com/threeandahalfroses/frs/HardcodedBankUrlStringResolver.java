package com.threeandahalfroses.frs;

import com.threeandahalfroses.frs.model.Bank;
import com.threeandahalfroses.frs.model.Country;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * @author patrizz on 02/09/16.
 * @copyright 2015 Three and a half Roses
 */
public class HardcodedBankUrlStringResolver implements BankUrlStringResolver {

    String baseUrlString = "https://glozrhoqo9.execute-api.eu-west-1.amazonaws.com/dev/iban-detail?bankCode=%s&iban=%s";

    Map<String, Map> mappings = new HashMap<>();

    public HardcodedBankUrlStringResolver() {

        Map<String, String> belgianMappings = new HashMap<>();
        belgianMappings.put("001", "http://fortis.be2840.be?le-iban=%s");
        belgianMappings.put("310", "http://ing.be2840.be?de-iban=%s");


        Map<String, String> germanMappings = new HashMap<>();
        germanMappings.put("37040044", "http://commerzbank.be2840.be?der-iban=%s");

        mappings.put("BE", belgianMappings);
        mappings.put("DE", germanMappings);

    }


    @Override
    public String getUrlForBank(Bank bank, String ibanString) {
        if (bank == null) {
            return null;
        }
        String countryCode = bank.getCountry().getAlpha2();
        Map<String, String> bankCodeMappings = mappings.get(countryCode);
        if (bankCodeMappings != null) {
            String bankCode = bank.getBankCode();
            if (bankCode != null) {

                String urlString = bankCodeMappings.get(bankCode);
                urlString = baseUrlString;
                if (urlString != null) {
                    if (urlString.contains("%s")) {
                        try {
                            return String.format(
                                    urlString,
                                    URLEncoder.encode(bankCode, "UTF-8"),
                                    URLEncoder.encode(ibanString, "UTF-8")
                            );
                        } catch (UnsupportedEncodingException e) {
                            e.printStackTrace();
                        }
                    } else {
                        return urlString;
                    }
                }
            }
        }
        return null;
    }
}
