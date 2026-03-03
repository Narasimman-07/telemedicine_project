from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import (
    DoctorProfile, PatientProfile, Appointment, Prescription,
    MedicalRecord, EmergencyCase, Payment
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'phone', 'address', 'date_of_birth', 'profile_image',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class RegisterSerializer(serializers.Serializer):
    """Serializer for user registration matching frontend"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    name = serializers.CharField()
    role = serializers.ChoiceField(choices=['patient', 'doctor', 'admin'])
    
    def create(self, validated_data):
        # Split name into first_name and last_name
        name_parts = validated_data['name'].split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Generate username from email
        email = validated_data['email']
        username = email.split('@')[0]
        
        # Make username unique if it exists
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
            role=validated_data['role']
        )
        
        return user


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating users (admin panel)"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'role', 'phone']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class DoctorProfileSerializer(serializers.ModelSerializer):
    """Serializer for DoctorProfile model"""
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = DoctorProfile
        fields = ['id', 'user', 'user_id', 'name', 'email', 'specialization',
                  'license_number', 'qualification', 'experience_years', 'bio',
                  'consultation_fee', 'is_approved', 'is_available', 'rating',
                  'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'rating', 'created_at', 'updated_at']
    
    def get_name(self, obj):
        return f"Dr. {obj.user.get_full_name()}"
    
    def get_email(self, obj):
        return obj.user.email
    
    def get_status(self, obj):
        if obj.is_approved:
            return 'approved'
        return 'pending'
    
    def create(self, validated_data):
        user_data = validated_data.pop('user_id', None)
        if user_data:
            user = User.objects.get(id=user_data)
            validated_data['user'] = user
        return super().create(validated_data)


class DoctorProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating doctor profiles"""
    email = serializers.EmailField(write_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = ['email', 'specialization', 'license_number', 
                  'qualification', 'experience_years', 'bio', 'consultation_fee']
    
    def create(self, validated_data):
        email = validated_data.pop('email')
        user = User.objects.get(email=email)
        return DoctorProfile.objects.create(user=user, **validated_data)


class PatientProfileSerializer(serializers.ModelSerializer):
    """Serializer for PatientProfile model"""
    user = UserSerializer(read_only=True)
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    
    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'name', 'email', 'blood_group', 'height', 'weight',
                  'medical_history', 'allergies', 'insurance_number', 
                  'insurance_provider', 'emergency_contact_name',
                  'emergency_contact_phone', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_name(self, obj):
        return obj.user.get_full_name()
    
    def get_email(self, obj):
        return obj.user.email


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for Appointment model"""
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    patient_email = serializers.SerializerMethodField()
    doctor_email = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'patient_name', 'doctor_name',
                  'patient_email', 'doctor_email', 'appointment_date', 
                  'appointment_time', 'appointment_type', 'status', 'reason',
                  'symptoms', 'notes', 'is_emergency', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return obj.patient.get_full_name()
    
    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.get_full_name()}"
    
    def get_patient_email(self, obj):
        return obj.patient.email
    
    def get_doctor_email(self, obj):
        return obj.doctor.email


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating appointments"""
    
    class Meta:
        model = Appointment
        fields = ['doctor', 'appointment_date', 'appointment_time', 
                  'appointment_type', 'reason', 'symptoms', 'is_emergency']


class PrescriptionSerializer(serializers.ModelSerializer):
    """Serializer for Prescription model"""
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Prescription
        fields = ['id', 'patient', 'doctor', 'appointment', 'patient_name',
                  'doctor_name', 'medications', 'diagnosis', 'notes', 'status',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return obj.patient.get_full_name()
    
    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.get_full_name()}"


class PrescriptionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating prescriptions"""
    
    class Meta:
        model = Prescription
        fields = ['patient', 'appointment', 'medications', 'diagnosis', 'notes']


class MedicalRecordSerializer(serializers.ModelSerializer):
    """Serializer for MedicalRecord model"""
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'doctor', 'appointment', 'patient_name',
                  'doctor_name', 'record_type', 'title', 'description', 'file',
                  'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_patient_name(self, obj):
        return obj.patient.get_full_name()
    
    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.get_full_name()}"


class EmergencyCaseSerializer(serializers.ModelSerializer):
    """Serializer for EmergencyCase model"""
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = EmergencyCase
        fields = ['id', 'patient', 'doctor', 'patient_name', 'doctor_name',
                  'description', 'location', 'status', 'is_accepted',
                  'created_at', 'resolved_at']
        read_only_fields = ['id', 'created_at', 'resolved_at']
    
    def get_patient_name(self, obj):
        return obj.patient.get_full_name()
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            return f"Dr. {obj.doctor.get_full_name()}"
        return None


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    
    class Meta:
        model = Payment
        fields = ['id', 'patient', 'appointment', 'amount', 'payment_method',
                  'transaction_id', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'transaction_id', 'created_at', 'updated_at']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect")
        return value


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_doctors = serializers.IntegerField()
    total_patients = serializers.IntegerField()
    total_appointments = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    emergency_count = serializers.IntegerField()
    completed_appointments = serializers.IntegerField()
    pending_appointments = serializers.IntegerField()

