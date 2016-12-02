package com.threeandahalfroses.frs.lambda.flexledger;

import org.apache.http.client.HttpClient;
import org.apache.http.client.utils.HttpClientUtils;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

/**
 * @author patrizz on 25/11/2016.
 * @copyright 2015 Three and a half Roses
 */
public class FlexledgerManagerTest {

    private FlexledgerManager flexledgerManager;

    @Before
    public void setup() {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        flexledgerManager = new FlexledgerManager(httpclient);
    }

    @Test
    public void test_list() {
        List<Flexledger> flexledgers = flexledgerManager.getflexledgers();
        assertNotNull("flexledgers null", flexledgers);
        assertTrue("flexledgers empty", flexledgers.size()>0);
    }


    public void test_create() {
        boolean success = flexledgerManager.createFlexledger("patrice");
        assertTrue("create ledger failed", success);
    }
    @Test
    public void test_get() {
        Flexledger flexledger = flexledgerManager.getFlexledger("stephane");
        assertNotNull("get ledger failed", flexledger);
    }

}
