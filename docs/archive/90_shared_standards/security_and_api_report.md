# Security & API Surface Report

## 1. Row Level Security (RLS) Policies
In Supabase, RLS policies determine "who can see what". Below is a summary of the policies detected across the migration files.

> **Note:** This list is extracted from source code analysis.

### Content & Communication
| Table | Policies Detected |
| :--- | :--- |
| **content_series** | `View Published Series` (SELECT), `Manage Series` (ALL) |
| **content_messages** | `View Published Messages` (SELECT), `Manage Messages` (ALL) |
| **reading_plans** | `View Published Plans` (SELECT), `Manage Plans` (ALL) |
| **reading_plan_days** | `View Plan Days` (SELECT), `Manage Plan Days` (ALL) |
| **user_plan_progress** | `Manage Own Progress` (ALL) |
| **user_content_history** | `Manage Own History` (ALL) |
| **whatsapp_templates** | `Users can view whatsapp templates`, `Users can manage whatsapp templates` |
| **posts** | (Derived from RLS enablement, specific policies likely `View Published`, `Manage Own`) |

### Teaching Module (EBD)
| Table | Policies Detected |
| :--- | :--- |
| **teaching_classes** | `View classes` (SELECT), `Classes visible to members`, `Admins manage classes`, `Manage classes` |
| **teaching_enrollments** | `View enrollments`, `Manage enrollments`, `Admins can view enrollments`, `Admins can manage enrollments` |
| **teaching_attendance** | `Manage attendance`, `Admins can manage attendance` |
| **teaching_attendance_details** | `Manage attendance details` |
| **teaching_class_leaders** | `View leaders`, `Manage leaders` |

### Project Management (Kanban)
| Table | Policies Detected |
| :--- | :--- |
| **projects** | `Projects viewable by church users`, `Projects insertable...`, `Projects updateable...`, `Projects deletable...` |
| **tasks** | `Tasks viewable by church users`, `Tasks insertable...`, `Tasks updateable...`, `Tasks deletable...` |

### Monetization
| Table | Policies Detected |
| :--- | :--- |
| **monetization_partners** | `View Published Partners`, `Manage Local Partners` |
| **monetization_services** | `View Published Services`, `Manage Local Services` |
| **monetization_tracking** | `Log Tracking` (INSERT), `View Church Tracking` (SELECT) |

### Core & Membership
| Table | Policies Detected |
| :--- | :--- |
| **profiles** | `Users can view their own member record` (and others) |
| **churches** | `Public can view visible churches`, `Public can view service times...`, `Users can manage service times...` |

---

## 2. Database Functions (RPCs)
These are Postgres functions that *can* be exposed to the client (callable via `supabase.rpc()`), provided they have the correct permissions.

| Function Name | Type | Purpose |
| :--- | :--- | :--- |
| **`public.get_church_members_export()`** | **RPC (Likely)** | Intended for exporting member data (e.g., CSV/Excel). |
| **`public.has_permission(perm text)`** | Helper | Internal Security Definer to check if the current user has a specific permission in `access_profiles`. |
| **`public.is_admin()`** | Helper | Internal Security Definer to check if the user is a system/church admin. |
| **`public.log_audit_event()`** | Trigger | Automatically logs changes to `audit_logs`. Not typically called directly by client. |
| **`public.handle_new_user()`** | Trigger | Automatically creates a profile when a new user signs up. |

> **Implication:** The app relies heavily on direct Table access (via Supabase SDK) protected by RLS, rather than routing everything through RPCs. `get_church_members_export` is likely one of the few distinct actions.

---

## 3. Edge Functions
**Status:** ❌ None Found.
The `supabase/functions` directory does not exist in this project. All backend logic is currently handled by Postgres Triggers, RLS, and the Next.js API/Server Actions.
