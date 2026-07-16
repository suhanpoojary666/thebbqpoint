import os

settings_path = r"C:\Users\HP\.gemini\antigravity\scratch\the_bbq_point\bbq_project\settings.py"
req_path = r"C:\Users\HP\.gemini\antigravity\scratch\the_bbq_point\requirements.txt"

# 1. Update settings.py
with open(settings_path, "r", encoding="utf-8") as f:
    settings = f.read()

# Add dj_database_url import at top
imports_old = "from pathlib import Path"
imports_new = """from pathlib import Path
import os
import dj_database_url"""

settings = settings.replace(imports_old, imports_new)

# Add Csrf Trusted Origins right below ALLOWED_HOSTS
allowed_hosts_old = "ALLOWED_HOSTS = ['*']"
allowed_hosts_new = """ALLOWED_HOSTS = ['*']

CSRF_TRUSTED_ORIGINS = [
    'https://*.vercel.app',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
]"""

settings = settings.replace(allowed_hosts_old, allowed_hosts_new)

# Add WhiteNoise Middleware directly after SecurityMiddleware
middleware_old = """MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',"""

middleware_new = """MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',"""

settings = settings.replace(middleware_old, middleware_new)

# Update Databases configuration to support DATABASE_URL
databases_old = """DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}"""

databases_new = """DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# If DATABASE_URL is defined, configure PostgreSQL (Vercel Production)
if os.environ.get('DATABASE_URL'):
    DATABASES['default'] = dj_database_url.config(conn_max_age=600, ssl_require=True)"""

settings = settings.replace(databases_old, databases_new)

# Configure Static Root and Whitenoise storage at bottom
static_old = """# Static files configuration
import os
STATICFILES_DIRS = [
    BASE_DIR / 'bbq_app' / 'static',
]"""

static_new = """# Static files configuration
import os
STATICFILES_DIRS = [
    BASE_DIR / 'bbq_app' / 'static',
]
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'"""

settings = settings.replace(static_old, static_new)

with open(settings_path, "w", encoding="utf-8") as f:
    f.write(settings)


# 2. Update requirements.txt
with open(req_path, "a", encoding="utf-8") as f:
    f.write("\ndj-database-url==2.1.0\npsycopg2-binary==2.9.9\n")

print("Vercel production configurations written successfully!")
