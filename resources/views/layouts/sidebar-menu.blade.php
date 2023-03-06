<nav class="navbar navbar-vertical fixed-start navbar-expand-md navbar-light" id="sidebar">
  <div class="container-fluid">

    <!-- Toggler -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Brand -->
    <a class="navbar-brand" href="{{route('home')}}">
      <img src="{{asset('assets/images/logo.svg')}}" class="navbar-brand-img mx-auto" alt="...">
    </a>

    <!-- User (xs) -->
    <div class="navbar-user d-md-none">

      <!-- Dropdown -->
      <div class="dropdown">

        <!-- Toggle -->
        <a href="https://dashkit.goodthemes.co/index.html#" id="sidebarIcon" class="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <div class="avatar avatar-sm avatar-online">
            <img src="{{asset('assets/images/avatar-1.jpg')}}" class="avatar-img rounded-circle" alt="...">
          </div>
        </a>
        <!-- Menu -->
        <div class="dropdown-menu dropdown-menu-end" aria-labelledby="sidebarIcon">
          <a href="https://dashkit.goodthemes.co/profile-posts.html" class="dropdown-item">Profile</a>
          <a href="https://dashkit.goodthemes.co/account-general.html" class="dropdown-item">Settings</a>
          <hr class="dropdown-divider">
          <a href="https://dashkit.goodthemes.co/sign-in.html" class="dropdown-item">Logout</a>
        </div>
      </div>

    </div>

    <!-- Collapse -->
    <div class="collapse navbar-collapse" id="sidebarCollapse">
      <!-- Navigation -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link " href="https://dashkit.goodthemes.co/widgets.html">
          <i class="fa fa-home" aria-hidden="true"></i> Dashboard
          </a>
        </li>
      </ul>
      <!-- Divider -->
      <hr class="navbar-divider my-3">

      <!-- Heading -->
      <h6 class="navbar-heading">
        Documentation
      </h6>
      <!-- Navigation -->
      <li class="nav-item">
        <a class="nav-link p-0 customer-class" href="{{route('customer.index')}}">
        <i class="fa fa-users" aria-hidden="true"></i> Customer
        </a>
      </li>

      <ul class="navbar-nav ">
        <li class="nav-item">
          <a class="nav-link collapsed" href="https://dashkit.goodthemes.co/index.html#sidebarproducts" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarproducts">
            <i class="fa fa-clipboard"></i> Products
          </a>
          <div class="collapse " id="sidebarproducts">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <a href="{{route('company.index')}}" class="nav-link ">
                  Companies
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('products')}}" class="nav-link ">
                  Products
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <ul class="navbar-nav ">
        <li class="nav-item">
          <a class="nav-link collapsed" href="https://dashkit.goodthemes.co/index.html#sidebarStock" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarStock">
          <i class="fa fa-briefcase" aria-hidden="true"></i> Stocks
          </a>
          <div class="collapse " id="sidebarStock">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <a href="{{route('stock-add')}}" class="nav-link ">
                  Add New
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('purchases')}}" class="nav-link ">
                  List
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('purchase-return')}}" class="nav-link ">
                  Purchase Returns
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <ul class="navbar-nav ">
        <li class="nav-item">
          <a class="nav-link collapsed" href="#salesStock" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="salesStock">
          <i class="fa fa-shopping-bag" aria-hidden="true"></i> Sales
          </a>
          <div class="collapse " id="salesStock">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <a href="{{route('sale-add')}}" class="nav-link ">
                  Add New
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('purchases')}}" class="nav-link ">
                  List
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('purchase-return')}}" class="nav-link ">
                  Sales Returns
                </a>
              </li>
            </ul>
          </div>
        </li>


      </ul>
      <!-- Push content down -->
      <div class="mt-auto"></div>
      <!-- User (md) -->
      <div class="navbar-user d-none d-md-flex" id="sidebarUser">

        <!-- Icon -->
        <a class="navbar-user-link" data-bs-toggle="offcanvas" href="https://dashkit.goodthemes.co/index.html#sidebarOffcanvasActivity" aria-controls="sidebarOffcanvasActivity">
          <span class="icon">
            <i class="fe fe-bell"></i>
          </span>
        </a>

        <!-- Dropup -->
        <div class="dropup">

          <!-- Toggle -->
          <a href="https://dashkit.goodthemes.co/index.html#" id="sidebarIconCopy" class="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="avatar avatar-sm avatar-online">
              <img src="{{asset('/assets/images/avatar-1.jpg')}}" class="avatar-img rounded-circle" alt="...">
            </div>
          </a>
          <!-- Menu -->
          <div class="dropdown-menu" aria-labelledby="sidebarIconCopy">
            <a href="https://dashkit.goodthemes.co/profile-posts.html" class="dropdown-item">Profile</a>
            <a href="https://dashkit.goodthemes.co/account-general.html" class="dropdown-item">Settings</a>
            <hr class="dropdown-divider">
            <a href="https://dashkit.goodthemes.co/sign-in.html" class="dropdown-item">Logout</a>
          </div>

        </div>

        <!-- Icon -->
        <a class="navbar-user-link" data-bs-toggle="offcanvas" href="https://dashkit.goodthemes.co/index.html#sidebarOffcanvasSearch" aria-controls="sidebarOffcanvasSearch">
          <span class="icon">
            <i class="fe fe-search"></i>
          </span>
        </a>

      </div>

    </div> <!-- / .navbar-collapse -->

  </div>
</nav>