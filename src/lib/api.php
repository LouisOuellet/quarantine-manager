<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/requirements.php';
require_once dirname(__FILE__,3) . '/src/lib/auth.php';

class API{

  protected $Settings = [];
  protected $Language = 'english';
  protected $Languages = [];
  public $Fields = [];
  protected $Timezones;
  protected $Timezone = 'America/Toronto';
  protected $PHPVersion;
  protected $Protocol;
  protected $Domain;
  protected $URL;
  protected $Auth;
  protected $Debug = false;
  protected $Log = "tmp/api.log";

  public function __construct(){

    // Increase PHP memory limit
    ini_set('memory_limit', '2G');
    ini_set('max_execution_time', 0);
    ini_set("display_errors", 0);

    // Init tmp directory
    $this->mkdir('tmp');

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
		if(isset($this->Settings['debug']) && $this->Settings['debug']){ $this->Debug = true; }
    if($this->Debug){ error_reporting(E_ALL & ~E_NOTICE); } else { error_reporting(0); }

		// Setup Restoration Method
		if(!isset($this->Settings['method'])){ $this->Settings['method'] = 'copy'; }

    // Setup URL
		if(isset($_SERVER['HTTP_HOST'])){
			$this->URL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://";
			$this->URL .= $_SERVER['HTTP_HOST'].'/';
		}

		//Import Listings
    $this->Timezones = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/timezones.json'),true);

		// Setup Language
		if(isset($_COOKIE['language'])){ $this->Language = $_COOKIE['language']; }
    elseif(isset($this->Settings['language'])){ $this->Language = $this->Settings['language']; }
    $this->Languages = array_diff(scandir(dirname(__FILE__,3) . "/dist/languages/"), array('.', '..'));
    foreach($this->Languages as $key => $value){ $this->Languages[$key] = str_replace('.json','',$value); }
    $this->Fields = json_decode(file_get_contents(dirname(__FILE__,3) . "/dist/languages/".$this->Language.".json"),true);

		// Setup Instance Timezone
		if(isset($this->Settings['timezone'])){ $this->Timezone = $this->Settings['timezone']; }
    date_default_timezone_set($this->Timezone);

    // Setup Auth
    $this->Auth = new Auth($this->Settings,$this->Fields);

    // Customize SMTP template
    if(isset($this->Settings['smtp'],$this->Settings['smtp']['username'],$this->Settings['smtp']['password'],$this->Settings['smtp']['host'],$this->Settings['smtp']['port'],$this->Settings['smtp']['encryption'])){
      $links = [
        "support" => "https://github.com/LouisOuellet/quarantine-manager",
        "logo" => $this->URL."dist/img/logo.png"
      ];
      $this->Auth->SMTP->customization("Quarantine",$links);
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

  protected function error($log = []){
    $this->log(json_encode($log, JSON_PRETTY_PRINT));
    exit();
  }

  protected function log($txt = " "){
    if($this->Debug){ echo $txt."\n"; }
    if(isset($this->Settings['log']['status']) && $this->Settings['log']['status']){
      return file_put_contents($this->Log, $txt.PHP_EOL , FILE_APPEND | LOCK_EX);
    }
  }

  public function init(){
    if($this->isLogin()){
      return [
        "success" => $this->Fields['Initialized'],
        "output" => [
          "timezones" => $this->Timezones,
          "timezone" => $this->Timezone,
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
      $this->mkdir('config');
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

  public function isAdmin(){
    if($this->isLogin() && isset($this->Settings['administrator']) && $this->Auth->Username == $this->Settings['administrator']){ return true; } else { return false; }
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

  protected function formatMsgs($messages = []){
    // Init Messages
    $results = [];
    // Retrieve Information
    foreach($messages as $msg){
      $uid=str_replace(['>','<'],['',''],$msg->UID);
      $results[$uid] = [
        "uid" => $uid,
        "date" => date('Y-m-d H:i:s',strtotime($msg->Date)),
        "sender" => $msg->From,
        "subject" => $msg->Subject->Full,
        "body" => $msg->Body->Content,
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
        array_push($results[$uid]['attachments'],[
          "name" => $name,
          "type" => $type,
          "size" => $file["bytes"],
        ]);
      }
    }
    return $results;
  }

  public function delete($uid = null){
    if($this->isLogin()){
      if($uid != null){
        if($this->Auth->IMAP->isConnected()){
          if($this->Auth->IMAP->delete($uid)){
            return [
              "success" => $this->Fields['Message deleted'],
              "output" => [
                "uid" => $uid,
              ],
            ];
          } else {
            return [
              "error" => $this->Fields['Unable to delete messages'],
              "output" => [],
            ];
          }
        } else {
          return [
            "error" => $this->Fields['Unable to connect to SMTP server'],
            "output" => [],
          ];
        }
      } else {
        return [
          "error" => $this->Fields['Unable to identify the message'],
          "output" => [],
        ];
      }
    } else {
      return [
        "error" => $this->Fields['You are not logged in'],
        "output" => [],
      ];
    }
  }

  public function restore($uid = null){
    if($this->isLogin()){
      if($uid != null){
        if($this->Auth->IMAP->isConnected()){
          if($eml = $this->Auth->IMAP->getEml($uid)){
            if(isset($this->Settings['method']) && $this->Settings['method'] == 'resend'){
              $file = dirname(__FILE__,3).'/tmp/'.$uid.'.eml';
              if(file_exists($file)){ unlink( $file); }
              file_put_contents($file, $eml);
              $body = "This email was found in quarantine and restored.\nBeware of the content. This email was quarantined for a reason.";
              $options = [
                'from' => $this->Settings['imap']['username'],
                'subject' => "Quarantined message ID=$uid restored",
                'attachments' => [$file],
              ];
              if($this->Auth->SMTP->isConnected()){
                if($this->Auth->SMTP->send($_SESSION['quarantine-username'], $body, $options)){
                  if($this->Auth->IMAP->delete($uid)){
                    unlink($file);
                    return [
                      "success" => $this->Fields['Message restored'],
                      "output" => [
                        "uid" => $uid,
                      ],
                    ];
                  } else {
                    return [
                      "error" => $this->Fields['Unable to remove the restored message'],
                      "output" => [],
                    ];
                  }
                } else {
                  return [
                    "error" => $this->Fields['Unable to send the restored message'],
                    "output" => [],
                  ];
                }
              } else {
                return [
                  "error" => $this->Fields['Unable to connect to SMTP server'],
                  "output" => [],
                ];
              }
            } else {
              // Connect to other mailbox
              if($IMAP = $this->Auth->IMAP->connect($_SESSION['quarantine-username'],$_SESSION['quarantine-password'])){
                // Append email
                if($this->Auth->IMAP->saveEml($eml,$IMAP)){
                  if($this->Auth->IMAP->delete($uid)){
                    return [
                      "success" => $this->Fields['Message restored'],
                      "output" => [
                        "uid" => $uid,
                      ],
                    ];
                  } else {
                    return [
                      "error" => $this->Fields['Unable to remove the restored message'],
                      "output" => [],
                    ];
                  }
                } else {
                  return [
                    "error" => $this->Fields['Unable to restore message'],
                    "output" => [],
                  ];
                }
              } else {
                return [
                  "error" => $this->Fields['Unable to connect to user mailbox'],
                  "output" => [],
                ];
              }
            }
          } else {
            return [
              "error" => $this->Fields['Unable to restore messages'],
              "output" => [],
            ];
          }
        } else {
          return [
            "error" => $this->Fields['Unable to connect to IMAP server'],
            "output" => [],
          ];
        }
      } else {
        return [
          "error" => $this->Fields['Unable to identify the message'],
          "output" => [],
        ];
      }
    } else {
      return [
        "error" => $this->Fields['You are not logged in'],
        "output" => [],
      ];
    }
  }

  public function save($settings = []){
    if($this->isLogin()){
      if($this->isAdmin()){
        $return = [];
        foreach($settings as $key => $value){
          if(isset($this->Settings[$key])){
            switch($key){
              case"administrator":
                if(isset($value['username'],$value['password'])){
                  if($this->Auth->login($value['username'], $value['password'])){
                    $this->Settings[$key] = $value['username'];
                  } else {
                    $return['error'] = $this->Fields['Unable to login with this administrator on server'];
                    $return['output']['errors'][$key] = $return['error'];
                  }
                } else {
                  $return['error'] = $this->Fields['Missing parameters'];
                  $return['output']['errors'][$key] = $return['error'];
                }
                break;
              case"smtp":
              case"imap":
                if(isset($value['host'],$value['encryption'],$value['port'],$value['username'],$value['password'])){
                  if($this->Auth->login($value['username'], $value['password'], $key, $value)){
                    $this->Settings[$key] = $value;
                  } else {
                    $return['error'] = $this->Fields['Unable to login on server'];
                    $return['output']['errors'][$key] = $return['error'];
                  }
                } else {
                  $return['error'] = $this->Fields['Missing parameters'];
                  $return['output']['errors'][$key] = $return['error'];
                }
                break;
              case"timezone":
                if(in_array($value,$this->Timezones)){
                  $this->Settings[$key] = $value;
                } else {
                  $return['error'] = $this->Fields['Unable to find timezone'];
                  $return['output']['errors'][$key] = $return['error'];
                }
                break;
              case"language":
                if(in_array($value,$this->Languages)){
                  $this->Settings[$key] = $value;
                } else {
                  $return['error'] = $this->Fields['Unable to find language'];
                  $return['output']['errors'][$key] = $return['error'];
                }
                break;
              default:
                $this->Settings[$key] = $value;
                break;
            }
          }
        }
        // Saving Settings
        if(!isset($return['error']) && $this->set()){
          $return['success'] = $this->Fields['Settings saved'];
        } else {
          $return['error'] = $this->Fields['Unable to save settings'];
        }
        $return['output']['settings'] = $this->Settings;
        return $return;
      } else {
        return [
          "error" => $this->Fields['You are not administrator'],
          "output" => [
            "settings" => $this->Settings,
          ],
        ];
      }
    } else {
      return [
        "error" => $this->Fields['You are not logged in'],
        "output" => [
          "settings" => $this->Settings,
        ],
      ];
    }
  }

  public function list(){
    if($this->isLogin()){
      if($this->isAdmin()){
        return [
          "success" => $this->Fields['Settings retrieved'],
          "output" => [
            "settings" => $this->Settings,
          ],
        ];
      } else {
        return [
          "error" => $this->Fields['You are not administrator'],
          "output" => [],
        ];
      }
    } else {
      return [
        "error" => $this->Fields['You are not logged in'],
        "output" => [],
      ];
    }
  }

  public function retrieve($recipient = null){
    if($recipient == null){ $recipient = $_SESSION['quarantine-username']; }
    $recipients = [];
    array_push($recipients,$recipient);
    if(isset($this->Settings['alias'][$recipient]) && is_array($this->Settings['alias'][$recipient])){
      foreach($this->Settings['alias'][$recipient] as $alias){
        array_push($recipients,$alias);
      }
    }
    // Check Connection Status
    if($this->Auth->IMAP->isConnected()){
      // Init Messages
      $messages = [];
      // Retrieve ALL Related emails
      foreach($recipients as $recipient){
        // Retrieve TO
        $inbox = $this->Auth->IMAP->search('TO "'.strtolower($recipient).'" SINCE "'.date("d-M-Y",strtotime("2 weeks ago")).'"');
        $messages = $messages + $this->formatMsgs($inbox->messages);
        // Retrieve CC
        $inbox = $this->Auth->IMAP->search('CC "'.strtolower($recipient).'" SINCE "'.date("d-M-Y",strtotime("2 weeks ago")).'"');
        $messages = $messages + $this->formatMsgs($inbox->messages);
        // Retrieve BCC
        $inbox = $this->Auth->IMAP->search('BCC "'.strtolower($recipient).'" SINCE "'.date("d-M-Y",strtotime("2 weeks ago")).'"');
        $messages = $messages + $this->formatMsgs($inbox->messages);
        ksort($messages, SORT_STRING);
      }
      // Return
      return [
        "success" => $this->Fields['Messages retrieved'],
        "output" => [
          "messages" => $messages,
        ],
      ];
    } else {
      return [
        "error" => $this->Fields['Unable to connect to IMAP server'],
        "output" => [
          "status" => $this->Auth->IMAP->isConnected(),
          "settings" => $this->Settings['imap'],
        ],
      ];
    }
  }
}
