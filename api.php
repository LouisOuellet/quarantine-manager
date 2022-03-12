<?php
session_start();

// Set Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Import Librairies
require_once dirname(__FILE__).'/src/lib/api.php';
require_once dirname(__FILE__).'/src/lib/url.php';

$URL = new URLparser();

if(!empty($_POST)){
	// Decoding
	foreach($_POST as $key => $value){ $_POST[$key] = $URL->decode($value); }
	// Parse
	foreach($_POST as $key => $value){ $_POST[$key] = $URL->parse($value); }
	// Sanitize
	foreach($_POST as $key => $value){ $_POST[$key] = $URL->sanitize($value); }
	if(isset($_POST['request'])){
		$trigger = $_POST['request'];
		// Import API
		$request = 'API';

		// Start API
		if(class_exists($request)){ $API = new $request(); }
		else {
			$return = [
				"error" => $API->Fields["Unknown API"],
				"api" => [
					"name" => $trigger,
					"class" => $request,
					"file" => $file,
				],
				"code" => 404,
			];
		}

		if(!isset($return)){
			// Maintenance Verification
			if((!isset($API->Settings['maintenance']))||(!$API->Settings['maintenance'])){
				// Check Login
				if($API->isLogin()){
					// Initialize Data
					if(isset($_POST['data'])){ $data = $_POST['data']; } else { $data = []; }
					// Handling API Request
					if(isset($_POST['type'])){
						$method = $_POST['type'];
						if(method_exists($API,$method)){ $return = $API->$method($data); }
						else {
							$return = [
								"error" => $API->Fields["Unknown request"],
								"api" => [
									"name" => $trigger,
									"class" => $request,
									"file" => $file,
								],
								"code" => 404,
							];
						}
					} else {
						$return = [
							"error" => $API->Fields["No request"],
							"api" => [
								"name" => $trigger,
								"class" => $request,
								"file" => $file,
							],
							"code" => 404,
						];
					}
				} else {
					$return = [
						"error" => $API->Fields["Not logged in"],
						"api" => [
							"name" => $trigger,
							"class" => $request,
							"file" => $file,
						],
						"code" => 403,
					];
				}
			} else {
				$return = [
					"error" => $API->Fields["Server under maintenance"],
					"api" => [
						"name" => $trigger,
						"class" => $request,
						"file" => $file,
					],
					"code" => 500,
				];
			}
		}
		// Encode and Print
		$return['request'] = $_POST;
		echo json_encode($return, JSON_PRETTY_PRINT);
	}
}
