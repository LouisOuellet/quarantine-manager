<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/vendor/PHPMailer/src/Exception.php';
require_once dirname(__FILE__,3) . '/vendor/PHPMailer/src/PHPMailer.php';
require_once dirname(__FILE__,3) . '/vendor/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

class MAILER{

	public $Mailer; // Contains the PHPMailer Class
	public $Status = false;
  protected $Language; // Contains the Language Class
	protected $URL; // Contains the main URL
	protected $Brand = "Mailer"; // Contains the brand name
	protected $Links = [
		"support" => "https://mailer.com/support",
		"trademark" => "https://mailer.com/trademark",
		"policy" => "https://mailer.com/policy",
		"logo" => "https://mailer.com/dist/img/logo.png",
	]; // Contains the various links required

	public function __construct($smtp = null,$languageArray = []){
		// Setup Language
		$this->Language = $languageArray;

		// Setup URL
		if(isset($_SERVER['HTTP_HOST'])){
			$this->URL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://";
			$this->URL .= $_SERVER['HTTP_HOST'].'/';
		}

		// Setup PHPMailer
		if($smtp != null && $this->login($smtp['username'],$smtp['password'],$smtp['host'],$smtp['port'],$smtp['encryption'])){
			$this->Status = true;
			$this->Mailer = new PHPMailer(true);
			$this->Mailer->isSMTP();
	    $this->Mailer->Host = $smtp['host'];
	    $this->Mailer->SMTPAuth = true;
	    $this->Mailer->Username = $smtp['username'];
	    $this->Mailer->Password = $smtp['password'];
			$this->Mailer->SMTPDebug = false;
			if($smtp['encryption'] == 'SSL'){ $this->Mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; }
			if($smtp['encryption'] == 'STARTTLS'){ $this->Mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; }
			$this->Mailer->SMTPOptions = [
				'ssl' => [
					'verify_peer' => false,
					'verify_peer_name' => false,
					'allow_self_signed' => true
				]
			];
	    $this->Mailer->Port = $smtp['port'];
		}
	}

	public function customization($brand = "Mailer",$links = [ "support" => "https://mailer.com/support", "trademark" => "https://mailer.com/trademark", "policy" => "https://mailer.com/policy", "logo" => "https://mailer.com/dist/img/logo.png" ]){
		$this->Brand = $brand;
		if(isset($links['support'])){ $this->Links['support'] = $links['support']; }
		if(isset($links['trademark'])){ $this->Links['trademark'] = $links['trademark']; }
		if(isset($links['policy'])){ $this->Links['policy'] = $links['policy']; }
		if(isset($links['logo'])){ $this->Links['logo'] = $links['logo']; }
	}

	public function isConnected(){
		return is_bool($this->Status) && $this->Status ? true:false;
	}

	public function login($username,$password,$host,$port,$encryption = null){
		// Setup PHPMailer
		$mail = new PHPMailer(true);
		$mail->isSMTP();
		$mail->Host = $host;
		$mail->SMTPAuth = true;
		$mail->Username = $username;
		$mail->Password = $password;
		$mail->SMTPDebug = false;
		if($encryption == 'SSL'){ $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; }
		if($encryption == 'STARTTLS'){ $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; }
		$mail->Port = $port;
		$mail->SMTPOptions = [
			'ssl' => [
				'verify_peer' => false,
				'verify_peer_name' => false,
				'allow_self_signed' => true
			]
		];
		// Test Connection
		if(!$mail->SmtpConnect()){ return false; }
		$mail->smtpClose(); return true;
	}

	public function sendReset($email,$token){
		$this->Mailer->setFrom($this->Mailer->Username, $this->Brand);
		$this->Mailer->addAddress($email);
		$this->Mailer->isHTML(true);
		$this->Mailer->Subject = $this->Brand.' | Reset your password';
    $this->Mailer->Body    = $this->URL.'?forgot='.$token.' '.$this->Language['* If you did not request this email, please forward it to your network administrator.'];
		return $this->Mailer->send();
	}

	public function send($email, $message, $extra = []){
		$this->Mailer->ClearAllRecipients();
		if(isset($extra['subject'])){ $this->Mailer->Subject = $extra['subject']; }
		else { $this->Mailer->Subject = $this->Brand; }
		if(isset($extra['from'])){ $this->Mailer->setFrom($extra['from']); }
		else { $this->Mailer->setFrom($this->Mailer->Username, $this->Brand); }
		if(isset($extra['replyto'])){ $this->Mailer->addReplyTo($extra['replyto']); }
		$this->Mailer->addAddress($email);
		$this->Mailer->clearAttachments();
		if((isset($extra['attachments']))&&(is_array($extra['attachments']))){
			foreach($extra['attachments'] as $attachment){
				$this->Mailer->addAttachment($attachment);
			}
		}
		$this->Mailer->isHTML(true);
		if(isset($extra['subject'])){ $this->Mailer->Subject = $extra['subject']; }
		else { $this->Mailer->Subject = $this->Brand; }
		$acceptReplies = false;
		if(isset($extra['acceptReplies']) && ($extra['acceptReplies'] == false || $extra['acceptReplies'] == 'false')){$acceptReplies = true;}
		$this->Mailer->Body = '';
		$this->Mailer->Body .= '
		<meta http-equiv="Content-Type" content="text/html">
		<meta name="viewport" content="width=device-width">
		<style type="text/css">
			a { text-decoration: none; color: #0088CC; }
			a:hover { text-decoration: underline }
			body {
				font-size: 18px;
				width: 100% !important;
				background-color: white;
				margin: 0;
				padding: 0;
				font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif;
				color: #333333;
				line-height: 26px;
			}
			.arrow-right:after {
				content: "";
				background: url("'.$this->URL.'dist/img/arrow-right_1x.png") no-repeat;
				background-position: -2px 2px;
				background-size: 24px;
				display: inline-block;
				width: 24px;
				height: 30px;
				position: absolute;
			}
			.arrow-left:after {
				content: "";
				background: url("'.$this->URL.'dist/img/arrow-left_1x.png") no-repeat;
				background-position: -2px 2px;
				background-size: 24px;
				display: inline-block;
				width: 24px;
				height: 30px;
				position: absolute;
			}
		</style>
		<meta name="format-detection" content="telephone=no">
		<table style="border-collapse: collapse;" width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" align="center">
			<tbody>
				<tr><td class="top-padding" style="line-height:120px;" width="100%">&nbsp;</td></tr>
				<tr>
					<td valign="top">
						<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0">
							<tbody>
								<tr style="width:100%!important;" align="center">
									<td>
										<table style="border-collapse: collapse;" width="692" cellspacing="0" cellpadding="0" border="0" align="center">
											<tbody>
												<tr width="100%" border="0" cellspacing="0" cellpadding="0">
													<td style="padding:0px 0px 0px 0px;" align="center">
														<div style="color:#495057;font-size: 2.1rem; text-align: center;font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif;,line-height: 1.5; padding-bottom: 20px;">';
														if(isset($this->Links['logo']) && $this->Links['logo'] != '' && $this->Links['logo'] != '#'){
															$this->Mailer->Body .= '<img src="'.$this->Links['logo'].'" style="width:100px;vertical-align: middle;border-style: none;"><b style="vertical-align: -10px; font-weight: bold;padding: .5rem;">'.$this->Brand.'</b>';
														} else {
															$this->Mailer->Body .= '<b style="font-weight: bold;padding: .5rem;">'.$this->Brand.'</b>';
														}
														$this->Mailer->Body .= '
														</div>
													</td>
												</tr>';
												if(isset($extra['title'])){
													$this->Mailer->Body .= '
														<tr>
															<td style="padding:0px 0px 0px 0px;" valign="top" align="center">
																<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
																	<tbody>
																		<tr align="center">
																			<td class="heading" style="font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif; font-size:52px; line-height:56px; font-weight: 200;padding:40px 0px 64px 0px; margin:0; border: 0; display:block; text-align:center;" width="90%" align="center">'.$extra['title'].'</td>
																		</tr>
																	</tbody>
																</table>
															</td>
														</tr>';
													}
		$this->Mailer->Body .= '
											</tbody>
										</table>
										<table style="border-collapse: collapse;" width="692px" cellspacing="0" cellpadding="0" border="0" align="center">
											<tbody>
												<tr>
													<td style="color:#333333; padding:0px 0px 64px 0px; margin:0px;" class="emailcontent" width="692px">
														<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
															<tbody>
																<tr>
																	<td>
																		<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
																			<tbody>
																				<tr>
																					<td style="padding:7px 0 19px; margin:0; font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif; color: #333333;font-size:18px; line-height: 26px; width:692px; text-align:justify">
																						'.$message.'
																					</td>
																				</tr>
																			</tbody>
																		</table>';
																		if(isset($extra['href'])){
																			$this->Mailer->Body .= '
																				<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
																					<tbody>
																						<tr>
																							<td style="padding:7px 0 19px; margin:0; font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif; color: #333333;font-size:18px; line-height: 26px; width:692px">
																								Case ID: 101413965073<br>
																								<a href="'.$extra['href'].'" style="color:#0088cc" class="aapl-link arrow-right" moz-do-not-send="true">Open this case</a>
																							</td>
																						</tr>
																					</tbody>
																				</table>';
																		}
		$this->Mailer->Body .= '
																		<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
																			<tbody>
																				<tr>
																					<td style="padding:7px 0 19px; margin:0; font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif; color: #333333;font-size:18px; line-height: 26px; width:692px">
																						Sincerely,<br>
																						'.$this->Brand.' Team
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>';
							$this->Mailer->Body .= '
								<tr style="width:100%!important; background-color:#343A40;" align="center">
									<td class="footer" style="padding-top: 64px; padding-bottom: 64px">
										<table style="border-collapse: collapse;" width="692" cellspacing="0" cellpadding="0" border="0" align="center">
											<tbody>
												<tr width="100%" border="0" cellspacing="0" cellpadding="0">
													<td style="font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif;color:#999999; text-align:center; font-size:12px; line-height:16px; padding:4px;" align="center">
														TM and copyright &copy; '.date('Y').'
													</td>
												</tr>
												<tr width="100%" border="0" cellspacing="0" cellpadding="0">
													<td style="font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif;text-align:center; font-size:12px; line-height:16px; color:#999999" align="center">';
														if(isset($this->Links['trademark']) && $this->Links['trademark'] != '' && $this->Links['trademark'] != '#'){
															$this->Mailer->Body .= '<a style="margin-left:4px;margin-right:4px;color:#ffffff;" href="'.$this->Links['trademark'].'" moz-do-not-send="true">All Rights Reserved</a>';
														}
														if(isset($this->Links['policy']) && $this->Links['policy'] != '' && $this->Links['policy'] != '#'){
															$this->Mailer->Body .= '<a style="margin-left:4px;margin-right:4px;color:#ffffff;" href="'.$this->Links['policy'].'" moz-do-not-send="true">Privacy Policy</a>';
														}
														if(isset($this->Links['support']) && $this->Links['support'] != '' && $this->Links['support'] != '#'){
															$this->Mailer->Body .= '<a style="margin-left:4px;margin-right:4px;color:#ffffff;" href="'.$this->Links['support'].'" moz-do-not-send="true">Support</a>';
														}
													$this->Mailer->Body .= '
													</td>
												</tr>';
												if($acceptReplies){
													$this->Mailer->Body .= '
														<tr width="100%" border="0" cellspacing="0" cellpadding="0">
															<td style="font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif;color:#999999; text-align:center; font-size:12px; line-height:16px; padding:4px;padding-top:32px; " align="center">
																This message was sent to you from an email address that does not accept incoming messages.<br>
																Any replies to this message will not be read. If you have questions, please visit <a href="'.$this->URL.'?p=contact" style="color: #ffffff" moz-do-not-send="true">'.$this->URL.'?p=contact</a>.
															</td>
														</tr>';
													}
		$this->Mailer->Body .= '
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
		';
		try { $this->Mailer->send(); return true; }
		catch (phpmailerException $e) { return false; }
		catch (Exception $e) { return false; }
	}
}
