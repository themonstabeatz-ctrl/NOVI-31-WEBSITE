import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Clock, X, Check, Trash2 } from 'lucide-react';
import '../styles/CustomTimePickerModal.css';

const CustomTimePickerModal = ({ value, onChange, name }) => {
  const { translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('14');
  const [selectedMinute, setSelectedMinute] = useState('00');
  
  // Parse value to hour and minute
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      if (hour && minute) {
        setSelectedHour(hour);
        setSelectedMinute(minute);
      }
    }
  }, [value]);

  // Generate hours (10:00 - 22:00 for spa working hours)
  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 10;
    return String(hour).padStart(2, '0');
  });

  // Generate ALL minutes (0-59)
  const minutes = Array.from({ length: 60 }, (_, i) => {
    return String(i).padStart(2, '0');
  });

  const handlePostavi = () => {
    const timeValue = `${selectedHour}:${selectedMinute}`;
    onChange({ target: { name, value: timeValue } });
    setIsOpen(false);
  };

  const handleOtkazi = () => {
    // Reset to original value
    if (value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour || '14');
      setSelectedMinute(minute || '00');
    }
    setIsOpen(false);
  };

  const handleObrisi = () => {
    setSelectedHour('14');
    setSelectedMinute('00');
    onChange({ target: { name, value: '' } });
    setIsOpen(false);
  };

  const formatDisplayTime = (value) => {
    if (!value) return translate('selectTime') || 'Izaberite vreme';
    return value;
  };

  return (
    <div className="custom-time-wrapper">
      <div 
        className="time-input-trigger"
        onClick={() => setIsOpen(true)}
      >
        <Clock className="time-icon" size={20} />
        <span className={value ? 'has-value' : 'placeholder'}>
          {formatDisplayTime(value)}
        </span>
      </div>

      {isOpen && (
        <>
          <div className="time-modal-backdrop" onClick={handleOtkazi} />
          <div className="time-modal">
            <div className="time-modal-header">
              <h3>{translate('selectTime') || 'Izaberite vreme'}</h3>
              <button 
                className="time-close-btn"
                onClick={handleOtkazi}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="time-picker-content">
              <div className="time-picker-section">
                <div className="time-label">{translate('hours')}</div>
                <div className="time-scroll-container">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={`time-option ${selectedHour === hour ? 'selected' : ''}`}
                      onClick={() => setSelectedHour(hour)}
                    >
                      {hour}
                    </div>
                  ))}
                </div>
              </div>

              <div className="time-separator">:</div>

              <div className="time-picker-section">
                <div className="time-label">{translate('minutes')}</div>
                <div className="time-scroll-container">
                  {minutes.map((minute) => (
                    <div
                      key={minute}
                      className={`time-option ${selectedMinute === minute ? 'selected' : ''}`}
                      onClick={() => setSelectedMinute(minute)}
                    >
                      {minute}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="time-preview">
              <Clock size={20} />
              <span>{translate('selectedTime')}: {selectedHour}:{selectedMinute}</span>
            </div>

            <div className="time-modal-actions">
              <button
                className="time-btn time-btn-delete"
                onClick={handleObrisi}
                type="button"
              >
                <Trash2 size={16} />
                {translate('timeDelete')}
              </button>
              <button
                className="time-btn time-btn-cancel"
                onClick={handleOtkazi}
                type="button"
              >
                <X size={16} />
                {translate('timeCancel')}
              </button>
              <button
                className="time-btn time-btn-confirm"
                onClick={handlePostavi}
                type="button"
              >
                <Check size={16} />
                {translate('timeConfirm')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomTimePickerModal;
