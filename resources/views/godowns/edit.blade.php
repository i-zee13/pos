@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="row mb-3">
        <div class="col">
            <h2 class="_head01">Edit Godown</h2>
        </div>
        <div class="col text-right">
            <a href="{{ route('godowns.index') }}" class="btn btn-secondary">Back</a>
        </div>
    </div>

    <div class="card">
        <div class="card-body">
            <form action="{{ route('godowns.update', $godown) }}" method="POST" class="validateform">
                @csrf
                @method('PUT')

                <div class="form-group">
                    <label for="name">Name *</label>
                    <input type="text" name="name" id="name" class="form-control required" value="{{ old('name', $godown->name) }}">
                </div>

                <div class="form-group">
                    <label for="code">Code</label>
                    <input type="text" name="code" id="code" class="form-control" value="{{ old('code', $godown->code) }}">
                </div>

                <div class="form-group">
                    <label for="type">Type *</label>
                    <select name="type" id="type" class="form-control required">
                        <option value="shop" {{ old('type', $godown->type) === 'shop' ? 'selected' : '' }}>Shop</option>
                        <option value="warehouse" {{ old('type', $godown->type) === 'warehouse' ? 'selected' : '' }}>Warehouse</option>
                    </select>
                </div>

                <div class="form-group form-check">
                    <input type="checkbox" name="is_active" id="is_active" class="form-check-input"
                        {{ old('is_active', $godown->is_active) ? 'checked' : '' }}>
                    <label for="is_active" class="form-check-label">Active</label>
                </div>

                <button type="submit" class="btn btn-primary">Update</button>
            </form>
        </div>
    </div>
</div>
@endsection

