// src/types/global.d.ts

import mongoose from 'mongoose';

// Global type declaration for mongoose
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}
