# Phase 2 — Module 17: Acceptance Criteria
# LDFX Runtime Foundation Specification

**Specification Version:** 2.0.0
**Status:** Canonical — Approved
**Phase:** 2 — Runtime Foundation
**Section:** 17 of 17
**Depends On:** Module 01–16

---

## 17. Acceptance Criteria

---

### 17.1 Overview

The Runtime Foundation specification is considered complete and accepted
when every criterion in this module is satisfied. Each criterion is
measurable, testable, and unambiguous. No criterion may be waived.

Criteria are organized into six categories:
1. Specification Completeness
2. Architecture Correctness
3. Security
4. Performance
5. Compatibility
6. Observability

---

### 17.2 Specification Completeness Criteria

| ID | Criterion | Verification Method |
|---|---|---|
| SC-01 | All 17 sections of the specification are written and approved | Document review |
| SC-02 | Every runtime component has a defined purpose, responsibilities, inputs, outputs, failure modes, and recovery strategy | Section 3 review |
| SC-03 | Every lifecycle state has a defined entry action, exit action, valid duration, and failure path | Section 5 and 10 review |
| SC-04 | Every public interface has a complete method table with inputs, outputs, ownership, and dependencies | Section 14 review |
| SC-05 | Every folder in `ldfx-runtime/src/` has a defined owner and responsibility | Section 15 review |
| SC-06 | Every identified risk has a description, impact, likelihood, and mitigation | Section 16 review |
| SC-07 | Every Mermaid diagram renders correctly without errors | Diagram rendering check |
| SC-08 | No section contains a TODO, placeholder, or TBD | Document review |
| SC-09 | The specification is internally consistent — no contradictions between sections | Cross-section review |
| SC-10 | The specification is consistent with Phase 1 (Modules 01–12) — no contradictions | Phase 1 cross-reference |

---

### 17.3 Architecture Correctness Criteria

| ID | Criterion | Verification Method |
|---|---|---|
| AC-01 | The layered architecture diagram correctly represents all 8 layers with no missing layers | Section 2 review |
| AC-02 | No layer in the diagram has an upward dependency (except events) | Dependency graph review |
| AC-03 | Every component in Section 3 appears in the folder ownership map in Section 15 | Cross-section check |
| AC-04 | Every component in Section 3 appears in the component dependency diagram | Diagram review |
| AC-05 | The boot sequence covers all 15 phases with defined timeouts and failure responses | Section 4 review |
| AC-06 | The state machine has no unreachable states | State machine analysis |
| AC-07 | The state machine has no states without a failure path | State machine analysis |
| AC-08 | The state machine has no transitions that bypass intermediate states (except fatal → Closing) | State machine analysis |
| AC-09 | Every service in Section 8 has a complete interface table | Section 8 review |
| AC-10 | The `DocumentContext` field table covers all fields referenced in other sections | Section 6 cross-reference |
| AC-11 | The configuration hierarchy covers all configuration keys referenced in other sections | Section 7 cross-reference |
| AC-12 | Every event in the event catalog has a defined payload, priority, and cancellability | Section 9 review |

---

### 17.4 Security Criteria

| ID | Criterion | Verification Method |
|---|---|---|
| SEC-01 | Every attack vector in the threat model has a defined mitigation | Section 12.10 review |
| SEC-02 | The permission model covers all 14 permissions defined in Phase 1 Module 09 | Cross-reference check |
| SEC-03 | The WASM sandbox model defines memory, CPU, network, and file system limits | Section 12.3 review |
| SEC-04 | The security event log is defined as non-suppressible by documents | Section 12.12 review |
| SEC-05 | Integrity verification is defined at both boot time and load time | Section 12.5 review |
| SEC-06 | The permission escalation rule is explicitly stated as forbidden | Section 12.4 review |
| SEC-07 | Every security risk in Section 16 has a mitigation strategy | Section 16.3 review |
| SEC-08 | The crash report privacy rules explicitly exclude document content and PII | Section 13.3 review |
| SEC-09 | The telemetry privacy rules explicitly exclude document content and PII | Section 13.5 review |
| SEC-10 | Safe mode restrictions are fully defined with a complete feature table | Section 4.6 review |

---

### 17.5 Performance Criteria

| ID | Criterion | Verification Method |
|---|---|---|
| PERF-01 | Cold boot targets are defined for all 5 document classes | Section 11.2 review |
| PERF-02 | Warm boot targets are defined for all 5 document classes | Section 11.2 review |
| PERF-03 | Memory targets are defined for baseline, per-page, per-asset, and per-plugin | Section 11.3 review |
| PERF-04 | CPU targets are defined for idle, render, asset decode, plugin, and event dispatch | Section 11.4 review |
| PERF-05 | Asset load time targets are defined for all size ranges and all cache tiers | Section 11.5 review |
| PERF-06 | Cache eviction policies are defined for all three cache tiers | Section 11.6 review |
| PERF-07 | Thread pool configuration is fully defined (min, max, stack size, idle timeout) | Section 11.8 review |
| PERF-08 | All performance metrics collected by the Performance Monitor are listed | Section 11.10 review |
| PERF-09 | Performance warning thresholds are defined for all monitored metrics | Section 11.12 review |
| PERF-10 | Lazy loading strategy defines what is loaded eagerly vs lazily at boot | Section 11.7 review |

---

### 17.6 Compatibility Criteria

| ID | Criterion | Verification Method |
|---|---|---|
| COMPAT-01 | Backward compatibility rule is explicitly stated (runtime N.x.x opens docs from 1.x.x to N.x.x) | Section 1.10 review |
| COMPAT-02 | Forward compatibility behavior is defined for all four `unknown_feature_policy` values | Section 1.10 review |
| COMPAT-03 | The `ldfx-runtime` crate dependency on `ldfx-core` is defined as one-way | Section 2.4 review |
| COMPAT-04 | The Plugin API versioning strategy is defined | Section 16 RISK-A-02 review |
| COMPAT-05 | The deprecation process for configuration keys is defined | Section 7.5 review |
| COMPAT-06 | The `Cargo.toml` dependency list is complete and versioned | Section 15.4 review |
| COMPAT-07 | All four target platforms are covered by the Platform Adapter | Section 15 review |

---

### 17.7 Observability Criteria

| ID | Criterion | Verification Method |
|---|---|---|
| OBS-01 | Every lifecycle state transition emits a corresponding event | Section 5.7 cross-reference with Section 9 |
| OBS-02 | Every boot phase emits a progress event | Section 4.12 review |
| OBS-03 | The logging system defines all five log levels with production/dev defaults | Section 3.12 review |
| OBS-04 | The crash report format is fully defined with all sections listed | Section 13.3 review |
| OBS-05 | The diagnostic snapshot export is defined | Section 13.11 review |
| OBS-06 | The Runtime Inspector sections are fully listed | Section 13.10 review |
| OBS-07 | The Developer Interface method table is complete | Section 14.13 review |
| OBS-08 | The Health Monitor heartbeat interval and failure threshold are defined | Section 8.16 review |
| OBS-09 | Performance statistics are defined with collection method and retention | Section 11.10 review |
| OBS-10 | Security events are defined as always-logged regardless of log level | Section 9.5.4 review |

---

### 17.8 Final Acceptance Gate

The Runtime Foundation specification is accepted when:

1. All 10 Specification Completeness criteria pass ✓
2. All 12 Architecture Correctness criteria pass ✓
3. All 10 Security criteria pass ✓
4. All 10 Performance criteria pass ✓
5. All 7 Compatibility criteria pass ✓
6. All 10 Observability criteria pass ✓

**Total: 59 criteria. All 59 must pass.**

No partial acceptance. No criteria may be deferred to a later phase.

---

### 17.9 What Comes After Acceptance

Once the Runtime Foundation specification is accepted, the following
implementation work may begin in parallel:

| Work Item | Depends On | Estimated Scope |
|---|---|---|
| `ldfx-runtime` crate scaffold | Section 15 (folder structure) | 1 day |
| Platform Adapter (Windows + Linux) | Section 15 `platform/` | 3 days |
| Virtual File System | Section 15 `vfs/` | 2 days |
| Security Manager (boot-time) | Section 15 `security/` | 3 days |
| Boot Manager (Phases 1–9) | Section 4 | 3 days |
| Resource Loader + Cache | Section 15 `resources/` | 3 days |
| Event Dispatcher | Section 15 `events/` | 2 days |
| Lifecycle Manager + State Machine | Section 5, 10 | 2 days |
| Configuration Manager | Section 15 `config/` | 2 days |
| Document Context | Section 6 | 1 day |
| Plugin Runtime (WASM) | Section 15 `plugins/` | 5 days |
| Logging System | Section 15 `logging/` | 1 day |
| Diagnostics Service | Section 15 `diagnostics/` | 2 days |
| Runtime API Layer | Section 15 `api/` | 2 days |
| Integration tests | All of the above | 3 days |

---

**End of Phase 2 — Runtime Foundation Specification**
**Modules 01–17 complete.**
