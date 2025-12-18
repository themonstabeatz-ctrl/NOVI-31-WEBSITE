import React, { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../config/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, Clock, User, Phone, Sparkles, Leaf } from "lucide-react";

/**
 * ✅ Termini (Appointments) Screen
 * Displays calendar events including SPA bookings from backend
 * LOCKED TO: spa-dashboard-2.preview.emergentagent.com
 */

// Format date helper
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

// Format time helper
const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("sr-RS", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Format price helper
const formatPrice = (price) => {
  const num = Number(price || 0);
  return num.toLocaleString("sr-RS") + " RSD";
};

// Get badge based on event type
const getBadge = (event) => {
  // Check for SPA
  if (event.type === "spa" || event.spa_category || event.category?.toLowerCase().includes("spa")) {
    return { label: "SPA", color: "#d4af37", bg: "rgba(212, 175, 55, 0.2)" };
  }
  // Check for couples massage
  if (event.is_couples_booking || event.type === "couple" || event.category?.toLowerCase().includes("couple")) {
    return { label: "PAROVI", color: "#e91e63", bg: "rgba(233, 30, 99, 0.2)" };
  }
  return { label: "MASAŽA", color: "#4ade80", bg: "rgba(74, 222, 128, 0.2)" };
};

// ✅ UNIFIED: Get service title (works for both massage + spa)
const getServiceTitle = (row) => {
  // SPA appointments - check type and services_snapshot
  if (row.type === "spa" || row.spa_category) {
    if (row.services_snapshot?.[0]?.name) {
      return row.services_snapshot[0].name;
    }
    // Parse from notes if service_name is missing
    if (row.notes?.includes("SPA paket:")) {
      const match = row.notes.match(/SPA paket:\s*([^\n]+)/);
      if (match) return match[1].trim();
    }
    return row.service_name || "SPA tretman";
  }
  
  // Couples massage - show both services
  if (row.is_couples_booking && row.person1_services_snapshot?.length) {
    const p1 = row.person1_services_snapshot.map(s => s.name?.replace('[PAROVI] ', '')).join(', ');
    return `Masaža za parove: ${p1}`;
  }
  
  // Single massage
  return row.service_name
    || row.service?.name
    || row.title
    || "Masaža";
};

// ✅ UNIFIED: Get service description
const getServiceDescription = (row) => {
  // SPA - return service description
  if (row.services_snapshot?.[0]?.description) {
    return row.services_snapshot[0].description;
  }
  return row.service_description
    || row.description
    || "";
};

// ✅ UNIFIED: Get duration in minutes
const getDurationMin = (row) => {
  // SPA appointments - from snapshot
  if (row.services_snapshot?.[0]?.duration_min) {
    return row.services_snapshot[0].duration_min;
  }
  if (row.services_snapshot?.[0]?.duration) {
    return row.services_snapshot[0].duration;
  }
  
  // Explicit fields
  if (Number.isFinite(row.duration_min)) return row.duration_min;
  if (Number.isFinite(row.duration)) return row.duration;
  
  // Derive from start/end times
  if (row.start_time && row.end_time) {
    const s = new Date(row.start_time).getTime();
    const e = new Date(row.end_time).getTime();
    const diff = Math.round((e - s) / 60000);
    if (Number.isFinite(diff) && diff > 0) return diff;
  }

  return null;
};

// ✅ Get add-ons text if present
const getAddonsText = (row) => {
  const addons = row.addons || row.spa_addons || [];
  if (!addons.length) return "";
  return "Doplate: " + addons.map(a => a.name || a).join(", ");
};

// Legacy alias for backward compatibility
const getTitle = getServiceTitle;

/**
 * ✅ Fetch calendar events from backend
 * Uses direct XMLHttpRequest to avoid rrweb-recorder clone() issue
 */
const fetchCalendarEvents = async () => {
  console.log("📅 Fetching all events from spa-dashboard-2...");
  
  // ✅ FIX: Use XMLHttpRequest to bypass rrweb-recorder interceptor
  const fetchWithXHR = (url) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          resolve([]);
        }
      } else {
        reject(new Error(`HTTP ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send();
  });
  
  try {
    // Fetch both massage and SPA appointments in parallel
    const [massageData, spaData] = await Promise.all([
      fetchWithXHR(`${API_BASE}/api/appointments?limit=100`).catch(() => []),
      fetchWithXHR(`${API_BASE}/api/spa/appointments`).catch(() => [])
    ]);
    
    // Mark SPA appointments with type
    const spaWithType = (Array.isArray(spaData) ? spaData : []).map(e => ({ ...e, type: "spa" }));
    
    // Combine and sort by start_time
    const combined = [...(Array.isArray(massageData) ? massageData : []), ...spaWithType];
    combined.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    
    console.log(`📅 Loaded ${combined.length} events (${massageData?.length || 0} massage + ${spaData?.length || 0} SPA)`);
    return combined;
  } catch (err) {
    console.error("❌ Failed to fetch events:", err);
    throw err;
  }
};

const Termini = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState("week"); // "day", "week", "month"
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate date range based on view mode
  const getDateRange = useCallback(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    if (viewMode === "day") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (viewMode === "week") {
      const dayOfWeek = start.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Start from Monday
      start.setDate(start.getDate() + diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (viewMode === "month") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    }
    
    return {
      startISO: start.toISOString(),
      endISO: end.toISOString()
    };
  }, [currentDate, viewMode]);

  // Load events
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ FIX: Fetch all events, then filter client-side by date range
      const allEvents = await fetchCalendarEvents();
      const { startISO, endISO } = getDateRange();
      const startDate = new Date(startISO);
      const endDate = new Date(endISO);
      
      // Filter events within the selected date range
      const filteredEvents = allEvents.filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate >= startDate && eventDate <= endDate;
      });
      
      console.log(`📅 Filtered ${filteredEvents.length}/${allEvents.length} events for date range`);
      setEvents(filteredEvents);
    } catch (err) {
      console.error("❌ Failed to load events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getDateRange]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() - 1);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() + 1);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Render event card
  const renderEventCard = (event) => {
    const badge = getBadge(event);
    // ✅ Use unified helper functions
    const title = getServiceTitle(event);
    const description = getServiceDescription(event);
    const duration = getDurationMin(event);
    const addonsText = getAddonsText(event);
    const durText = duration ? `${duration} min` : "—";
    
    const startTime = formatTime(event.start_time);
    const endTime = formatTime(event.end_time);
    const clientName = event.client 
      ? `${event.client.first_name || ""} ${event.client.last_name || ""}`.trim()
      : event.client_first_name 
        ? `${event.client_first_name} ${event.client_last_name || ""}`.trim()
        : "Nepoznat klijent";
    const price = event.pricing?.final_total || event.final_price || event.price || 0;

    return (
      <Card 
        key={event.id} 
        className="event-card"
        onClick={() => setSelectedEvent(event)}
        style={{
          cursor: "pointer",
          background: "rgba(26, 26, 26, 0.8)",
          border: `1px solid ${badge.color}40`,
          marginBottom: "0.75rem",
          transition: "all 0.3s ease"
        }}
      >
        <CardContent style={{ padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              {/* Badge */}
              <span style={{
                display: "inline-block",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.7rem",
                fontWeight: "bold",
                background: badge.bg,
                color: badge.color,
                marginBottom: "0.5rem"
              }}>
                {badge.label}
              </span>
              
              {/* Title */}
              <h4 style={{ color: "#f5f2e8", fontSize: "1rem", margin: "0.25rem 0" }}>
                {title}
              </h4>
              
              {/* Client */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#c0baa8", fontSize: "0.85rem" }}>
                <User size={14} />
                <span>{clientName}</span>
              </div>
              
              {/* Time */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#c0baa8", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                <Clock size={14} />
                <span>{startTime} - {endTime}</span>
              </div>
            </div>
            
            {/* Price */}
            <div style={{ 
              color: "#d4af37", 
              fontWeight: "bold",
              fontSize: "1rem"
            }}>
              {formatPrice(price)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render selected event details modal
  const renderEventModal = () => {
    if (!selectedEvent) return null;
    
    const badge = getBadge(selectedEvent);
    const title = getTitle(selectedEvent);
    const clientName = selectedEvent.client 
      ? `${selectedEvent.client.first_name || ""} ${selectedEvent.client.last_name || ""}`.trim()
      : selectedEvent.client_first_name 
        ? `${selectedEvent.client_first_name} ${selectedEvent.client_last_name || ""}`.trim()
        : "Nepoznat klijent";
    const phone = selectedEvent.client?.phone || selectedEvent.client_phone || "";
    const email = selectedEvent.client?.email || selectedEvent.client_email || "";
    const price = selectedEvent.pricing?.final_total || selectedEvent.final_price || selectedEvent.price || 0;
    const notes = selectedEvent.notes || "";

    return (
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
        onClick={() => setSelectedEvent(null)}
      >
        <Card 
          style={{
            maxWidth: "500px",
            width: "90%",
            background: "#1a1a1a",
            border: `2px solid ${badge.color}`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                background: badge.bg,
                color: badge.color
              }}>
                {badge.label}
              </span>
              <button 
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  fontSize: "1.5rem",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>
            <CardTitle style={{ color: "#d4af37", marginTop: "0.5rem" }}>
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Client */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#f5f2e8" }}>
                <User size={18} style={{ color: "#d4af37" }} />
                <span>{clientName}</span>
              </div>
              
              {/* Phone */}
              {phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#c0baa8" }}>
                  <Phone size={18} style={{ color: "#d4af37" }} />
                  <span>{phone}</span>
                </div>
              )}
              
              {/* Time */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#c0baa8" }}>
                <Clock size={18} style={{ color: "#d4af37" }} />
                <span>
                  {formatDate(selectedEvent.start_time)} {formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}
                </span>
              </div>
              
              {/* Price */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.75rem",
                padding: "0.75rem",
                background: "rgba(212, 175, 55, 0.1)",
                borderRadius: "8px"
              }}>
                <span style={{ color: "#c0baa8" }}>Cena:</span>
                <span style={{ color: "#d4af37", fontWeight: "bold", fontSize: "1.2rem" }}>
                  {formatPrice(price)}
                </span>
              </div>
              
              {/* Notes */}
              {notes && (
                <div style={{ 
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  color: "#c0baa8",
                  fontSize: "0.9rem"
                }}>
                  <strong style={{ color: "#f5f2e8" }}>Napomena:</strong>
                  <p style={{ margin: "0.5rem 0 0 0" }}>{notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Group events by date
  const groupEventsByDate = () => {
    const grouped = {};
    events.forEach(event => {
      const dateKey = formatDate(event.start_time);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
      padding: "80px 20px 40px"
    }}>
      {/* Header */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{
          fontSize: "2.5rem",
          color: "#d4af37",
          textAlign: "center",
          marginBottom: "0.5rem"
        }}>
          <Calendar style={{ display: "inline", marginRight: "0.5rem" }} />
          Termini
        </h1>
        <p style={{
          color: "#c0baa8",
          textAlign: "center",
          marginBottom: "2rem"
        }}>
          Pregled zakazanih termina
        </p>

        {/* Controls */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          {/* View mode buttons */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["day", "week", "month"].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "outline"}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? "#d4af37" : "transparent",
                  color: viewMode === mode ? "#1a1a1a" : "#d4af37",
                  border: "1px solid #d4af37"
                }}
              >
                {mode === "day" ? "Dan" : mode === "week" ? "Nedelja" : "Mesec"}
              </Button>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Button variant="outline" onClick={goToPrevious} style={{ color: "#d4af37", border: "1px solid #d4af37" }}>
              ←
            </Button>
            <Button variant="outline" onClick={goToToday} style={{ color: "#d4af37", border: "1px solid #d4af37" }}>
              Danas
            </Button>
            <Button variant="outline" onClick={goToNext} style={{ color: "#d4af37", border: "1px solid #d4af37" }}>
              →
            </Button>
          </div>

          {/* Refresh */}
          <Button 
            variant="outline" 
            onClick={loadEvents}
            style={{ color: "#d4af37", border: "1px solid #d4af37" }}
          >
            ↻ Osveži
          </Button>
        </div>

        {/* Current date display */}
        <div style={{
          textAlign: "center",
          color: "#f5f2e8",
          fontSize: "1.2rem",
          marginBottom: "1.5rem"
        }}>
          {viewMode === "day" && formatDate(currentDate)}
          {viewMode === "week" && `Nedelja: ${formatDate(getDateRange().startISO)}`}
          {viewMode === "month" && currentDate.toLocaleDateString("sr-RS", { month: "long", year: "numeric" })}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#c0baa8" }}>
            Učitavanje termina...
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ 
            textAlign: "center", 
            padding: "1rem", 
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            color: "#ef4444",
            marginBottom: "1rem"
          }}>
            {error}
          </div>
        )}

        {/* Events */}
        {!loading && !error && (
          <>
            {events.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "3rem", 
                color: "#888",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px"
              }}>
                <Calendar size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                <p>Nema zakazanih termina za ovaj period.</p>
              </div>
            ) : (
              <div>
                {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                  <div key={date} style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ 
                      color: "#d4af37", 
                      fontSize: "1.1rem",
                      marginBottom: "0.75rem",
                      paddingBottom: "0.5rem",
                      borderBottom: "1px solid rgba(212, 175, 55, 0.3)"
                    }}>
                      {date}
                    </h3>
                    {dateEvents.map(renderEventCard)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Stats */}
        {!loading && events.length > 0 && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "2rem",
            padding: "1rem",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "12px"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#d4af37", fontSize: "1.5rem", fontWeight: "bold" }}>
                {events.length}
              </div>
              <div style={{ color: "#888", fontSize: "0.85rem" }}>Ukupno termina</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#4ade80", fontSize: "1.5rem", fontWeight: "bold" }}>
                {events.filter(e => e.type !== "spa" && !e.category?.toLowerCase().includes("spa")).length}
              </div>
              <div style={{ color: "#888", fontSize: "0.85rem" }}>Masaže</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#d4af37", fontSize: "1.5rem", fontWeight: "bold" }}>
                {events.filter(e => e.type === "spa" || e.category?.toLowerCase().includes("spa")).length}
              </div>
              <div style={{ color: "#888", fontSize: "0.85rem" }}>SPA</div>
            </div>
          </div>
        )}
      </div>

      {/* Event details modal */}
      {renderEventModal()}
    </div>
  );
};

export default Termini;
