from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, DoctorProfile, PatientProfile, Appointment,
    Prescription, MedicalRecord, EmergencyCase, Payment
)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_staff']
    list_filter = ['role', 'is_staff', 'is_superuser']
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone', 'address', 'date_of_birth', 'profile_image')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone')}),
    )


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'specialization', 'license_number', 'is_approved', 'is_available', 'rating']
    list_filter = ['is_approved', 'is_available', 'specialization']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    actions = ['approve_doctors']

    def approve_doctors(self, request, queryset):
        queryset.update(is_approved=True)
    approve_doctors.short_description = 'Approve selected doctors'


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'blood_group', 'insurance_provider']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    list_filter = ['blood_group']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'appointment_date', 'appointment_time', 'status', 'is_emergency']
    list_filter = ['status', 'appointment_type', 'is_emergency', 'appointment_date']
    search_fields = ['patient__email', 'doctor__email']
    date_hierarchy = 'appointment_date'


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['patient__email', 'doctor__email']


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'record_type', 'title', 'created_at']
    list_filter = ['record_type', 'created_at']
    search_fields = ['patient__email', 'title']


@admin.register(EmergencyCase)
class EmergencyCaseAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'status', 'is_accepted', 'created_at']
    list_filter = ['status', 'is_accepted', 'created_at']
    search_fields = ['patient__email', 'location']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'amount', 'payment_method', 'status', 'transaction_id', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['patient__email', 'transaction_id']
    readonly_fields = ['transaction_id']

