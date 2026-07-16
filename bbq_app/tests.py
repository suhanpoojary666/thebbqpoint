from django.test import TestCase
from django.urls import reverse
from django.core import mail
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Review

class ReviewModelTests(TestCase):
    def test_create_valid_review(self):
        review = Review.objects.create(
            name="Test User",
            email="test@example.com",
            rating=5,
            comment="Excellent!"
        )
        self.assertEqual(Review.objects.count(), 1)
        self.assertEqual(str(review), "Test User - 5 Stars")

    def test_invalid_rating_min(self):
        review = Review(
            name="Test User",
            email="test@example.com",
            rating=0,
            comment="Bad!"
        )
        with self.assertRaises(ValidationError):
            review.full_clean()

    def test_invalid_rating_max(self):
        review = Review(
            name="Test User",
            email="test@example.com",
            rating=6,
            comment="Too Good!"
        )
        with self.assertRaises(ValidationError):
            review.full_clean()


class ReviewAPITests(APITestCase):
    def setUp(self):
        self.url = reverse('review-create')
        self.valid_payload = {
            "name": "Priya",
            "email": "priya@gmail.com",
            "rating": 5,
            "comment": "Absolutely tasty!"
        }

    def test_get_reviews_list(self):
        Review.objects.create(name="User 1", email="u1@ex.com", rating=4, comment="Nice")
        Review.objects.create(name="User 2", email="u2@ex.com", rating=5, comment="Love it")
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], "User 2")

    def test_create_review_via_api_and_email_dispatched(self):
        mail.outbox = []
        
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)
        
        stored = Review.objects.first()
        self.assertEqual(stored.name, "Priya")
        self.assertEqual(stored.rating, 5)
        
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "New Review for The BBQ Point: 5 Stars from Priya")
        self.assertIn("thebbqpoint@gmail.com", mail.outbox[0].to)
        self.assertIn("Absolutely tasty!", mail.outbox[0].body)

    def test_create_review_invalid_data(self):
        invalid_payload = {
            "name": "",
            "email": "invalid-email",
            "rating": 10,
            "comment": ""
        }
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Review.objects.count(), 0)
