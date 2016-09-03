package com.threeandahalfroses.frs.lambda;

/**
 * @author patrizz on 03/09/16.
 * @copyright 2015 Three and a half Roses
 */
public class ResponseFound extends RuntimeException {
    public ResponseFound(String uri) { super(uri); }
}
