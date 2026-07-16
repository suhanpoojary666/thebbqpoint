from django.shortcuts import render
from django.core.mail import send_mail
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer
import logging

logger = logging.getLogger(__name__)

def home_view(request):
    return render(request, 'index.html')

class ReviewCreateAPIView(generics.ListCreateAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        # Save to database
        review = serializer.save()
        
        # Send Email
        subject = f"New Review for The BBQ Point: {review.rating} Stars from {review.name}"
        message = (
            f"You received a new review on your portfolio website!\n\n"
            f"Name: {review.name}\n"
            f"Email: {review.email}\n"
            f"Rating: {review.rating}/5 Stars\n\n"
            f"Comment:\n{review.comment}\n\n"
            f"Submitted at: {review.created_at.strftime('%Y-%m-%d %H:%M:%S') if review.created_at else 'Just now'}"
        )
        recipient_list = ['thebbqpoint@gmail.com']
        
        try:
            send_mail(
                subject,
                message,
                None,  # Will use DEFAULT_FROM_EMAIL from settings
                recipient_list,
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
