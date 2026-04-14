import React from 'react';
import { Link } from 'react-router-dom';

export default function SitemapPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-4xl font-extrabold font-headline">Sitemap</h1>
      <ul className="list-disc list-inside space-y-2 text-blue-600">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/document-printing">Document Printing</Link></li>
        <li><Link to="/pvc-cards">PVC Cards</Link></li>
        <li><Link to="/photos">Photos</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
        <li><Link to="/contact-us">Contact Us</Link></li>
        <li><Link to="/faq">FAQ</Link></li>
      </ul>
    </div>
  );
}
