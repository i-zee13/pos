<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Multi-tenant scoping for a single shared database.
 *
 * - Adds a global scope so every read query is automatically filtered by the
 *   logged-in user's tenant_id (when a tenant is resolvable).
 * - Auto-fills tenant_id on insert from the logged-in user.
 *
 * When no tenant is resolvable (e.g. console commands, scheduled jobs, or the
 * login screen before authentication) the scope is skipped so the framework
 * keeps working as before.
 */
trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            $tenantId = current_tenant_id();
            if ($tenantId !== null) {
                $model = $builder->getModel();
                $builder->where($model->getQualifiedTenantColumn(), $tenantId);
            }
        });

        static::creating(function (Model $model) {
            $column = $model->getTenantColumn();
            if (empty($model->{$column})) {
                $tenantId = current_tenant_id();
                if ($tenantId !== null) {
                    $model->{$column} = $tenantId;
                }
            }
        });
    }

    public function getTenantColumn(): string
    {
        return 'tenant_id';
    }

    public function getQualifiedTenantColumn(): string
    {
        return $this->getTable().'.'.$this->getTenantColumn();
    }
}
