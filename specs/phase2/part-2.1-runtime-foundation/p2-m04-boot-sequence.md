# Phase 2 — Module 04: Runtime Boot Sequence
# LDFX Runtime Foundation Specification

**Specification Version:** 2.0.0
**Status:** Canonical — Approved
**Phase:** 2 — Runtime Foundation
**Section:** 4 of 17
**Depends On:** Module 01, Module 02, Module 03

---

## 4. Runtime Boot Sequence

---

### 4.1 Overview

The boot sequence is the ordered set of operations that transforms a raw
`.ldfx` byte stream into a fully initialized, ready-to-use runtime. It is
owned by the Boot Manager and executed under the supervision of the Runtime
Kernel.

Every step in the boot sequence is:
- Ordered — steps execute in the defined sequence, never in parallel unless stated
- Timed — every step has a maximum allowed duration
- Recoverable — every failure has a defined response
- Observable — every step emits a progress event

---

### 4.2 Cold Boot Sequence

A cold boot is the standard boot path — opening a document for the first time
with no cached state.

```mermaid
sequenceDiagram
    participant App as Application
    participant API as Runtime API
    participant Boot as Boot Manager
    participant Sec as Security Manager
    participant VFS as Virtual File System
    participant Res as Resource Loader
    participant Kern as Runtime Kernel
    participant Plug as Plugin Runtime

    App->>API: open_document(bytes, options)
    API->>Boot: boot(bytes, BootMode::Cold, options)

    Note over Boot: Phase 1 — Pre-flight
    Boot->>Boot: check file size >= 64 bytes
    Boot->>Sec: verify_magic_bytes(bytes[0..4])
    Sec-->>Boot: OK | MagicMismatch

    Note over Boot: Phase 2 — Header
    Boot->>Sec: parse_and_validate_header(bytes[0..64])
    Sec-->>Boot: LdfxHeader | HeaderError

    Note over Boot: Phase 3 — Container
    Boot->>VFS: open(bytes, offset=64)
    VFS-->>Boot: VfsHandle | VfsError
    Boot->>VFS: validate_structure()
    VFS-->>Boot: warnings[] | ContainerError

    Note over Boot: Phase 4 — Manifest
    Boot->>Res: load_entry("manifest.json")
    Res-->>Boot: manifest_bytes
    Boot->>Sec: parse_manifest(manifest_bytes)
    Sec-->>Boot: Manifest | ManifestError

    Note over Boot: Phase 5 — Version Check
    Boot->>Boot: check_version_compatibility(header, manifest)
    Boot-->>Boot: OK | VersionMismatch

    Note over Boot: Phase 6 — Integrity
    Boot->>Res: load_entry("security/hashes.json")
    Res-->>Boot: hashes_bytes
    Boot->>Sec: verify_all_hashes(vfs_entries, hashes)
    Sec-->>Boot: OK | HashMismatch(path)

    Note over Boot: Phase 7 — Signatures
    Boot->>Res: load_entry("security/signatures.json")
    Res-->>Boot: sigs_bytes
    Boot->>Sec: validate_signatures(sigs)
    Sec-->>Boot: OK | SignatureError

    Note over Boot: Phase 8 — Metadata
    Boot->>Res: load_entry("metadata/metadata.json")
    Res-->>Boot: meta_bytes
    Boot->>Boot: parse_and_cross_validate(meta, manifest)
    Boot-->>Boot: Metadata | MetadataError

    Note over Boot: Phase 9 — Configuration
    Boot->>Boot: resolve_configuration(manifest, metadata, options)
    Boot-->>Boot: ResolvedConfig

    Note over Boot: Phase 10 — Resources Init
    Boot->>Res: initialize(vfs, config)
    Res-->>Boot: ready
    Boot->>Res: preload_entry_page()
    Res-->>Boot: PageContent

    Note over Boot: Phase 11 — Plugin Discovery
    Boot->>Res: load_entry("plugins/index.json")
    Res-->>Boot: plugin_index
    Boot->>Plug: load_plugins(plugin_index, vfs)
    Plug-->>Boot: PluginRegistry | PluginError

    Note over Boot: Phase 12 — State Init
    Boot->>Kern: initialize_state_manager(config)
    Kern-->>Boot: StateManager

    Note over Boot: Phase 13 — Runtime Init
    Boot->>Kern: create_document_context(manifest, metadata, config, ...)
    Kern-->>Boot: DocumentContext

    Note over Boot: Phase 14 — UI Init
    Boot->>API: emit(ResourcesReady)
    API-->>App: ResourcesReady event

    Note over Boot: Phase 15 — Ready
    Boot->>API: emit(RuntimeReady)
    API-->>App: RuntimeReady event
    Boot-->>API: BootResult::Success(RuntimeHandle)
    API-->>App: RuntimeHandle
```

---

### 4.3 Boot Phase Definitions

| Phase | Name | Timeout | Fatal On Failure | Description |
|---|---|---|---|---|
| 1 | Pre-flight | 10ms | Yes | File size check, byte availability |
| 2 | Header | 20ms | Yes | Magic bytes, CRC32, version |
| 3 | Container | 50ms | Yes | ZIP structure, required folders |
| 4 | Manifest | 50ms | Yes | Parse and validate manifest.json |
| 5 | Version Check | 5ms | Yes | Runtime vs document version |
| 6 | Integrity | 200ms | Yes | SHA-256 hash verification |
| 7 | Signatures | 100ms | No (warn if unsigned) | Digital signature validation |
| 8 | Metadata | 50ms | Yes | Parse metadata, cross-validate |
| 9 | Configuration | 20ms | No (use defaults) | Resolve config hierarchy |
| 10 | Resources Init | 300ms | Yes | Preload entry page and hot assets |
| 11 | Plugin Discovery | 200ms | Conditional | Required plugins fatal, optional warn |
| 12 | State Init | 20ms | Yes | Initialize state manager |
| 13 | Runtime Init | 50ms | Yes | Create DocumentContext |
| 14 | UI Init | 100ms | No | Signal renderer to prepare |
| 15 | Ready | — | — | Emit RuntimeReady |

**Total cold boot budget:** 500ms for standard documents (≤100 pages, ≤50 assets)

---

### 4.4 Warm Boot Sequence

A warm boot occurs when a document is reopened after being previously opened
in the same session. Cached state from the previous session is reused.

```mermaid
flowchart TD
    A[open_document called] --> B{Warm cache exists?}
    B -->|No| C[Cold Boot]
    B -->|Yes| D[Load cached manifest from memory]
    D --> E[Verify document bytes hash matches cache key]
    E -->|Mismatch| F[Invalidate cache → Cold Boot]
    E -->|Match| G[Skip Phases 1–8]
    G --> H[Phase 9: Reload Configuration]
    H --> I[Phase 10: Restore Resource Cache]
    I --> J[Phase 11: Restore Plugin Registry]
    J --> K[Phase 12: Restore State from Warm Store]
    K --> L[Phase 13: Recreate DocumentContext]
    L --> M[Phase 14: UI Init]
    M --> N[RuntimeReady — warm boot complete]
```

**Warm boot target:** < 100ms for standard documents.

**Cache invalidation rules:**
- Document bytes hash changed → full cold boot
- Runtime version changed → full cold boot
- Security policy changed → full cold boot
- Warm cache age > 30 minutes → full cold boot

---

### 4.5 Recovery Boot Sequence

A recovery boot is triggered when a previous session ended abnormally
(crash, forced kill, power loss). The runtime attempts to restore the
document to a usable state using the last known good state.

```mermaid
flowchart TD
    A[open_document called] --> B{Crash marker present?}
    B -->|No| C[Normal Cold Boot]
    B -->|Yes| D[Recovery Boot]
    D --> E[Run full Phase 1 validation]
    E -->|Fail| F[Reject document]
    E -->|Pass| G[Load last known good state snapshot]
    G --> H{Snapshot valid?}
    H -->|No| I[Discard snapshot → Cold Boot]
    H -->|Yes| J[Restore state from snapshot]
    J --> K[Emit RuntimeRecovering event]
    K --> L[Complete remaining boot phases]
    L --> M[Emit RuntimeReady with recovery_mode=true]
    M --> N[Notify user of recovery via Runtime API]
```

**Recovery state includes:**
- Last scroll position per page
- Form input state
- Annotation drafts
- Active plugin state snapshots

---

### 4.6 Safe Mode Boot

Safe mode is a restricted boot that disables all optional features.
It is triggered when:
- The user explicitly requests safe mode
- A previous boot failed due to a plugin or script error
- The Security Manager detects a suspicious document

```mermaid
flowchart TD
    A[Safe Mode Boot] --> B[Run full Phase 1 validation]
    B -->|Fail| C[Reject]
    B -->|Pass| D[Disable all plugins]
    D --> E[Disable all scripts]
    E --> F[Disable all AI features]
    F --> G[Disable network access]
    G --> H[Disable annotations write]
    H --> I[Load document in read-only mode]
    I --> J[Emit RuntimeReady with safe_mode=true]
    J --> K[Display safe mode indicator to user]
```

**Safe mode restrictions:**

| Feature | Safe Mode |
|---|---|
| Page rendering | ✅ Enabled |
| Asset display | ✅ Enabled |
| Plugins | ❌ Disabled |
| Scripts | ❌ Disabled |
| AI features | ❌ Disabled |
| Network access | ❌ Disabled |
| Annotations (write) | ❌ Disabled |
| Cloud sync | ❌ Disabled |
| Forms (submit) | ❌ Disabled |

---

### 4.7 Restart Sequence

A restart re-executes the boot sequence for the currently open document
without closing the application. Used after configuration changes or
plugin updates.

```mermaid
sequenceDiagram
    participant API as Runtime API
    participant LC as Lifecycle Manager
    participant Boot as Boot Manager
    participant Kern as Runtime Kernel

    API->>LC: request_restart(reason)
    LC->>LC: transition to Restarting state
    LC->>Kern: save_restart_snapshot()
    Kern-->>LC: snapshot saved
    LC->>Kern: teardown_components()
    Kern-->>LC: components torn down
    LC->>Boot: boot(original_bytes, BootMode::Warm, restart_options)
    Boot-->>LC: BootResult::Success
    LC->>LC: transition to Ready state
    LC->>API: emit(RuntimeRestarted)
```

---

### 4.8 Shutdown Sequence

```mermaid
sequenceDiagram
    participant App as Application
    participant API as Runtime API
    participant LC as Lifecycle Manager
    participant Plug as Plugin Runtime
    participant Res as Resource Loader
    participant Sec as Security Manager
    participant LOG as Logging System

    App->>API: close_document()
    API->>LC: request_shutdown()
    LC->>LC: transition to Closing
    LC->>API: emit(RuntimeClosing)

    LC->>Plug: shutdown_all_plugins()
    Plug-->>LC: plugins stopped

    LC->>Res: release_all_resources()
    Res-->>LC: resources released

    LC->>Sec: finalize_security_log()
    Sec-->>LC: log finalized

    LC->>LOG: flush_all_sinks()
    LOG-->>LC: flushed

    LC->>LC: transition to Destroyed
    LC->>API: emit(RuntimeDestroyed)
    API-->>App: close_document() returns OK
```

**Shutdown budget:** < 200ms for clean shutdown.

**Forced shutdown:** If clean shutdown exceeds 500ms, the runtime
performs a forced shutdown — releasing all OS handles and exiting
without waiting for component acknowledgment.

---

### 4.9 Sleep and Resume

Sleep is triggered by OS power management or application backgrounding.

```mermaid
stateDiagram-v2
    Running --> Sleeping : OS suspend signal
    Sleeping --> Resuming : OS resume signal
    Resuming --> Running : resume complete
    Sleeping --> Closing : shutdown while sleeping
```

**On Sleep:**
1. Pause the Scheduler (no new tasks)
2. Flush the Logging System
3. Snapshot mutable state to warm store
4. Release non-essential memory (warm and cold cache)
5. Emit `RuntimeSleeping`

**On Resume:**
1. Emit `RuntimeResuming`
2. Restore warm cache
3. Resume the Scheduler
4. Re-verify document integrity (hash check on manifest)
5. Emit `RuntimeReady`

---

### 4.10 Boot Error Handling

Every boot phase failure has a defined response:

| Error | Phase | Response | User Visible |
|---|---|---|---|
| File too small | 1 | Reject, return error | "Not a valid LDFX file" |
| Magic mismatch | 2 | Reject, return error | "Not a valid LDFX file" |
| CRC32 mismatch | 2 | Reject, return error | "File is corrupted" |
| Version mismatch (major) | 5 | Reject, return error | "Incompatible document version" |
| Hash mismatch | 6 | Reject, return error | "File integrity check failed" |
| Invalid signature | 7 | Warn or reject (per policy) | "Signature invalid" |
| Metadata mismatch | 8 | Reject, return error | "Document metadata is inconsistent" |
| Config invalid | 9 | Use defaults, warn | None (silent fallback) |
| Entry page missing | 10 | Reject, return error | "Document entry page not found" |
| Required plugin missing | 11 | Reject, return error | "Required plugin not available" |
| Optional plugin missing | 11 | Warn, continue | "Plugin X not available" |
| State init failure | 12 | Reject, return error | "Runtime initialization failed" |

---

### 4.11 Boot Timeout Handling

If any boot phase exceeds its timeout:

```
1. Log timeout event with phase ID and elapsed time
2. If phase is fatal → abort boot, return BootError::PhaseTimeout(phase)
3. If phase is non-fatal → skip phase, log warning, continue
4. If total boot time exceeds 15 seconds → abort regardless of phase
```

---

### 4.12 Boot Progress Events

The Boot Manager emits the following events during the boot sequence.
Applications may use these to display a loading indicator.

| Event | Phase | Payload |
|---|---|---|
| `BootStarted` | 1 | `{ mode, document_size }` |
| `HeaderVerified` | 2 | `{ spec_version, feature_flags }` |
| `ContainerOpened` | 3 | `{ entry_count }` |
| `ManifestLoaded` | 4 | `{ document_id, title, page_count }` |
| `VersionVerified` | 5 | `{ spec_version }` |
| `IntegrityVerified` | 6 | `{ hash_count }` |
| `SignatureVerified` | 7 | `{ signed, signer_id }` |
| `MetadataLoaded` | 8 | `{ author_count, revision }` |
| `ConfigurationResolved` | 9 | `{ source_count }` |
| `ResourcesLoading` | 10 | `{ asset_count, page_count }` |
| `ResourcesReady` | 10 | `{ loaded_count }` |
| `PluginsReady` | 11 | `{ plugin_count }` |
| `RuntimeReady` | 15 | `{ boot_mode, elapsed_ms }` |

---

**Next:** Module 05 — Runtime Lifecycle
