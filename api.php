<?php
session_start();

// Import API
require_once dirname(__FILE__).'/src/lib/api.php';

if(!empty($_POST)){
	if(isset($_POST['request'])){

		// Start API
		$API = new API();

		// Maintenance Verification
		if((!isset($API->Settings['maintenance']))||(!$API->Settings['maintenance'])){

			// Initialize Data
			if(isset($_POST['data'])){
				if($API->isJson($_POST['data'])){ $data = json_decode($decodedURI, true); }
				else { $data = json_decode(urldecode(base64_decode($_POST['data'])), true); }
			} else { $data = []; }

			// Handling API Request
			if(isset($_POST['method'])){
				$method = $_POST['method'];
				switch($method){
					case"send":
						if(property_exists($API,'Mail') && method_exists($API->Mail,$method)){
							if(isset($data['extra'])){$API->Mail->send($data['email'],$data['message'],$data['extra']);}
							else{$API->Mail->send($data['email'],$data['message']);}
							$return = ["success" => $API->Fields["Message Sent"]];
						}
						else {
							$return = [
								"error" => $API->Fields["Unable to send your message"],
								"request" => $_POST,
								"api" => [
									"method" => $method,
								],
								"code" => 404,
							];
						}
						break;
					default:
						if(method_exists($API,$method)){ $return = $API->$method($data); }
						else {
							$return = [
								"error" => $API->Fields["Unknown Method"],
								"request" => $_POST,
								"api" => [
									"method" => $method,
								],
								"code" => 404,
							];
						}
						break;
				}
			} else {
				$return = [
					"error" => $API->Fields["Unknown Request"],
					"request" => $_POST,
					"api" => [
						"method" => $method,
					],
					"code" => 404,
				];
			}
		} else {
			$return = [
				"error" => $API->Fields["Server Under Maintenance"],
				"request" => $_POST,
				"api" => [
					"method" => $method,
				],
				"code" => 500,
			];
		}
		// Encoded JSON Response
		echo base64_encode(urlencode(json_encode($return, JSON_PRETTY_PRINT)));
	}
}
