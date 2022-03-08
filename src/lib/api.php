<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/requirements.php';
require_once dirname(__FILE__,3) . '/src/lib/auth.php';

class API{

  protected $Settings = [];
  protected $Language = 'english';
  protected $Languages = [];
  protected $Fields = [];
  protected $Mail;
  protected $Timezones;
  protected $DB;
  protected $PHPVersion;
  protected $Protocol;
  protected $Domain;
  protected $Auth;
  protected $Debug = true;

  public function __construct(){

    // Increase PHP memory limit
    ini_set('memory_limit', '2G');
    ini_set('max_execution_time', 0);

    // Init tmp directory
    if(!is_dir(dirname(__FILE__,3) . '/tmp')){ mkdir(dirname(__FILE__,3) . '/tmp'); }

		// Gathering Server Information
		$this->PHPVersion=substr(phpversion(),0,3);
		if(isset($_SERVER['HTTP_HOST'])){
			$this->Protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://";
			$this->Domain = $_SERVER['HTTP_HOST'];
		}

    // Import Configurations
		if(is_file(dirname(__FILE__,3) . "/config/config.json")){
			$this->Settings = json_decode(file_get_contents(dirname(__FILE__,3) . '/config/config.json'),true);
		}

		// Setup Debug
		if((isset($this->Settings['debug']))&&($this->Settings['debug'])){ $this->Debug = true; }
    if($this->Debug){ error_reporting(-1); } else { error_reporting(0); }

    // Setup URL
		if(isset($_SERVER['HTTP_HOST']) && !isset($this->Settings['url'])){
			$this->Settings['url'] = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://";
			$this->Settings['url'] .= $_SERVER['HTTP_HOST'].'/';
      if(file_exists(dirname(__FILE__,3).'/config/config.json')){ $this->set($this->Settings); }
		}

		//Import Listings
    $this->Timezones = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/timezones.json'),true);

		// Setup Language
		if(isset($_COOKIE['language'])){ $this->Language = $_COOKIE['language']; }
    elseif(isset($this->Settings['language'])){ $this->Language = $this->Settings['language']; }
    $this->Languages = array_diff(scandir(dirname(__FILE__,3) . "/dist/languages/"), array('.', '..'));
    foreach($this->Languages as $key => $value){ $this->Languages[$key] = str_replace('.json','',$value); }
    $this->Fields = json_decode(file_get_contents(dirname(__FILE__,3) . "/dist/languages/".$this->Language.".json"),true);

		// Setup Instance
		if(isset($this->Settings['timezone'])){ date_default_timezone_set($this->Settings['timezone']); }

    // Setup Auth
    $this->Auth = new Auth($this->Settings,$this->Fields);

    // Customize SMTP template
    if(isset($this->Settings['url'],$this->Settings['smtp'],$this->Settings['smtp']['username'],$this->Settings['smtp']['password'],$this->Settings['smtp']['host'],$this->Settings['smtp']['port'],$this->Settings['smtp']['encryption'])){
      $this->Mail = new MAIL($this->Settings['smtp'],$this->Fields);
      $customization = [
        "logo" => $this->Settings['url']."dist/img/logo.png",
        "support" => $this->Settings['url']."?p=support",
        "trademark" => $this->Settings['url']."?p=trademark",
        "policy" => $this->Settings['url']."?p=policy"
      ];
      if(is_file(dirname(__FILE__,3).'/dist/img/custom-logo.png')){ $customization['logo'] = $this->Settings['url']."dist/img/custom-logo.png"; }
      $this->Mail->Customization('Quarantine',$customization);
    }
  }

  protected function mkdir($directory){
    $make = dirname(__FILE__,3);
    $directories = explode('/',$directory);
    foreach($directories as $subdirectory){
      $make .= '/'.$subdirectory;
      if(!is_file($make)&&!is_dir($make)){ mkdir($make); }
    }
    return $make;
  }

  public function init(){
    if($this->isLogin()){
      return [
        "success" => $this->Fields['Initialized'],
        "output" => [
          "timezones" => $this->Timezones,
          "language" => $this->Language,
          "languages" => $this->Languages,
          "fields" => $this->Fields,
          "debug" => $this->Debug,
          "username" => $_SESSION['quarantine-username'],
        ],
      ];
    }
  }

  protected function set(){
    try {
      $json = fopen(dirname(__FILE__,3).'/config/config.json', 'w');
  		fwrite($json, json_encode($this->Settings, JSON_PRETTY_PRINT));
  		fclose($json);
      return true;
    } catch(Exception $error){ return false; }
  }

  public function isInstall(){
    return is_file(dirname(__FILE__,3).'/config/config.json');
  }

  public function isLogin(){
    if((session_status() == PHP_SESSION_ACTIVE)&&(isset($_SESSION['quarantine-username']))){ return true; } else { return false; }
  }

  public function logout(){
    unset($_SESSION['quarantine-username']);
    unset($_SESSION['quarantine-password']);
    session_unset();
    session_destroy();
    if(!$this->isLogin()){
      return [
        "success" => $this->Fields['Logged out'],
        "output" => [
          "status" => $this->isLogin(),
        ],
      ];
    } else {
      return [
        "error" => $this->Fields['Unable to logout'],
        "output" => [
          "status" => $this->isLogin(),
        ],
      ];
    }
  }

  public function retrieve($to = null){
    // Check Connection Status
    if($this->Auth->IMAP->isConnected()){
      // Retrieve INBOX
      $inbox = $this->Auth->IMAP->get();
      // Init Messages
      $messages = [];
      // Output ids and subject of all messages retrieved
      foreach($inbox->messages as $msg){
        $continue = false;
        if($to != null){
          foreach($msg->Receiver as $receiver){
            if($to == $receiver){ $continue = true; break; }
          }
        } else { $continue = true; }
        if($continue){
          $uid=str_replace(['>','<'],['',''],$msg->UID);
          $messages[$uid] = [
            "uid" => $uid,
            "sender" => $msg->From,
            "subject" => $msg->Subject->Full,
            "body" => $msg->Body->Content,
            "date" => $msg->Date,
            "attachments" => []
          ];
          foreach($msg->Attachments->Files as $file){
            if(isset($file["name"])){
              $filename = explode('.',$file["name"]);
              $type = end($filename);
              $name = $filename[0];
            } else { $file["name"] = null; }
            if(isset($file["filename"])){
              $filename = explode('.',$file["filename"]);
              $type = end($filename);
              $name = $filename[0];
            } else { $file["filename"] = null; }
            array_push($messages[$uid]['attachments'],[
              "name" => $name,
              "type" => $type,
              "size" => $file["bytes"],
            ]);
          }
        }
      }
      return [
        "success" => $this->Fields['Messages retrieved'],
        "output" => [
          "messages" => $messages,
        ],
      ];
    } else {
      return [
        "error" => $this->Fields['Unable to retrieve messages'],
        "output" => [
          "status" => $this->Auth->IMAP->isConnected(),
          "settings" => $this->Settings['imap'],
        ],
      ];
    }
  }
}
