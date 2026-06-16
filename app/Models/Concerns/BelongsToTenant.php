<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Multi-tenant scoping for a single shared database.
 * Scope skips when no tenant is resolvable (console, login, tenant_id not set yet).
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
