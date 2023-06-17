<!DOCTYPE html>
<!-- saved from url=(0048)https://dashkit.goodthemes.co/sign-up-cover.html -->
<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    
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
   
    <style>body { display: none; }</style>
    
    <!-- Title -->
    <title>POS</title>
<body class="d-flex align-items-center bg-auth border-top border-top-2 border-primary" style="display: block; background:#152e4d !important; border-top:none !important">

    <!-- CONTENT
    ================================================== -->
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5 align-self-center">

          <!-- Heading -->
          <img src="{{asset('images/Shama-logo.png')}}" class="mb-3" alt="..." style="height: 45px;margin-left:85px;">

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

              <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

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
                                <a  href="{{ route('password.request') }}" class="form-text small text-muted">
                                    {{ __('Forgot Your Password?') }}
                                </a>
                            @endif
                  </div>
              </div>
              <!-- Input group -->
              <div class="input-group input-group-merge">

                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                <!-- Icon -->
                <span class="input-group-text">
                  <i class="fe fe-eye"></i>
                </span>

              </div>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn btn-lg w-100 btn-primary mb-3" fdprocessedid="nxu92">
              {{ __('Login') }}
          </button>
            
             <!-- Link -->
             <div class="text-center">
              <small class="text-muted text-center">
              Don't have an account yet? <a href="{{ route('password.request') }}">Sign up</a>.
              </small>
            </div>

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


  

<div id="draggable-live-region" aria-relevant="additions" aria-atomic="true" aria-live="assertive" role="log" style="position: fixed; width: 1px; height: 1px; top: -1px; overflow: hidden;"></div></body></html>