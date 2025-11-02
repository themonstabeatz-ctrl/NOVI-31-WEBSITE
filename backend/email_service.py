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
    
    # Titles based on language
    titles = {
        'sr': 'Bua Luang Thai Spa',
        'en': 'Bua Luang Thai Spa',
        'ru': 'Bua Luang Thai Spa',
        'th': 'Bua Luang Thai Spa'
    }
    
    footer_text = {
        'sr': 'S poštovanjem,<br>Bua Luang Thai Spa Tim',
        'en': 'Best regards,<br>Bua Luang Thai Spa Team',
        'ru': 'С уважением,<br>Команда Bua Luang Thai Spa',
        'th': 'ด้วยความเคารพ,<br>ทีม Bua Luang Thai Spa'
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
                background-color: #0a0a0a;
            }}
            .email-container {{
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
                border: 2px solid #d4af37;
                border-radius: 10px;
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #1a1506 0%, #0d0a03 100%);
                padding: 30px 20px;
                text-align: center;
                border-bottom: 3px solid #d4af37;
                position: relative;
            }}
            .header::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 100%;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="%23d4af37" opacity="0.03"/></svg>');
                background-size: 100px 100px;
                opacity: 0.1;
            }}
            .logo {{
                width: 120px;
                height: auto;
                margin-bottom: 15px;
            }}
            .header-title {{
                color: #d4af37;
                font-size: 28px;
                font-weight: bold;
                margin: 0;
                text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
                letter-spacing: 2px;
            }}
            .content {{
                padding: 40px 30px;
                color: #e0e0e0;
                line-height: 1.8;
                background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
            }}
            .greeting {{
                font-size: 20px;
                color: #d4af37;
                margin-bottom: 25px;
                font-weight: bold;
            }}
            .details-box {{
                background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
                border: 2px solid #d4af37;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
            }}
            .detail-row {{
                display: table;
                width: 100%;
                margin: 12px 0;
                padding: 10px 0;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            }}
            .detail-row:last-child {{
                border-bottom: none;
            }}
            .detail-icon {{
                display: table-cell;
                width: 35px;
                font-size: 24px;
                vertical-align: middle;
            }}
            .detail-label {{
                display: table-cell;
                color: #d4af37;
                font-weight: bold;
                vertical-align: middle;
                padding-left: 10px;
            }}
            .detail-value {{
                display: table-cell;
                color: #ffffff;
                text-align: right;
                vertical-align: middle;
                font-size: 16px;
            }}
            .info-box {{
                background: linear-gradient(135deg, #2d2416 0%, #1f1810 100%);
                border-left: 4px solid #d4af37;
                padding: 20px;
                margin: 25px 0;
                border-radius: 5px;
            }}
            .info-box h3 {{
                color: #d4af37;
                margin: 0 0 15px 0;
                font-size: 18px;
            }}
            .info-box ul {{
                margin: 10px 0;
                padding-left: 20px;
                color: #e0e0e0;
            }}
            .info-box li {{
                margin: 8px 0;
            }}
            .contact-info {{
                background: linear-gradient(135deg, #1a1506 0%, #0d0a03 100%);
                padding: 25px;
                margin: 25px 0;
                border-radius: 8px;
                text-align: center;
                border: 1px solid rgba(212, 175, 55, 0.3);
            }}
            .contact-info a {{
                color: #d4af37;
                text-decoration: none;
                font-weight: bold;
            }}
            .footer {{
                background: linear-gradient(135deg, #0d0a03 0%, #000000 100%);
                padding: 25px 20px;
                text-align: center;
                border-top: 3px solid #d4af37;
                color: #d4af37;
            }}
            .lotus {{
                font-size: 40px;
                margin: 15px 0;
            }}
            @media only screen and (max-width: 600px) {{
                .email-container {{
                    border-radius: 0;
                    border-left: none;
                    border-right: none;
                }}
                .content {{
                    padding: 30px 20px;
                }}
                .header-title {{
                    font-size: 24px;
                }}
                .detail-value {{
                    font-size: 14px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://spa-booking-pro-1.preview.emergentagent.com/logo192.png" alt="Bua Luang Thai Spa" class="logo">
                <h1 class="header-title">{titles.get(language, titles['sr'])}</h1>
            </div>
            
            <div class="content">
                <div class="greeting">Poštovani/a {client_name},</div>
                
                {content}
                
                <div class="contact-info">
                    <strong style="color: #d4af37; font-size: 18px;">Za sva pitanja:</strong><br><br>
                    📧 <a href="mailto:bualuangthailandspa@gmail.com">bualuangthailandspa@gmail.com</a><br>
                    📞 <a href="tel:+381626255500">+381 62 625 500</a><br>
                    📍 Abebe Bikile 10A, Beograd<br>
                    🕐 Radno vreme: 10:00 - 22:00
                </div>
                
                <div class="lotus">🌸</div>
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
        
        # Prepare plain text email content (fallback)
        subject = template['confirmation_subject']
        plain_body = template['confirmation_body'].format(
            client_name=client_name,
            client_email=client_email,
            client_phone=client_phone,
            service_name=service_name,
            appointment_date=date_str,
            appointment_time=time_str
        )
        
        # Create HTML content
        html_content = f"""
        <p style="font-size: 18px; color: #d4af37; margin-bottom: 20px;">
            <strong>Uspešno ste zakazali vaš tretman u Bua Luang Thai Spa!</strong>
        </p>
        
        <div class="details-box">
            <h2 style="color: #d4af37; margin: 0 0 20px 0; font-size: 22px; text-align: center;">
                📋 Detalji rezervacije
            </h2>
            
            <div class="detail-row">
                <div class="detail-icon">👤</div>
                <div class="detail-label">Ime:</div>
                <div class="detail-value">{client_name}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-icon">📧</div>
                <div class="detail-label">Email:</div>
                <div class="detail-value">{client_email}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-icon">📞</div>
                <div class="detail-label">Telefon:</div>
                <div class="detail-value">{client_phone}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-icon">💆</div>
                <div class="detail-label">Tretman:</div>
                <div class="detail-value">{service_name}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-icon">📅</div>
                <div class="detail-label">Datum:</div>
                <div class="detail-value">{date_str}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-icon">🕐</div>
                <div class="detail-label">Vreme:</div>
                <div class="detail-value">{time_str}</div>
            </div>
        </div>
        
        <div class="info-box">
            <h3>ℹ️ VAŽNE INFORMACIJE</h3>
            <ul>
                <li>Molimo vas da stignete <strong>10 minuta pre</strong> zakazanog termina</li>
                <li>Kasnjenje duže od 15 minuta može rezultovati skraćivanjem tretmana</li>
                <li>Za otkazivanje molimo kontaktirajte nas najmanje <strong>4 sata unapred</strong></li>
            </ul>
        </div>
        
        <p style="text-align: center; color: #d4af37; font-size: 18px; margin-top: 30px;">
            <strong>Radujemo se vašoj poseti! 🌸</strong>
        </p>
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
        
        # Prepare plain text email content (fallback)
        subject = template['reminder_subject']
        plain_body = template['reminder_body'].format(
            client_name=client_name,
            service_name=service_name,
            appointment_date=date_str,
            appointment_time=time_str
        )
        
        # Create HTML content for reminder
        html_content = f"""
        <p style="font-size: 20px; color: #d4af37; margin-bottom: 25px; text-align: center;">
            <strong>⏰ Podsetnik: Imate zakazani tretman danas!</strong>
        </p>
        
        <div class="details-box">
            <h2 style="color: #d4af37; margin: 0 0 20px 0; font-size: 22px; text-align: center;">
                📋 Detalji rezervacije
            </h2>
            
            <div class="detail-row">
                <div class="detail-icon">👤</div>
                <div class="detail-label">Ime:</div>
                <div class="detail-value">{client_name}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-icon">💆</div>
                <div class="detail-label">Tretman:</div>
                <div class="detail-value">{service_name}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-icon">📅</div>
                <div class="detail-label">Datum:</div>
                <div class="detail-value">{date_str}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-icon">🕐</div>
                <div class="detail-label">Vreme:</div>
                <div class="detail-value">{time_str}</div>
            </div>
        </div>
        
        <div class="info-box">
            <h3>📍 Lokacija</h3>
            <p style="margin: 10px 0; font-size: 16px;">
                <strong>Abebe Bikile 10A, Beograd</strong>
            </p>
        </div>
        
        <p style="text-align: center; background: linear-gradient(135deg, #2d2416 0%, #1f1810 100%); padding: 20px; border-radius: 8px; border: 2px solid #d4af37; margin: 25px 0;">
            <span style="font-size: 18px; color: #d4af37;">⏰</span><br>
            <strong style="color: #ffffff; font-size: 17px;">Molimo vas da stignete 10 minuta pre zakazanog termina</strong>
        </p>
        
        <p style="text-align: center; color: #d4af37; font-size: 18px; margin-top: 30px;">
            <strong>Vidimo se uskoro! 🌸</strong>
        </p>
        """
        
        html_body = create_html_email_template(client_name, html_content, language)
        
        return send_email(client_email, subject, plain_body, html_body)
        
    except Exception as e:
        logger.error(f"Error sending reminder email: {e}")
        return False
