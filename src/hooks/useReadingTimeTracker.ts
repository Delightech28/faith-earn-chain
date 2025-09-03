import { useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'faithchain_reading_time';
const INACTIVITY_TIMEOUT = 30000; // 30 seconds of inactivity
const UPDATE_INTERVAL = 1000; // Update every second

export const useReadingTimeTracker = () => {
  const startTimeRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);
  const isPageVisibleRef = useRef(true);

  // Get stored reading time in minutes
  const getStoredTime = useCallback((): number => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }, []);

  // Update stored reading time
  const updateStoredTime = useCallback((additionalMinutes: number) => {
    const currentTime = getStoredTime();
    const newTime = currentTime + additionalMinutes;
    localStorage.setItem(STORAGE_KEY, newTime.toString());
  }, [getStoredTime]);

  // Format time for display
  const formatReadingTime = useCallback((totalMinutes: number): string => {
    if (totalMinutes < 60) {
      return `${totalMinutes}m`;
    }
    const hours = Math.floor(totalMinutes / 60);
    return `${hours}h`;
  }, []);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      isActiveRef.current = false;
    }, INACTIVITY_TIMEOUT);

    if (!isActiveRef.current) {
      isActiveRef.current = true;
      // If user becomes active again, restart timing
      if (isPageVisibleRef.current && !startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
    }
  }, []);

  // Handle user activity
  const handleActivity = useCallback(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Handle page visibility change
  const handleVisibilityChange = useCallback(() => {
    const isVisible = !document.hidden;
    isPageVisibleRef.current = isVisible;

    if (isVisible && isActiveRef.current && !startTimeRef.current) {
      // Resume timing when page becomes visible and user is active
      startTimeRef.current = Date.now();
    } else if (!isVisible && startTimeRef.current) {
      // Pause timing when page becomes hidden
      const sessionTime = Date.now() - startTimeRef.current;
      const minutesToAdd = Math.floor(sessionTime / 60000); // Convert to minutes
      if (minutesToAdd > 0) {
        updateStoredTime(minutesToAdd);
      }
      startTimeRef.current = null;
    }
  }, [updateStoredTime]);

  // Start reading session
  const startReading = useCallback(() => {
    if (!startTimeRef.current && isActiveRef.current && isPageVisibleRef.current) {
      startTimeRef.current = Date.now();
    }
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Stop reading session
  const stopReading = useCallback(() => {
    if (startTimeRef.current) {
      const sessionTime = Date.now() - startTimeRef.current;
      const minutesToAdd = Math.floor(sessionTime / 60000); // Convert to minutes
      if (minutesToAdd > 0) {
        updateStoredTime(minutesToAdd);
      }
      startTimeRef.current = null;
    }

    // Clear timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  }, [updateStoredTime]);

  // Get current reading time (including current session)
  const getCurrentReadingTime = useCallback((): number => {
    let totalMinutes = getStoredTime();
    
    if (startTimeRef.current && isActiveRef.current && isPageVisibleRef.current) {
      const currentSessionTime = Date.now() - startTimeRef.current;
      const currentSessionMinutes = Math.floor(currentSessionTime / 60000);
      totalMinutes += currentSessionMinutes;
    }
    
    return totalMinutes;
  }, [getStoredTime]);

  useEffect(() => {
    // Add event listeners for activity detection
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start the reading session
    startReading();

    // Set up interval to periodically save progress
    updateIntervalRef.current = setInterval(() => {
      if (startTimeRef.current && isActiveRef.current && isPageVisibleRef.current) {
        const sessionTime = Date.now() - startTimeRef.current;
        const minutesToAdd = Math.floor(sessionTime / 60000);
        
        if (minutesToAdd > 0) {
          updateStoredTime(minutesToAdd);
          startTimeRef.current = Date.now(); // Reset start time
        }
      }
    }, UPDATE_INTERVAL);

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      stopReading();
    };
  }, [handleActivity, handleVisibilityChange, startReading, stopReading, updateStoredTime]);

  return {
    getCurrentReadingTime,
    formatReadingTime,
    getStoredTime
  };
};