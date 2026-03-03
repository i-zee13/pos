<?php

namespace App\Http\Controllers;

use App\Models\Godown;
use Illuminate\Http\Request;

class GodownController extends Controller
{
    public function index()
    {
        // If the request expects JSON (AJAX), return data only
        if (request()->wantsJson()) {
            $godowns = Godown::orderBy('id')->get();
            return response()->json(['godowns' => $godowns]);
        }

        // Otherwise, render the management screen
        return view('godowns.index');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:godowns,code',
            'type' => 'required|in:shop,warehouse',
            'is_active' => 'nullable|boolean',
        ]);

        $data['is_active'] = $request->has('is_active') ? (bool) $request->is_active : true;

        $godown = Godown::create($data);

        return request()->wantsJson()
            ? response()->json($godown)
            : redirect()->route('godowns.index')->with('success', 'Godown created successfully.');
    }

    public function edit(Godown $godown)
    {
        return view('godowns.edit', compact('godown'));
    }

    public function update(Request $request, Godown $godown)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:godowns,code,' . $godown->id,
            'type' => 'required|in:shop,warehouse',
            'is_active' => 'nullable|boolean',
        ]);

        $data['is_active'] = $request->has('is_active') ? (bool) $request->is_active : true;

        $godown->update($data);

        return request()->wantsJson()
            ? response()->json($godown)
            : redirect()->route('godowns.index')->with('success', 'Godown updated successfully.');
    }

    public function destroy(Godown $godown)
    {
        $godown->delete();

        return request()->wantsJson()
            ? response()->json(['status' => 'success'])
            : redirect()->route('godowns.index')->with('success', 'Godown deleted successfully.');
    }
}

