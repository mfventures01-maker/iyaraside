import React from 'react';

export const Menu = () => <span>M</span>;
export const X = () => <span>X</span>;
// Exporting only what's absolutely needed to prevent import errors at runtime,
// but checking if the build passes now.
// If this passes, the previous wrapper had the syntax error.
