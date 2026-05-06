<nav class="navbar navbar-expand  static-top">
    <a class="hamburger" href="#" id="sidebarToggle"><i class="fas fa-bars"></i></a>
    <a class="_logo" href="/"><img src="/images/sell-360.svg" alt="" /></a>
    <ul class="navbar-nav ml-auto top_nav">
        <li class="nav-item TM_icon">
            <a class="nav-link" href="#"><img src="/images/q-link-icon.svg" alt="" /></a>
        </li>
        <li class="nav-item TM_icon">
            <a class="nav-link" href="#"><img src="/images/settings-icon.svg" alt="" /></a>
        </li>
        <li class="nav-item TM_icon dropdown no-arrow">
            <a class="nav-link dropdown-toggle" href="#" id="NotiFications" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false"> <span class="badge">
                    {{ sizeof($notif_data) }}
                </span> <img src="{{ URL::to('/images/bell-icon.svg') }}" alt="" /></a>
            <div class="dropdown-menu dropdown-menu-right notiF" aria-labelledby="NotiFications">
                <h4 class="notiF-title">Notification </h4>
                @if(!empty($notif_data))
                @foreach($notif_data as $notifications)
                <a href="#"><img src="{{ URL::to('/storage/company').'/'.$notifications->picture}}" class="NU-img"
                        alt=""><strong class="notifications_list"
                        id="{{$notifications->id}}">{{$notifications->message}} </strong>
                    <p>
                        <?php $datetime1 = new DateTime(date('Y-m-d H:i:s'));//current time
                                    $datetime2 = new DateTime($notifications->created_at);//notification time
                                    $interval = $datetime1->diff($datetime2);
                                    echo $interval->format('$d days %H hours %i minutes %s seconds ago'); ?>
                    </p>
                </a>
                @endforeach
                @endif
                <a href="/ViewAllNotifications" class="all-NF">View All
                    ({{ $all_notifications ? sizeof($all_notifications) : 0 }})</a>
            </div>
        </li>
        <li class="nav-item dropdown no-arrow">
            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <img src="{{ Auth::user()->picture ? str_replace('./', '/', Auth::user()->picture) : '' }}"
                    class="user_log" alt="" />
                <span class="uname">{{ Auth::user()->name }}</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                <span class="dropdown-item usernamelab">{{ Auth::user()->name }}</span>
                <a class="dropdown-item" href="/Profile/{{ Auth::user()->id }}"><i class="fa fa-user"> </i> Profile</a>
                <a class="dropdown-item" href="#"><i class="fa fa-cogs"> </i> Settings</a>
                <a class="dropdown-item" href="/logout"><i class="fa fa-power-off"> </i> Logout</a>
            </div>
        </li>
    </ul>
</nav>
