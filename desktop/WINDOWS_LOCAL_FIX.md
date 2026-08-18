# Windows: why local PHP keeps failing

## Your current error

`PHP exited code 3221225781` = Windows **0xC0000135** = **DLL not found**.

Portable PHP (VS16 build) needs:

**Microsoft Visual C++ Redistributable 2015–2022 (x64)**

Download (Microsoft):  
https://aka.ms/vs/17/release/vc_redist.x64.exe

1. Install  
2. Restart PC  
3. Open Storeeo POS again (net off → Start local POS)

## Why errors keep coming (one by one)

| Step | What broke |
|------|------------|
| 0.1.x | Only cloud shell — offline impossible |
| 0.2.0 | PHP not inside installer (`localReady=false`) |
| 0.2.1 | PHP present but `artisan serve` weak on portable PHP |
| 0.2.2 | PHP starts then **crashes** — VC++ runtime missing on laptop |

Har fix agla Windows/environment gap kholta hai. Yeh normal hai Phase 1 mein.

## After VC++ installed

Agar phir error aaye, naya message screenshot bhejo.
