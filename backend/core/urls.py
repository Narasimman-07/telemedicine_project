from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AuthViewSet, UserViewSet, DoctorViewSet, PatientViewSet,
    AppointmentViewSet, PrescriptionViewSet, MedicalRecordViewSet,
    EmergencyCaseViewSet, PaymentViewSet, DashboardStatsView, LogoutView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'doctors', DoctorViewSet, basename='doctors')
router.register(r'patients', PatientViewSet, basename='patients')
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescriptions')
router.register(r'records', MedicalRecordViewSet, basename='records')
router.register(r'emergency', EmergencyCaseViewSet, basename='emergency')
router.register(r'payments', PaymentViewSet, basename='payments')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', AuthViewSet.as_view({'post': 'register'}), name='register'),
    path('auth/login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard stats
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    
    # Include router URLs
    path('', include(router.urls)),
]

