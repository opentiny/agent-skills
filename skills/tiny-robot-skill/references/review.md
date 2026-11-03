# Application review

## Outcome

Find concrete TinyRobot correctness, compatibility, accessibility, and ownership regressions in application code without inventing design rules.

## Review evidence

For each potential finding, cite the consumer version/declaration and the matching indexed formal doc or demo. Package-root exports outside the formal index may be discussed only as unconfirmed/query-only APIs.

## Review checks

1. Imports come from the package that owns the public symbol.
2. A complete chat feature does not unnecessarily recreate documented Chat behavior from primitives.
3. Props, events, slots, runtime options, methods, and types exist in the installed public contract.
4. Required TinyRobot package versions are aligned before version-sensitive code is accepted.
5. New work avoids deprecated Container and McpServerPicker; migrations preserve their documented behavior mappings.
6. The application handles responsibilities not owned by the UI: extension mutations/persistence, authentication, authorization, tool side effects, credentials, and error recovery.
7. Custom slots that replace documented keyboard or ARIA behavior reimplement that behavior where the component docs require it.
8. Tests protect observable application behavior or a documented public contract.

## Finding threshold

Report a finding only when the code can violate a documented contract or an observable application requirement. Do not require a component, abstraction, styling pattern, or architecture merely because it seems preferable.

Each finding states severity, affected code, user-visible consequence, supporting evidence, and a minimal correction. If evidence is insufficient, record a question or uncertainty rather than a defect.
