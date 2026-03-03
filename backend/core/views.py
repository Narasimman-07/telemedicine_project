from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
import uuid

from .models import (
    DoctorProfile, PatientProfile, Appointment, Prescription,
    MedicalRecord, EmergencyCase, Payment
)
from .serializers import (
    UserSerializer, UserCreateSerializer, LoginSerializer, RegisterSerializer,
    DoctorProfileSerializer, DoctorProfileCreateSerializer,
    PatientProfileSerializer, AppointmentSerializer, AppointmentCreateSerializer,
    PrescriptionSerializer, PrescriptionCreateSerializer,
    MedicalRecordSerializer, EmergencyCaseSerializer,
    PaymentSerializer, DashboardStatsSerializer
)

User = get_user_model()


class AuthViewSet(viewsets.ViewSet):
    """Authentication endpoints"""
    permission_classes = [AllowAny]
    
    def register(self, request):
        """User registration endpoint"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create profile based on role
            if user.role == 'doctor':
                # Doctors need approval, so we don't auto-create profile
                pass
            elif user.role == 'patient':
                PatientProfile.objects.create(user=user)
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Registration successful',
                'user_id': user.id,
                'email': user.email,
                'role': user.role,
                'token': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def login(self, request):
        """User login endpoint"""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
            if not user.check_password(password):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Check if doctor is approved
            if user.role == 'doctor':
                try:
                    doctor_profile = user.doctor_profile
                    if not doctor_profile.is_approved:
                        return Response({'error': 'Your account is pending approval'}, status=status.HTTP_403_FORBIDDEN)
                except DoctorProfile.DoesNotExist:
                    return Response({'error': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'user_id': user.id,
                'role': user.role,
                'email': user.email,
                'name': user.get_full_name(),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    """User management endpoints"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'doctor':
            return User.objects.filter(role='patient')
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user info"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class DoctorViewSet(viewsets.ModelViewSet):
    """Doctor management endpoints"""
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            return [AllowAny()]
        elif self.action in ['approve', 'reject', 'update']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return DoctorProfile.objects.all()
        elif user.role == 'doctor':
            return DoctorProfile.objects.filter(user=user)
        # Patients can see approved doctors
        return DoctorProfile.objects.filter(is_approved=True, is_available=True)
    
    def create(self, request, *args, **kwargs):
        """Create doctor profile after user registration"""
        serializer = DoctorProfileCreateSerializer(data=request.data)
        if serializer.is_valid():
            doctor = serializer.save()
            return Response(
                DoctorProfileSerializer(doctor).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a doctor"""
        doctor = self.get_object()
        doctor.is_approved = True
        doctor.save()
        return Response({'message': 'Doctor approved successfully'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a doctor"""
        doctor = self.get_object()
        doctor.is_approved = False
        doctor.save()
        return Response({'message': 'Doctor rejected'})
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending doctors"""
        doctors = DoctorProfile.objects.filter(is_approved=False)
        serializer = DoctorProfileSerializer(doctors, many=True)
        return Response(serializer.data)


class PatientViewSet(viewsets.ModelViewSet):
    """Patient management endpoints"""
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    
    def get_permissions(self):
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return PatientProfile.objects.all()
        elif user.role == 'doctor':
            return PatientProfile.objects.all()
        return PatientProfile.objects.filter(user=user)


class AppointmentViewSet(viewsets.ModelViewSet):
    """Appointment management endpoints"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
    def get_permissions(self):
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Appointment.objects.all()
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor=user)
        elif user.role == 'patient':
            return Appointment.objects.filter(patient=user)
        return Appointment.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        return AppointmentSerializer
    
    def perform_create(self, serializer):
        patient = self.request.user
        serializer.save(patient=patient)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark appointment as completed"""
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.save()
        return Response({'message': 'Appointment completed'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel appointment"""
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'message': 'Appointment cancelled'})
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's appointments"""
        today = timezone.now().date()
        appointments = self.get_queryset().filter(appointment_date=today)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


class PrescriptionViewSet(viewsets.ModelViewSet):
    """Prescription management endpoints"""
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    
    def get_permissions(self):
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Prescription.objects.all()
        elif user.role == 'doctor':
            return Prescription.objects.filter(doctor=user)
        elif user.role == 'patient':
            return Prescription.objects.filter(patient=user)
        return Prescription.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PrescriptionCreateSerializer
        return PrescriptionSerializer
    
    def perform_create(self, serializer):
        doctor = self.request.user
        serializer.save(doctor=doctor)


class MedicalRecordViewSet(viewsets.ModelViewSet):
    """Medical record management endpoints"""
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    
    def get_permissions(self):
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return MedicalRecord.objects.all()
        elif user.role == 'doctor':
            return MedicalRecord.objects.filter(doctor=user)
        elif user.role == 'patient':
            return MedicalRecord.objects.filter(patient=user)
        return MedicalRecord.objects.none()


class EmergencyCaseViewSet(viewsets.ModelViewSet):
    """Emergency case management endpoints"""
    queryset = EmergencyCase.objects.all()
    serializer_class = EmergencyCaseSerializer
    
    def get_permissions(self):
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return EmergencyCase.objects.all()
        elif user.role == 'doctor':
            return EmergencyCase.objects.filter(
                Q(doctor=user) | Q(status='pending')
            )
        elif user.role == 'patient':
            return EmergencyCase.objects.filter(patient=user)
        return EmergencyCase.objects.none()
    
    def perform_create(self, serializer):
        patient = self.request.user
        serializer.save(patient=patient)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Doctor accepts emergency case"""
        emergency = self.get_object()
        doctor = request.user
        emergency.doctor = doctor
        emergency.is_accepted = True
        emergency.status = 'in_progress'
        emergency.save()
        return Response({'message': 'Emergency case accepted'})
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve emergency case"""
        emergency = self.get_object()
        emergency.status = 'resolved'
        emergency.resolved_at = timezone.now()
        emergency.save()
        return Response({'message': 'Emergency case resolved'})


class PaymentViewSet(viewsets.ModelViewSet):
    """Payment management endpoints"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    
    def get_permissions(self):
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(patient=user)
    
    def perform_create(self, serializer):
        patient = self.request.user
        # Generate unique transaction ID
        transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        serializer.save(patient=patient, transaction_id=transaction_id)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark payment as completed"""
        payment = self.get_object()
        payment.status = 'completed'
        payment.save()
        return Response({'message': 'Payment completed'})


class DashboardStatsView(APIView):
    """Dashboard statistics endpoint"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role == 'admin':
            stats = self.get_admin_stats()
        elif user.role == 'doctor':
            stats = self.get_doctor_stats(user)
        elif user.role == 'patient':
            stats = self.get_patient_stats(user)
        else:
            stats = {}
        
        return Response(stats)
    
    def get_admin_stats(self):
        total_doctors = User.objects.filter(role='doctor').count()
        total_patients = User.objects.filter(role='patient').count()
        total_appointments = Appointment.objects.count()
        completed_appointments = Appointment.objects.filter(status='completed').count()
        pending_appointments = Appointment.objects.filter(status='scheduled').count()
        total_revenue = Payment.objects.filter(status='completed').aggregate(
            total=Sum('amount')
        )['total'] or 0
        emergency_count = EmergencyCase.objects.filter(
            status__in=['pending', 'in_progress']
        ).count()
        
        return {
            'totalDoctors': total_doctors,
            'totalPatients': total_patients,
            'totalAppointments': total_appointments,
            'totalRevenue': total_revenue,
            'emergencyCount': emergency_count,
            'completedAppointments': completed_appointments,
            'pendingAppointments': pending_appointments,
        }
    
    def get_doctor_stats(self, user):
        total_appointments = Appointment.objects.filter(doctor=user).count()
        completed_appointments = Appointment.objects.filter(
            doctor=user, status='completed'
        ).count()
        pending_appointments = Appointment.objects.filter(
            doctor=user, status='scheduled'
        ).count()
        today_appointments = Appointment.objects.filter(
            doctor=user,
            appointment_date=timezone.now().date()
        ).count()
        
        # Calculate rating
        try:
            doctor_profile = user.doctor_profile
            rating = doctor_profile.rating
        except DoctorProfile.DoesNotExist:
            rating = 0
        
        # Count patients
        patients = Appointment.objects.filter(doctor=user).values('patient').distinct().count()
        
        return {
            'totalAppointments': total_appointments,
            'completedAppointments': completed_appointments,
            'pendingAppointments': pending_appointments,
            'todayAppointments': today_appointments,
            'rating': rating,
            'patients': patients,
        }
    
    def get_patient_stats(self, user):
        upcoming_appointments = Appointment.objects.filter(
            patient=user,
            status='scheduled',
            appointment_date__gte=timezone.now().date()
        ).count()
        completed_appointments = Appointment.objects.filter(
            patient=user, status='completed'
        ).count()
        active_prescriptions = Prescription.objects.filter(
            patient=user, status='active'
        ).count()
        total_spent = Payment.objects.filter(
            patient=user, status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        return {
            'upcomingAppointments': upcoming_appointments,
            'completedAppointments': completed_appointments,
            'activePrescriptions': active_prescriptions,
            'totalSpent': total_spent,
        }


class LogoutView(APIView):
    """Logout endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'message': 'Logout successful'})

