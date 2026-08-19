<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Local desktop SQLite installs ship with admin/admin123.
 * Force a password change before using the rest of the app.
 */
class ForceLocalPasswordChange
{
    public function handle(Request $request, Closure $next)
    {
        $driver = (string) config('database.connections.'.config('database.default').'.driver', '');
        if ($driver !== 'sqlite') {
            return $next($request);
        }

        $user = Auth::user();
        if (! $user) {
            return $next($request);
        }

        if ((int) ($user->password_changed ?? 0) === 1) {
            return $next($request);
        }

        $path = trim($request->path(), '/');
        $allowed = [
            'login',
            'logout',
            'profile',
            'update-user-password',
            'update-user-profile-pic',
        ];

        foreach ($allowed as $ok) {
            if ($path === $ok || str_starts_with($path, $ok.'/')) {
                return $next($request);
            }
        }

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'status' => 'password_required',
                'msg' => 'Pehle apna password change karein (Profile).',
            ], 423);
        }

        return redirect()
            ->route('admin.profile')
            ->with('error', 'Security: pehle default password change karein (admin123 ko apna strong password banao).');
    }
}
