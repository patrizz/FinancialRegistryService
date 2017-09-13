package com.threeandahalfroses.frs.vc;

import org.json.simple.JSONObject;

/**
 *
 * https://json-ld.github.io/normalization/spec/
 *
 * @author Patrice Kerremans
 * @copyright 2014 Three and a half Roses
 */
public class Normalizer {
    JSONObject normalize(JSONObject jsonObject) {
        JSONObject normalizedJSONObject = new JSONObject(jsonObject);
        return normalizedJSONObject;
    }
}
