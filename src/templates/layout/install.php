<style>
  div.pace{
    display:none;
  }
</style>
<div class="install-page">
  <div class="install-box align-middle">
    <form id="SetupWizard" name="SetupWizard" method="post">
      <div id="accordion">
        <div class="collapse show" data-bs-parent="#accordion" id="welcome">
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5><?= $this->Fields['Installation Wizard'] ?></h5>
            </div>
            <div class="card-body">
              <p class="card-text"><?= $this->Fields['welcome_message'] ?></p>
            </div>
            <div class="card-footer">
              <button type="button" data-bs-target="#imap" data-bs-toggle="collapse" aria-expanded="false" class="btn btn-primary float-end"><?= $this->Fields['Get Started'] ?><i class="nav-icon fas fa-chevron-right ms-2"></i></button>
            </div>
          </div>
        </div>
        <div class="collapse" data-bs-parent="#accordion" id="imap">
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5><?= $this->Fields['IMAP'] ?></h5>
            </div>
            <div class="card-body">
              <div class="form-group row">
                <label for="imap_host" class="col-sm-2 col-form-label"><?= $this->Fields['Host'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-server"></i>
                  </span>
                  <input type="text" class="form-control" name="imap_host" id="imap_host" placeholder="<?= $this->Fields['Host'] ?>">
                </div>
              </div>
              <div class="form-group row">
                <label for="imap_encryption" class="col-sm-2 col-form-label"><?= $this->Fields['Encryption'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <select class="form-control" name="imap_encryption" id="imap_encryption">
                    <option value="ssl"><?= $this->Fields['SSL'] ?></option>
                    <option value="starttls"><?= $this->Fields['STARTTLS'] ?></option>
                    <option value="none"><?= $this->Fields['None'] ?></option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label for="imap_port" class="col-sm-2 col-form-label"><?= $this->Fields['Port'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-plug"></i>
                  </span>
                  <input type="text" class="form-control" name="imap_port" id="imap_port" placeholder="<?= $this->Fields['Port'] ?>">
                </div>
              </div>
              <div class="form-group row">
                <label for="imap_username" class="col-sm-2 col-form-label"><?= $this->Fields['Username'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-at"></i>
                  </span>
                  <input type="text" class="form-control" name="imap_username" id="imap_username" placeholder="<?= $this->Fields['Username'] ?>">
                </div>
              </div>
              <div class="form-group row">
                <label for="imap_password" class="col-sm-2 col-form-label"><?= $this->Fields['Password'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-key"></i>
                  </span>
                  <input type="password" class="form-control" name="imap_password" id="imap_password" placeholder="<?= $this->Fields['Password'] ?>">
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button type="button" data-bs-target="#welcome" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left me-2"></i><?= $this->Fields['Back'] ?></button>
              <button type="button" data-bs-target="#smtp" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-primary float-end"><?= $this->Fields['Next'] ?><i class="nav-icon fas fa-chevron-right ms-2"></i></button>
            </div>
          </div>
        </div>
        <div class="collapse" data-bs-parent="#accordion" id="smtp">
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5><?= $this->Fields['SMTP'] ?></h5>
            </div>
            <div class="card-body">
              <div class="form-group row">
                <label for="smtp_host" class="col-sm-2 col-form-label"><?= $this->Fields['Host'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-server"></i>
                  </span>
                  <input type="text" class="form-control" name="smtp_host" id="smtp_host" placeholder="<?= $this->Fields['Host'] ?>">
                </div>
              </div>
              <div class="form-group row">
                <label for="smtp_encryption" class="col-sm-2 col-form-label"><?= $this->Fields['Encryption'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <select class="form-control" name="smtp_encryption" id="smtp_encryption">
                    <option value="ssl"><?= $this->Fields['SSL'] ?></option>
                    <option value="starttls"><?= $this->Fields['STARTTLS'] ?></option>
                    <option value="none"><?= $this->Fields['None'] ?></option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label for="smtp_port" class="col-sm-2 col-form-label"><?= $this->Fields['Port'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-plug"></i>
                  </span>
                  <input type="text" class="form-control" name="smtp_port" id="smtp_port" placeholder="<?= $this->Fields['Port'] ?>">
                </div>
              </div>
              <div class="form-group row">
                <label for="smtp_username" class="col-sm-2 col-form-label"><?= $this->Fields['Username'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-at"></i>
                  </span>
                  <input type="text" class="form-control" name="smtp_username" id="smtp_username" placeholder="<?= $this->Fields['Username'] ?>">
                </div>
              </div>
              <div class="form-group row">
                <label for="smtp_password" class="col-sm-2 col-form-label"><?= $this->Fields['Password'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-key"></i>
                  </span>
                  <input type="password" class="form-control" name="smtp_password" id="smtp_password" placeholder="<?= $this->Fields['Password'] ?>">
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button type="button" data-bs-target="#imap" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left me-2"></i><?= $this->Fields['Back'] ?></button>
              <button type="button" data-bs-target="#site" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-primary float-end"><?= $this->Fields['Next'] ?><i class="nav-icon fas fa-chevron-right ms-2"></i></button>
            </div>
          </div>
        </div>
        <div class="collapse" data-bs-parent="#accordion" id="site">
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5><?= $this->Fields['Site Configuration'] ?></h5>
            </div>
            <div class="card-body">
              <div class="form-group row">
                <label for="language" class="col-sm-2 col-form-label"><?= $this->Fields['Language'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="fas fa-language"></i>
                  </span>
                  <select class="form-control" name="language" id="language">
                    <?php foreach($this->Languages as $language) {?>
                      <option value="<?=$language?>"<?php if((isset($_POST['site_language']))&&($_POST['site_language']==$language)){echo" selected";} else { if($this->Language==$language){ echo " selected"; } }?>><?=$language?></option>
                    <?php } ?>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label for="timezone" class="col-sm-2 col-form-label"><?= $this->Fields['Timezone'] ?></label>
                <div class="col-sm-10 input-group">
                  <span class="input-group-text">
                    <i class="far fa-clock"></i>
                  </span>
                  <select class="form-control" name="timezone" id="timezone">
                    <?php foreach($this->Timezones as $timezone) {?>
                      <option value="<?=$timezone?>"<?php if((isset($_POST['site_timezone']))&&($_POST['site_timezone']==$timezone)){echo" selected";} else { if(isset($this->Settings['timezone'])&&$this->Settings['timezone']==$timezone){ echo " selected"; } }?>><?=$timezone?></option>
                    <?php } ?>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button type="button" data-bs-target="#imap" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left me-2"></i><?= $this->Fields['Back'] ?></button>
              <button type="button" data-bs-target="#license" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-primary float-end"><?= $this->Fields['Next'] ?><i class="nav-icon fas fa-chevron-right ms-2"></i></button>
            </div>
          </div>
        </div>
        <div class="collapse" data-bs-parent="#accordion" id="license">
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5><?= $this->Fields['License'] ?></h5>
            </div>
            <div class="card-body" style="max-height:500px;overflow:scroll;">
              <p class="card-text">
                <?php include("LICENSE.html") ?>
                <div class="form-group mb-0">
                  <div class="icheck-primary">
                    <input type="checkbox" id="license term field" name="license term" style="position: static !important;">
                    <label for="license term field"><?= $this->Fields['I have read this License'] ?></label>
                  </div>
                </div>
              </p>
            </div>
            <div class="card-footer">
              <button type="button" data-bs-target="#site" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left me-2"></i><?= $this->Fields['Back'] ?></button>
              <button type="button" id="reviewBTN" data-bs-target="#review" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-primary float-end"><?= $this->Fields['Next'] ?><i class="nav-icon fas fa-chevron-right ms-2"></i></button>
            </div>
          </div>
        </div>
        <div class="collapse" data-bs-parent="#accordion" id="review">
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5><?= $this->Fields['Review Configuration'] ?></h5>
            </div>
            <div class="card-body row">
              <div class="col-6">
                <div class="card card-primary my-2">
                  <div class="card-header">
                    <h5><?= $this->Fields['IMAP'] ?></h5>
                  </div>
                  <div class="card-body">
                    <div class="row border-bottom pt-2">
                      <div class="col-4"><?= $this->Fields['Host'] ?></div>
                      <div class="col-8" id="review_imap_host"></div>
                    </div>
                    <div class="row border-bottom pt-2">
                      <div class="col-4"><?= $this->Fields['Encryption'] ?></div>
                      <div class="col-8" id="review_imap_encryption"></div>
                    </div>
                    <div class="row border-bottom pt-2">
                      <div class="col-4"><?= $this->Fields['Port'] ?></div>
                      <div class="col-8" id="review_imap_port"></div>
                    </div>
                    <div class="row border-bottom pt-2">
                      <div class="col-4"><?= $this->Fields['Username'] ?></div>
                      <div class="col-8" id="review_imap_username"></div>
                    </div>
                    <div class="row pt-2">
                      <div class="col-4"><?= $this->Fields['Password'] ?></div>
                      <div class="col-8" id="review_imap_password"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="card card-primary my-2">
                  <div class="card-header">
                    <h5><?= $this->Fields['SMTP'] ?></h5>
                  </div>
                  <div class="card-body">
                    <div class="row border-bottom pt-2">
                      <div class="col-4"><?= $this->Fields['Host'] ?></div>
                      <div class="col-8" id="review_smtp_host"></div>
                    </div>
                    <div class="row border-bottom pt-2">
                      <div class="col-4"><?= $this->Fields['Encryption'] ?></div>
                      <div class="col-8" id="review_smtp_encryption"></div>
                    </div>
                    <div class="row border-bottom pt-2">
                      <div class="col-4"><?= $this->Fields['Port'] ?></div>
                      <div class="col-8" id="review_smtp_port"></div>
                    </div>
                    <div class="row border-bottom pt-2">
                      <div class="col-4"><?= $this->Fields['Username'] ?></div>
                      <div class="col-8" id="review_smtp_username"></div>
                    </div>
                    <div class="row pt-2">
                      <div class="col-4"><?= $this->Fields['Password'] ?></div>
                      <div class="col-8" id="review_smtp_password"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="card card-primary my-2">
                  <div class="card-header">
                    <h5><?= $this->Fields['Site Configuration'] ?></h5>
                  </div>
                  <div class="card-body">
                    <div class="row border-bottom pt-2">
                      <div class="col-4"><?= $this->Fields['Language'] ?></div>
                      <div class="col-8" id="review_language"></div>
                    </div>
                    <div class="row pt-2">
                      <div class="col-4"><?= $this->Fields['Timezone'] ?></div>
                      <div class="col-8" id="review_timezone"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button type="button" data-bs-target="#license" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left me-2"></i><?= $this->Fields['Back'] ?></button>
              <button type="submit" name="StartInstall" class="btn btn-success float-end"><?= $this->Fields['Install'] ?><i class="nav-icon far fa-play-circle ms-2"></i></button>
            </div>
          </div>
        </div>
        <div class="collapse" data-bs-parent="#accordion" id="log">
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5><?= $this->Fields['Installation Details'] ?></h5>
            </div>
            <div class="card-body p-0">
              <div class="progress" style="height: 48px;">
                <div id="log-progress" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
              </div>
              <div class="m-3 p-2 terminal"><p class="card-text" id="log-container"></p></div>
            </div>
            <div class="card-footer">
              <button type="button" data-action="back" data-bs-target="#welcome" data-bs-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left me-2"></i><?= $this->Fields['Back'] ?></button>
              <a href="<?=$this->URL?>" data-action="login" class="btn btn-success float-end">
                <?= $this->Fields['Sign in'] ?><i class="nav-icon fas fa-sign-in-alt ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
<script src="/dist/js/install.js"></script>
