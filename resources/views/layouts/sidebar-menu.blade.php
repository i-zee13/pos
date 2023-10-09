<nav class="navbar navbar-vertical fixed-start navbar-expand-md navbar-light" id="sidebar">
  <div class="container-fluid">

    <!-- Toggler -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Brand -->
    <a class="navbar-brand" href="{{route('home')}}">
      <img src="{{asset('images/Shama-logo.png')}}" class="navbar-brand-img mx-auto" alt="..." style="height: 35px;">
    </a>

    <!-- User (xs) -->
    <div class="navbar-user d-md-none">

      <!-- Dropdown -->
      <div class="dropdown">

        <!-- Toggle -->
        <a href="#" id="sidebarIcon" class="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <div class="avatar avatar-sm avatar-online">
            <img src="{{asset('assets/images/avatar-1.jpg')}}" class="avatar-img rounded-circle" alt="...">
          </div>
        </a>
        <!-- Menu -->
        <div class="dropdown-menu dropdown-menu-end" aria-labelledby="sidebarIcon">
          <a href="#" class="dropdown-item">Profile</a>
          <a href="#" class="dropdown-item">Settings</a>
          <hr class="dropdown-divider">
          <a href="{{ route('logout') }}" class="dropdown-item">Logout</a>
        </div>
      </div>

    </div>

    <!-- Collapse -->
    <div class="collapse navbar-collapse" id="sidebarCollapse">
      <!-- Navigation -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link " href="{{route('home')}}">
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

      <ul class="navbar-nav ">
        <li class="nav-item">
          <a class="nav-link collapsed" href="#sidebarclient" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarclient">
            <i class="fa fa-briefcase" aria-hidden="true"></i> Clients
          </a>
          <div class="collapse" id="sidebarclient">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <a href="{{route('vendors.index')}}" class="nav-link ">
                  Vendors
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('customer.index')}}" class="nav-link ">
                  Customers
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <!-- <li class="nav-item">
        <a class="nav-link p-0 customer-class" href="{{route('customer.index')}}">
        <i class="fa fa-users mr-5" aria-hidden="true"></i> Customer
        </a>
      </li> -->

      <ul class="navbar-nav ">
        <li class="nav-item">
          <a class="nav-link collapsed" href="#sidebarproducts" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarproducts">
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
              <li class="nav-item">
                <a href="{{route('change-price')}}" class="nav-link ">
                  Change Price
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <ul class="navbar-nav ">
        <li class="nav-item">
          <a class="nav-link collapsed" href="#sidebarStock" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarStock">
            <i class="fa fa-briefcase" aria-hidden="true"></i> Purchases
          </a>
          <div class="collapse " id="sidebarStock">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <a href="{{route('stock-add')}}" class="nav-link add-new-purchase">
                  Add New
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('purchases')}}" class="nav-link ">
                  List
                </a>
              </li>
              <li class="nav-item">
                <a href="#sidebarPurchaseReturnDropDown" class="nav-link collapsed" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarPurchaseReturnDropDown">
                 Returns
                </a>
                <div class="collapse" id="sidebarPurchaseReturnDropDown" style="">
                  <ul class="nav nav-sm flex-column">
                    <li class="nav-item">
                      <a href="{{route('purchase-return.create')}}" class="nav-link add-purchase-return">
                        Add New
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="{{route('purchase-return.index')}}" class="nav-link">
                        List
                      </a>
                    </li>
                  </ul>
                </div>

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
                <a href="{{route('sale-add')}}" class="nav-link add-new-sale">
                  Add New
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('sales')}}" class="nav-link ">
                  Today List
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('all-sales-list')}}" class="nav-link ">
                  All List
                </a>
              </li>
              <li class="nav-item">
                <a href="#sidebarSaleReturnDropDown" class="nav-link collapsed" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarSaleReturnDropDown">
                 Returns
                </a>
                <div class="collapse" id="sidebarSaleReturnDropDown" style="">
                  <ul class="nav nav-sm flex-column">
                    <li class="nav-item">
                      <a href="{{route('salereturn.create')}}" class="nav-link add-sale-return">
                        Add New
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="{{route('salereturn.index')}}" class="nav-link ">
                        List
                      </a>
                    </li>
                  </ul>
                </div>

              </li>
              <li class="nav-item">
                <a href="#sidebarProductReplacementDropDown" class="nav-link collapsed" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarProductReplacementDropDown">
                  Replacements
                </a>
                <div class="collapse" id="sidebarProductReplacementDropDown" style="">
                  <ul class="nav nav-sm flex-column">
                    <li class="nav-item">
                      <a href="{{route('ProductReplacement.create')}}" class="nav-link add-replacement">
                        Add New
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="{{route('ProductReplacement.index')}}" class="nav-link ">
                        List
                      </a>
                    </li>
                  </ul>
                </div>

              </li>
            </ul>
          </div>
        </li>


      </ul>
      <ul class="navbar-nav ">
        <li class="nav-item">
          <a class="nav-link collapsed" href="#transactions" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="transactions">
            <i class="fa fa-money" aria-hidden="true"></i> Transactions
          </a>
          <div class="collapse " id="transactions">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <a href="#sidebarCustomerLedger" class="nav-link collapsed" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarCustomerLedger">
                  Customers
                </a>
                <div class="collapse" id="sidebarCustomerLedger" style="">
                  <ul class="nav nav-sm flex-column">
                    <li class="nav-item">
                      <a href="{{route('customer-ledger-jama')}}" class="nav-link " style="font-size:20px;">
                        جمع
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="{{route('customer-ledger-banam')}}" class="nav-link " style="font-size:20px;">
                        بنام
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="nav-item">
                <a href="#sidebarVendorLedger" class="nav-link collapsed" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarVendorLedger">
                  Vendors
                </a>
                <div class="collapse" id="sidebarVendorLedger" style="">
                  <ul class="nav nav-sm flex-column">
                    <li class="nav-item">
                      <a href="{{route('vendor-ledger-jama')}}" class="nav-link " style="font-size:20px;">
                        جمع
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="{{route('vendor-ledger-banam')}}" class="nav-link " style="font-size:20px;">
                        بنام
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <!-- <li class="nav-item">
                <a href="{{route('vendor-ledgers')}}" class="nav-link ">
                  Vendors
                </a>
              </li> -->

            </ul>
          </div>
        </li>

      </ul>
      <ul class="navbar-nav ">
        <li class="nav-item">
          <a class="nav-link collapsed" href="#reporting" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="reporting">
            <i class="fa fa-bar-chart" aria-hidden="true"></i> Reporting
          </a>
          <div class="collapse " id="reporting">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <a href="{{route('customer-reports')}}" class="nav-link ">
                  Customers
                </a>
              </li>
              <li class="nav-item">
                <a href="{{route('vendor-reports')}}" class="nav-link ">
                  Vendors
                </a>
              </li>
              <li class="nav-item">
                <a href="#sidebarStockDropDown" class="nav-link collapsed" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarStockDropDown">
                  Stock Report
                </a>
                <div class="collapse" id="sidebarStockDropDown" style="">
                  <ul class="nav nav-sm flex-column">
                    <li class="nav-item">
                      <a href="{{route('stock-reports')}}" class="nav-link ">
                        Stock
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="{{route('stock-value-report')}}" class="nav-link ">
                        Value Report
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

              <li class="nav-item">
                <a href="{{route('sale-reports')}}" class="nav-link ">
                  Sale
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
        <a class="navbar-user-link" data-bs-toggle="offcanvas" href="#" aria-controls="sidebarOffcanvasActivity">
          <span class="icon">
            <i class="fe fe-bell"></i>
          </span>
        </a>

        <!-- Dropup -->
        <div class="dropup">

          <!-- Toggle -->
          <a href="#" id="sidebarIconCopy" class="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="avatar avatar-sm avatar-online">
              <img src="{{asset('/assets/images/avatar-1.jpg')}}" class="avatar-img rounded-circle" alt="...">
            </div>
          </a>
          <!-- Menu -->
          <div class="dropdown-menu" aria-labelledby="sidebarIconCopy">
            <a href="#" class="dropdown-item">Profile</a>
            <a href="#" class="dropdown-item">Settings</a>
            <a href="/admin-sale-close" class="dropdown-item">Admin Close</a>
            <hr class="dropdown-divider">
            <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
              {{ __('Logout') }}
            </a>
            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
              @csrf
            </form>

          </div>

        </div>

        <!-- Icon -->
        <a class="navbar-user-link" data-bs-toggle="offcanvas" href="#" aria-controls="sidebarOffcanvasSearch">
          <span class="icon">
            <i class="fe fe-search"></i>
          </span>
        </a>

      </div>

    </div> <!-- / .navbar-collapse -->

  </div>
</nav>
