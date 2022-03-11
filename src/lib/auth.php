<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/imap.php';
require_once dirname(__FILE__,3) . '/src/lib/smtp.php';

class Auth{

  public $SMTP;
  public $IMAP;
  protected $Settings = [];
  protected $Fields = [];
  public $Username = null;

  public function __construct($settings = [],$fields = []){
    if(!empty($settings)){ $this->Settings = $settings; }
    if(!empty($fields)){ $this->Fields = $fields; }
    if(isset($this->Settings['imap'])){
      $this->IMAP = new IMAP($this->Settings['imap']['host'],$this->Settings['imap']['port'],$this->Settings['imap']['encryption'],$this->Settings['imap']['username'],$this->Settings['imap']['password']);
    } else { $this->IMAP = new IMAP(); }
    if(isset($this->Settings['smtp'])){
      $this->SMTP = new MAILER($this->Settings['smtp'],$this->Fields);
    } else { $this->SMTP = new MAILER(); }
    $this->authenticate();
  }

  public function authenticate(){
    if((session_status() == PHP_SESSION_ACTIVE)&&(isset($_SESSION['quarantine-username']))){
      $this->Username = $_SESSION['quarantine-username'];
      return true;
    } else {
      if(!isset($_COOKIE['quarantine-username'])){
        if(isset($_POST['signin'],$_POST['username'],$_POST['password'])){
          if($this->login($_POST['username'],$_POST['password'])){
            $this->Username = $_POST['username'];
            $_SESSION['quarantine-username'] = $_POST['username'];
            $_SESSION['quarantine-password'] = $_POST['password'];
            return true;
          } else { return false; }
        } else { return false; }
      } else {
        $this->Username = $_COOKIE['quarantine-username'];
        $_SESSION['quarantine-username'] = $_COOKIE['quarantine-username'];
        $_SESSION['quarantine-password'] = $_COOKIE['quarantine-password'];
      }
    }
  }

  public function login($username, $password, $type = "imap", $settings = []){
    if($type == "imap"){
      if(empty($settings)){
        return $this->IMAP->login($username,$password);
      } else {
        if(isset($settings['host'],$settings['port'],$settings['encryption'])){
          return $this->IMAP->login($username,$password,$settings['host'],$settings['port'],$settings['encryption']);
        } else { return false; }
      }
    } elseif($type == "smtp"){
      if(empty($settings) && !empty($this->Settings)){ $settings = $this->Settings['smtp']; }
      if(isset($settings['host'],$settings['port'],$settings['encryption'])){
        return $this->SMTP->login($username,$password,$settings['host'],$settings['port'],$settings['encryption']);
      } else { return false; }
    } else { return false; }
  }
}
