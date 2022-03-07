<!-- Custom styles for this template -->
<link href="/dist/css/signin.css" rel="stylesheet">
<style>
	.bd-placeholder-img {
		font-size: 1.125rem;
		text-anchor: middle;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
	}
	@media (min-width: 768px) {
		.bd-placeholder-img-lg {
			font-size: 3.5rem;
		}
	}
</style>
<div class="text-center">
	<main class="form-signin">
		<form>
			<img class="mb-4" src="/dist/img/logo.png" alt="" width="72" height="72">
			<h1 class="h3 mb-3 fw-normal">Please sign in</h1>
			<div class="form-floating">
				<input type="email" class="form-control" id="floatingInput" placeholder="<?= $this->Fields['Username'] ?>">
				<label for="floatingInput"><?= $this->Fields['Username'] ?></label>
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" id="floatingPassword" placeholder="<?= $this->Fields['Password'] ?>">
				<label for="floatingPassword"><?= $this->Fields['Password'] ?></label>
			</div>
			<div class="checkbox mb-3">
				<label>
					<input type="checkbox" value="remember-me"> Remember me
				</label>
			</div>
			<button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
			<p class="mt-5 mb-3 text-muted">&copy; 2017–<?= date("Y"); ?></p>
		</form>
	</main>
</div>
