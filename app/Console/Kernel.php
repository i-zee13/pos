<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // DB backup every N hours (Pakistan time). withoutOverlapping avoids stacked runs.
        $hours = max(1, (int) config('backup.schedule_interval_hours', 3));
        $schedule->command('backup:databases --scheduled')
            ->cron('0 */'.$hours.' * * *')
            ->timezone(config('backup.schedule_timezone', 'Asia/Karachi'))
            ->withoutOverlapping(120);

        // Keep connected Google Drive tokens warm so backups never fail on expiry.
        $schedule->command('backup:refresh-drive-tokens')->twiceDaily(6, 18);
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
