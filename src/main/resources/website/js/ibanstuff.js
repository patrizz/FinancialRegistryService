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

function mapAliasToIBAN(alias) {
	if (alias == "Stephane") {
		return "BE69 3101 5432 1234";
	}
}


function flyBillFromL2R(callback) {
	$(".euro-bill-left").css("left", "0px");
	$(".euro-bill-left").fadeIn(1000, function() {
		$(".euro-bill-left").animate({left: "+=500"}, 1000);
		$(".euro-bill-left").fadeOut(1000, function() {
			callback();
		});
	});
}

function flyBillFromR2L(callback) {
	$(".euro-bill-right").css("left", "220px");
	$(".euro-bill-right").fadeIn(1000, function() {
		$(".euro-bill-right").animate({left: "-=500"}, 1000);
		$(".euro-bill-right").fadeOut(1000, function() {
			callback();
		});
	});

}


"use strict";
$(document).ready(function(){
    console.log("attaching handler to iban-form");



	$("#use-case-text-left-more-button").click(function() {
		console.log("left button clicked");
		if ($("#use-case-text-left-more-text").data("hidden")) {
			console.log("data hidden true");
			$("#use-case-text-left-more-text").data("hidden", false);
			$("#use-case-text-left-more-button").prop('disabled', true);
			$("#use-case-text-left-more-text").fadeIn(function() {
				$("#use-case-text-left-more-button").prop('disabled', false);
				$("#use-case-text-left-more-button").text("less");
			});
		} else {
			console.log("data hidden false");
			$("#use-case-text-left-more-text").data("hidden", true);
			$("#use-case-text-left-more-button").prop('disabled', true);
			$("#use-case-text-left-more-text").fadeOut(function() {
				$("#use-case-text-left-more-button").prop('disabled', false);
				$("#use-case-text-left-more-button").text("more");
			});
		}
	});

	$("#use-case-text-right-more-button").click(function() {
		console.log("right button clicked");
		if ($("#use-case-text-right-more-text").data("hidden")) {
			console.log("data hidden true");
			$("#use-case-text-right-more-text").data("hidden", false);
			$("#use-case-text-right-more-button").prop('disabled', true);
			$("#use-case-text-right-more-text").fadeIn(function() {
				$("#use-case-text-right-more-button").prop('disabled', false);
				$("#use-case-text-right-more-button").text("less");
			});
		} else {
			console.log("data hidden false");
			$("#use-case-text-right-more-text").data("hidden", true);
			$("#use-case-text-right-more-text").fadeOut(function() {
				$("#use-case-text-right-more-button").prop('disabled', false);
				$("#use-case-text-right-more-button").text("more");
			});
		}
	});

	$("#use-case-text-third-more-button").click(function() {
		console.log("third button clicked");
		if ($("#use-case-text-third-more-text").data("hidden")) {
			console.log("data hidden true");
			$("#use-case-text-third-more-text").data("hidden", false);
			$("#use-case-text-third-more-button").prop('disabled', true);
			$("#use-case-text-third-more-text").fadeIn(function() {
				$("#use-case-text-third-more-button").prop('disabled', false);
				$("#use-case-text-third-more-button").text("less");
			});
		} else {
			console.log("data hidden false");
			$("#use-case-text-third-more-text").data("hidden", true);
			$("#use-case-text-third-more-text").fadeOut(function() {
				$("#use-case-text-third-more-button").prop('disabled', false);
				$("#use-case-text-third-more-button").text("more");
			});
		}
	});

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

						var leDiv = $("#leResult1");
						leDiv.empty();
						leDiv.append("<div class='info'><label><u>Beneficiary</u></label><span>" + ibanData.bankCode + "</span></div>");
						leDiv.append("<div class='info'><label>Account Number</label><span>" + ibanData.iban + "</span></div>");
						leDiv.append("<div class='info'><label>Firstname</label><span>" + ibanData.firstname + "</span></div>");
						leDiv.append("<div class='info'><label>Lastname</label><span>" + ibanData.lastname + "</span></div>");


						var confirmA = $("<a href='#'>Confirm</a>");
						confirmA.click(function(e) {
							e.preventDefault();

							flyBillFromL2R(function() {
								leDiv.empty();
								leDiv.append("<div class='info'><label>Payment</label><span>done</span></div>");

								var confirmA = $("<a href='#'>Yeay!</a>");
								confirmA.click(function(e) {
									e.preventDefault();
									$("#leResult1").hide();
									$("#leResult1").css("z-index", "-100");
									$(".left .iban-form-holder").show();
								});
								var span = $("<span></span>");
								span.addClass("button")
								span.append(confirmA);
								leDiv.append(span);
							});




						});
						var span = $("<span></span>");
						span.addClass("button")
						span.append(confirmA);
						leDiv.append(span);
						leDiv.show();
						$("#leResult1").css("z-index", "100");
						$(".left .iban-form-holder").hide();



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

	$("#search-iban-right").click(function(e){
		//console.log("e", e);
		e.preventDefault();
		var alias = $("#domain-text-right").val();
		/*
		for (var i=0; i<99; i++) {
			var iban = "BE" + i + " 3101 5432 1234";
			console.log("iban: " + iban + " valid? " + IBAN.isValid(iban));
		}
		*/
		var ibanString = mapAliasToIBAN(alias);
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

						var leDiv = $("#leResult2");
						leDiv.empty();
						leDiv.append("<div class='info'><label>Alias</label><span>" + alias + "</span></div>");
						leDiv.append("<div class='info'><label>Account Number</label><span>" + ibanString + "</span></div>");
						leDiv.append("<div class='info'><label>Firstname</label><span>" + ibanData.firstname + "</span></div>");
						leDiv.append("<div class='info'><label>Lastname</label><span>" + ibanData.lastname + "</span></div>");


						var confirmA = $("<a href='#'>Confirm</a>");
						confirmA.click(function(e) {
							e.preventDefault();
							flyBillFromR2L(function() {
								//$("#leResult2").hide();
								//$("#leResult2").css("z-index", "-100");
								//$(".right .iban-form-holder").show();

								leDiv.empty();
								leDiv.append("<div class='info'><label>Payment</label><span>done</span></div>");

								var confirmA = $("<a href='#'>Yeay!</a>");
								confirmA.click(function(e) {
									e.preventDefault();
									$("#leResult2").hide();
									$("#leResult2").css("z-index", "-100");
									$(".right .iban-form-holder").show();
								});
								var span = $("<span></span>");
								span.addClass("button")
								span.append(confirmA);
								leDiv.append(span);
							});

						});
						var span = $("<span></span>");
						span.addClass("button")
						span.append(confirmA);
						leDiv.append(span);
						leDiv.show();
						$("#leResult2").css("z-index", "100");
						$(".right .iban-form-holder").hide();



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

						var leDiv = $("<div id='leResult1' style='white-space:pre; width:600px; height:200px'></div>");

						$.featherlight(leDiv, configuration);

						$("#leResult1").typed({
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