package com.threeandahalfroses.frs;

import org.json.simple.JSONAware;
import org.json.simple.parser.ParseException;
import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.*;

/**
 * @author patrizz on 06/09/16.
 * @copyright 2015 Three and a half Roses
 */
public class UtilityTest {
    @Test
    public void load_DE() throws IOException, ParseException {
        JSONAware jsonAware = Utility.loadResourceAsJSON("/DE89370400440532013000.json");
        assertNotNull("json null", jsonAware);
    }
}
