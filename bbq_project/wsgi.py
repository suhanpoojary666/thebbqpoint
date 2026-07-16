"""
WSGI config for bbq_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bbq_project.settings')

application = get_wsgi_application()

# Auto-run migrations on startup when DATABASE_URL is defined (for serverless Vercel)
if os.environ.get('DATABASE_URL'):
    try:
        from django.core.management import call_command
        print("Running database migrations...")
        call_command('migrate', interactive=False)
        print("Database migrations completed successfully!")
    except Exception as e:
        print("Database auto-migration failed:", e)
