"use client";

import AuthProtectedFavorite from './AuthProtectedFavorite';

// Example component showing how to integrate favorites into notes, PYQs, or links
export default function ContentCard({ 
  id, 
  type, // 'note', 'pyq', 'link'
  title, 
  description, 
  content 
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header with title and favorite button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        
        {/* Favorite button - requires login */}
        <AuthProtectedFavorite
          itemId={id}
          itemType={type}
          className="ml-4 flex-shrink-0"
        />
      </div>

      {/* Content */}
      <div className="text-gray-700">
        {content}
      </div>

      {/* Card footer with type indicator */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <span className={`
          inline-block px-3 py-1 rounded-full text-xs font-medium
          ${type === 'note' ? 'bg-blue-100 text-blue-800' : ''}
          ${type === 'pyq' ? 'bg-green-100 text-green-800' : ''}
          ${type === 'link' ? 'bg-purple-100 text-purple-800' : ''}
        `}>
          {type === 'note' ? '📝 Note' : ''}
          {type === 'pyq' ? '📋 PYQ' : ''}
          {type === 'link' ? '🔗 Link' : ''}
        </span>
      </div>
    </div>
  );
}