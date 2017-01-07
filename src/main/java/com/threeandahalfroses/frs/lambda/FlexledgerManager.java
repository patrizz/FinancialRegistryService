package com.threeandahalfroses.frs.lambda;

import com.threeandahalfroses.commons.general.JSONUtility;
import com.threeandahalfroses.commons.general.Utility;
import com.threeandahalfroses.frs.lambda.flexledger.Flexledger;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.io.InputStream;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * @author patrizz on 25/11/2016.
 * @copyright 2015 Three and a half Roses
 */
public class FlexledgerManager {
    private static Logger LOGGER = LogManager.getLogger(FlexledgerManager.class);
    private HttpClient httpClient = null;




    public FlexledgerManager() {
        this(HttpClients.createDefault());
    }

    public FlexledgerManager(HttpClient httpClient) {
        this.httpClient = httpClient;
    }

    public Flexledger getFlexledger(String name) {
        List<Flexledger> flexledgers = getflexledgers();
        for (Flexledger flexledger : flexledgers) {
            if (StringUtils.equals(flexledger.getName(), name)) {
                return flexledger;
            }
        }
        throw new NoSuchElementException(String.format("ledger with name '%s' not found", name));
    }

    public boolean createFlexledger(String name) {

        String bodyContent = "";
        try {
            bodyContent = IOUtils.toString(getClass().getResourceAsStream("/create_ledger.json"));
            bodyContent = bodyContent.replaceAll("%name%", name);
            bodyContent = bodyContent.replaceAll("%did%", Utility.generateUniqueId());
            LOGGER.debug("sending content: " + bodyContent);
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(bodyContent);

        } catch (IOException e) {
            LOGGER.error(e);
        } catch (NoSuchAlgorithmException e) {
            LOGGER.error(e);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        HttpPost httpPost = new HttpPost("http://dhs2016ledger.digitalbazaar.com/ledgers");
        HttpEntity entity = null;
        entity = new StringEntity(bodyContent, ContentType.APPLICATION_JSON);
        httpPost.setEntity(entity);
        try {
            HttpResponse httpResponse = httpClient.execute(httpPost);
            if (httpResponse.getStatusLine().getStatusCode() == 201) {
                HttpEntity responseEntity = httpResponse.getEntity();
                InputStream inputStream = responseEntity.getContent();
                String jsonString = IOUtils.toString(inputStream);
                LOGGER.debug("response: " + jsonString);
                return true;
            } else {
                HttpEntity responseEntity = httpResponse.getEntity();
                InputStream inputStream = responseEntity.getContent();
                String responseString = IOUtils.toString(inputStream);
                LOGGER.debug("error response: " + responseString);

            }
        } catch(Exception e) {
            LOGGER.error(e);
        }
        return false;

    }

    public List<Flexledger> getflexledgers() {
        List<Flexledger> flexledgers = new ArrayList<>();
        HttpUriRequest httpUriRequest = new HttpGet("http://dhs2016ledger.digitalbazaar.com/ledgers");
        httpUriRequest.addHeader("Accept", "application/ld+json, application/json, text/plain, */*");
        try {
            HttpResponse httpResponse = httpClient.execute(httpUriRequest);
            if (httpResponse.getStatusLine().getStatusCode() == 200) {
                HttpEntity entity = httpResponse.getEntity();
                InputStream inputStream = entity.getContent();
                String jsonString = IOUtils.toString(inputStream);
                //LOGGER.debug("response: " + jsonString);
                JSONParser jsonParser = new JSONParser();
                JSONObject ledgerJSONObject = (JSONObject) jsonParser.parse(jsonString);
                JSONArray jsonArray = (JSONArray) ledgerJSONObject.get("ledger");
                if (jsonArray == null) {
                    LOGGER.debug("response is null");
                } else {
                    LOGGER.debug("response: " + jsonArray.toJSONString());
                }
                IOUtils.closeQuietly(inputStream);

                for (int i = 0; i < jsonArray.size(); i++) {
                    JSONObject flexledgerJSONObject = (JSONObject) jsonArray.get(i);
                    Flexledger flexledger = new Flexledger(
                            (String) flexledgerJSONObject.get("id"),
                            (String) flexledgerJSONObject.get("name")
                    );

                    flexledgers.add(flexledger);
                }
            } else {
                LOGGER.info("error loading ledgers: " + httpResponse.getStatusLine().getStatusCode());
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return flexledgers;
    }


    public void addParty(Flexledger flexledger, String partyName) {

        JSONObject jsonObject = (JSONObject) JSONUtility.loadJSON("/add_party.json");
        try {
            jsonObject.put("id", Utility.generateUniqueId());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

    }
}
