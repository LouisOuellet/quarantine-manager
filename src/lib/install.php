<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/api.php';

class Installer extends API {

	protected $Log;
  protected $Steps = 8;

  public function install($settings){

    // Init Installer
    if(is_file(dirname(__FILE__,3) . '/tmp/resume.install')){ unlink(dirname(__FILE__,3) . '/tmp/resume.install'); }
    file_put_contents(dirname(__FILE__,3) . '/tmp/resume.install', $this->Steps.PHP_EOL , FILE_APPEND | LOCK_EX);

    // Init Log
    $this->Log = dirname(__FILE__,3) . '/tmp/install.log';
    if(is_file($this->Log)){ unlink($this->Log); }
    $this->log("====================================================", true);
    $this->log("  Installation Log ".date("Y-m-d H:i:s")."", true);
    $this->log("====================================================", true);
    $this->log("", true);

    // Verify if alreay installed
    if($this->isInstall()){
      $this->log("Application is already installed!", true);
      $this->error($settings, true);
    }

    // Clear current settings
    $this->Settings = [];

    // Validate Form and Prepare Settings
    if(isset($settings['imap'])){
      // Set IMAP
      $this->Settings['imap'] = $settings['imap'];
      $this->log("IMAP Set!", true);
			if($this->Auth->login($settings['imap']['username'], $settings['imap']['password'], "imap", $settings['imap'])){
				$this->log("IMAP Authenticated", true);
			} else {
				$this->log("Unable to authenticate on IMAP server", true);
	      $this->error($settings, true);
			}
    } else {
      $this->log("No IMAP settings provided!", true);
      $this->error($settings, true);
    }
    if(isset($settings['smtp'])){
      // Set SMTP
      $this->Settings['smtp'] = $settings['smtp'];
      $this->log("SMTP Set!", true);
			if($this->Auth->login($settings['smtp']['username'], $settings['smtp']['password'], "smtp", $settings['smtp'])){
				$this->log("SMTP Authenticated", true);
			} else {
				$this->log("Unable to authenticate on SMTP server", true);
	      $this->error($settings, true);
			}
    } else {
      $this->log("No SMTP settings provided!", true);
      $this->error($settings, true);
    }
    if(isset($settings['imap'])){
      // Set Administrator
      $this->Settings['administrator'] = $settings['administrator']['username'];
      $this->log("Administrator Set!", true);
			if($this->Auth->login($settings['administrator']['username'], $settings['administrator']['password'], "imap", $settings['imap'])){
				$this->log("Administrator Authenticated", true);
			} else {
				$this->log("Unable to authenticate the Administrator", true);
	      $this->error($settings, true);
			}
    } else {
      $this->log("No IMAP settings provided!", true);
      $this->error($settings, true);
    }
    if(isset($settings['language'])){
      // Set Language
      $this->Settings['language'] = $settings['language'];
      $this->log("Language Set!", true);
    } else {
      $this->log("No language provided!", true);
      $this->error($settings, true);
    }
    if(isset($settings['timezone'])){
      // Set Timezone
      $this->Settings['timezone'] = $settings['timezone'];
      date_default_timezone_set($this->Settings['timezone']);
      $this->log("Timezone Set!", true);
    } else {
      $this->log("No timezone provided!", true);
      $this->error($settings, true);
    }

    // Saving Settings
    if($this->set()){
      $this->log("Installation has completed successfully at ".date("Y-m-d H:i:s")."!", true);
    } else {
      $this->log("Unable to complete the installation", true);
      $this->error($settings, true);
    }
  }
}

$API = new Installer;
if(isset($_POST) && !empty($_POST)){
  $API->install($_POST);
}
