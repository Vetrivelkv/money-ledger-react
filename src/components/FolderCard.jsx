import React from "react";
import "./folderCard.css";

export default function FolderCard({ title, subtitle, onClick }) {
  return (
    <button type="button" className="mlFolder" onClick={onClick}>
      <div className="mlFolderIcon" aria-hidden="true">
        <svg viewBox="0 0 64 48" width="64" height="48" focusable="false">
          <path d="M6 10c0-2.2 1.8-4 4-4h16l4 4h20c2.2 0 4 1.8 4 4v24c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V10z" fill="currentColor" opacity="0.12" />
          <path d="M10 12h44c2.2 0 4 1.8 4 4v22c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V16c0-2.2 1.8-4 4-4z" fill="currentColor" opacity="0.20" />
          <path d="M10 14h44c1.1 0 2 .9 2 2v22c0 1.1-.9 2-2 2H10c-1.1 0-2-.9-2-2V16c0-1.1.9-2 2-2z" fill="currentColor" opacity="0.28" />
        </svg>
      </div>

      <div className="mlFolderText">
        <div className="mlFolderTitle">{title}</div>
        {subtitle ? <div className="mlFolderSubtitle">{subtitle}</div> : null}
      </div>
    </button>
  );
}
