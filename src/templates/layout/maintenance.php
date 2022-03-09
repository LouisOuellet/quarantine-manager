<div class="login-page">
  <div class="login-box">
    <div class="collapse show">
      <div class="card card-danger card-outline">
        <div class="card-header"></div>
        <div class="card-body">
          <h1 style="text-align:center;"><i class="fas fa-3x fa-exclamation-triangle"></i></h1>
          <h1 style="text-align:center;"><?= $this->Language->Field['Maintenance'] ?></h1>
          <p style="text-align:center;"><?= $this->Language->Field['This'] ?> <?= $this->Settings['title']?> <?= $this->Language->Field['instance_is_in_maintenance_mode'] ?></p>
          <p style="text-align:center;"><?= $this->Language->Field['Contact_your_system_administrator'] ?></p>
        </div>
        <div class="card-footer bg-danger"></div>
      </div>
    </div>
  </div>
</div>
