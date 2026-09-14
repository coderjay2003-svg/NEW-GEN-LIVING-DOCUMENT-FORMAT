# Phase 2 — Module 10: Runtime State Machine
# LDFX Runtime Foundation Specification

**Specification Version:** 2.0.0
**Status:** Canonical — Approved
**Phase:** 2 — Runtime Foundation
**Section:** 10 of 17
**Depends On:** Module 01–09

---

## 10. Runtime State Machine

---

### 10.1 Overview

The Runtime State Machine is the formal definition of every state the
LDFX Runtime can occupy, every valid transition between states, every
failure transition, and every recovery transition. It is the authoritative
reference for the Lifecycle Manager implementation.

The state machine is deterministic. Given the current state and a trigger,
there is exactly one valid next state. All other transitions are rejected.

---

### 10.2 Complete State Machine Diagram

```mermaid
stateDiagram-v2
    direction TB

    [*] --> Created : instantiate()

    state "Created" as CR
    state "Initializing" as IN
    state "Loading" as LD
    state "Ready" as RD
    state "Running" as RN
    state "Idle" as ID
    state "Paused" as PA
    state "Background" as BG
    state "Restoring" as RS
    state "Sleeping" as SL
    state "Resuming" as RM
    state "Updating" as UP
    state "Restarting" as RT
    state "Closing" as CL
    state "Destroyed" as DS

    CR --> IN : boot()
    CR --> DS : abort()

    IN --> LD : phases_1_9_ok
    IN --> CL : fatal_error
    IN --> CL : timeout

    LD --> RD : resources_ready
    LD --> CL : fatal_error
    LD --> CL : timeout

    RD --> RN : session_start
    RD --> CL : close_requested
    RD --> CL : fatal_error

    RN --> ID : idle_timeout
    RN --> PA : pause()
    RN --> BG : os_background
    RN --> SL : os_suspend
    RN --> UP : update_start
    RN --> RT : restart()
    RN --> CL : close_requested
    RN --> CL : fatal_error

    ID --> RN : user_activity
    ID --> PA : pause()
    ID --> BG : os_background
    ID --> SL : os_suspend
    ID --> CL : close_requested
    ID --> CL : fatal_error

    PA --> RS : resume()
    PA --> SL : os_suspend
    PA --> CL : close_requested
    PA --> CL : fatal_error

    BG --> RS : os_foreground
    BG --> SL : os_suspend
    BG --> CL : close_requested
    BG --> CL : fatal_error

    RS --> RN : restore_ok
    RS --> CL : restore_failed
    RS --> CL : timeout

    SL --> RM : os_resume
    SL --> CL : shutdown_while_sleeping

    RM --> RN : resume_ok
    RM --> CL : resume_failed
    RM --> CL : timeout

    UP --> RN : update_ok
    UP --> CL : update_fatal
    UP --> CL : timeout

    RT --> IN : teardown_ok
    RT --> DS : restart_fatal

    CL --> DS : shutdown_ok
    CL --> DS : shutdown_timeout [forced]

    DS --> [*]
```

---

### 10.3 State Descriptions

#### `Created`
The runtime object has been instantiated. No resources have been allocated.
No file has been opened. The boot sequence has not started.

**Entry action:** Allocate runtime object, initialize logging.
**Exit action:** Begin boot sequence.
**Valid duration:** < 10ms before boot() is called.

---

#### `Initializing`
The boot sequence is executing Phases 1–9 (pre-flight through configuration
resolution). The document is being validated and parsed. No user-visible
content is available yet.

**Entry action:** Emit `RuntimeInitializing`. Start boot phase timer.
**Exit action (success):** Emit `ManifestLoaded`, `IntegrityVerified`.
**Exit action (failure):** Emit `BootFailed`. Begin shutdown.
**Valid duration:** Up to 500ms (standard document).

---

#### `Loading`
Boot Phases 10–14 are executing. Resources are being loaded, plugins are
being initialized, and the Document Context is being created.

**Entry action:** Emit `ResourcesLoading`.
**Exit action (success):** Emit `ResourcesReady`, `PluginsReady`.
**Exit action (failure):** Emit `BootFailed`. Begin shutdown.
**Valid duration:** Up to 1000ms (standard document).

---

#### `Ready`
Boot is complete. The document is fully initialized and available.
No active user session has started yet. The renderer may begin
displaying content.

**Entry action:** Emit `RuntimeReady`. Record boot completion time.
**Exit action:** Emit `RuntimeRunning` or `RuntimeClosing`.
**Valid duration:** Indefinite (waiting for first user interaction).

---

#### `Running`
An active user session is in progress. The document is fully interactive.
All features are available according to the document's declared capabilities
and the user's granted permissions.

**Entry action:** Emit `RuntimeRunning`. Start idle timer.
**Exit action:** Emit appropriate transition event.
**Valid duration:** Indefinite.

---

#### `Idle`
The runtime is running but no user interaction has occurred for longer
than `idle_timeout_ms`. Resources are conserved. The document remains
fully loaded and interactive — it will respond immediately to any input.

**Entry action:** Emit `RuntimeIdle`. Reduce scheduler thread pool.
**Exit action:** Emit `RuntimeRunning` on any user input.
**Valid duration:** Indefinite (until user input or explicit pause).

---

#### `Paused`
The runtime has been explicitly paused by the application. Rendering
is suspended. The Scheduler is paused. All state is preserved in memory.

**Entry action:** Emit `RuntimePaused`. Suspend scheduler. Suspend renderer.
**Exit action:** Emit `RuntimeRestoring`.
**Valid duration:** Indefinite.

---

#### `Background`
The application has been moved to the background by the OS. Similar to
Paused but triggered by an OS signal rather than an application request.
Memory is aggressively reclaimed.

**Entry action:** Emit `RuntimeBackground`. Suspend renderer. Reclaim memory.
**Exit action:** Emit `RuntimeRestoring`.
**Valid duration:** Indefinite (OS-controlled).

---

#### `Restoring`
The runtime is returning from Paused or Background state. State is being
restored and the renderer is being reactivated.

**Entry action:** Emit `RuntimeRestoring`. Restore warm cache.
**Exit action (success):** Emit `RuntimeRunning`.
**Exit action (failure):** Begin shutdown.
**Valid duration:** Up to 500ms.

---

#### `Sleeping`
The OS has issued a suspend signal (laptop lid close, system sleep).
All non-essential operations are stopped. State is persisted to warm store.

**Entry action:** Emit `RuntimeSleeping`. Persist state. Release non-essential memory.
**Exit action:** Emit `RuntimeResuming`.
**Valid duration:** Indefinite (OS-controlled).

---

#### `Resuming`
The OS has issued a resume signal. The runtime is restoring from sleep.
Integrity is re-verified before returning to Running.

**Entry action:** Emit `RuntimeResuming`. Re-verify manifest hash.
**Exit action (success):** Emit `RuntimeRunning`.
**Exit action (failure):** Begin shutdown.
**Valid duration:** Up to 1000ms.

---

#### `Updating`
A document update is in progress (live edit sync, content update from
collaboration). The document is partially available during this state.

**Entry action:** Emit `RuntimeUpdating`. Pause affected page rendering.
**Exit action (success):** Emit `RuntimeRunning`.
**Exit action (failure):** Begin shutdown if update is fatal.
**Valid duration:** Up to 5000ms.

---

#### `Restarting`
A restart has been requested. The runtime is tearing down all components
before re-executing the boot sequence with the same document bytes.

**Entry action:** Emit `RuntimeRestarting`. Save restart snapshot.
**Exit action (success):** Re-enter `Initializing`.
**Exit action (failure):** Transition to `Destroyed`.
**Valid duration:** Up to 500ms for teardown.

---

#### `Closing`
The shutdown sequence is in progress. Plugins are being stopped, resources
are being released, and logs are being flushed.

**Entry action:** Emit `RuntimeClosing`. Begin ordered shutdown.
**Exit action:** Emit `RuntimeDestroyed`.
**Valid duration:** Up to 500ms (forced after timeout).

---

#### `Destroyed`
Terminal state. All resources have been released. The runtime object is
invalid and must not be used. The session is over.

**Entry action:** Emit `RuntimeDestroyed`. Release all memory.
**Exit action:** None — terminal state.

---

### 10.4 Failure Transitions

Every state has a failure path. Failure transitions always lead to `Closing`
(except `Created` and `Restarting` which go directly to `Destroyed`).

```mermaid
graph TD
    IN[Initializing] -->|fatal_error| CL[Closing]
    LD[Loading] -->|fatal_error| CL
    RD[Ready] -->|fatal_error| CL
    RN[Running] -->|fatal_error| CL
    ID[Idle] -->|fatal_error| CL
    PA[Paused] -->|fatal_error| CL
    BG[Background] -->|fatal_error| CL
    RS[Restoring] -->|restore_failed| CL
    SL[Sleeping] -->|shutdown_while_sleeping| CL
    RM[Resuming] -->|resume_failed| CL
    UP[Updating] -->|update_fatal| CL
    RT[Restarting] -->|restart_fatal| DS[Destroyed]
    CL -->|shutdown_complete| DS
    CL -->|timeout_forced| DS
```

---

### 10.5 Recovery Transitions

Some failures are recoverable without entering `Closing`.

| State | Failure | Recovery Action | Recovery Transition |
|---|---|---|---|
| Running | Plugin crash | Restart plugin | Stay in Running |
| Running | Asset load failure | Show error placeholder | Stay in Running |
| Running | Network timeout | Retry with backoff | Stay in Running |
| Running | Config change failure | Rollback config | Stay in Running |
| Updating | Non-fatal update error | Partial update, warn | Running |
| Resuming | Integrity warning | Warn user, continue | Running |

---

### 10.6 Timeout Transitions

If a state does not complete its expected action within its timeout,
the Lifecycle Manager forces a transition.

```mermaid
graph TD
    IN[Initializing\n500ms timeout] -->|timeout| CL[Closing]
    LD[Loading\n1000ms timeout] -->|timeout| CL
    RS[Restoring\n500ms timeout] -->|timeout| CL
    RM[Resuming\n1000ms timeout] -->|timeout| CL
    UP[Updating\n5000ms timeout] -->|timeout| CL
    RT[Restarting\n500ms timeout] -->|timeout| DS[Destroyed]
    CL[Closing\n500ms timeout] -->|timeout forced| DS
```

---

### 10.7 State Machine Invariants

The following invariants must hold at all times:

| Invariant | Description |
|---|---|
| Single state | The runtime is in exactly one state at any time |
| No re-entry | A state may not transition to itself |
| Terminal is final | `Destroyed` has no outgoing transitions |
| Closing is one-way | Once in `Closing`, only `Destroyed` is reachable |
| Events always emitted | Every transition emits its corresponding event |
| Timeouts always enforced | No state may exceed its timeout without a forced transition |
| Failure always handled | Every state has a defined failure path |

---

**Next:** Module 11 — Runtime Performance
