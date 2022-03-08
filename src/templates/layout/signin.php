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
<div class="signin-page">
	<div class="signin-box">
		<main class="form-signin">
			<form method="post">
				<img class="mb-4" src="/dist/img/logo.png" alt="" width="72" height="72">
				<h1 class="h3 mb-3 fw-normal"><?= $this->Fields['Quarantine'] ?></h1>
				<div class="form-floating">
					<input type="email" class="form-control" id="username" name="username" placeholder="<?= $this->Fields['Username'] ?>">
					<label for="username"><?= $this->Fields['Username'] ?></label>
				</div>
				<div class="form-floating">
					<input type="password" class="form-control" id="password" name="password" placeholder="<?= $this->Fields['Password'] ?>">
					<label for="password"><?= $this->Fields['Password'] ?></label>
				</div>
				<button class="w-100 btn btn-lg btn-primary" type="submit" id="signin" name="signin"><?= $this->Fields['Sign in'] ?></button>
				<p class="mt-5 mb-3 text-muted">&copy; 2017–<?= date("Y"); ?></p>
			</form>
		</main>
	</div>
</div>
