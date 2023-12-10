import React from 'react';

const TextBrilloso = ({ name }) => {
  return (
    <>
      <svg width="0" height="0">
        <filter id="f" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="35" />
          <feColorMatrix type="saturate" values="1.3" />
          <feComposite in="SourceGraphic" />
        </filter>
      </svg>

      <h1 style={{
        '--k': 0,
        placeSelf: 'center',
        background: `linear-gradient(90deg, hsl(calc(var(--k)*1turn), 95%, 65%), hsl(calc(var(--k)*1turn + 90deg), 95%, 65%))`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'var(--dark)',
        font: '900 clamp(.875em, 7.25vw, 3em) arial black, sans-serif',
        filter: 'url(#f)',
        textAlign: 'center',
        textTransform: 'uppercase',
        animation: 'k 4s linear infinite',
      }}>
        {name}
      </h1>
    </>
  );
}

export default TextBrilloso;
