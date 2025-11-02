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


def send_email(to_email: str, subject: str, body: str, html_body: str = None) -> bool:
    """Send email via Gmail SMTP with optional HTML"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = f"{EMAIL_FROM_NAME} <{EMAIL_FROM}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Attach plain text body (fallback)
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Attach HTML body if provided
        if html_body:
            msg.attach(MIMEText(html_body, 'html', 'utf-8'))
        
        # Remove any spaces from password
        smtp_password = SMTP_PASSWORD.replace(' ', '')
        
        # Connect to Gmail SMTP
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, smtp_password)
            server.send_message(msg)
        
        logger.info(f"✅ Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to send email to {to_email}: {str(e)}")
        return False


def create_html_email_template(
    client_name: str,
    content: str,
    language: str = 'sr'
) -> str:
    """Create beautiful HTML email template with spa theme"""
    
    footer_text = {
        'sr': 'S poštovanjem, Bua Luang Thai Spa Tim',
        'en': 'Best regards, Bua Luang Thai Spa Team',
        'ru': 'С уважением, Команда Bua Luang Thai Spa',
        'th': 'ด้วยความเคารพ, ทีม Bua Luang Thai Spa'
    }
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
            }}
            .email-container {{
                max-width: 500px;
                margin: 10px auto;
                background: #ffffff;
                border: 1px solid #d4af37;
                border-radius: 5px;
                overflow: hidden;
            }}
            .header {{
                background-image: url('https://customer-assets.emergentagent.com/job_spa-booking-pro-1/artifacts/lve6klzv_podloga.jpg');
                background-size: cover;
                background-position: center;
                padding: 15px;
                text-align: center;
                border-bottom: 2px solid #d4af37;
                position: relative;
            }}
            .header::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                z-index: 1;
            }}
            .header-content {{
                position: relative;
                z-index: 2;
            }}
            .logo {{
                width: 60px;
                height: auto;
                margin-bottom: 5px;
            }}
            .header-title {{
                color: #d4af37;
                font-size: 14px;
                font-weight: bold;
                margin: 0;
            }}
            .content {{
                padding: 15px;
                color: #333333;
                line-height: 1.4;
                font-size: 11px;
                background-image: url('https://customer-assets.emergentagent.com/job_spa-booking-pro-1/artifacts/6qmohhxk_gridijent%20background.jpg');
                background-size: cover;
                background-position: center;
                position: relative;
            }}
            .content::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.92);
                z-index: 1;
            }}
            .content > * {{
                position: relative;
                z-index: 2;
            }}
            .greeting {{
                font-size: 11px;
                color: #333333;
                margin-bottom: 8px;
            }}
            .details-box {{
                background: rgba(250, 250, 250, 0.95);
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                padding: 8px;
                margin: 8px 0;
            }}
            .detail-row {{
                display: flex;
                justify-content: space-between;
                margin: 4px 0;
                padding: 3px 0;
                border-bottom: 1px solid #f0f0f0;
                font-size: 10px;
            }}
            .detail-row:last-child {{
                border-bottom: none;
            }}
            .detail-label {{
                color: #666666;
                font-weight: 600;
            }}
            .detail-value {{
                color: #333333;
                text-align: right;
            }}
            .info-text {{
                background: rgba(255, 254, 248, 0.95);
                border-left: 2px solid #d4af37;
                padding: 6px;
                margin: 8px 0;
                font-size: 10px;
                color: #555555;
            }}
            .contact-info {{
                text-align: center;
                padding: 8px;
                font-size: 10px;
                color: #666666;
            }}
            .contact-info a {{
                color: #d4af37;
                text-decoration: none;
            }}
            .footer {{
                background: #1a1506;
                padding: 10px;
                text-align: center;
                border-top: 2px solid #d4af37;
                color: #d4af37;
                font-size: 11px;
            }}
            @media only screen and (max-width: 500px) {{
                .email-container {{
                    margin: 0;
                    border-radius: 0;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="header-content">
                    <img src="https://customer-assets.emergentagent.com/job_spa-booking-pro-1/artifacts/4ws5rkri_Bua%20luang%20logo.png" alt="Logo" class="logo">
                    <div class="header-title">Bua Luang Thai Spa</div>
                </div>
            </div>
            
            <div class="content">
                <div class="greeting">Poštovani/a {client_name},</div>
                
                {content}
                
                <div class="contact-info">
                    📧 <a href="mailto:bualuangthailandspa@gmail.com">bualuangthailandspa@gmail.com</a><br>
                    📞 <a href="tel:+381626255500">+381 62 625 500</a> | 📍 Abebe Bikile 10A<br>
                    🌸
                </div>
            </div>
            
            <div class="footer">
                {footer_text.get(language, footer_text['sr'])}
            </div>
        </div>
    </body>
    </html>
    """
    
    return html


def send_confirmation_email(
    client_email: str,
    client_name: str,
    client_phone: str,
    service_name: str,
    appointment_datetime: str,
    language: str = 'sr'
) -> bool:
    """Send booking confirmation email with beautiful HTML"""
    try:
        # Get template for language (default to Serbian if not found)
        template = EMAIL_TEMPLATES.get(language, EMAIL_TEMPLATES['sr'])
        
        # Format date and time
        date_str, time_str = format_date_time(appointment_datetime, language)
        
        # SHORT plain text for email preview only
        subject = template['confirmation_subject']
        plain_body = f"Potvrda rezervacije za {client_name} - {service_name}, {date_str} u {time_str}. Vidite detalje u emailu."
        
        # Create HTML content
        html_content = f"""
        <p style="font-size: 13px; color: #d4af37; margin: 0 0 8px 0;">
            <strong>✅ Uspešno zakazano!</strong>
        </p>
        
        <div class="details-box">
            <div class="detail-row">
                <span class="detail-label">💆 Tretman:</span>
                <span class="detail-value">{service_name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">📅 Datum:</span>
                <span class="detail-value">{date_str}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">🕐 Vreme:</span>
                <span class="detail-value">{time_str}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">👤 Ime:</span>
                <span class="detail-value">{client_name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">📞 Telefon:</span>
                <span class="detail-value">{client_phone}</span>
            </div>
        </div>
        
        <div class="info-text">
            Stignite 10 min pre termina. Otkazivanje 4h unapred.
        </div>
        """
        
        html_body = create_html_email_template(client_name, html_content, language)
        
        return send_email(client_email, subject, plain_body, html_body)
        
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
    """Send appointment reminder email with beautiful HTML"""
    try:
        # Get template for language (default to Serbian if not found)
        template = EMAIL_TEMPLATES.get(language, EMAIL_TEMPLATES['sr'])
        
        # Format date and time
        date_str, time_str = format_date_time(appointment_datetime, language)
        
        # SHORT plain text for email preview only
        subject = template['reminder_subject']
        plain_body = f"Podsetnik: {client_name}, vaš tretman danas u {time_str} - {service_name}. Vidite detalje u emailu."
        
        # Create HTML content for reminder
        html_content = f"""
        <p style="font-size: 13px; color: #d4af37; margin: 0 0 8px 0; text-align: center;">
            <strong>⏰ Podsetnik: Vaš tretman danas!</strong>
        </p>
        
        <div class="details-box">
            <div class="detail-row">
                <span class="detail-label">💆 Tretman:</span>
                <span class="detail-value">{service_name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">🕐 Vreme:</span>
                <span class="detail-value">{time_str}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">📍 Lokacija:</span>
                <span class="detail-value">Abebe Bikile 10A</span>
            </div>
        </div>
        
        <div class="info-text" style="text-align: center;">
            <strong>Stignite 10 minuta pre termina</strong>
        </div>
        """
        
        html_body = create_html_email_template(client_name, html_content, language)
        
        return send_email(client_email, subject, plain_body, html_body)
        
    except Exception as e:
        logger.error(f"Error sending reminder email: {e}")
        return False
