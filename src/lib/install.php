<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/api.php';

class Installer extends API {

	protected $Log;
  protected $Steps = 7;

  public function install($settings){

    // Init Installer
    if(is_file(dirname(__FILE__,3) . '/tmp/resume.install')){ unlink(dirname(__FILE__,3) . '/tmp/resume.install'); }
    file_put_contents(dirname(__FILE__,3) . '/tmp/resume.install', $this->Steps.PHP_EOL , FILE_APPEND | LOCK_EX);

    // Init Log
    $this->Log = dirname(__FILE__,3) . '/tmp/install.log';
    if(is_file($this->Log)){ unlink($this->Log); }
    $this->log("====================================================");
    $this->log("  Installation Log ".date("Y-m-d H:i:s")."");
    $this->log("====================================================");
    $this->log("\n");

    // Verify if alreay installed
    if($this->isInstall()){
      $this->log("Application is already installed!");
      $this->error($settings);
    }

    // Clear current settings
    $this->Settings = [];

    // Validate Form and Prepare Settings
    if(isset($settings['imap'])){
      // Set IMAP
      $this->Settings['imap'] = $settings['imap'];
      $this->log("IMAP Set!");
			if($this->Auth->login($settings['imap']['username'], $settings['imap']['password'], "imap", $settings['imap'])){
				$this->log("IMAP Authenticated");
			} else {
				$this->log("Unable to authenticate on IMAP server");
	      $this->error($settings);
			}
    } else {
      $this->log("No IMAP settings provided!");
      $this->error($settings);
    }
    if(isset($settings['smtp'])){
      // Set IMAP
      $this->Settings['smtp'] = $settings['smtp'];
      $this->log("SMTP Set!");
			if($this->Auth->login($settings['smtp']['username'], $settings['smtp']['password'], "smtp", $settings['smtp'])){
				$this->log("SMTP Authenticated");
			} else {
				$this->log("Unable to authenticate on SMTP server");
	      $this->error($settings);
			}
    } else {
      $this->log("No SMTP settings provided!");
      $this->error($settings);
    }
    if(isset($settings['language'])){
      // Set Language
      $this->Settings['language'] = $settings['language'];
      $this->log("Language Set!");
    } else {
      $this->log("No language provided!");
      $this->error($settings);
    }
    if(isset($settings['timezone'])){
      // Set Timezone
      $this->Settings['timezone'] = $settings['timezone'];
      date_default_timezone_set($this->Settings['timezone']);
      $this->log("Timezone Set!");
    } else {
      $this->log("No timezone provided!");
      $this->error($settings);
    }

    // Saving Settings
    if($this->set()){
      $this->log("Installation has completed successfully at ".date("Y-m-d H:i:s")."!");
    } else {
      $this->log("Unable to complete the installation");
      $this->error($settings);
    }
  }

  private function error($settings = []){
    // Log Settings Array
    $this->log(json_encode($settings, JSON_PRETTY_PRINT));
    exit();
  }

  private function log($txt){
    return file_put_contents($this->Log, $txt.PHP_EOL , FILE_APPEND | LOCK_EX);
  }
}

$API = new Installer;
if(isset($_POST) && !empty($_POST)){
  $API->install($_POST);
}
