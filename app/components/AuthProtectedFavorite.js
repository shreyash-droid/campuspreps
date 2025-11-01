"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import FavoriteButton from './FavoriteButton';

export default function AuthProtectedFavorite({ itemId, itemType, className = "" }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <FavoriteButton
        itemId={itemId}
        itemType={itemType}
        onLoginRequired={handleLoginRequired}
        className={className}
      />

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSuccess}
          switchToSignup={switchToSignup}
        />
      )}

      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignup={handleSignupSuccess}
          switchToLogin={switchToLogin}
        />
      )}
    </>
  );
}