import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    bible: 'Bible',
    leaderboard: 'Leaderboard',
    wallet: 'Wallet',
    profile: 'Profile',
    
    // Settings
    settings: 'Settings',
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    language: 'Language',
    privacy: 'Privacy',
    about: 'About',
    
    // Profile
    editProfile: 'Edit Profile',
    appPreferences: 'App Preferences',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    dateOfBirth: 'Date of Birth',
    location: 'Location',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    changePhoto: 'Change Photo',
    
    // App Preferences
    readingPreferences: 'Reading Preferences',
    pushNotifications: 'Push Notifications',
    soundEffects: 'Sound Effects',
    autoBookmark: 'Auto Bookmark',
    enhancedReaderMode: 'Enhanced Reader Mode',
    dailyReadingReminders: 'Daily Reading Reminders',
    resetOptions: 'Reset Options',
    resetReadingProgress: 'Reset Reading Progress',
    clearAllBookmarks: 'Clear All Bookmarks',
    resetAllPreferences: 'Reset All Preferences',
    
    // Notifications
    notificationSettings: 'Notification Settings',
    readingReminders: 'Reading Reminders',
    achievements: 'Achievements',
    weeklyDigest: 'Weekly Digest',
    
    // About
    appVersion: 'App Version',
    rewardSystem: 'Reward System',
    howToEarn: 'How to Earn',
    leaderboardInfo: 'Leaderboard Information',
    
    // Success messages
    profileUpdated: 'Profile updated successfully!',
    addressCopied: 'Address copied to clipboard!',
    
    // Descriptions
    pushNotificationsDesc: 'Receive notifications for reading reminders and achievements',
    soundEffectsDesc: 'Play sounds for interactions and achievements',
    autoBookmarkDesc: 'Automatically bookmark your reading progress',
    enhancedReaderModeDesc: 'Optimize text for comfortable reading',
    dailyReadingRemindersDesc: 'Get reminded to continue your daily reading'
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    bible: 'Bible',
    leaderboard: 'Classement',
    wallet: 'Portefeuille',
    profile: 'Profil',
    
    // Settings
    settings: 'Paramètres',
    notifications: 'Notifications',
    darkMode: 'Mode Sombre',
    language: 'Langue',
    privacy: 'Confidentialité',
    about: 'À Propos',
    
    // Profile
    editProfile: 'Modifier le Profil',
    appPreferences: 'Préférences de l\'App',
    personalInfo: 'Informations Personnelles',
    fullName: 'Nom Complet',
    emailAddress: 'Adresse Email',
    dateOfBirth: 'Date de Naissance',
    location: 'Localisation',
    saveChanges: 'Sauvegarder',
    cancel: 'Annuler',
    changePhoto: 'Changer la Photo',
    
    // App Preferences
    readingPreferences: 'Préférences de Lecture',
    pushNotifications: 'Notifications Push',
    soundEffects: 'Effets Sonores',
    autoBookmark: 'Marque-page Auto',
    enhancedReaderMode: 'Mode Lecture Amélioré',
    dailyReadingReminders: 'Rappels de Lecture Quotidiens',
    resetOptions: 'Options de Réinitialisation',
    resetReadingProgress: 'Réinitialiser le Progrès de Lecture',
    clearAllBookmarks: 'Effacer Tous les Marque-pages',
    resetAllPreferences: 'Réinitialiser Toutes les Préférences',
    
    // Notifications
    notificationSettings: 'Paramètres de Notification',
    readingReminders: 'Rappels de Lecture',
    achievements: 'Réalisations',
    weeklyDigest: 'Résumé Hebdomadaire',
    
    // About
    appVersion: 'Version de l\'App',
    rewardSystem: 'Système de Récompense',
    howToEarn: 'Comment Gagner',
    leaderboardInfo: 'Informations du Classement',
    
    // Success messages
    profileUpdated: 'Profil mis à jour avec succès!',
    addressCopied: 'Adresse copiée dans le presse-papiers!',
    
    // Descriptions
    pushNotificationsDesc: 'Recevez des notifications pour les rappels de lecture et les réalisations',
    soundEffectsDesc: 'Jouer des sons pour les interactions et les réalisations',
    autoBookmarkDesc: 'Marquer automatiquement votre progression de lecture',
    enhancedReaderModeDesc: 'Optimiser le texte pour une lecture confortable',
    dailyReadingRemindersDesc: 'Soyez rappelé de continuer votre lecture quotidienne'
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    bible: 'Biblia',
    leaderboard: 'Clasificación',
    wallet: 'Billetera',
    profile: 'Perfil',
    
    // Settings
    settings: 'Configuración',
    notifications: 'Notificaciones',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    privacy: 'Privacidad',
    about: 'Acerca de',
    
    // Profile
    editProfile: 'Editar Perfil',
    appPreferences: 'Preferencias de la App',
    personalInfo: 'Información Personal',
    fullName: 'Nombre Completo',
    emailAddress: 'Dirección de Email',
    dateOfBirth: 'Fecha de Nacimiento',
    location: 'Ubicación',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',
    changePhoto: 'Cambiar Foto',
    
    // App Preferences
    readingPreferences: 'Preferencias de Lectura',
    pushNotifications: 'Notificaciones Push',
    soundEffects: 'Efectos de Sonido',
    autoBookmark: 'Marcador Automático',
    enhancedReaderMode: 'Modo de Lectura Mejorado',
    dailyReadingReminders: 'Recordatorios de Lectura Diaria',
    resetOptions: 'Opciones de Reinicio',
    resetReadingProgress: 'Reiniciar Progreso de Lectura',
    clearAllBookmarks: 'Limpiar Todos los Marcadores',
    resetAllPreferences: 'Reiniciar Todas las Preferencias',
    
    // Notifications
    notificationSettings: 'Configuración de Notificaciones',
    readingReminders: 'Recordatorios de Lectura',
    achievements: 'Logros',
    weeklyDigest: 'Resumen Semanal',
    
    // About
    appVersion: 'Versión de la App',
    rewardSystem: 'Sistema de Recompensas',
    howToEarn: 'Cómo Ganar',
    leaderboardInfo: 'Información de Clasificación',
    
    // Success messages
    profileUpdated: '¡Perfil actualizado exitosamente!',
    addressCopied: '¡Dirección copiada al portapapeles!',
    
    // Descriptions
    pushNotificationsDesc: 'Recibir notificaciones para recordatorios de lectura y logros',
    soundEffectsDesc: 'Reproducir sonidos para interacciones y logros',
    autoBookmarkDesc: 'Marcar automáticamente tu progreso de lectura',
    enhancedReaderModeDesc: 'Optimizar texto para lectura cómoda',
    dailyReadingRemindersDesc: 'Recibe recordatorios para continuar tu lectura diaria'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const t = (key: string): string => {
    const lang = language as keyof typeof translations;
    const langTranslations = translations[lang] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};