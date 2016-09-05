package com.threeandahalfroses.frs;

import org.apache.commons.io.IOUtils;
import org.json.simple.JSONAware;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;

/**
 * @author patrizz on 05/09/16.
 * @copyright 2015 Three and a half Roses
 */
public class Utility {

    public static JSONAware loadResourceAsJSON(String resourceName) throws IOException, ParseException {
        JSONParser jsonParser = new JSONParser();
        String resourceString = loadResourceAsString(resourceName);
        return (JSONAware) jsonParser.parse(resourceString);
    }

    public static String loadResourceAsString(String resourceName) throws IOException {
        InputStream inputStream = Utility.class.getResourceAsStream(resourceName);
        try {
            if (inputStream == null) {
                return null;
            }
            String string = loadInputStreamAsString(inputStream);
            return string;
        } finally {
            inputStream.close();
        }
    }

    public static String loadInputStreamAsString(InputStream inputStream) throws IOException {
        return loadInputStreamAsString(inputStream, "UTF-8");
    }

    public static String loadInputStreamAsString(InputStream inputStream, String encoding) throws IOException {
        return IOUtils.toString(inputStream, encoding);
    }

}
