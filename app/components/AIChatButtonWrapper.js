"use client";

import { useAuth } from '../context/AuthContext';
import AIChatButton from './AIChatButton';

export default function AIChatButtonWrapper() {
  const { user } = useAuth();

  if (!user) return null;

  return <AIChatButton />;
}