<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <meta name="author" content="Louis Ouellet, Mark Otto, Jacob Thornton, and Bootstrap contributors">
	<!-- Tell the browser to be responsive to screen width -->
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php
  // Title
  if($this->isInstall()){
    if((!isset($this->Settings['maintenance']))||(!$this->Settings['maintenance'])){
      if($this->isLogin()){
        $title = $this->Fields['Dashboard'];;
      } else { $title = $this->Fields['Sign in']; }
    } else { $title = $this->Fields['Maintenance']; }
  } else { $title = $this->Fields['Installation']; }
	?>
  <title><?= $title; ?> · Quarantine</title>
	<link rel="shortcut icon" href="./dist/img/favicon.ico" />
  <!-- Bootstrap core CSS -->
  <link href="./vendor/bootstrap-5.1.3-dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="./vendor/fontawesome-free/css/all.min.css">
  <!-- Select2 -->
  <link rel="stylesheet" href="./vendor/select2-4.0.13/dist/css/select2.min.css">
  <link rel="stylesheet" href="./vendor/select2-bootstrap-5-theme-1.2.0/dist/select2-bootstrap-5-theme.min.css">
  <!-- jQuery UI -->
  <link rel="stylesheet" href="./vendor/jquery-ui/jquery-ui.min.css">
  <!-- pace-progress -->
  <link rel="stylesheet" href="./vendor/pace-progress/themes/black/pace-theme-flat-top.css">
  <!-- overlayScrollbars -->
  <link rel="stylesheet" href="./vendor/overlayScrollbars/css/OverlayScrollbars.min.css">
  <!-- SweetAlert2 -->
  <link rel="stylesheet" href="./vendor/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css">
  <!-- Toastr -->
  <link rel="stylesheet" href="./vendor/toastr/toastr.min.css">
  <!-- Core CSS -->
  <link href="./dist/css/stylesheet.css" rel="stylesheet">
  <!-- jQuery -->
  <script src="./vendor/jquery/jquery.min.js"></script>
  <!-- Bootstrap 5 -->
  <script src="./vendor/bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js"></script>
  <!-- TimeAgo JS -->
  <script src="./vendor/timeago/jquery.timeago.js"></script>
  <!-- jQuery UI -->
  <script src="./vendor/jquery-ui/jquery-ui.min.js"></script>
  <!-- bs-custom-file-input -->
  <script src="./vendor/bs-custom-file-input/bs-custom-file-input.min.js"></script>
  <!-- SweetAlert2 -->
  <script src="./vendor/sweetalert2/sweetalert2.min.js"></script>
  <!-- Toastr -->
  <script src="./vendor/toastr/toastr.min.js"></script>
  <!-- Select2 -->
  <script src="./vendor/select2-4.0.13/dist/js/select2.full.min.js"></script>
  <!-- jquery-validation -->
  <script src="./vendor/jquery-validation/jquery.validate.min.js"></script>
  <script src="./vendor/jquery-validation/additional-methods.min.js"></script>
	<!-- FontAwesome -->
	<script src="./vendor/fontawesome-free/4f8426d3cf.js" crossorigin="anonymous"></script>
	<!-- Pace-Settings -->
	<script>
		window.paceOptions = {
			restartOnRequestAfter: false,
			startOnPageLoad:false,
      ajax: { trackMethods: ['POST'] },
      document: true,
		};
	</script>
  <!-- Pace-Progress -->
	<script src="./vendor/pace-progress/pace.min.js"></script>
  <!-- overlayScrollbars -->
  <script src="./vendor/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
  <!-- whatwg-fetch -->
	<script>window.fetch = undefined;</script>
  <script src="./vendor/whatwg-fetch/fetch.umd.js"></script>
</head>
<body>
  <?php
    if($this->isInstall()){
  		if((!isset($this->Settings['maintenance']))||(!$this->Settings['maintenance'])){
  			if($this->isLogin()){
  				require_once dirname(__FILE__,2) . '/templates/layout/main.php';
  			} else { require_once dirname(__FILE__,2) . '/templates/layout/signin.php'; }
  		} else { require_once dirname(__FILE__,2) . '/templates/layout/maintenance.php'; }
  	} else { require_once dirname(__FILE__,2) . '/templates/layout/install.php'; }
  ?>
</body>
</html>
