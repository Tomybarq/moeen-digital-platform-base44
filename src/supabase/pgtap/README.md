# اختبارات عزل البيانات (Multi-Tenant RLS Audit)

مجموعة اختبارات pgTAP للتحقق الصارم من سياسات Row Level Security في Supabase.

## الملفات

| الملف | الوصف |
|-------|-------|
| `pgtap/rls_isolation.sql` | الاختبار الرئيسي (24 اختبار) — beneficiaries, cross-tenant, injection, edge cases |
| `pgtap/rls_users.sql` | اختبارات users table (13 اختبار) — تصعيد الصلاحيات، الحذف، القراءة |

## التشغيل

### عبر pg_prove (سطر الأوامر)
```bash
# تثبيت pgTAP أولاً
pg_prove -d "postgres://postgres:[PASSWORD]@[HOST]:6543/postgres" \
  supabase/pgtap/rls_isolation.sql

pg_prove -d "postgres://postgres:[PASSWORD]@[HOST]:6543/postgres" \
  supabase/pgtap/rls_users.sql
```

### عبر Supabase SQL Editor
انسخ محتوى كل ملف والصقه في SQL Editor واضغط Run.
(يجب تثبيت إضافة pgTAP مسبقاً: `create extension if not exists pgtap;`)

## مصفوفة الاختبارات — beneficiaries

| # | الدور | العملية | الهدف | النتيجة المتوقعة |
|---|-------|---------|-------|-----------------|
| 1 | ngo_manager_A | SELECT | مستفيد NGO_A | ✅ مسموح |
| 2 | ngo_manager_A | SELECT | مستفيد NGO_B | ❌ ممنوع (فارغ) |
| 3 | ngo_manager_A | COUNT | ngo_id = NGO_A | ✅ = 1 |
| 4 | ngo_manager_A | COUNT | ngo_id = NGO_B | ✅ = 0 |
| 5 | platform_admin | SELECT | مستفيد NGO_A | ✅ مسموح |
| 6 | platform_admin | SELECT | مستفيد NGO_B | ✅ مسموح |
| 7 | ngo_manager_A | INSERT | تحت NGO_A | ✅ مسموح |
| 8 | ngo_manager_A | INSERT | تحت NGO_B | ❌ policy violation |
| 9 | ngo_manager_A | UPDATE | مستفيد NGO_A | ✅ مسموح |
| 10 | ngo_manager_A | UPDATE | مستفيد NGO_B | ❌ 0 rows affected |
| 11 | ngo_manager_A | DELETE | مستفيد NGO_A | ✅ مسموح |
| 12 | ngo_manager_A | DELETE | مستفيد NGO_B | ❌ 0 rows affected |
| 14 | researcher (بلا سجلات) | SELECT | beneficiaries | ✅ فارغ |
| 15 | marketer NGO_A | SELECT | مستفيد NGO_B | ❌ فارغ |
| 16 | ngo_manager_A | SELECT * | الكل | ✅ NGO_A فقط |
| 18 | ngo_manager_A | UPDATE bulk | NGO_A | ✅ يؤثر على NGO_A فقط |
| 19 | anonymous | SELECT | beneficiaries | ❌ فارغ |
| 20 | anonymous | INSERT | beneficiaries | ❌ policy violation |
| 23 | ngo_manager_A | INSERT | SQL injection | ✅ مخزن كنص حرفي |
| 24 | ngo_manager (null ngo_id) | SELECT | beneficiaries | ❌ فارغ (آمن) |

## مصفوفة الاختبارات — users

| # | الدور | العملية | النتيجة المتوقعة |
|---|-------|---------|-----------------|
| 1 | ngo_manager_A | SELECT own record | ✅ مسموح |
| 2 | ngo_manager_A | SELECT ngo_manager_B record | ❌ ممنوع (فارغ) |
| 6 | marketer | UPDATE role → admin | ❌ policy violation |
| 10 | anonymous | SELECT users | ❌ فارغ |
| 11 | anonymous | INSERT users | ❌ policy violation |
| 13 | ngo_manager_A | DELETE ngo_manager_B | ❌ policy violation |

## النتيجة النهائية

كل الاختبارات مصممة لـ **fail loudly** عند وجود ثغرة — لا تسكت أبداً.
الاختبار يعمل داخل transaction ويلفّ (`rollback`) في النهاية، فلا يترك أي بيانات اختبار.