<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;
use PDO;
use Throwable;

/**
 * Register MySQL-compatible SQL functions on SQLite for offline desktop.
 * Lets existing raw queries (DATE_FORMAT, SUBSTRING_INDEX, …) run locally.
 */
class SqliteMysqlPolyfills
{
    protected static bool $registered = false;

    public static function register(): void
    {
        if (self::$registered) {
            return;
        }

        try {
            $connection = DB::connection();
        } catch (Throwable $e) {
            return;
        }

        if ($connection->getDriverName() !== 'sqlite') {
            return;
        }

        $pdo = $connection->getPdo();
        if (!$pdo instanceof PDO) {
            return;
        }

        $pdo->sqliteCreateFunction('DATE_FORMAT', [self::class, 'dateFormat'], 2);
        $pdo->sqliteCreateFunction('SUBSTRING_INDEX', [self::class, 'substringIndex'], 3);
        $pdo->sqliteCreateFunction('IF', [self::class, 'mysqlIf'], 3);
        $pdo->sqliteCreateFunction('GREATEST', [self::class, 'greatest'], -1);
        $pdo->sqliteCreateFunction('LEAST', [self::class, 'least'], -1);
        $pdo->sqliteCreateFunction('YEAR', [self::class, 'year'], 1);
        $pdo->sqliteCreateFunction('MONTH', [self::class, 'month'], 1);
        $pdo->sqliteCreateFunction('DAY', [self::class, 'day'], 1);

        self::$registered = true;
    }

    /** Allow re-register after DB::reconnect() (new PDO loses UDFs). */
    public static function reset(): void
    {
        self::$registered = false;
    }

    public static function dateFormat($date, $format)
    {
        if ($date === null || $date === '') {
            return null;
        }

        $map = [
            '%Y' => 'Y',
            '%y' => 'y',
            '%m' => 'm',
            '%d' => 'd',
            '%e' => 'j',
            '%H' => 'H',
            '%h' => 'h',
            '%i' => 'i',
            '%s' => 's',
            '%p' => 'A',
            '%W' => 'l',
            '%a' => 'D',
            '%M' => 'F',
            '%b' => 'M',
        ];

        $phpFormat = strtr((string) $format, $map);

        try {
            return (new \DateTimeImmutable((string) $date))->format($phpFormat);
        } catch (Throwable $e) {
            return (string) $date;
        }
    }

    public static function substringIndex($string, $delimiter, $count)
    {
        if ($string === null) {
            return null;
        }

        $parts = explode((string) $delimiter, (string) $string);
        $count = (int) $count;

        if ($count > 0) {
            return implode((string) $delimiter, array_slice($parts, 0, $count));
        }

        if ($count < 0) {
            return implode((string) $delimiter, array_slice($parts, $count));
        }

        return '';
    }

    public static function mysqlIf($condition, $true, $false)
    {
        return $condition ? $true : $false;
    }

    public static function greatest(...$args)
    {
        $args = array_values(array_filter($args, static fn ($v) => $v !== null));

        return $args === [] ? null : max($args);
    }

    public static function least(...$args)
    {
        $args = array_values(array_filter($args, static fn ($v) => $v !== null));

        return $args === [] ? null : min($args);
    }

    public static function year($date)
    {
        return self::part($date, 'Y');
    }

    public static function month($date)
    {
        return self::part($date, 'n');
    }

    public static function day($date)
    {
        return self::part($date, 'j');
    }

    protected static function part($date, string $format)
    {
        if ($date === null || $date === '') {
            return null;
        }

        try {
            return (int) (new \DateTimeImmutable((string) $date))->format($format);
        } catch (Throwable $e) {
            return null;
        }
    }
}
