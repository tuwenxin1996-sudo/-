# Security Specification for NoteLens

## Data Invariants
1. A **Brand** must have an `owner_id` matching the creator's UID.
2. A **Question** must belong to a valid **Brand** that the user has access to.
3. Access to **Questions** is strictly derived from membership/ownership of the parent **Brand**.
4. Important fields like `brand_id` and `created_at` are immutable after creation.
5. `question_text` length must be between 5 and 500 characters.

## The "Dirty Dozen" Payloads (Targeting Relational Integrity and Identity)
1. **P1 (Identity Spoofing)**: Creating a brand with `owner_id` set to someone else.
2. **P2 (Orphaned Question)**: Creating a question for a `brand_id` that does not exist.
3. **P3 (Unauthorized Question Write)**: Creating a question for a brand owned by another user.
4. **P4 (Unverified Read)**: Attempting to list questions of a brand the user doesn't own.
5. **P5 (Type Poisoning)**: Setting `frequency_minutes` to a string instead of an integer.
6. **P6 (Enum Breach)**: Setting `priority` to "SUPER_HIGH" (not in enum).
7. **P7 (Immutable Breach)**: Updating `brand_id` of an existing question.
8. **P8 (Resource Exhaustion)**: Injecting a 2MB string into `question_text`.
9. **P9 (State Shortcut)**: Updating a question's status to "ACTIVE" when it was "ARCHIVED" without proper permissions (if specific logic added).
10. **P10 (Unverified Identity)**: Reading user profile data without being the owner.
11. **P11 (Query Scrape)**: Attempting to list all questions across all brands without a brand filter.
12. **P12 (Shadow Field)**: Adding `is_admin: true` to a brand document.

## Field Validation Constants
- ID Regex: `^[a-zA-Z0-9_\-]+$`
- Max String Size: 500 characters for text fields.
