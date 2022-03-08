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
  <!-- daterange picker -->
  <link rel="stylesheet" href="./vendor/daterangepicker/daterangepicker.css">
  <!-- iCheck for checkboxes and radio inputs -->
  <link rel="stylesheet" href="./vendor/icheck-bootstrap/icheck-bootstrap.min.css">
  <!-- Select2 -->
  <link rel="stylesheet" href="./vendor/select2-4.0.13/dist/css/select2.min.css">
  <link rel="stylesheet" href="./vendor/select2-bootstrap-5-theme-1.2.0/dist/select2-bootstrap-5-theme.min.css">
  <!-- Google Font: Source Sans Pro -->
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
  <!-- DataTables -->
  <link rel="stylesheet" href="./vendor/datatables-bs4/css/dataTables.bootstrap4.css">
  <link href="./vendor/datatables-buttons/buttons.dataTables.min.css" rel="stylesheet">
  <link href="./vendor/datatables-select/select.dataTables.min.css" rel="stylesheet">
  <link href="./vendor/datatables-responsive/responsive.bootstrap4.min.css" rel="stylesheet">
  <!-- summernote -->
  <link rel="stylesheet" href="./vendor/summernote/summernote-bs4.min.css">
  <!-- CodeMirror -->
  <link rel="stylesheet" href="./vendor/codemirror/codemirror.css">
  <link rel="stylesheet" href="./vendor/codemirror/theme/monokai.css">
  <!-- simplemde -->
  <link rel="stylesheet" href="./vendor/simplemde/dist/simplemde.min.css">
  <!-- simplemde -->
  <link rel="stylesheet" href="./vendor/jquery-ui/jquery-ui.min.css">
  <!-- pace-progress -->
  <link rel="stylesheet" href="./vendor/pace-progress/themes/black/pace-theme-flat-top.css">
  <!-- overlayScrollbars -->
  <link rel="stylesheet" href="./vendor/overlayScrollbars/css/OverlayScrollbars.min.css">
  <!-- dropzonejs -->
  <link rel="stylesheet" href="./vendor/dropzone/min/dropzone.min.css">
  <!-- fullCalendar -->
  <link rel="stylesheet" href="./vendor/fullcalendar/main.min.css">
  <link rel="stylesheet" href="./vendor/fullcalendar-daygrid/main.min.css">
  <link rel="stylesheet" href="./vendor/fullcalendar-timegrid/main.min.css">
  <link rel="stylesheet" href="./vendor/fullcalendar-bootstrap/main.min.css">
  <!-- SweetAlert2 -->
  <link rel="stylesheet" href="./vendor/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css">
  <!-- Toastr -->
  <link rel="stylesheet" href="./vendor/toastr/toastr.min.css">
  <!-- Core CSS -->
  <link href="/dist/css/stylesheet.css" rel="stylesheet">
  <!-- jQuery -->
  <script src="/vendor/jquery/jquery.min.js"></script>
  <!-- Bootstrap 5 -->
  <script src="/vendor/bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js"></script>
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
  <!-- DataTables -->
  <script src="./vendor/datatables/jquery.dataTables.js"></script>
  <script src="./vendor/datatables-bs4/js/dataTables.bootstrap4.js"></script>
  <script src="./vendor/datatables-jquery/jquery.dataTables.min.js"></script>
  <script src="./vendor/datatables-bs4/dataTables.bootstrap4.min.js"></script>
  <script src="./vendor/datatables-responsive/dataTables.responsive.min.js"></script>
  <script src="./vendor/datatables-responsive/responsive.bootstrap4.min.js"></script>
  <script src="./vendor/datatables-buttons/dataTables.buttons.min.js"></script>
  <script src="./vendor/datatables-buttons/buttons.flash.min.js"></script>
  <script src="./vendor/datatables-jszip/jszip.min.js"></script>
  <script src="./vendor/datatables-pdfmake/pdfmake.min.js"></script>
  <script src="./vendor/datatables-pdfmake/vfs_fonts.js"></script>
  <script src="./vendor/datatables-buttons/buttons.html5.min.js"></script>
  <script src="./vendor/datatables-buttons/buttons.print.min.js"></script>
  <script src="./vendor/datatables-select/dataTables.select.min.js"></script>
  <!-- Select2 -->
  <script src="./vendor/select2-4.0.13/dist/js/select2.full.min.js"></script>
  <!-- Bootstrap4 Duallistbox -->
  <script src="./vendor/bootstrap4-duallistbox/jquery.bootstrap-duallistbox.min.js"></script>
  <!-- InputMask -->
  <script src="./vendor/moment/moment.min.js"></script>
  <script src="./vendor/inputmask/min/jquery.inputmask.bundle.min.js"></script>
  <!-- date-range-picker -->
  <script src="./vendor/daterangepicker/daterangepicker.js"></script>
  <!-- Tempusdominus Bootstrap 4 -->
  <script src="./vendor/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
  <!-- Bootstrap Switch -->
  <script src="./vendor/bootstrap-switch/js/bootstrap-switch.min.js"></script>
  <!-- jquery-validation -->
  <script src="./vendor/jquery-validation/jquery.validate.min.js"></script>
  <script src="./vendor/jquery-validation/additional-methods.min.js"></script>
  <!-- Summernote -->
  <script src="./vendor/summernote/summernote-bs4.min.js"></script>
  <!-- CodeMirror -->
  <script src="./vendor/codemirror/codemirror.js"></script>
  <script src="./vendor/codemirror/mode/css/css.js"></script>
  <script src="./vendor/codemirror/mode/xml/xml.js"></script>
  <script src="./vendor/codemirror/mode/htmlmixed/htmlmixed.js"></script>
  <!-- fullCalendar 2.2.5 -->
  <script src="./vendor/moment/moment.min.js"></script>
  <script src="./vendor/fullcalendar/main.min.js"></script>
  <script src="./vendor/fullcalendar-daygrid/main.min.js"></script>
  <script src="./vendor/fullcalendar-timegrid/main.min.js"></script>
  <script src="./vendor/fullcalendar-interaction/main.min.js"></script>
  <script src="./vendor/fullcalendar-bootstrap/main.min.js"></script>
  <!-- simplemde -->
  <script src="./vendor/simplemde/dist/simplemde.min.js"></script>
	<!-- FontAwesome -->
	<script src="./vendor/fontawesome-free/4f8426d3cf.js" crossorigin="anonymous"></script>
	<!-- HE -->
	<script src="./vendor/he-master/he.js" crossorigin="anonymous"></script>
	<!-- Pace-Settings -->
	<script>
		window.paceOptions = {
			// Only show the progress on regular and ajax-y page navigation,
			// not every request
			restartOnRequestAfter: 5,
			startOnPageLoad:false,

			ajax: {
				trackMethods: ['GET', 'POST', 'PUT', 'DELETE', 'REMOVE'],
				trackWebSockets: true,
				ignoreURLs: [/.*api.php.*/]
			}
		};
	</script>
  <!-- Pace-Progress -->
	<script src="./vendor/pace-progress/pace.min.js"></script>
  <!-- overlayScrollbars -->
  <script src="./vendor/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
  <!-- dropzonejs -->
  <script src="./vendor/dropzone/min/dropzone.min.js"></script>
  <!-- whatwg-fetch -->
	<script>window.fetch = undefined;</script>
  <script src="./vendor/whatwg-fetch/fetch.umd.js"></script>
</head>
<body>
  <?php
    if($this->isInstall()){
  		if((!isset($this->Settings['maintenance']))||(!$this->Settings['maintenance'])){
  			if($this->isLogin()){
  				require_once dirname(__FILE__,2) . '/templates/layout/dashboard.php';
  			} else { require_once dirname(__FILE__,2) . '/templates/layout/signin.php'; }
  		} else { require_once dirname(__FILE__,2) . '/templates/layout/maintenance.php'; }
  	} else { require_once dirname(__FILE__,2) . '/templates/layout/install.php'; }
  ?>
</body>
</html>
