<!DOCTYPE html>
<!-- saved from url=(0048)https://dashkit.goodthemes.co/sign-up-cover.html -->
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="A fully featured admin theme which can be used to build CRM, CMS, etc.">

  <!-- Favicon -->
  <link rel="shortcut icon" href="https://dashkit.goodthemes.co/assets/favicon/favicon.ico" type="image/x-icon">

  <!-- Map CSS -->
  <link rel="stylesheet" href="{{asset('/assets/css/mapbox-gl.css')}}">


  <!-- Libs CSS -->
  <link rel="stylesheet" href="{{asset('/assets/css/libs.bundle.css')}}">


  <!-- Theme CSS -->
  <link rel="stylesheet" href="{{asset('/assets/css/theme.bundle.css')}}" id="stylesheetLight">
  <link rel="stylesheet" href="{{asset('/assets/css/theme-dark.bundle.css')}}" id="stylesheetDark" disabled="">

  <link href="{{ asset('/vendor/fontawesome-free/css/all.min.css') }}" rel="stylesheet" type="text/css">

  <style>
    body {
      display: none;
    }

    .btn-login-brand {
      background: linear-gradient(90deg, #0a0e36 0%, #040725 100%) !important;
      border: 2px solid #ebb30a !important;
      color: #fff !important;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-size: 0.95rem;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      box-shadow: 0 0 0 0 rgba(235, 179, 10, 0);
      transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
    }

    .btn-login-brand:hover,
    .btn-login-brand:focus {
      background: linear-gradient(90deg, #ebb30a 0%, #d4a008 100%) !important;
      border-color: #ebb30a !important;
      color: #040725 !important;
      box-shadow: 0 4px 18px rgba(235, 179, 10, 0.45);
      transform: translateY(-1px);
    }

    .btn-login-brand:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(235, 179, 10, 0.35) !important;
    }

    .btn-login-brand:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(235, 179, 10, 0.35), 0 4px 18px rgba(235, 179, 10, 0.45);
    }

    #togglePassword {
      cursor: pointer;
      background: #fff;
      border-color: #e2e6ea;
      color: #040725;
      min-width: 46px;
      justify-content: center;
    }

    #togglePassword:hover {
      color: #ebb30a;
    }
  </style>

  <!-- Title -->
  <title>POS</title>

<body class="d-flex align-items-center bg-auth border-top border-top-2 border-primary" style="display: block; background:#040725 !important; border-top:none !important">

  <!-- CONTENT
    ================================================== -->
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5 align-self-center">

        <!-- Heading -->
        <img src="/storage/{{$organization->logo_img}}" class="mb-3" alt="..." style="height:100px;margin-left:125px;">

        <!-- Subheading -->
        <p class="text-muted text-center mb-5">
          Welcome to POS.
        </p>

        <!-- Form -->
        <form method="POST" action="{{ route('login') }}">
          @csrf

          <!-- Email address -->
          <div class="form-group">

            <!-- Label -->
            <label class="form-label text-white">
              Email Address
            </label>

            <input id="email" type="text" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus tabindex="1">

            @error('email')
            <span class="invalid-feedback" role="alert">
              <strong>{{ $message }}</strong>
            </span>
            @enderror

          </div>

          <!-- Password -->
          <div class="form-group">

            <div class="row">
              <div class="col">

                <!-- Label -->
                <label class="form-label text-white">
                  Password
                </label>

              </div>
              <div class="col-auto">
                @if (Route::has('password.request'))
                <a href="{{ route('password.request') }}" class="form-text small text-muted">
                  {{ __('Forgot Your Password?') }}
                </a>
                @endif
              </div>
            </div>
            <!-- Input group -->
            <div class="input-group input-group-merge">

              <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password" tabindex="2">

              @error('password')
              <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
              </span>
              @enderror
              <button type="button" class="input-group-text" id="togglePassword" aria-label="Show password" title="Show password">
                <i class="fas fa-eye" id="togglePasswordIcon"></i>
              </button>

            </div>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn-lg w-100 btn-login-brand mb-3" tabindex="3">
            {{ __('Sign In') }}
          </button>

          <!-- Link -->
          <!--<div class="text-center">-->
          <!--  <small class="text-muted text-center">-->
          <!--    Don't have an account yet? <a href="{{ route('password.request') }}">Sign up</a>.-->
          <!--  </small>-->
          <!--</div>-->

        </form>

      </div>
      <div class="col-12 col-md-7 col-lg-6 col-xl-8 d-none d-lg-block">

        <!-- Image -->
        <div class="bg-cover h-100 min-vh-100 mt-n1 me-n3" style="background-image: url(assets/images/auth-side-cover.avif); z-index = 1;opacity: 0.5;"></div>

      </div>
    </div> <!-- / .row -->
  </div>

  <!-- JAVASCRIPT -->
  <!-- Map JS -->
  <script src="{{asset('/assets/js/mapbox-gl.js')}}"></script>


  <!-- Vendor JS -->
  <script src="{{asset('/assets/js/vendor.bundle.js')}}"></script>


  <!-- Theme JS -->
  <script src="{{asset('/assets/js/theme.bundle.js')}}"></script>

  <script>
    (function () {
      var toggle = document.getElementById('togglePassword');
      var password = document.getElementById('password');
      var icon = document.getElementById('togglePasswordIcon');
      if (!toggle || !password || !icon) {
        return;
      }
      toggle.addEventListener('click', function () {
        var show = password.type === 'password';
        password.type = show ? 'text' : 'password';
        icon.classList.toggle('fa-eye', !show);
        icon.classList.toggle('fa-eye-slash', show);
        toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        toggle.setAttribute('title', show ? 'Hide password' : 'Show password');
      });
    })();
  </script>


  <div id="draggable-live-region" aria-relevant="additions" aria-atomic="true" aria-live="assertive" role="log" style="position: fixed; width: 1px; height: 1px; top: -1px; overflow: hidden;"></div>
</body>

</html>