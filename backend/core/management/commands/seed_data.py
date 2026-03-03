from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import DoctorProfile, PatientProfile, Appointment, Prescription
from datetime import date, time, timedelta
from django.utils import timezone

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed demo data for the telemedicine system'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        
        # Create Admin User
        if not User.objects.filter(email='admin@medcare.com').exists():
            admin = User.objects.create_superuser(
                username='admin',
                email='admin@medcare.com',
                password='password',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin: {admin.email}'))
        
        # Create Doctor Users
        doctors_data = [
            {'email': 'doctor@medcare.com', 'name': 'Smith', 'specialization': 'Cardiology', 'license': 'LIC001'},
            {'email': 'johnson@medcare.com', 'name': 'Johnson', 'specialization': 'Neurology', 'license': 'LIC002'},
            {'email': 'williams@medcare.com', 'name': 'Williams', 'specialization': 'Orthopedics', 'license': 'LIC003'},
        ]
        
        for doc_data in doctors_data:
            if not User.objects.filter(email=doc_data['email']).exists():
                user = User.objects.create_user(
                    username=doc_data['email'].split('@')[0],
                    email=doc_data['email'],
                    password='password',
                    first_name=f"Dr. {doc_data['name']}",
                    last_name='',
                    role='doctor'
                )
                DoctorProfile.objects.create(
                    user=user,
                    specialization=doc_data['specialization'],
                    license_number=doc_data['license'],
                    qualification='MD',
                    experience_years=10,
                    is_approved=True,
                    rating=4.5
                )
                self.stdout.write(self.style.SUCCESS(f'Created doctor: {user.email}'))
        
        # Create Patient Users
        patients_data = [
            {'email': 'patient@medcare.com', 'name': 'John Doe'},
            {'email': 'jane@medcare.com', 'name': 'Jane Smith'},
            {'email': 'mike@medcare.com', 'name': 'Mike Johnson'},
        ]
        
        for pat_data in patients_data:
            if not User.objects.filter(email=pat_data['email']).exists():
                user = User.objects.create_user(
                    username=pat_data['email'].split('@')[0],
                    email=pat_data['email'],
                    password='password',
                    first_name=pat_data['name'].split()[0],
                    last_name=pat_data['name'].split()[1] if len(pat_data['name']) > 1 else '',
                    role='patient'
                )
                PatientProfile.objects.create(
                    user=user,
                    blood_group='O+'
                )
                self.stdout.write(self.style.SUCCESS(f'Created patient: {user.email}'))
        
        # Create sample appointments
        doctor = User.objects.filter(role='doctor').first()
        patient = User.objects.filter(role='patient').first()
        
        if doctor and patient:
            if not Appointment.objects.exists():
                today = timezone.now().date()
                Appointment.objects.create(
                    patient=patient,
                    doctor=doctor,
                    appointment_date=today + timedelta(days=1),
                    appointment_time=time(10, 0),
                    appointment_type='general',
                    status='scheduled',
                    reason='Regular checkup'
                )
                self.stdout.write(self.style.SUCCESS('Created sample appointment'))
        
        self.stdout.write(self.style.SUCCESS('Data seeding completed!'))
        self.stdout.write('')
        self.stdout.write('Demo Credentials:')
        self.stdout.write('  Admin: admin@medcare.com / password')
        self.stdout.write('  Doctor: doctor@medcare.com / password')
        self.stdout.write('  Patient: patient@medcare.com / password')

