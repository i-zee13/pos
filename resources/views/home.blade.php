@extends('layouts.app')

@section('content')
 <!-- CARDS -->
 <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-lg-6 col-xl">

            <!-- Value  -->
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center gx-0">
                  <div class="col">

                    <!-- Title -->
                    <h6 class="text-uppercase text-muted mb-2">
                      Value
                    </h6>

                    <!-- Heading -->
                    <span class="h2 mb-0">
                      $24,500
                    </span>

                    <!-- Badge -->
                    <span class="badge bg-success-soft mt-n1">
                      +3.5%
                    </span>
                  </div>
                  <div class="col-auto">

                    <!-- Icon -->
                    <span class="h2 fe fe-dollar-sign text-muted mb-0"></span>

                  </div>
                </div> <!-- / .row -->
              </div>
            </div>

          </div>
          <div class="col-12 col-lg-6 col-xl">

            <!-- Hours -->
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center gx-0">
                  <div class="col">

                    <!-- Title -->
                    <h6 class="text-uppercase text-muted mb-2">
                      Total hours
                    </h6>

                    <!-- Heading -->
                    <span class="h2 mb-0">
                      763.5
                    </span>

                  </div>
                  <div class="col-auto">

                    <!-- Icon -->
                    <span class="h2 fe fe-briefcase text-muted mb-0"></span>

                  </div>
                </div> <!-- / .row -->
              </div>
            </div>

          </div>
          <div class="col-12 col-lg-6 col-xl">

            <!-- Exit -->
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center gx-0">
                  <div class="col">

                    <!-- Title -->
                    <h6 class="text-uppercase text-muted mb-2">
                      Exit %
                    </h6>

                    <!-- Heading -->
                    <span class="h2 mb-0">
                      35.5%
                    </span>

                  </div>
                  <div class="col-auto">

                    <!-- Chart -->
                    <div class="chart chart-sparkline">
                      <canvas class="chart-canvas" id="sparklineChart" width="75" height="35" style="display: block; box-sizing: border-box; height: 35px; width: 75px;"></canvas>
                    </div>

                  </div>
                </div> <!-- / .row -->
              </div>
            </div>

          </div>
          <div class="col-12 col-lg-6 col-xl">

            <!-- Time -->
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center gx-0">
                  <div class="col">

                    <!-- Title -->
                    <h6 class="text-uppercase text-muted mb-2">
                      Avg. Time
                    </h6>

                    <!-- Heading -->
                    <span class="h2 mb-0">
                      2:37
                    </span>

                  </div>
                  <div class="col-auto">

                    <!-- Icon -->
                    <span class="h2 fe fe-clock text-muted mb-0"></span>

                  </div>
                </div> <!-- / .row -->
              </div>
            </div>

          </div>
        </div> <!-- / .row -->
        <div class="row">
          <div class="col-12 col-xl-8">

            <!-- Convertions -->
            <div class="card">
              <div class="card-header">

                <!-- Title -->
                <h4 class="card-header-title">
                  Conversions
                </h4>

                <!-- Caption -->
                <span class="text-muted me-3">
                  Last year comparision:
                </span>

                <!-- Switch -->
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="cardToggle" data-toggle="chart" data-target="#conversionsChart" data-trigger="change" data-action="add" data-dataset="1">
                  <label class="form-check-label" for="cardToggle"></label>
                </div>

              </div>
              <div class="card-body">

                <!-- Chart -->
                <div class="chart">
                  <canvas id="conversionsChart" class="chart-canvas" width="626" height="300" style="display: block; box-sizing: border-box; height: 300px; width: 626px;"></canvas>
                <div id="chart-tooltip" role="tooltip" class="popover bs-popover-top" style="visibility: hidden; left: 209.211px; top: 119.77px; transform: translateX(-50%) translateY(-100%) translateY(-1rem);"><div class="popover-arrow translate-middle-x"></div><div class="popover-content"><div><h3 class="popover-header text-center text-nowrap">Oct 4</h3></div><div><div class="popover-body d-flex align-items-center text-nowrap justify-content-center"><span class="popover-body-indicator" style="background-color: rgb(44, 123, 229);"></span> 22%</div></div></div></div></div>

              </div>
            </div>
          </div>
          <div class="col-12 col-xl-4">

            <!-- Traffic -->
            <div class="card">
              <div class="card-header">

                <!-- Title -->
                <h4 class="card-header-title">
                  Traffic Channels
                </h4>

                <!-- Tabs -->
                <ul class="nav nav-tabs nav-tabs-sm card-header-tabs">
                  <li class="nav-item" data-toggle="chart" data-target="#trafficChart" data-trigger="click" data-action="toggle" data-dataset="0">
                    <a href="https://dashkit.goodthemes.co/index.html#" class="nav-link active" data-bs-toggle="tab">
                      All
                    </a>
                  </li>
                  <li class="nav-item" data-toggle="chart" data-target="#trafficChart" data-trigger="click" data-action="toggle" data-dataset="1">
                    <a href="https://dashkit.goodthemes.co/index.html#" class="nav-link" data-bs-toggle="tab">
                      Direct
                    </a>
                  </li>
                </ul>

              </div>
              <div class="card-body">

                <!-- Chart -->
                <div class="chart chart-appended">
                  <canvas id="trafficChart" class="chart-canvas" data-toggle="legend" data-target="#trafficChartLegend" width="276" height="240" style="display: block; box-sizing: border-box; height: 240px; width: 276px;"></canvas>
                </div>

                <!-- Legend -->
                <div id="trafficChartLegend" class="chart-legend"><div><span class="chart-legend-item"><span class="chart-legend-indicator" style="background-color: #2C7BE5"></span>Direct</span><span class="chart-legend-item"><span class="chart-legend-indicator" style="background-color: #A6C5F7"></span>Organic</span><span class="chart-legend-item"><span class="chart-legend-indicator" style="background-color: #D2DDEC"></span>Referral</span></div></div>

              </div>
            </div>
          </div>
        </div> <!-- / .row -->
        <div class="row">
          <div class="col-12 col-xl-4">

            <!-- Projects -->
            <div class="card card-fill">
              <div class="card-header">

                <!-- Title -->
                <h4 class="card-header-title">
                  Projects
                </h4>

                <!-- Link -->
                <a href="https://dashkit.goodthemes.co/project-overview.html" class="small">View all</a>

              </div>
              <div class="card-body">

                <!-- List group -->
                <div class="list-group list-group-flush my-n3">
                  <div class="list-group-item">
                    <div class="row align-items-center">
                      <div class="col-auto">

                        <!-- Avatar -->
                        <a href="https://dashkit.goodthemes.co/project-overview.html" class="avatar avatar-4by3">
                          <img src="./assets/images/project-1.jpg" alt="..." class="avatar-img rounded">
                        </a>

                      </div>
                      <div class="col ms-n2">

                        <!-- Title -->
                        <h4 class="mb-1">
                          <a href="https://dashkit.goodthemes.co/project-overview.html">Homepage Redesign</a>
                        </h4>

                        <!-- Time -->
                        <p class="card-text small text-muted">
                          <time datetime="2018-05-24">Updated 4hr ago</time>
                        </p>

                      </div>
                      <div class="col-auto">

                        <!-- Dropdown -->
                        <div class="dropdown">
                          <a href="https://dashkit.goodthemes.co/index.html#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Another action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Something else here
                            </a>
                          </div>
                        </div>

                      </div>
                    </div> <!-- / .row -->
                  </div>
                  <div class="list-group-item">
                    <div class="row align-items-center">
                      <div class="col-auto">

                        <!-- Avatar -->
                        <a href="https://dashkit.goodthemes.co/project-overview.html" class="avatar avatar-4by3">
                          <img src="./assets/images/project-2.jpg" alt="..." class="avatar-img rounded">
                        </a>

                      </div>
                      <div class="col ms-n2">

                        <!-- Title -->
                        <h4 class="mb-1">
                          <a href="https://dashkit.goodthemes.co/project-overview.html">Travels &amp; Time</a>
                        </h4>

                        <!-- Time -->
                        <p class="card-text small text-muted">
                          <time datetime="2018-05-24">Updated 4hr ago</time>
                        </p>

                      </div>
                      <div class="col-auto">

                        <!-- Dropdown -->
                        <div class="dropdown">
                          <a href="https://dashkit.goodthemes.co/index.html#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Another action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Something else here
                            </a>
                          </div>
                        </div>

                      </div>
                    </div> <!-- / .row -->
                  </div>
                  <div class="list-group-item">
                    <div class="row align-items-center">
                      <div class="col-auto">

                        <!-- Avatar -->
                        <a href="https://dashkit.goodthemes.co/project-overview.html" class="avatar avatar-4by3">
                          <img src="./assets/images/project-3.jpg" alt="..." class="avatar-img rounded">
                        </a>

                      </div>
                      <div class="col ms-n2">

                        <!-- Title -->
                        <h4 class="mb-1">
                          <a href="https://dashkit.goodthemes.co/project-overview.html">Safari Exploration</a>
                        </h4>

                        <!-- Time -->
                        <p class="card-text small text-muted">
                          <time datetime="2018-05-24">Updated 4hr ago</time>
                        </p>

                      </div>
                      <div class="col-auto">

                        <!-- Dropdown -->
                        <div class="dropdown">
                          <a href="https://dashkit.goodthemes.co/index.html#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Another action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Something else here
                            </a>
                          </div>
                        </div>

                      </div>
                    </div> <!-- / .row -->
                  </div>
                  <div class="list-group-item">
                    <div class="row align-items-center">
                      <div class="col-auto">

                        <!-- Avatar -->
                        <a href="https://dashkit.goodthemes.co/project-overview.html" class="avatar avatar-4by3">
                          <img src="./assets/images/project-5.jpg" alt="..." class="avatar-img rounded">
                        </a>

                      </div>
                      <div class="col ms-n2">

                        <!-- Title -->
                        <h4 class="mb-1">
                          <a href="https://dashkit.goodthemes.co/project-overview.html">Personal Site</a>
                        </h4>

                        <!-- Time -->
                        <p class="card-text small text-muted">
                          <time datetime="2018-05-24">Updated 4hr ago</time>
                        </p>

                      </div>
                      <div class="col-auto">

                        <!-- Dropdown -->
                        <div class="dropdown">
                          <a href="https://dashkit.goodthemes.co/index.html#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Another action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Something else here
                            </a>
                          </div>
                        </div>

                      </div>
                    </div> <!-- / .row -->
                  </div>
                </div>

              </div> <!-- / .card-body -->
            </div> <!-- / .card -->
          </div>
          <div class="col-12 col-xl-8">

            <!-- Sales -->
            <div class="card">
              <div class="card-header">

                <!-- Title -->
                <h4 class="card-header-title">
                  Sales
                </h4>

                <!-- Nav -->
                <ul class="nav nav-tabs nav-tabs-sm card-header-tabs">
                  <li class="nav-item" data-toggle="chart" data-target="#salesChart" data-trigger="click" data-action="toggle" data-dataset="0">
                    <a class="nav-link active" href="https://dashkit.goodthemes.co/index.html#" data-bs-toggle="tab">
                      All
                    </a>
                  </li>
                  <li class="nav-item" data-toggle="chart" data-target="#salesChart" data-trigger="click" data-action="toggle" data-dataset="1">
                    <a class="nav-link" href="https://dashkit.goodthemes.co/index.html#" data-bs-toggle="tab">
                      Direct
                    </a>
                  </li>
                  <li class="nav-item" data-toggle="chart" data-target="#salesChart" data-trigger="click" data-action="toggle" data-dataset="2">
                    <a class="nav-link" href="https://dashkit.goodthemes.co/index.html#" data-bs-toggle="tab">
                      Organic
                    </a>
                  </li>
                </ul>

              </div>
              <div class="card-body">

                <!-- Chart -->
                <div class="chart">
                  <canvas id="salesChart" class="chart-canvas" width="626" height="300" style="display: block; box-sizing: border-box; height: 300px; width: 626px;"></canvas>
                <div id="chart-tooltip" role="tooltip" class="popover bs-popover-top" style="visibility: hidden; left: 103.509px; top: 168.867px; transform: translateX(-50%) translateY(-100%) translateY(-1rem);"><div class="popover-arrow translate-middle-x"></div><div class="popover-content"><div><h3 class="popover-header text-center text-nowrap">Oct 3</h3></div><div><div class="popover-body d-flex align-items-center text-nowrap justify-content-center"><span class="popover-body-indicator" style="background-color: rgb(44, 123, 229);"></span> $10k</div></div></div></div></div>

              </div>
            </div>

          </div>
        </div> <!-- / .row -->
        <div class="row">
          <div class="col-12">

            <!-- Goals -->
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">

                    <!-- Title -->
                    <h4 class="card-header-title">
                      Goals
                    </h4>

                  </div>
                  <div class="col-auto">

                    <!-- Button -->
                    <a href="https://dashkit.goodthemes.co/index.html#!" class="btn btn-sm btn-white">
                      Export
                    </a>

                  </div>
                </div> <!-- / .row -->
              </div>
              <div class="table-responsive mb-0" data-list="{&quot;valueNames&quot;: [&quot;goal-project&quot;, &quot;goal-status&quot;, &quot;goal-progress&quot;, &quot;goal-date&quot;]}">
                <table class="table table-sm table-nowrap card-table">
                  <thead>
                    <tr>
                      <th>
                        <a href="https://dashkit.goodthemes.co/index.html#" class="text-muted list-sort" data-sort="goal-project">
                          Goal
                        </a>
                      </th>
                      <th>
                        <a href="https://dashkit.goodthemes.co/index.html#" class="text-muted list-sort" data-sort="goal-status">
                          Status
                        </a>
                      </th>
                      <th>
                        <a href="https://dashkit.goodthemes.co/index.html#" class="text-muted list-sort" data-sort="goal-progress">
                          Progress
                        </a>
                      </th>
                      <th>
                        <a href="https://dashkit.goodthemes.co/index.html#" class="text-muted list-sort" data-sort="goal-date">
                          Due date
                        </a>
                      </th>
                      <th class="text-end">
                        Team
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody class="list"><tr>
                      <td class="goal-project">
                        Update the API
                      </td>
                      <td class="goal-status">
                        <span class="text-warning">●</span> In progress
                      </td>
                      <td class="goal-progress">
                        55%
                      </td>
                      <td class="goal-date">
                        <time datetime="2018-10-24">07/24/18</time>
                      </td>
                      <td class="text-end">
                        <div class="avatar-group">
                          <a href="https://dashkit.goodthemes.co/profile-posts.html" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Dianna Smiley">
                            <img src="./assets/images/avatar-1.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/profile-posts.html" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Ab Hadley">
                            <img src="./assets/images/avatar-2.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/profile-posts.html" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Adolfo Hess">
                            <img src="./assets/images/avatar-3.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/profile-posts.html" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Daniela Dewitt">
                            <img src="./assets/images/avatar-4.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                        </div>
                      </td>
                      <td class="text-end">
                        <div class="dropdown">
                          <a href="https://dashkit.goodthemes.co/index.html#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Another action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Something else here
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr><tr>
                      <td class="goal-project">
                        Release v1.2-Beta
                      </td>
                      <td class="goal-status">
                        <span class="text-warning">●</span> In progress
                      </td>
                      <td class="goal-progress">
                        25%
                      </td>
                      <td class="goal-date">
                        <time datetime="2018-10-24">08/26/18</time>
                      </td>
                      <td class="text-end">
                        <div class="avatar-group justify-content-end">
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Dianna Smiley">
                            <img src="./assets/images/avatar-1.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Ab Hadley">
                            <img src="./assets/images/avatar-2.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Adolfo Hess">
                            <img src="./assets/images/avatar-3.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                        </div>
                      </td>
                      <td class="text-end">
                        <div class="dropdown">
                          <a href="https://dashkit.goodthemes.co/index.html#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Another action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Something else here
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr><tr>
                      <td class="goal-project">
                        GDPR Compliance
                      </td>
                      <td class="goal-status">
                        <span class="text-success">●</span> Completed
                      </td>
                      <td class="goal-progress">
                        100%
                      </td>
                      <td class="goal-date">
                        <time datetime="2018-10-24">06/19/18</time>
                      </td>
                      <td class="text-end">
                        <div class="avatar-group justify-content-end">
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Dianna Smiley">
                            <img src="./assets/images/avatar-1.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Ab Hadley">
                            <img src="./assets/images/avatar-2.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Adolfo Hess">
                            <img src="./assets/images/avatar-3.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                        </div>
                      </td>
                      <td class="text-end">
                        <div class="dropdown">
                          <a href="https://dashkit.goodthemes.co/index.html#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Another action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Something else here
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr><tr>
                      <td class="goal-project">
                        v1.2 Documentation
                      </td>
                      <td class="goal-status">
                        <span class="text-danger">●</span> Cancelled
                      </td>
                      <td class="goal-progress">
                        0%
                      </td>
                      <td class="goal-date">
                        <time datetime="2018-10-24">06/25/18</time>
                      </td>
                      <td class="text-end">
                        <div class="avatar-group justify-content-end">
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Dianna Smiley">
                            <img src="./assets/images/avatar-1.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Ab Hadley">
                            <img src="./assets/images/avatar-2.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                        </div>
                      </td>
                      <td class="text-end">
                        <div class="dropdown">
                          <a href="https://dashkit.goodthemes.co/index.html#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="fe fe-more-vertical"></span>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Another action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Something else here
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr><tr>
                      <td class="goal-project">
                        Plan design offsite
                      </td>
                      <td class="goal-status">
                        <span class="text-success">●</span> Completed
                      </td>
                      <td class="goal-progress">
                        100%
                      </td>
                      <td class="goal-date">
                        <time datetime="2018-10-24">06/30/18</time>
                      </td>
                      <td class="text-end">
                        <div class="avatar-group justify-content-end">
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Dianna Smiley">
                            <img src="./assets/images/avatar-1.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Ab Hadley">
                            <img src="./assets/images/avatar-2.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Adolfo Hess">
                            <img src="./assets/images/avatar-3.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                          <a href="https://dashkit.goodthemes.co/index.html#!" class="avatar avatar-xs" data-bs-toggle="tooltip" title="" data-bs-original-title="Daniela Dewitt">
                            <img src="./assets/images/avatar-4.jpg" class="avatar-img rounded-circle" alt="...">
                          </a>
                        </div>
                      </td>
                      <td class="text-end">
                        <div class="dropdown">
                          <a href="https://dashkit.goodthemes.co/index.html#" class="dropdown-ellipses dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Another action
                            </a>
                            <a href="https://dashkit.goodthemes.co/index.html#!" class="dropdown-item">
                              Something else here
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr></tbody>
                </table>
              </div>
            </div>

          </div>
        </div> <!-- / .row -->
        <div class="row">
          <div class="col-12 col-xl-5">

            <!-- Activity -->
            <div class="card card-fill">
              <div class="card-header">

                <!-- Title -->
                <h4 class="card-header-title">
                  Recent Activity
                </h4>

                <!-- Button -->
                <a class="small" href="https://dashkit.goodthemes.co/index.html#!">View all</a>

              </div>
              <div class="card-body">

                <!-- List group -->
                <div class="list-group list-group-flush list-group-activity my-n3">
                  <div class="list-group-item">
                    <div class="row">
                      <div class="col-auto">

                        <!-- Avatar -->
                        <div class="avatar avatar-sm avatar-online">
                          <img class="avatar-img rounded-circle" src="./assets/images/avatar-1.jpg" alt="...">
                        </div>

                      </div>
                      <div class="col ms-n2">

                        <!-- Heading -->
                        <h5 class="mb-1">
                          Dianna Smiley
                        </h5>

                        <!-- Text -->
                        <p class="small text-gray-700 mb-0">
                          Uploaded the files "Launchday Logo" and "New Design".
                        </p>

                        <!-- Time -->
                        <small class="text-muted">
                          2m ago
                        </small>

                      </div>
                    </div> <!-- / .row -->
                  </div>
                  <div class="list-group-item">
                    <div class="row">
                      <div class="col-auto">

                        <!-- Avatar -->
                        <div class="avatar avatar-sm avatar-online">
                          <img class="avatar-img rounded-circle" src="./assets/images/avatar-2.jpg" alt="...">
                        </div>

                      </div>
                      <div class="col ms-n2">

                        <!-- Heading -->
                        <h5 class="mb-1">
                          Ab Hadley
                        </h5>

                        <!-- Text -->
                        <p class="small text-gray-700 mb-0">
                          Shared the "Why Dashkit?" post with 124 subscribers.
                        </p>

                        <!-- Time -->
                        <small class="text-muted">
                          1h ago
                        </small>

                      </div>
                    </div> <!-- / .row -->
                  </div>
                  <div class="list-group-item">
                    <div class="row">
                      <div class="col-auto">

                        <!-- Avatar -->
                        <div class="avatar avatar-sm avatar-offline">
                          <img class="avatar-img rounded-circle" src="./assets/images/avatar-3.jpg" alt="...">
                        </div>

                      </div>
                      <div class="col ms-n2">

                        <!-- Heading -->
                        <h5 class="mb-1">
                          Adolfo Hess
                        </h5>

                        <!-- Text -->
                        <p class="small text-gray-700 mb-0">
                          Exported sales data from Launchday's subscriber data.
                        </p>

                        <!-- Time -->
                        <small class="text-muted">
                          3h ago
                        </small>

                      </div>
                    </div>
                    <!-- / .row -->
                  </div>
                </div>

              </div>
            </div>

          </div>
          <div class="col-12 col-xl-7">

            <!-- Checklist -->
            <div class="card">
              <div class="card-header">

                <!-- Title -->
                <h4 class="card-header-title">
                  Scratchpad Checklist
                </h4>

                <!-- Badge -->
                <span class="badge bg-secondary-soft">
                  23 Archived
                </span>

              </div>
              <div class="card-body">

                <!-- Checklist -->
                <div class="checklist" tabindex="0">
                  <div class="form-check" tabindex="0">
                    <input class="form-check-input" type="checkbox" id="checklistOne">
                    <label class="form-check-label">Delete the old mess in functions files.</label>
                  </div>
                  <div class="form-check" tabindex="0">
                    <input class="form-check-input" type="checkbox" id="checklistTwo">
                    <label class="form-check-label">Refactor the core social sharing modules.</label>
                  </div>
                  <div class="form-check" tabindex="0">
                    <input class="form-check-input" type="checkbox" id="checklistThree">
                    <label class="form-check-label">Create the release notes for the new pages so customers get psyched.</label>
                  </div>
                  <div class="form-check" tabindex="0">
                    <input class="form-check-input" type="checkbox" id="checklistFour">
                    <label class="form-check-label">Send Dianna those meeting notes.</label>
                  </div>
                  <div class="form-check" tabindex="0">
                    <input class="form-check-input" type="checkbox" id="checklistFive">
                    <label class="form-check-label">Share the documentation for the new unified API.</label>
                  </div>
                  <div class="form-check" tabindex="0">
                    <input class="form-check-input" type="checkbox" id="checklistSix" checked="">
                    <label class="form-check-label">Clean up the Figma file with all of the avatars, buttons, and other
                      components.</label>
                  </div>
                </div>

              </div>
              <div class="card-footer">
                <div class="row align-items-center">
                  <div class="col">

                    <!-- Input -->
                    <textarea class="form-control form-control-flush form-control-auto" data-autosize="" rows="1" placeholder="Create a task" style="overflow: hidden; overflow-wrap: break-word; height: 25px;"></textarea>

                  </div>
                  <div class="col-auto">

                    <!-- Button -->
                    <button class="btn btn-sm btn-primary">
                      Add
                    </button>

                  </div>
                </div> <!-- / .row -->
              </div>
            </div>

          </div>
        </div> <!-- / .row -->
      </div>

@endsection
