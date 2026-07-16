from django.urls import path
from .views import home_view, ReviewCreateAPIView

urlpatterns = [
    path('', home_view, name='home'),
    path('api/reviews/', ReviewCreateAPIView.as_view(), name='review-create'),
]
