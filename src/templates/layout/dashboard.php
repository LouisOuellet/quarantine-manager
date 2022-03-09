<main>
  <div class="sidebar d-flex flex-column flex-shrink-0 bg-dark">
    <span class="d-block p-3 link-dark text-decoration-none">
      <img class="bi" src="/dist/img/logo.png">
    </span>
    <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
      <li>
        <a href="#dashboard" class="nav-link active py-3 border-top border-bottom" title="<?= $this->Fields['Dashboard'] ?>" data-bs-toggle="tooltip" data-bs-placement="right">
          <i class="fas fa-tachometer-alt" aria-label="<?= $this->Fields['Dashboard'] ?>"></i>
        </a>
      </li>
      <!-- <li>
        <a href="#settings" class="nav-link py-3 border-bottom" title="<?= $this->Fields['Settings'] ?>" data-bs-toggle="tooltip" data-bs-placement="right">
          <i class="fas fa-cog" aria-label="<?= $this->Fields['Settings'] ?>"></i>
        </a>
      </li> -->
    </ul>
    <div class="dropdown border-top" title="<?= $this->Fields['Profile'] ?>" data-bs-toggle="tooltip" data-bs-placement="right">
      <a href="#" class="d-flex align-items-center justify-content-center p-3 link-light text-decoration-none dropdown-toggle" id="UserMenu" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-user-circle"></i>
      </a>
      <ul class="dropdown-menu text-small shadow" aria-labelledby="UserMenu">
        <li><span class="dropdown-item"><?= $_SESSION['quarantine-username'] ?></span></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item"><?= $this->Fields['Sign out'] ?></a></li>
      </ul>
    </div>
  </div>
  <div class="content d-flex flex-column flex-shrink-0"></div>
</main>
<script src="./dist/js/engine.js"></script>
<script src="./dist/js/dashboard.js"></script>
