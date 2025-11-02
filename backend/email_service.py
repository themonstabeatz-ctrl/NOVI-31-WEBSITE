"""
Email service for booking confirmations and reminders
Supports multi-language: Serbian, English, Russian, Thai
"""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

# Email configuration from environment
SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
EMAIL_FROM = os.getenv('EMAIL_FROM')
EMAIL_FROM_NAME = os.getenv('EMAIL_FROM_NAME', 'Bua Luang Thai Spa')

# Email templates in multiple languages
EMAIL_TEMPLATES = {
    'sr': {
        'confirmation_subject': 'Potvrda rezervacije - Bua Luang Thai Spa',
        'reminder_subject': 'Podsetnik: Vaš tretman danas - Bua Luang Thai Spa',
        'confirmation_body': """
Poštovani/a {client_name},

Uspešno ste zakazali vaš tretman u Bua Luang Thai Spa!

📋 Detalji rezervacije:
━━━━━━━━━━━━━━━━━━━━━━
👤 Ime: {client_name}
📧 Email: {client_email}
📞 Telefon: {client_phone}
💆 Tretman: {service_name}
📅 Datum: {appointment_date}
🕐 Vreme: {appointment_time}
━━━━━━━━━━━━━━━━━━━━━━

📍 Lokacija: Abebe Bikile 10A, Beograd
🕐 Radno vreme: 10:00 - 22:00

ℹ️ VAŽNE INFORMACIJE:
• Molimo vas da stignete 10 minuta pre zakazanog termina
• Kasnjenje duže od 15 minuta može rezultovati skraćivanjem tretmana
• Za otkazivanje molimo kontaktirajte nas najmanje 4 sata unapred

Za sva pitanja kontaktirajte nas:
📧 bualuangthailandspa@gmail.com
📞 +381 62 625 500

Radujemo se vašoj poseti! 🌸

S poštovanjem,
Bua Luang Thai Spa Tim
""",
        'reminder_body': """
Poštovani/a {client_name},

Podsetnik: Imate zakazani tretman danas!

📋 Detalji rezervacije:
━━━━━━━━━━━━━━━━━━━━━━
👤 Ime: {client_name}
💆 Tretman: {service_name}
📅 Datum: {appointment_date}
🕐 Vreme: {appointment_time}
━━━━━━━━━━━━━━━━━━━━━━

📍 Lokacija: Abebe Bikile 10A, Beograd

⏰ Molimo vas da stignete 10 minuta pre zakazanog termina.

Vidimo se uskoro! 🌸

S poštovanjem,
Bua Luang Thai Spa Tim
"""
    },
    'en': {
        'confirmation_subject': 'Booking Confirmation - Bua Luang Thai Spa',
        'reminder_subject': 'Reminder: Your Treatment Today - Bua Luang Thai Spa',
        'confirmation_body': """
Dear {client_name},

You have successfully booked your treatment at Bua Luang Thai Spa!

📋 Booking Details:
━━━━━━━━━━━━━━━━━━━━━━
👤 Name: {client_name}
📧 Email: {client_email}
📞 Phone: {client_phone}
💆 Treatment: {service_name}
📅 Date: {appointment_date}
🕐 Time: {appointment_time}
━━━━━━━━━━━━━━━━━━━━━━

📍 Location: Abebe Bikile 10A, Belgrade
🕐 Working hours: 10:00 AM - 10:00 PM

ℹ️ IMPORTANT INFORMATION:
• Please arrive 10 minutes before your scheduled time
• Delays longer than 15 minutes may result in shortened treatment
• For cancellations, please contact us at least 4 hours in advance

For any questions, contact us:
📧 bualuangthailandspa@gmail.com
📞 +381 62 625 500

We look forward to your visit! 🌸

Best regards,
Bua Luang Thai Spa Team
""",
        'reminder_body': """
Dear {client_name},

Reminder: You have a scheduled treatment today!

📋 Booking Details:
━━━━━━━━━━━━━━━━━━━━━━
👤 Name: {client_name}
💆 Treatment: {service_name}
📅 Date: {appointment_date}
🕐 Time: {appointment_time}
━━━━━━━━━━━━━━━━━━━━━━

📍 Location: Abebe Bikile 10A, Belgrade

⏰ Please arrive 10 minutes before your scheduled time.

See you soon! 🌸

Best regards,
Bua Luang Thai Spa Team
"""
    },
    'ru': {
        'confirmation_subject': 'Подтверждение бронирования - Bua Luang Thai Spa',
        'reminder_subject': 'Напоминание: Ваша процедура сегодня - Bua Luang Thai Spa',
        'confirmation_body': """
Уважаемый/ая {client_name},

Вы успешно забронировали процедуру в Bua Luang Thai Spa!

📋 Детали бронирования:
━━━━━━━━━━━━━━━━━━━━━━
👤 Имя: {client_name}
📧 Email: {client_email}
📞 Телефон: {client_phone}
💆 Процедура: {service_name}
📅 Дата: {appointment_date}
🕐 Время: {appointment_time}
━━━━━━━━━━━━━━━━━━━━━━

📍 Адрес: Abebe Bikile 10A, Белград
🕐 Рабочие часы: 10:00 - 22:00

ℹ️ ВАЖНАЯ ИНФОРМАЦИЯ:
• Пожалуйста, приходите за 10 минут до назначенного времени
• Опоздание более 15 минут может привести к сокращению процедуры
• Для отмены, пожалуйста, свяжитесь с нами минимум за 4 часа

По всем вопросам свяжитесь с нами:
📧 bualuangthailandspa@gmail.com
📞 +381 62 625 500

Ждем вашего визита! 🌸

С уважением,
Команда Bua Luang Thai Spa
""",
        'reminder_body': """
Уважаемый/ая {client_name},

Напоминание: У вас запланирована процедура сегодня!

📋 Детали бронирования:
━━━━━━━━━━━━━━━━━━━━━━
👤 Имя: {client_name}
💆 Процедура: {service_name}
📅 Дата: {appointment_date}
🕐 Время: {appointment_time}
━━━━━━━━━━━━━━━━━━━━━━

📍 Адрес: Abebe Bikile 10A, Белград

⏰ Пожалуйста, приходите за 10 минут до назначенного времени.

До скорой встречи! 🌸

С уважением,
Команда Bua Luang Thai Spa
"""
    },
    'th': {
        'confirmation_subject': 'ยืนยันการจอง - Bua Luang Thai Spa',
        'reminder_subject': 'เตือนความจำ: การนวดของคุณวันนี้ - Bua Luang Thai Spa',
        'confirmation_body': """
เรียน {client_name},

คุณได้จองการนวดที่ Bua Luang Thai Spa สำเร็จแล้ว!

📋 รายละเอียดการจอง:
━━━━━━━━━━━━━━━━━━━━━━
👤 ชื่อ: {client_name}
📧 อีเมล: {client_email}
📞 โทรศัพท์: {client_phone}
💆 การบริการ: {service_name}
📅 วันที่: {appointment_date}
🕐 เวลา: {appointment_time}
━━━━━━━━━━━━━━━━━━━━━━

📍 สถานที่: Abebe Bikile 10A, Belgrade
🕐 เวลาทำการ: 10:00 - 22:00

ℹ️ ข้อมูลสำคัญ:
• กรุณามาถึง 10 นาทีก่อนเวลานัดหมาย
• การมาสายเกิน 15 นาทีอาจทำให้เวลาบริการสั้นลง
• สำหรับการยกเลิก กรุณาติดต่อเราอย่างน้อย 4 ชั่วโมงล่วงหน้า

หากมีคำถาม ติดต่อเรา:
📧 bualuangthailandspa@gmail.com
📞 +381 62 625 500

เรารอคอยการมาเยือนของคุณ! 🌸

ด้วยความเคารพ,
ทีม Bua Luang Thai Spa
""",
        'reminder_body': """
เรียน {client_name},

เตือนความจำ: คุณมีนัดหมายการนวดวันนี้!

📋 รายละเอียดการจอง:
━━━━━━━━━━━━━━━━━━━━━━
👤 ชื่อ: {client_name}
💆 การบริการ: {service_name}
📅 วันที่: {appointment_date}
🕐 เวลา: {appointment_time}
━━━━━━━━━━━━━━━━━━━━━━

📍 สถานที่: Abebe Bikile 10A, Belgrade

⏰ กรุณามาถึง 10 นาทีก่อนเวลานัดหมาย

แล้วพบกันเร็วๆ นี้! 🌸

ด้วยความเคารพ,
ทีม Bua Luang Thai Spa
"""
    }
}


def format_date_time(iso_datetime: str, language: str = 'sr') -> tuple:
    """Format datetime for display based on language"""
    try:
        dt = datetime.fromisoformat(iso_datetime.replace('Z', '+00:00'))
        
        # Format date based on language
        if language == 'sr':
            date_str = dt.strftime('%d.%m.%Y')  # DD.MM.YYYY
            time_str = dt.strftime('%H:%M')
        elif language == 'en':
            date_str = dt.strftime('%B %d, %Y')  # January 02, 2025
            time_str = dt.strftime('%I:%M %p')  # 02:00 PM
        elif language == 'ru':
            date_str = dt.strftime('%d.%m.%Y')  # DD.MM.YYYY
            time_str = dt.strftime('%H:%M')
        elif language == 'th':
            date_str = dt.strftime('%d.%m.%Y')  # DD.MM.YYYY
            time_str = dt.strftime('%H:%M')
        else:
            date_str = dt.strftime('%d.%m.%Y')
            time_str = dt.strftime('%H:%M')
            
        return date_str, time_str
    except Exception as e:
        logger.error(f"Error formatting datetime: {e}")
        return iso_datetime.split('T')[0], iso_datetime.split('T')[1][:5]


def send_email(to_email: str, subject: str, body: str) -> bool:
    """Send email via Gmail SMTP"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = f"{EMAIL_FROM_NAME} <{EMAIL_FROM}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Attach plain text body
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Remove any spaces from password
        smtp_password = SMTP_PASSWORD.replace(' ', '')
        
        # Connect to Gmail SMTP
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.set_debuglevel(1)  # Enable debug output
            server.starttls()
            server.login(SMTP_USER, smtp_password)
            server.send_message(msg)
        
        logger.info(f"✅ Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to send email to {to_email}: {str(e)}")
        return False


def send_confirmation_email(
    client_email: str,
    client_name: str,
    client_phone: str,
    service_name: str,
    appointment_datetime: str,
    language: str = 'sr'
) -> bool:
    """Send booking confirmation email"""
    try:
        # Get template for language (default to Serbian if not found)
        template = EMAIL_TEMPLATES.get(language, EMAIL_TEMPLATES['sr'])
        
        # Format date and time
        date_str, time_str = format_date_time(appointment_datetime, language)
        
        # Prepare email content
        subject = template['confirmation_subject']
        body = template['confirmation_body'].format(
            client_name=client_name,
            client_email=client_email,
            client_phone=client_phone,
            service_name=service_name,
            appointment_date=date_str,
            appointment_time=time_str
        )
        
        return send_email(client_email, subject, body)
        
    except Exception as e:
        logger.error(f"Error sending confirmation email: {e}")
        return False


def send_reminder_email(
    client_email: str,
    client_name: str,
    service_name: str,
    appointment_datetime: str,
    language: str = 'sr'
) -> bool:
    """Send appointment reminder email"""
    try:
        # Get template for language (default to Serbian if not found)
        template = EMAIL_TEMPLATES.get(language, EMAIL_TEMPLATES['sr'])
        
        # Format date and time
        date_str, time_str = format_date_time(appointment_datetime, language)
        
        # Prepare email content
        subject = template['reminder_subject']
        body = template['reminder_body'].format(
            client_name=client_name,
            service_name=service_name,
            appointment_date=date_str,
            appointment_time=time_str
        )
        
        return send_email(client_email, subject, body)
        
    except Exception as e:
        logger.error(f"Error sending reminder email: {e}")
        return False
