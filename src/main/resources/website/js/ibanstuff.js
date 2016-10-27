/*------------------------------------------------------------------
 * Theme Name: HostRocket v2 Responsive HTML5 Landing page
 * Theme URI: http://www.brandio.io/envato/hostrocket-v2
 * Author: Brandio
 * Author URI: http://www.brandio.io/
 * Description: A Bootstrap Responsive HTML5 Landing page
 * Version: 1.0
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2016 Brandio.
 -------------------------------------------------------------------*/

function getCountryCode(ibanString) {
	return ibanString.substring(0,2).toUpperCase();
}

function getBankCode(ibanString) {

	var countryCode = getCountryCode(ibanString);
	var bankCode = '';
	if (countryCode == 'BE') {
		//BE10310112342345 --> 310
		bankCode = ibanString.trim().substring(5,8);
	} else if (countryCode == 'DE') {
		//DE89370400440532013000 --> 37040044
		bankCode = ibanString.substring(5,12);
	}
	return bankCode;
}




"use strict";
$(document).ready(function(){
    console.log("attaching handler to iban-form");

	$("#search-iban-left").click(function(e){
		//console.log("e", e);
		e.preventDefault();
		var ibanString = $("#domain-text-left").val();
		if (IBAN.isValid(ibanString)) {
			console.log("valid iban");
			var cc = getCountryCode(ibanString).toLowerCase();
			var bc = getBankCode(ibanString);

			var url = "https://" + cc + bc + ".thewearablebank.com/get-api";



			console.log("calling url: ", url);
			$.getJSON(url, function(data) {
				console.log("succes", data);
				if (data.api) {
					$.getJSON(data.api + "?iban=" + ibanString.replace(/ /g, '+'), function(ibanData) {
						console.log("iban data", ibanData);
						var configuration = {};

						var leDiv = $("#leResult");
						leDiv.empty();
						leDiv.append("<span>Bank Code : " + ibanData.bankCode + "</span>");
						leDiv.append("<span>IBAN : " + ibanData.iban + "</span>");
						leDiv.append("<span>Firstname : " + ibanData.firstname + "</span>");
						leDiv.append("<span>Lastname : " + ibanData.lastname + "</span>");


						var confirmA = $("<a href='#'>Confirm</a>");
						confirmA.click(function(e) {
							e.preventDefault();
							$("#leResult").css("opacity", "0");
							$("#leResult").css("z-index", "-100");
							$(".left .iban-form-holder").css("opacity", "1");
						});
						var span = $("<span></span>");
						span.append(confirmA);
						leDiv.append(span);
						leDiv.css("opacity", "1");
						$("#leResult").css("z-index", "100");
						$(".left .iban-form-holder").css("opacity", "0");



					});
				}
			}).done(function() {
				console.log( "second success" );
			}).fail(function(err) {
				console.log( "error", err );
			});

		} else {
			alert("invalid iban!");
		}


	});

    $("#iban-form").submit(function(e){
    	//console.log("e", e);
        e.preventDefault();
        var ibanString = $("#domain-text").val();
		if (IBAN.isValid(ibanString)) {
			console.log("valid iban");
			var cc = getCountryCode(ibanString).toLowerCase();
			var bc = getBankCode(ibanString);

			var url = "https://" + cc + bc + ".thewearablebank.com/get-api";



			console.log("calling url: ", url);
			$.getJSON(url, function(data) {
				console.log("succes", data);
				if (data.api) {
					$.getJSON(data.api + "?iban=" + ibanString.replace(/ /g, '+'), function(ibanData) {
						console.log("iban data", ibanData);
						var configuration = {};

						var leDiv = $("<div id='leResult' style='white-space:pre; width:600px; height:200px'></div>");

						$.featherlight(leDiv, configuration);

						$("#leResult").typed({
							strings: [
								"Calling url: " + url + "\n" +
								"DNS resolved it to: " + "https://glozrhoqo9.execute-api.eu-west-1.amazonaws.com/dev/iban" + "\n" +
								"Calling url: " + "https://glozrhoqo9.execute-api.eu-west-1.amazonaws.com/dev/iban" + "\n" +
								//"Result.^500.^500.^500.^500.^500.^500." + "\n" +
								"Result....." + "\n" +
								"Bank Code : " + ibanData.bankCode + "\n" +
								"IBAN      : " + ibanData.iban + "\n" +
								"Firstname : " + ibanData.firstname + "\n" +
								"Lastname  : " + ibanData.lastname + "\n" +
								"done...."
							],
							typeSpeed: 0
						});




					});
				}
			}).done(function() {
				console.log( "second success" );
			}).fail(function(err) {
				console.log( "error", err );
			});

		} else {
			alert("invalid iban!");
		}
        
        
    });
    console.log("attached handler to iban-form");
    console.log("attaching handler to search-iban");
    
    $("#search-iban").click(function(e){
    	e.preventDefault();
    	console.log("e", e);
        $("#iban-form").submit();
    });
    
    console.log("attached handler to iban-form");
    
    $("#iban-form").submit
});