
import { useEffect, useRef, useCallback, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const INACTIVITY_TIMEOUT = 30000; // 30 seconds of inactivity
const UPDATE_INTERVAL = 1000; // Update every second
const FIRESTORE_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes


export const useReadingTimeTracker = () => {
  // Persist session start time in localStorage to survive reloads
  const getPersistedStartTime = () => {
    const val = localStorage.getItem('readingSessionStartTime');
    return val ? parseInt(val, 10) : null;
  };
  const setPersistedStartTime = (time: number | null) => {
    if (time) {
      localStorage.setItem('readingSessionStartTime', time.toString());
    } else {
      localStorage.removeItem('readingSessionStartTime');
    }
  };

  const startTimeRef = useRef<number | null>(getPersistedStartTime());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const displayUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const firestoreUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);
  const [readingTime, setReadingTime] = useState(0); // in minutes

  // Fetch reading time from Firestore on mount
  useEffect(() => {
    const fetchReadingTime = async () => {
      if (auth.currentUser) {
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          setReadingTime(userSnap.data().readingTime || 0);
        }
      }
    };
    fetchReadingTime();
  }, []);


  // Format time for display
  const formatReadingTime = useCallback((totalMinutes: number): string => {
    if (totalMinutes < 60) {
      return `${totalMinutes}m`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }, []);

  // Format session time as HH:MM:SS
  const formatSessionTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);


  // Reset inactivity timer (pause counting, do not reset session)
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      // Only pause counting, do not reset session or set currentSessionSeconds to 0
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

  // Update stored reading time in Firestore and local state
  const updateStoredTime = useCallback(async (minutesToAdd: number) => {
    setReadingTime(prev => prev + minutesToAdd);
    if (auth.currentUser) {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, { readingTime: readingTime + minutesToAdd });
    }
  }, [readingTime]);

  // Handle page visibility change
  const handleVisibilityChange = useCallback(async () => {
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
        await updateStoredTime(minutesToAdd);
      }
      startTimeRef.current = null;
    }
  }, [updateStoredTime]);

  // Start reading session
  const startReading = useCallback(() => {
    if (!startTimeRef.current && isActiveRef.current && isPageVisibleRef.current) {
      const now = Date.now();
      startTimeRef.current = now;
      setPersistedStartTime(now);
      // Don't reset currentSessionSeconds here, let it continue
    }
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Stop reading session
  const stopReading = useCallback(async () => {
    if (startTimeRef.current) {
      const sessionTime = Date.now() - startTimeRef.current;
      const minutesToAdd = Math.floor(sessionTime / 60000); // Convert to minutes
      if (minutesToAdd > 0) {
        setReadingTime(prev => prev + minutesToAdd);
        if (auth.currentUser) {
          const userDoc = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userDoc, { readingTime: readingTime + minutesToAdd });
        }
      }
      startTimeRef.current = null;
      setPersistedStartTime(null);
      setCurrentSessionSeconds(0);
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
    if (displayUpdateIntervalRef.current) {
      clearInterval(displayUpdateIntervalRef.current);
      displayUpdateIntervalRef.current = null;
    }
    if (firestoreUpdateIntervalRef.current) {
      clearInterval(firestoreUpdateIntervalRef.current);
      firestoreUpdateIntervalRef.current = null;
    }
  }, [readingTime]);


  // Get current reading time (including current session)
  const getCurrentReadingTime = useCallback((): number => {
    let totalMinutes = readingTime;
    if (startTimeRef.current && isActiveRef.current && isPageVisibleRef.current) {
      const currentSessionTime = Date.now() - startTimeRef.current;
      const currentSessionMinutes = Math.floor(currentSessionTime / 60000);
      totalMinutes += currentSessionMinutes;
    }
    return totalMinutes;
  }, [readingTime]);

  useEffect(() => {
    // On mount, restore session start time if present and set session seconds
    const persisted = getPersistedStartTime();
    if (persisted && !startTimeRef.current) {
      startTimeRef.current = persisted;
      // Calculate elapsed seconds since persisted start time
      const elapsed = Math.floor((Date.now() - persisted) / 1000);
      setCurrentSessionSeconds(elapsed > 0 ? elapsed : 0);
    }

    // Stable event handlers
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const activityHandler = () => resetInactivityTimer();
    const visibilityHandler = async () => {
      const isVisible = !document.hidden;
      isPageVisibleRef.current = isVisible;
      if (isVisible && isActiveRef.current && !startTimeRef.current) {
        startTimeRef.current = Date.now();
        setPersistedStartTime(startTimeRef.current);
      } else if (!isVisible && startTimeRef.current) {
        const sessionTime = Date.now() - startTimeRef.current;
        const minutesToAdd = Math.floor(sessionTime / 60000);
        if (minutesToAdd > 0) {
          await updateStoredTime(minutesToAdd);
        }
        startTimeRef.current = null;
        setPersistedStartTime(null);
      }
    };

    // Save reading time to localStorage on page unload/refresh (sync only)
    const unloadHandler = () => {
      if (startTimeRef.current && isActiveRef.current && isPageVisibleRef.current) {
        setPersistedStartTime(startTimeRef.current);
      }
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });
    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('beforeunload', unloadHandler);

    // Always start the timer if a persisted start time exists or user is active
    if (!startTimeRef.current && isActiveRef.current && isPageVisibleRef.current) {
      const persistedStart = getPersistedStartTime();
      const now = Date.now();
      startTimeRef.current = persistedStart || now;
      setPersistedStartTime(startTimeRef.current);
      // Set session seconds from persisted start
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      setCurrentSessionSeconds(elapsed > 0 ? elapsed : 0);
    } else if (startTimeRef.current) {
      // If timer already running, update session seconds from start time
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      setCurrentSessionSeconds(elapsed > 0 ? elapsed : 0);
    }
    resetInactivityTimer();

    // Set up interval to update display counter every second
    displayUpdateIntervalRef.current = setInterval(() => {
      if (startTimeRef.current && isActiveRef.current && isPageVisibleRef.current) {
        const sessionTime = Date.now() - startTimeRef.current;
        const sessionSeconds = Math.floor(sessionTime / 1000);
        setCurrentSessionSeconds(prev => (prev !== sessionSeconds ? sessionSeconds : prev));
      }
    }, 1000);

    // Set up interval to periodically save progress to Firestore (every 5 minutes)
    firestoreUpdateIntervalRef.current = setInterval(async () => {
      if (startTimeRef.current && isActiveRef.current && isPageVisibleRef.current && auth.currentUser) {
        const sessionTime = Date.now() - startTimeRef.current;
        const minutesToAdd = Math.floor(sessionTime / 60000);
        if (minutesToAdd > 0) {
          const userDoc = doc(db, 'users', auth.currentUser.uid);
          setReadingTime(prev => {
            updateDoc(userDoc, { readingTime: prev + minutesToAdd });
            return prev + minutesToAdd;
          });
          startTimeRef.current = Date.now();
          setPersistedStartTime(startTimeRef.current);
        }
      }
    }, FIRESTORE_UPDATE_INTERVAL);

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, activityHandler);
      });
      document.removeEventListener('visibilitychange', visibilityHandler);
      window.removeEventListener('beforeunload', unloadHandler);
      stopReading();
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    getCurrentReadingTime,
    formatReadingTime,
    formatSessionTime,
    currentSessionSeconds,
    readingTime
  };
};